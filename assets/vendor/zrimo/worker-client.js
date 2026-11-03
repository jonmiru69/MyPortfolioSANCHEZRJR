import { abortError, errorFromData, ViewerError } from "./errors.js";
import { transferablesFor } from "./worker-protocol.js";
export class WorkerRpcClient {
    #worker;
    #pending = new Map();
    #nextId = 1;
    #destroyed = false;
    constructor(worker) {
        this.#worker = worker;
        worker.addEventListener("message", this.#onMessage);
        worker.addEventListener("error", this.#onCrash);
        worker.addEventListener("messageerror", this.#onCrash);
    }
    request(operation, payload, options = {}) {
        if (this.#destroyed)
            return Promise.reject(new ViewerError("lifecycle-error", "Worker client is destroyed"));
        if (options.signal?.aborted)
            return Promise.reject(abortError());
        const id = this.#nextId++;
        const message = {
            kind: "request",
            id,
            operation,
            ...(payload === undefined ? {} : { payload }),
        };
        return new Promise((resolve, reject) => {
            const abort = options.signal
                ? () => {
                    this.#worker.postMessage({ kind: "cancel", id });
                    this.#finish(id, abortError());
                }
                : undefined;
            const pending = {
                resolve: resolve,
                reject,
                ...(options.onProgress ? { onProgress: options.onProgress } : {}),
                ...(options.onWarning ? { onWarning: options.onWarning } : {}),
                ...(options.signal ? { signal: options.signal } : {}),
                ...(abort ? { abort } : {}),
                ...(options.timeoutMs
                    ? {
                        timeout: setTimeout(() => {
                            const error = operationTimeout(operation, options.timeoutMs);
                            this.#worker.postMessage({ kind: "cancel", id });
                            this.#terminate(error);
                        }, options.timeoutMs),
                    }
                    : {}),
            };
            this.#pending.set(id, pending);
            options.signal?.addEventListener("abort", abort, { once: true });
            this.#worker.postMessage(message, options.transfer ?? transferablesFor(payload));
        });
    }
    destroy() {
        this.#terminate(new ViewerError("worker-crashed", "Worker terminated"));
    }
    #terminate(error) {
        if (this.#destroyed)
            return;
        this.#destroyed = true;
        this.#worker.removeEventListener("message", this.#onMessage);
        this.#worker.removeEventListener("error", this.#onCrash);
        this.#worker.removeEventListener("messageerror", this.#onCrash);
        this.#worker.terminate();
        for (const id of this.#pending.keys())
            this.#finish(id, error);
    }
    #onMessage = (event) => {
        const message = event.data;
        const pending = this.#pending.get(message.id);
        if (!pending)
            return;
        if (message.kind === "progress")
            pending.onProgress?.(message.progress);
        else if (message.kind === "warning")
            pending.onWarning?.(message.warning);
        else if (message.kind === "success")
            this.#finish(message.id, undefined, message.result);
        else
            this.#finish(message.id, errorFromData(message.error));
    };
    #onCrash = () => {
        const error = new ViewerError("worker-crashed", "Document worker crashed");
        for (const id of this.#pending.keys())
            this.#finish(id, error);
    };
    #finish(id, error, value) {
        const pending = this.#pending.get(id);
        if (!pending)
            return;
        this.#pending.delete(id);
        if (pending.abort && pending.signal)
            pending.signal.removeEventListener("abort", pending.abort);
        if (pending.timeout)
            clearTimeout(pending.timeout);
        if (error)
            pending.reject(error);
        else
            pending.resolve(value);
    }
}
function operationTimeout(operation, timeoutMs) {
    return new ViewerError("resource-limit", `Worker operation ${operation} exceeded maxOperationMs`, { details: { operation, timeoutMs } });
}
