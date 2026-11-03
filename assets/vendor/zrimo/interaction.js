export function visibleRange(scrollOffset, viewportExtent, itemExtent, itemCount, overscan = 1) {
    if (itemCount <= 0 || itemExtent <= 0)
        return { start: 0, end: 0 };
    const first = Math.floor(Math.max(0, scrollOffset) / itemExtent);
    const last = Math.ceil((Math.max(0, scrollOffset) + Math.max(0, viewportExtent)) / itemExtent);
    return {
        start: Math.max(0, first - Math.max(0, Math.trunc(overscan))),
        end: Math.min(itemCount, last + Math.max(0, Math.trunc(overscan))),
    };
}
export function normalizeCellRange(range) {
    return {
        sheetIndex: Math.max(0, Math.trunc(range.sheetIndex)),
        startRow: Math.max(1, Math.min(range.startRow, range.endRow)),
        startColumn: Math.max(1, Math.min(range.startColumn, range.endColumn)),
        endRow: Math.max(1, Math.max(range.startRow, range.endRow)),
        endColumn: Math.max(1, Math.max(range.startColumn, range.endColumn)),
    };
}
export function findNormalizedMatches(text, query, pageIndex, caseSensitive = false) {
    const haystack = normalizeWithMap(text, caseSensitive);
    const needle = normalizeSearchText(query, caseSensitive);
    if (!needle)
        return [];
    const matches = [];
    let offset = 0;
    while (offset <= haystack.text.length - needle.length) {
        const found = haystack.text.indexOf(needle, offset);
        if (found < 0)
            break;
        const last = found + needle.length - 1;
        const start = haystack.starts[found] ?? 0;
        const end = haystack.ends[last] ?? start;
        matches.push({
            pageIndex,
            start,
            end,
            text: text.slice(start, end),
        });
        offset = found + Math.max(1, needle.length);
    }
    return matches;
}
export function normalizeSearchText(text, caseSensitive = false) {
    const normalized = text.normalize("NFKC");
    return caseSensitive ? normalized : unicodeCaseFold(normalized);
}
/** Clamp a UTF-16 DOM offset to a grapheme boundary for native selection UI. */
export function snapGraphemeOffset(text, offset, edge) {
    const safeOffset = Math.max(0, Math.min(text.length, Math.trunc(offset)));
    for (const segment of graphemeSegments(text)) {
        if (safeOffset === segment.start || safeOffset === segment.end)
            return safeOffset;
        if (safeOffset > segment.start && safeOffset < segment.end)
            return edge === "start" ? segment.start : segment.end;
    }
    return safeOffset;
}
export function cellRangeToTsv(range, cells) {
    const normalized = normalizeCellRange(range);
    const rows = [];
    for (let row = normalized.startRow; row <= normalized.endRow; row += 1) {
        const values = [];
        for (let column = normalized.startColumn; column <= normalized.endColumn; column += 1)
            values.push(escapeTsv(cells.get(`${row}:${column}`) ?? ""));
        rows.push(values.join("\t"));
    }
    return rows.join("\n");
}
export function cellRangesToTsv(ranges, cells) {
    if (ranges.length === 0)
        return "";
    if (ranges.length === 1)
        return cellRangeToTsv(ranges[0], cells);
    const rows = new Map();
    for (const rawRange of ranges) {
        const range = normalizeCellRange(rawRange);
        for (let row = range.startRow; row <= range.endRow; row += 1) {
            const intervals = rows.get(row) ?? [];
            intervals.push({ start: range.startColumn, end: range.endColumn });
            rows.set(row, intervals);
        }
    }
    const output = [];
    for (const [row, intervals] of [...rows].sort(([left], [right]) => left - right)) {
        const selected = mergeIntervals(intervals);
        const start = selected[0].start;
        const end = selected[selected.length - 1].end;
        const values = [];
        for (let column = start; column <= end; column += 1) {
            const included = selected.some((interval) => column >= interval.start && column <= interval.end);
            values.push(included ? escapeTsv(cells.get(`${row}:${column}`) ?? "") : "");
        }
        output.push(values.join("\t"));
    }
    return output.join("\n");
}
export class LruMap {
    #values = new Map();
    #capacity;
    constructor(capacity) {
        this.#capacity = Math.max(1, Math.trunc(capacity));
    }
    get size() {
        return this.#values.size;
    }
    get(key) {
        const value = this.#values.get(key);
        if (value === undefined)
            return undefined;
        this.#values.delete(key);
        this.#values.set(key, value);
        return value;
    }
    set(key, value) {
        if (this.#values.has(key))
            this.#values.delete(key);
        this.#values.set(key, value);
        if (this.#values.size <= this.#capacity)
            return undefined;
        const oldest = this.#values.entries().next().value;
        this.#values.delete(oldest[0]);
        return { key: oldest[0], value: oldest[1] };
    }
    clear() {
        this.#values.clear();
    }
}
function normalizeWithMap(text, caseSensitive) {
    const output = [];
    const starts = [];
    const ends = [];
    const segments = graphemeSegments(text);
    for (const segment of segments) {
        const normalized = normalizeSearchText(segment.value, caseSensitive);
        output.push(normalized);
        for (let index = 0; index < normalized.length; index += 1) {
            starts.push(segment.start);
            ends.push(segment.end);
        }
    }
    return { text: output.join(""), starts, ends };
}
function graphemeSegments(text) {
    if (typeof Intl.Segmenter === "function") {
        const segmenter = new Intl.Segmenter(undefined, {
            granularity: "grapheme",
        });
        return [...segmenter.segment(text)].map((segment) => ({
            value: segment.segment,
            start: segment.index,
            end: segment.index + segment.segment.length,
        }));
    }
    const result = [];
    let offset = 0;
    for (const value of text) {
        result.push({ value, start: offset, end: offset + value.length });
        offset += value.length;
    }
    return result;
}
function unicodeCaseFold(text) {
    return text
        .toLocaleLowerCase("und")
        .replaceAll("ß", "ss")
        .replaceAll("ς", "σ");
}
function escapeTsv(value) {
    return /[\t\n\r"]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}
function mergeIntervals(intervals) {
    const sorted = [...intervals].sort((left, right) => left.start - right.start);
    const merged = [];
    for (const interval of sorted) {
        const previous = merged.at(-1);
        if (previous && interval.start <= previous.end + 1)
            previous.end = Math.max(previous.end, interval.end);
        else
            merged.push({ ...interval });
    }
    return merged;
}
