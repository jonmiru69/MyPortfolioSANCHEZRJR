/* tslint:disable */
/* eslint-disable */

/**
 * Parsed, bounded multi-page TIFF document.
 */
export class TiffViewerDocument {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Decode all TIFF IFDs and retain compressed PNG pages.
     *
     * # Errors
     *
     * Returns an error for malformed/unsupported TIFF data or a pixel-limit breach.
     */
    constructor(data: Uint8Array, max_decoded_pixels: number);
    /**
     * Number of image directories/pages.
     */
    pageCount(): number;
    /**
     * Height of one page in pixels.
     */
    pageHeight(page_index: number): number;
    /**
     * Width of one page in pixels.
     */
    pageWidth(page_index: number): number;
    /**
     * Return a decoded page as PNG bytes.
     *
     * # Errors
     *
     * Returns an error when `page_index` is outside the document.
     */
    renderPagePng(page_index: number): Uint8Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_tiffviewerdocument_free: (a: number, b: number) => void;
    readonly tiffviewerdocument_new: (a: number, b: number, c: number, d: number) => void;
    readonly tiffviewerdocument_pageCount: (a: number) => number;
    readonly tiffviewerdocument_pageHeight: (a: number, b: number) => number;
    readonly tiffviewerdocument_pageWidth: (a: number, b: number) => number;
    readonly tiffviewerdocument_renderPagePng: (a: number, b: number, c: number) => void;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
