export function transferablesFor(value) {
    if (value instanceof ArrayBuffer)
        return [value];
    if (typeof ImageBitmap !== "undefined" && value instanceof ImageBitmap)
        return [value];
    if (ArrayBuffer.isView(value))
        return [value.buffer];
    if (value && typeof value === "object") {
        const data = value.data;
        if (data instanceof ArrayBuffer)
            return [data];
    }
    return [];
}
