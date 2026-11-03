import { ViewerError } from "./errors.js";
const extensionFormats = {
    docx: "docx",
    docm: "docm",
    xlsx: "xlsx",
    xlsm: "xlsm",
    pptx: "pptx",
    pptm: "pptm",
    ppsx: "ppsx",
    doc: "doc",
    xls: "xls",
    ppt: "ppt",
    pdf: "pdf",
    csv: "csv",
    tsv: "tsv",
    png: "png",
    jpg: "jpeg",
    jpeg: "jpeg",
    gif: "gif",
    webp: "webp",
    svg: "svg",
    bmp: "bmp",
    tif: "tiff",
    tiff: "tiff",
};
const mimeFormats = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.ms-excel": "xls",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-word.document.macroenabled.12": "docm",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-excel.sheet.macroenabled.12": "xlsm",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
    "text/csv": "csv",
    "text/tab-separated-values": "tsv",
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
    "image/tiff": "tiff",
};
export function detectFormat(data, hints = {}) {
    if (isEncryptedOfficeContainer(data))
        throw new ViewerError("encrypted-document", "Password-protected Office documents are not supported");
    const hinted = hints.format ??
        formatFromMime(hints.contentType) ??
        formatFromFileName(hints.fileName ?? "");
    const detected = detectByBytes(data, hinted);
    if (!detected && hinted && ["csv", "tsv", "svg"].includes(hinted))
        return { format: hinted, confidence: "hint", warnings: [] };
    if (!detected)
        throw new ViewerError("unsupported-format", "Unable to detect a supported document format", {
            details: { fileName: hints.fileName, contentType: hints.contentType },
        });
    const format = preserveSubtype(detected, hinted);
    const warnings = [];
    if (hinted && !sameFamily(format, hinted))
        warnings.push({
            code: "format-hint-mismatch",
            message: `Content is ${format}, but the supplied hint was ${hinted}; content wins`,
            details: { detected: format, hinted },
        });
    return {
        format,
        confidence: detected === format ? "magic" : "container",
        warnings,
    };
}
function isEncryptedOfficeContainer(data) {
    return (starts(data, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]) &&
        includesUtf16(data, "EncryptionInfo") &&
        includesUtf16(data, "EncryptedPackage"));
}
export function formatFromFileName(fileName) {
    const cleanName = fileName.split(/[?#]/, 1)[0] ?? fileName;
    const dot = cleanName.lastIndexOf(".");
    return dot < 0
        ? undefined
        : extensionFormats[cleanName.slice(dot + 1).toLowerCase()];
}
export function formatFromMime(contentType) {
    return contentType
        ? mimeFormats[contentType.split(";", 1)[0].trim().toLowerCase()]
        : undefined;
}
export function sniffFormat(data) {
    return detectByBytes(data);
}
function detectByBytes(data, hint) {
    if (starts(data, [0x25, 0x50, 0x44, 0x46, 0x2d]))
        return "pdf";
    if (starts(data, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
        return "png";
    if (starts(data, [0xff, 0xd8, 0xff]))
        return "jpeg";
    if (ascii(data, 0, 4) === "GIF8")
        return "gif";
    if (ascii(data, 0, 4) === "RIFF" && ascii(data, 8, 12) === "WEBP")
        return "webp";
    if (ascii(data, 0, 2) === "BM")
        return "bmp";
    if (starts(data, [0x49, 0x49, 0x2a, 0x00]) ||
        starts(data, [0x4d, 0x4d, 0x00, 0x2a]))
        return "tiff";
    if (starts(data, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
        return detectOle(data) ?? legacyHint(hint);
    if (starts(data, [0x50, 0x4b]))
        return detectOoxml(data) ?? ooxmlHint(hint);
    if (looksLikeSvg(data))
        return "svg";
    return undefined;
}
function detectOoxml(data) {
    // Entry names from the central directory are the authoritative signal;
    // scanning the whole buffer misreads compressed part data, where a random
    // "xl/" or "word/" byte run is near-certain in a large media-heavy file.
    const entryNames = readZipEntryNames(data);
    if (entryNames)
        return ooxmlFormatFromEntryNames(entryNames);
    // No readable central directory (typically a truncated prefix passed to
    // sniffFormat): keep the legacy substring scan as a best-effort fallback.
    if (includesAscii(data, "word/"))
        return "docx";
    if (includesAscii(data, "xl/"))
        return "xlsx";
    if (includesAscii(data, "ppt/"))
        return "pptx";
    return undefined;
}
function ooxmlFormatFromEntryNames(entryNames) {
    for (const name of entryNames) {
        if (name === "word/document.xml")
            return "docx";
        if (name === "xl/workbook.xml")
            return "xlsx";
        if (name === "ppt/presentation.xml")
            return "pptx";
    }
    if (entryNames.some((name) => name.startsWith("word/")))
        return "docx";
    if (entryNames.some((name) => name.startsWith("xl/")))
        return "xlsx";
    if (entryNames.some((name) => name.startsWith("ppt/")))
        return "pptx";
    return undefined;
}
const ZIP_EOCD_SIGNATURE = 0x06054b50;
const ZIP_CENTRAL_HEADER_SIGNATURE = 0x02014b50;
const ZIP_CENTRAL_DIGITAL_SIGNATURE = 0x05054b50;
const ZIP_EOCD_MIN_BYTES = 22;
// The end-of-central-directory record sits at most a 16-bit comment before
// the end of the archive.
const ZIP_EOCD_MAX_SCAN_BYTES = ZIP_EOCD_MIN_BYTES + 0xffff;
const ZIP_CENTRAL_HEADER_MIN_BYTES = 46;
/**
 * Reads the archive's entry names from the central directory, or returns
 * undefined when the directory cannot be read consistently (truncated input,
 * zip64 markers, or corrupted records). Parsing is bounded by the record
 * count and validated against the buffer on every step.
 */
function readZipEntryNames(data) {
    if (data.byteLength < ZIP_EOCD_MIN_BYTES)
        return undefined;
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const stop = Math.max(0, view.byteLength - ZIP_EOCD_MAX_SCAN_BYTES);
    let eocdOffset = -1;
    for (let offset = view.byteLength - ZIP_EOCD_MIN_BYTES; offset >= stop; offset -= 1) {
        if (view.getUint32(offset, true) !== ZIP_EOCD_SIGNATURE)
            continue;
        const commentLength = view.getUint16(offset + 20, true);
        if (offset + ZIP_EOCD_MIN_BYTES + commentLength !== view.byteLength)
            continue;
        const diskNumber = view.getUint16(offset + 4, true);
        const centralDisk = view.getUint16(offset + 6, true);
        const entriesOnDisk = view.getUint16(offset + 8, true);
        const entryCount = view.getUint16(offset + 10, true);
        const centralSize = view.getUint32(offset + 12, true);
        const centralOffset = view.getUint32(offset + 16, true);
        if (diskNumber !== 0 ||
            centralDisk !== 0 ||
            entriesOnDisk !== entryCount ||
            entryCount === 0xffff ||
            centralSize === 0xffffffff ||
            centralOffset === 0xffffffff ||
            centralOffset + centralSize !== offset)
            continue;
        eocdOffset = offset;
        break;
    }
    if (eocdOffset < 0)
        return undefined;
    const entryCount = view.getUint16(eocdOffset + 10, true);
    let offset = view.getUint32(eocdOffset + 16, true);
    // A zip64 archive stores 0xffffffff here; treat it as unreadable rather
    // than guessing.
    if (offset === 0xffffffff)
        return undefined;
    const decoder = new TextDecoder();
    const names = [];
    for (let index = 0; index < entryCount; index += 1) {
        if (offset + ZIP_CENTRAL_HEADER_MIN_BYTES > eocdOffset)
            return undefined;
        if (view.getUint32(offset, true) !== ZIP_CENTRAL_HEADER_SIGNATURE)
            return undefined;
        const nameLength = view.getUint16(offset + 28, true);
        const extraLength = view.getUint16(offset + 30, true);
        const commentLength = view.getUint16(offset + 32, true);
        const nameStart = offset + ZIP_CENTRAL_HEADER_MIN_BYTES;
        const entryEnd = nameStart + nameLength + extraLength + commentLength;
        if (entryEnd > eocdOffset)
            return undefined;
        names.push(decoder.decode(data.subarray(nameStart, nameStart + nameLength)));
        offset = entryEnd;
    }
    if (offset === eocdOffset)
        return names;
    // A central-directory digital signature may follow the file headers.
    if (offset + 6 <= eocdOffset &&
        view.getUint32(offset, true) === ZIP_CENTRAL_DIGITAL_SIGNATURE &&
        offset + 6 + view.getUint16(offset + 4, true) === eocdOffset)
        return names;
    return undefined;
}
function detectOle(data) {
    if (includesUtf16(data, "WordDocument"))
        return "doc";
    if (includesUtf16(data, "Workbook") || includesUtf16(data, "Book"))
        return "xls";
    if (includesUtf16(data, "PowerPoint Document"))
        return "ppt";
    return undefined;
}
function preserveSubtype(detected, hinted) {
    return hinted && sameFamily(detected, hinted) ? hinted : detected;
}
function sameFamily(a, b) {
    return family(a) === family(b);
}
function family(format) {
    if (["doc", "docx", "docm"].includes(format))
        return "word";
    if (["xls", "xlsx", "xlsm"].includes(format))
        return "sheet";
    if (["ppt", "pptx", "pptm", "ppsx"].includes(format))
        return "slides";
    return format;
}
function legacyHint(format) {
    return format && ["doc", "xls", "ppt"].includes(format) ? format : undefined;
}
function ooxmlHint(format) {
    return format &&
        ["docx", "docm", "xlsx", "xlsm", "pptx", "pptm", "ppsx"].includes(format)
        ? format
        : undefined;
}
function looksLikeSvg(data) {
    const prefix = new TextDecoder().decode(data.subarray(0, Math.min(data.byteLength, 4096)));
    return /<(?:svg)(?:\s|>)/i.test(prefix.replace(/^\uFEFF/, ""));
}
function starts(data, signature) {
    return signature.every((byte, index) => data[index] === byte);
}
function ascii(data, start, end) {
    return String.fromCharCode(...data.subarray(start, end));
}
function includesAscii(data, text) {
    return indexOf(data, new TextEncoder().encode(text)) >= 0;
}
function includesUtf16(data, text) {
    const bytes = new Uint8Array(text.length * 2);
    for (let index = 0; index < text.length; index += 1)
        bytes[index * 2] = text.charCodeAt(index);
    return indexOf(data, bytes) >= 0;
}
function indexOf(haystack, needle) {
    outer: for (let offset = 0; offset <= haystack.length - needle.length; offset += 1) {
        for (let index = 0; index < needle.length; index += 1)
            if (haystack[offset + index] !== needle[index])
                continue outer;
        return offset;
    }
    return -1;
}
