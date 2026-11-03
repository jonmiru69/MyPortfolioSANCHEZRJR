import { abortError, ViewerError } from "../errors.js";
// Preserve the public zoom=1 contract: one PDF point maps to one renderer CSS
// pixel. Per-page geometry still prevents the viewport from coercing pages to
// A4 or changing their width while virtualizing.
const CSS_UNITS = 1;
export class PdfDocumentAdapter {
    id = "pdf";
    formats = ["pdf"];
    #options;
    constructor(options = {}) {
        this.#options = options;
    }
    async open(data, context) {
        context.reportProgress({ phase: "parsing", loaded: 0, total: 1 });
        try {
            const backend = this.#options.open
                ? await this.#options.open(data, context)
                : await PdfJsBackend.open(data, context, this.#options);
            if (context.signal.aborted) {
                await backend.close();
                throw abortError();
            }
            if (backend.pageCount < 1) {
                await backend.close();
                throw new ViewerError("invalid-file", "PDF contains no pages");
            }
            context.reportProgress({
                phase: "parsing",
                loaded: 1,
                total: 1,
                ratio: 1,
            });
            return { backend };
        }
        catch (error) {
            if (context.signal.aborted)
                throw abortError();
            if (error instanceof ViewerError)
                throw error;
            const message = error instanceof Error ? error.message : String(error);
            throw new ViewerError(isPasswordError(error, message) ? "encrypted-document" : "invalid-file", isPasswordError(error, message)
                ? "Password-protected PDF documents are not supported"
                : message, { cause: error });
        }
    }
    async getInfo(handle) {
        const pageSizes = handle.backend.pageSize
            ? await Promise.all(Array.from({ length: handle.backend.pageCount }, (_, pageIndex) => handle.backend.pageSize(pageIndex)))
            : undefined;
        return {
            format: "pdf",
            unit: "page",
            pageCount: handle.backend.pageCount,
            ...(pageSizes ? { pageSizes } : {}),
        };
    }
    async render(handle, target, viewport, signal) {
        assertPage(viewport.pageIndex, handle.backend.pageCount);
        if (signal?.aborted)
            throw abortError();
        await handle.backend.renderPage(target, viewport.pageIndex, viewport.zoom, viewport.devicePixelRatio, signal);
        if (signal?.aborted)
            throw abortError();
    }
    async getTextMap(handle, pageIndex, signal) {
        assertPage(pageIndex, handle.backend.pageCount);
        if (signal?.aborted)
            throw abortError();
        return handle.backend.pageText(pageIndex, signal);
    }
    async close(handle) {
        await handle.backend.close();
    }
}
export function createPdfAdapter(options = {}) {
    return new PdfDocumentAdapter(options);
}
class PdfJsBackend {
    pageCount;
    #module;
    #document;
    #worker;
    #loadingTask;
    #maxPixels;
    #pages = new Map();
    #closed = false;
    constructor(module, document, worker, loadingTask, maxPixels) {
        this.#module = module;
        this.#document = document;
        this.#worker = worker;
        this.#loadingTask = loadingTask;
        this.#maxPixels = maxPixels;
        this.pageCount = document.numPages;
    }
    static async open(data, context, options) {
        if (typeof Worker === "undefined")
            throw new ViewerError("internal", "PDF.js requires a browser module Worker");
        // PDF.js' modern build targets browsers with very recent JavaScript
        // intrinsics (for example Math.sumPrecise). The legacy build keeps the
        // same API while installing the required polyfills in both the main
        // realm and its matching worker, which is necessary for our supported
        // browser matrix.
        const module = (await import("pdfjs-dist/legacy/build/pdf.mjs"));
        const assetRoot = context.assetBaseUrl
            ? new URL("assets/pdfjs/", context.assetBaseUrl)
            : packageRelativeUrl(["..", "assets", "pdfjs", ""]);
        const defaultWorkerUrl = context.assetBaseUrl
            ? new URL("workers/pdf.worker.min.mjs", context.assetBaseUrl)
            : packageRelativeUrl(["..", "workers", "pdf.worker.min.mjs"]);
        // The worker filename is intentionally stable for package consumers, so
        // attach the PDF.js version to avoid reusing an incompatible cached worker
        // after a dependency upgrade.
        defaultWorkerUrl.searchParams.set("v", module.version);
        const workerUrl = resolveAssetUrl(options.workerUrl, context.assetBaseUrl, defaultWorkerUrl);
        const workerPort = new Worker(workerUrl, {
            type: "module",
            name: `pdfjs-${module.version}`,
        });
        const worker = new module.PDFWorker({ port: workerPort });
        const loadingTask = module.getDocument({
            data: data.slice(),
            worker,
            cMapUrl: directoryUrl(options.cMapUrl, context, assetRoot, "cmaps/"),
            cMapPacked: true,
            standardFontDataUrl: directoryUrl(options.standardFontDataUrl, context, assetRoot, "standard_fonts/"),
            wasmUrl: directoryUrl(options.wasmUrl, context, assetRoot, "wasm/"),
            iccUrl: directoryUrl(options.iccUrl, context, assetRoot, "iccs/"),
            useWorkerFetch: true,
            useWasm: true,
            useSystemFonts: false,
            disableFontFace: false,
            isEvalSupported: false,
            enableXfa: false,
            stopAtErrors: false,
            maxImageSize: context.limits.maxDecodedPixels,
            canvasMaxAreaInBytes: context.limits.maxDecodedPixels * 4,
        });
        const onAbort = () => {
            void loadingTask.destroy();
            worker.destroy();
            workerPort.terminate();
        };
        context.signal.addEventListener("abort", onAbort, { once: true });
        try {
            const document = await withTimeout(loadingTask.promise, context.limits.maxOperationMs, "PDF parsing");
            if (context.signal.aborted)
                throw abortError();
            return new PdfJsBackend(module, document, worker, loadingTask, context.limits.maxDecodedPixels);
        }
        catch (error) {
            await loadingTask.destroy().catch(() => undefined);
            worker.destroy();
            workerPort.terminate();
            throw error;
        }
        finally {
            context.signal.removeEventListener("abort", onAbort);
        }
    }
    async renderPage(target, pageIndex, zoom, devicePixelRatio, signal) {
        this.#assertOpen();
        const page = await this.#page(pageIndex);
        if (signal?.aborted)
            throw abortError();
        const viewport = page.getViewport({ scale: CSS_UNITS * zoom });
        const dpr = Math.max(1, devicePixelRatio);
        const width = Math.max(1, viewport.width);
        const height = Math.max(1, viewport.height);
        const pixels = Math.ceil(width * dpr) * Math.ceil(height * dpr);
        if (!Number.isSafeInteger(pixels) || pixels > this.#maxPixels)
            throw new ViewerError("resource-limit", "Rendered PDF page exceeds pixel limit", { details: { pixels, limit: this.#maxPixels } });
        target.width = Math.max(1, Math.ceil(width * dpr));
        target.height = Math.max(1, Math.ceil(height * dpr));
        if ("style" in target) {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
        }
        const context = target.getContext("2d");
        if (!context)
            throw new ViewerError("render-failed", "Canvas 2D context is unavailable");
        const renderTask = page.render({
            canvas: null,
            canvasContext: context,
            viewport,
            transform: dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0],
            background: "rgb(255,255,255)",
            intent: "display",
        });
        const onAbort = () => renderTask.cancel(0);
        signal?.addEventListener("abort", onAbort, { once: true });
        try {
            await renderTask.promise;
            if (signal?.aborted)
                throw abortError();
        }
        catch (error) {
            if (signal?.aborted ||
                error instanceof this.#module.RenderingCancelledException ||
                (error instanceof Error && error.name === "RenderingCancelledException"))
                throw abortError();
            throw new ViewerError("render-failed", "PDF.js page rendering failed", {
                cause: error,
            });
        }
        finally {
            signal?.removeEventListener("abort", onAbort);
        }
    }
    async pageSize(pageIndex, signal) {
        this.#assertOpen();
        const page = await raceAbort(this.#page(pageIndex), signal);
        const viewport = page.getViewport({ scale: CSS_UNITS });
        return { width: viewport.width, height: viewport.height };
    }
    async pageText(pageIndex, signal) {
        this.#assertOpen();
        const page = await this.#page(pageIndex);
        if (signal?.aborted)
            throw abortError();
        const viewport = page.getViewport({ scale: CSS_UNITS });
        const [content, annotations] = await Promise.all([
            raceAbort(page.getTextContent(), signal),
            raceAbort(page.getAnnotations({ intent: "display" }), signal),
        ]);
        const links = await this.#links(annotations, viewport, signal);
        const runs = [];
        let logicalOffset = 0;
        for (const item of content.items) {
            if (!("str" in item) || item.str.length === 0)
                continue;
            const style = content.styles[item.fontName] ?? {};
            const run = textItemToRun(item, style, viewport, links, logicalOffset);
            logicalOffset = run.logicalEnd ?? logicalOffset + item.str.length;
            runs.push(run);
        }
        return runs;
    }
    async close() {
        if (this.#closed)
            return;
        this.#closed = true;
        this.#pages.clear();
        try {
            await this.#document.cleanup();
            await this.#loadingTask.destroy();
        }
        finally {
            this.#worker.destroy();
        }
    }
    #page(pageIndex) {
        let page = this.#pages.get(pageIndex);
        if (!page) {
            page = this.#document.getPage(pageIndex + 1);
            this.#pages.set(pageIndex, page);
        }
        return page;
    }
    async #links(annotations, viewport, signal) {
        const result = [];
        for (const annotation of annotations) {
            if (annotation.subtype !== "Link" ||
                !annotation.rect ||
                annotation.rect.length < 4)
                continue;
            const target = await this.#linkTarget(annotation, signal);
            if (!target)
                continue;
            const first = viewport.convertToViewportPoint(annotation.rect[0], annotation.rect[1]);
            const second = viewport.convertToViewportPoint(annotation.rect[2], annotation.rect[3]);
            result.push({
                left: Math.min(first[0], second[0]),
                top: Math.min(first[1], second[1]),
                right: Math.max(first[0], second[0]),
                bottom: Math.max(first[1], second[1]),
                target,
            });
        }
        return result;
    }
    async #linkTarget(annotation, signal) {
        const external = safeExternalUrl(annotation.url ?? annotation.unsafeUrl);
        if (external)
            return external;
        if (!annotation.dest)
            return undefined;
        const reference = typeof annotation.dest === "string"
            ? await raceAbort(this.#document.getDestination(annotation.dest), signal)
            : annotation.dest;
        if (!reference || reference.length === 0)
            return undefined;
        let pageIndex;
        try {
            pageIndex = await raceAbort(this.#document.getPageIndex(reference[0]), signal);
        }
        catch {
            // A malformed destination remains a typed internal link without a page.
        }
        return {
            kind: "internal",
            ref: typeof annotation.dest === "string" ? annotation.dest : "pdf-dest",
            ...(pageIndex === undefined ? {} : { pageIndex }),
        };
    }
    #assertOpen() {
        if (this.#closed)
            throw new ViewerError("lifecycle-error", "PDF backend is closed");
    }
}
function textItemToRun(item, style, viewport, links, logicalStart) {
    const transform = multiplyTransform(viewport.transform, item.transform);
    let angle = Math.atan2(transform[1], transform[0]);
    if (style.vertical)
        angle += Math.PI / 2;
    const fontHeight = Math.max(1, Math.hypot(transform[2], transform[3]));
    const ascent = style.ascent !== undefined
        ? style.ascent * fontHeight
        : style.descent !== undefined
            ? (1 + style.descent) * fontHeight
            : fontHeight;
    const left = transform[4] + fontHeight * Math.sin(angle) * (ascent / fontHeight);
    const top = transform[5] - fontHeight * Math.cos(angle) * (ascent / fontHeight);
    const width = Math.max(1, item.width * viewport.scale);
    const height = Math.max(1, item.height * viewport.scale, fontHeight);
    const hyperlink = links.find((link) => rectanglesOverlap({ left, top, right: left + width, bottom: top + height }, link))?.target;
    const fontFamily = style.fontFamily ?? "sans-serif";
    return {
        text: item.str,
        x: left,
        y: top,
        width,
        height,
        direction: item.dir === "rtl" ? "rtl" : "ltr",
        fontFamily,
        fontSize: fontHeight,
        font: `${fontHeight}px ${fontFamily}`,
        ...(Math.abs(angle) < 0.000_001
            ? {}
            : { transform: `rotate(${angle}rad)` }),
        textLayer: "pdf",
        coordinateWidth: viewport.width,
        coordinateHeight: viewport.height,
        logicalStart,
        logicalEnd: logicalStart + item.str.length,
        ...(hyperlink ? { hyperlink } : {}),
    };
}
function multiplyTransform(first, second) {
    return [
        first[0] * second[0] + first[2] * second[1],
        first[1] * second[0] + first[3] * second[1],
        first[0] * second[2] + first[2] * second[3],
        first[1] * second[2] + first[3] * second[3],
        first[0] * second[4] + first[2] * second[5] + first[4],
        first[1] * second[4] + first[3] * second[5] + first[5],
    ];
}
function rectanglesOverlap(left, right) {
    return !(left.right < right.left ||
        left.left > right.right ||
        left.bottom < right.top ||
        left.top > right.bottom);
}
function safeExternalUrl(value) {
    if (!value)
        return undefined;
    try {
        const url = new URL(value);
        return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
            ? { kind: "external", url: url.href }
            : undefined;
    }
    catch {
        return undefined;
    }
}
function resolveAssetUrl(value, base, fallback) {
    return value === undefined ? fallback : new URL(value, base);
}
function packageRelativeUrl(segments) {
    // Keeping the path data-driven prevents application bundlers from treating
    // the package-owned directory as an import to hash or inline. Hosts that
    // bundle the facade should normally provide assetBaseUrl.
    const moduleUrl = import.meta.url;
    return new URL(segments.join("/"), moduleUrl);
}
function directoryUrl(value, context, assetRoot, directory) {
    const url = resolveAssetUrl(value, context.assetBaseUrl, new URL(directory, assetRoot));
    return url.href.endsWith("/") ? url.href : `${url.href}/`;
}
function raceAbort(promise, signal) {
    if (!signal)
        return promise;
    if (signal.aborted)
        return Promise.reject(abortError());
    return new Promise((resolve, reject) => {
        const onAbort = () => reject(abortError());
        signal.addEventListener("abort", onAbort, { once: true });
        promise.then((value) => {
            signal.removeEventListener("abort", onAbort);
            resolve(value);
        }, (error) => {
            signal.removeEventListener("abort", onAbort);
            reject(error);
        });
    });
}
function withTimeout(promise, timeoutMs, operation) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new ViewerError("resource-limit", `${operation} exceeded maxOperationMs`, { details: { timeoutMs } })), timeoutMs);
        promise.then((value) => {
            clearTimeout(timeout);
            resolve(value);
        }, (error) => {
            clearTimeout(timeout);
            reject(error);
        });
    });
}
function isPasswordError(error, message) {
    return ((error instanceof Error && error.name === "PasswordException") ||
        /password|encrypted/i.test(message));
}
function assertPage(pageIndex, pageCount) {
    if (!Number.isInteger(pageIndex) || pageIndex < 0 || pageIndex >= pageCount)
        throw new ViewerError("render-failed", "PDF page index is out of range", {
            details: { pageIndex, pageCount },
        });
}
