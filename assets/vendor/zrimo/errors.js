export class ViewerError extends Error {
    name = "ViewerError";
    code;
    details;
    constructor(code, message, options = {}) {
        super(message, options.cause === undefined ? undefined : { cause: options.cause });
        this.code = code;
        if (options.details)
            this.details = options.details;
    }
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            ...(this.details ? { details: this.details } : {}),
        };
    }
}
export function abortError(message = "Operation aborted") {
    return new ViewerError("aborted", message);
}
export function normalizeError(error, fallback = "internal") {
    if (error instanceof ViewerError)
        return error;
    if (isAbort(error))
        return abortError();
    return new ViewerError(fallback, error instanceof Error ? error.message : String(error), {
        cause: error,
    });
}
export function errorFromData(data) {
    return new ViewerError(data.code, data.message, data.details ? { details: data.details } : {});
}
function isAbort(error) {
    return ((typeof DOMException !== "undefined" &&
        error instanceof DOMException &&
        error.name === "AbortError") ||
        (error instanceof Error && error.name === "AbortError"));
}
