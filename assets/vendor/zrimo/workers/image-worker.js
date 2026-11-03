const workerScope = self;
let document;
workerScope.onmessage = async (event) => {
    const request = event.data;
    try {
        if (request.type === "open") {
            if (!request.moduleUrl || !request.data || !request.maxPixels)
                throw new Error("Invalid TIFF open request");
            const module = (await import(
            /* @vite-ignore */ request.moduleUrl));
            await module.default();
            document?.free();
            document = new module.TiffViewerDocument(new Uint8Array(request.data), request.maxPixels);
            const pages = Array.from({ length: document.pageCount() }, (_, pageIndex) => ({
                width: document.pageWidth(pageIndex),
                height: document.pageHeight(pageIndex),
            }));
            workerScope.postMessage({ id: request.id, ok: true, pages });
        }
        else if (request.type === "render") {
            if (!document || request.pageIndex === undefined)
                throw new Error("TIFF is not open");
            const png = document.renderPagePng(request.pageIndex);
            const data = png.slice().buffer;
            workerScope.postMessage({ id: request.id, ok: true, data }, [data]);
        }
        else {
            document?.free();
            document = undefined;
            workerScope.postMessage({ id: request.id, ok: true });
        }
    }
    catch (error) {
        workerScope.postMessage({
            id: request.id,
            ok: false,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};
export {};
