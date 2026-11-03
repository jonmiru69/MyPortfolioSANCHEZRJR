import { parseDelimitedBytes } from "./adapters/csv-parser.js";
const workerScope = self;
workerScope.onmessage = (event) => {
    try {
        const result = parseDelimitedBytes(new Uint8Array(event.data.data), event.data.format, event.data.maxCells);
        workerScope.postMessage({ ok: true, result });
    }
    catch (error) {
        workerScope.postMessage({
            ok: false,
            message: error instanceof Error ? error.message : String(error),
            code: typeof error === "object" && error !== null && "code" in error
                ? String(error.code)
                : "invalid-file",
        });
    }
};
