import { ViewerError } from "./errors.js";
import { defaultResourceLimits, resolveLimits } from "./limits.js";
import { AdapterRegistry } from "./registry.js";
import { DocumentViewer } from "./viewer.js";
import { createOfficeAdapter } from "./adapters/office.js";
import { createPdfAdapter } from "./adapters/pdf.js";
import { createImageAdapter } from "./adapters/image.js";
import { createCsvAdapter } from "./adapters/csv.js";
import { createSvgAdapter } from "./adapters/svg.js";
import { FontManager } from "./fonts.js";
import { RenderScheduler } from "./render-scheduler.js";
export class ViewerClient {
    registry;
    fetch;
    logger;
    assetBaseUrl;
    limits;
    fonts;
    renderScheduler;
    #viewers = new Set();
    #destroyed = false;
    static create(options = {}) {
        return new ViewerClient(options);
    }
    constructor(options = {}) {
        this.registry = new AdapterRegistry(options.adapters ?? [
            createOfficeAdapter(),
            createPdfAdapter(),
            createImageAdapter(),
            createCsvAdapter(),
            createSvgAdapter(),
        ]);
        this.fetch = options.fetch ?? globalThis.fetch?.bind(globalThis);
        if (!this.fetch)
            throw new ViewerError("network-error", "No global fetch implementation is available; supply options.fetch");
        if (options.logger)
            this.logger = options.logger;
        if (options.assetBaseUrl)
            this.assetBaseUrl = new URL(options.assetBaseUrl, globalThis.location?.href ?? "http://localhost/");
        this.limits = resolveLimits(defaultResourceLimits, options.limits);
        this.fonts = new FontManager({
            fetch: this.fetch,
            ...(this.assetBaseUrl ? { assetBaseUrl: this.assetBaseUrl } : {}),
            ...(options.fontPolicy ? { policy: options.fontPolicy } : {}),
            ...(options.fonts ? { registered: options.fonts } : {}),
        });
        this.renderScheduler = new RenderScheduler(this.limits.maxConcurrentRenders);
    }
    createViewer(options = {}) {
        this.#assertAlive();
        const runtime = {
            registry: this.registry,
            fetch: this.fetch,
            limits: this.limits,
            fonts: this.fonts,
            renderScheduler: this.renderScheduler,
            ...(this.logger ? { logger: this.logger } : {}),
            ...(this.assetBaseUrl ? { assetBaseUrl: this.assetBaseUrl } : {}),
            release: (viewer) => this.#viewers.delete(viewer),
        };
        const viewer = new DocumentViewer(options, runtime);
        this.#viewers.add(viewer);
        return viewer;
    }
    registerAdapter(adapter) {
        this.#assertAlive();
        return this.registry.register(adapter);
    }
    async destroy() {
        if (this.#destroyed)
            return;
        this.#destroyed = true;
        await Promise.all([...this.#viewers].map(async (viewer) => viewer.destroy()));
        this.#viewers.clear();
        await this.registry.destroy();
        await this.fonts.destroy();
    }
    #assertAlive() {
        if (this.#destroyed)
            throw new ViewerError("lifecycle-error", "ViewerClient is destroyed");
    }
}
