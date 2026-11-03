import { abortError, ViewerError } from "../errors.js";
import { drawEncodedImage } from "./bitmap.js";
export class ImageDocumentAdapter {
    id = "image";
    formats = ["png", "jpeg", "gif", "webp", "bmp", "tiff"];
    #options;
    constructor(options = {}) {
        this.#options = options;
    }
    async open(data, context) {
        if (context.format === "tiff") {
            context.reportProgress({ phase: "parsing", loaded: 0, total: 1 });
            const backend = this.#options.openTiff
                ? await this.#options.openTiff(data, context)
                : await WorkerTiffBackend.open(data, this.#options.workerUrl
                    ? new URL(this.#options.workerUrl, context.assetBaseUrl)
                    : context.assetBaseUrl
                        ? new URL("workers/image-worker.js", context.assetBaseUrl)
                        : new URL("../image-worker.js", import.meta.url), this.#options.moduleUrl
                    ? new URL(this.#options.moduleUrl, context.assetBaseUrl)
                    : context.assetBaseUrl
                        ? new URL("assets/image/index.js", context.assetBaseUrl)
                        : new URL("../assets/image/index.js", import.meta.url), context.limits.maxDecodedPixels, context.signal, context.limits.maxOperationMs);
            if (backend.pages.length === 0) {
                backend.close();
                throw new ViewerError("invalid-file", "TIFF contains no pages");
            }
            context.reportProgress({
                phase: "parsing",
                loaded: 1,
                total: 1,
                ratio: 1,
            });
            return { kind: "tiff", format: "tiff", backend, warnings: [] };
        }
        const format = context.format;
        const animated = isAnimated(data, format);
        return {
            kind: "native",
            format,
            data,
            warnings: animated
                ? [
                    {
                        code: "unsupported-feature",
                        message: "Animated image frames are preserved in the source; headless canvas rendering captures one browser-decoded frame",
                        details: { feature: "animation", format },
                    },
                ]
                : [],
        };
    }
    async getInfo(handle) {
        return {
            format: handle.format,
            unit: "image",
            pageCount: handle.kind === "tiff" ? handle.backend.pages.length : 1,
            warnings: handle.warnings,
        };
    }
    async render(handle, target, viewport, signal) {
        if (signal?.aborted)
            throw abortError();
        const pageCount = handle.kind === "tiff" ? handle.backend.pages.length : 1;
        if (!Number.isInteger(viewport.pageIndex) ||
            viewport.pageIndex < 0 ||
            viewport.pageIndex >= pageCount)
            throw new ViewerError("render-failed", "Image page index is out of range");
        const data = handle.kind === "tiff"
            ? await handle.backend.renderPagePng(viewport.pageIndex, signal)
            : handle.data;
        await drawEncodedImage(data, handle.kind === "tiff" ? "image/png" : mimeType(handle.format), target, {
            dpr: viewport.devicePixelRatio,
            scale: viewport.zoom,
            ...(viewport.width === undefined ? {} : { cssWidth: viewport.width }),
            ...(viewport.height === undefined
                ? {}
                : { cssHeight: viewport.height }),
        });
        if (signal?.aborted)
            throw abortError();
    }
    async getTextMap() {
        return [];
    }
    close(handle) {
        if (handle.kind === "tiff")
            handle.backend.close();
    }
}
export function createImageAdapter(options = {}) {
    return new ImageDocumentAdapter(options);
}
class WorkerTiffBackend {
    pages;
    #worker;
    #id = 0;
    #closed = false;
    #timeoutMs;
    constructor(worker, pages, timeoutMs) {
        this.#worker = worker;
        this.pages = pages;
        this.#timeoutMs = timeoutMs;
    }
    static async open(data, workerUrl, moduleUrl, maxPixels, signal, timeoutMs) {
        const worker = new Worker(workerUrl, {
            type: "module",
            name: "tiff-decoder",
        });
        const copy = data.slice().buffer;
        const response = await requestWorker(worker, {
            id: 0,
            type: "open",
            data: copy,
            moduleUrl: moduleUrl.href,
            maxPixels,
        }, [copy], signal, timeoutMs);
        if (!response.ok || !response.pages) {
            worker.terminate();
            const message = response.ok
                ? "TIFF worker returned no pages"
                : response.message;
            throw new ViewerError(/pixel|limit/i.test(message) ? "resource-limit" : "invalid-file", message);
        }
        return new WorkerTiffBackend(worker, response.pages, timeoutMs);
    }
    async renderPagePng(pageIndex, signal) {
        if (this.#closed)
            throw new ViewerError("lifecycle-error", "TIFF backend is closed");
        const response = await requestWorker(this.#worker, { id: ++this.#id, type: "render", pageIndex }, [], signal, this.#timeoutMs);
        if (!response.ok || !response.data)
            throw new ViewerError("render-failed", response.ok ? "TIFF worker returned no bitmap" : response.message);
        return new Uint8Array(response.data);
    }
    close() {
        if (this.#closed)
            return;
        this.#closed = true;
        this.#worker.postMessage({ id: ++this.#id, type: "close" });
        this.#worker.terminate();
    }
}
function requestWorker(worker, payload, transfer, signal, timeoutMs = 30_000) {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(abortError());
            return;
        }
        const expectedId = payload.id;
        const finish = () => {
            clearTimeout(timeout);
            signal?.removeEventListener("abort", onAbort);
            worker.removeEventListener("message", onMessage);
            worker.removeEventListener("error", onError);
        };
        const timeout = setTimeout(() => {
            finish();
            worker.terminate();
            reject(new ViewerError("resource-limit", "TIFF worker operation exceeded maxOperationMs", { details: { timeoutMs } }));
        }, timeoutMs);
        const onAbort = () => {
            finish();
            reject(abortError());
        };
        const onMessage = (event) => {
            if (event.data.id !== expectedId)
                return;
            finish();
            resolve(event.data);
        };
        const onError = (event) => {
            finish();
            reject(new ViewerError("worker-crashed", "TIFF worker crashed", {
                details: { message: event.message },
            }));
        };
        signal?.addEventListener("abort", onAbort, { once: true });
        worker.addEventListener("message", onMessage);
        worker.addEventListener("error", onError);
        worker.postMessage(payload, transfer);
    });
}
function mimeType(format) {
    return format === "jpeg" ? "image/jpeg" : `image/${format}`;
}
function isAnimated(data, format) {
    if (format === "gif") {
        let frames = 0;
        for (const byte of data)
            if (byte === 0x2c && ++frames > 1)
                return true;
    }
    if (format === "webp")
        return new TextDecoder("latin1")
            .decode(data.subarray(0, 64))
            .includes("ANIM");
    return false;
}
