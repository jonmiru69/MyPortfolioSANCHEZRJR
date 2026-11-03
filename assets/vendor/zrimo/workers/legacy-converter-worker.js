const workerScope = self;
workerScope.onmessage = async (event) => {
    try {
        const module = (await import(
        /* @vite-ignore */ event.data.moduleUrl));
        await module.default();
        const output = module.convertLegacyToOoxml(new Uint8Array(event.data.data), event.data.format);
        const data = output.slice().buffer;
        workerScope.postMessage({ ok: true, data }, [data]);
    }
    catch (error) {
        workerScope.postMessage({
            ok: false,
            data: new ArrayBuffer(0),
            message: error instanceof Error ? error.message : String(error),
        });
    }
};
export {};
