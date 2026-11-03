import { normalizeError } from "./errors.js";
import { transferablesFor } from "./worker-protocol.js";
export function attachWorkerEndpoint(scope, handler) {
    const operations = new Map();
    const onMessage = (event) => {
        const message = event.data;
        if (message.kind === "cancel") {
            cancel(operations, message);
            return;
        }
        void run(scope, handler, operations, message);
    };
    scope.addEventListener("message", onMessage);
    return () => {
        scope.removeEventListener("message", onMessage);
        for (const controller of operations.values())
            controller.abort();
        operations.clear();
    };
}
async function run(scope, handler, operations, request) {
    const controller = new AbortController();
    operations.set(request.id, controller);
    try {
        const result = await handler(request.operation, request.payload, {
            signal: controller.signal,
            reportProgress: (progress) => scope.postMessage({
                kind: "progress",
                id: request.id,
                progress,
            }),
            reportWarning: (warning) => scope.postMessage({
                kind: "warning",
                id: request.id,
                warning,
            }),
        });
        scope.postMessage({
            kind: "success",
            id: request.id,
            ...(result === undefined ? {} : { result }),
        }, transferablesFor(result));
    }
    catch (error) {
        scope.postMessage({
            kind: "failure",
            id: request.id,
            error: normalizeError(error).toJSON(),
        });
    }
    finally {
        operations.delete(request.id);
    }
}
function cancel(operations, message) {
    operations.get(message.id)?.abort();
}
