import { ViewerError } from "./errors.js";
import { WorkerRpcClient } from "./worker-client.js";
export class WorkerDocumentAdapter {
    id;
    formats;
    #createWorker;
    #handles = new Set();
    constructor(options) {
        this.id = options.id;
        this.formats = options.formats;
        this.#createWorker = options.createWorker;
    }
    async open(data, context) {
        const rpc = new WorkerRpcClient(this.#createWorker());
        const handle = { rpc, timeoutMs: context.limits.maxOperationMs };
        const transferable = data.slice().buffer;
        const payload = {
            data: transferable,
            format: context.format,
            limits: context.limits,
            ...(context.fileName ? { fileName: context.fileName } : {}),
            ...(context.contentType ? { contentType: context.contentType } : {}),
        };
        try {
            await rpc.request("init", undefined, {
                signal: context.signal,
                timeoutMs: context.limits.maxOperationMs,
            });
            await rpc.request("open", payload, {
                signal: context.signal,
                transfer: [transferable],
                onProgress: context.reportProgress,
                onWarning: context.reportWarning,
                timeoutMs: context.limits.maxOperationMs,
            });
            this.#handles.add(handle);
            return handle;
        }
        catch (error) {
            rpc.destroy();
            throw error;
        }
    }
    getInfo(handle) {
        return handle.rpc.request("get-info", undefined, {
            timeoutMs: handle.timeoutMs,
        });
    }
    async render(handle, target, viewport, signal) {
        const payload = viewport;
        const bitmap = await handle.rpc.request("render", payload, {
            ...(signal ? { signal } : {}),
            timeoutMs: handle.timeoutMs,
        });
        const bitmapContext = target.getContext("bitmaprenderer");
        if (bitmapContext) {
            bitmapContext.transferFromImageBitmap(bitmap);
            return;
        }
        const context = target.getContext("2d");
        if (!context) {
            bitmap.close();
            throw new ViewerError("render-failed", "Canvas has no 2D or bitmaprenderer context");
        }
        context.drawImage(bitmap, 0, 0);
        bitmap.close();
    }
    getTextMap(handle, pageIndex, signal) {
        return handle.rpc.request("get-text-map", { pageIndex }, { ...(signal ? { signal } : {}), timeoutMs: handle.timeoutMs });
    }
    async close(handle) {
        if (!this.#handles.delete(handle))
            return;
        try {
            await handle.rpc.request("close", undefined, {
                timeoutMs: handle.timeoutMs,
            });
        }
        finally {
            handle.rpc.destroy();
        }
    }
    async destroy() {
        const handles = [...this.#handles];
        this.#handles.clear();
        await Promise.all(handles.map(async (handle) => {
            try {
                await handle.rpc.request("destroy", undefined, {
                    timeoutMs: handle.timeoutMs,
                });
            }
            finally {
                handle.rpc.destroy();
            }
        }));
    }
}
