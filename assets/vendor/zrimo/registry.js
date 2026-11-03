import { ViewerError } from "./errors.js";
export class AdapterRegistry {
    #adapters = new Map();
    constructor(adapters = []) {
        for (const adapter of adapters)
            this.register(adapter);
    }
    register(adapter) {
        if (!adapter.id.trim())
            throw new ViewerError("internal", "Adapter id must not be empty");
        for (const format of adapter.formats) {
            if (this.#adapters.has(format))
                throw new ViewerError("internal", `An adapter is already registered for ${format}`);
            this.#adapters.set(format, adapter);
        }
        return () => {
            for (const format of adapter.formats)
                if (this.#adapters.get(format) === adapter)
                    this.#adapters.delete(format);
        };
    }
    resolve(format) {
        const adapter = this.#adapters.get(format);
        if (!adapter)
            throw new ViewerError("unsupported-format", `No adapter is registered for ${format}`, {
                details: { format },
            });
        return adapter;
    }
    async destroy() {
        const unique = new Set(this.#adapters.values());
        this.#adapters.clear();
        await Promise.all([...unique].map(async (adapter) => adapter.destroy?.()));
    }
}
