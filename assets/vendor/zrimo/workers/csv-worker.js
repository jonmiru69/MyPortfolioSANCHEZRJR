// src/errors.ts
var ViewerError = class extends Error {
  name = "ViewerError";
  code;
  details;
  constructor(code, message, options = {}) {
    super(
      message,
      options.cause === void 0 ? void 0 : { cause: options.cause }
    );
    this.code = code;
    if (options.details) this.details = options.details;
  }
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      ...this.details ? { details: this.details } : {}
    };
  }
};

// src/adapters/csv-parser.ts
function parseDelimitedBytes(data, format, maxCells = 1e6) {
  const decoded = decodeDelimitedBytes(data);
  const delimiter = format === "tsv" ? "	" : detectDelimiter(decoded.text, [",", "	", ";"]);
  return {
    delimiter,
    encoding: decoded.encoding,
    rows: parseDelimitedText(decoded.text, delimiter, maxCells)
  };
}
function parseDelimitedText(text, delimiter, maxCells = 1e6) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  let cells = 0;
  const pushField = () => {
    cells += 1;
    if (cells > maxCells)
      throw new ViewerError(
        "resource-limit",
        "Delimited data exceeds cell limit",
        {
          details: { maxCells }
        }
      );
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else quoted = false;
      } else field += character;
      continue;
    }
    if (character === '"' && field.length === 0) quoted = true;
    else if (character === delimiter) pushField();
    else if (character === "\n") pushRow();
    else if (character !== "\r") field += character;
  }
  if (quoted)
    throw new ViewerError(
      "invalid-file",
      "Unterminated quoted field in delimited data"
    );
  if (field.length > 0 || row.length > 0) pushRow();
  return rows;
}
function decodeDelimitedBytes(data) {
  if (data[0] === 239 && data[1] === 187 && data[2] === 191)
    return {
      text: new TextDecoder("utf-8", { fatal: true }).decode(data.subarray(3)),
      encoding: "utf-8"
    };
  if (data[0] === 255 && data[1] === 254)
    return {
      text: new TextDecoder("utf-16le", { fatal: true }).decode(
        data.subarray(2)
      ),
      encoding: "utf-16le"
    };
  if (data[0] === 254 && data[1] === 255) {
    const swapped = data.subarray(2).slice();
    for (let index = 0; index + 1 < swapped.length; index += 2)
      [swapped[index], swapped[index + 1]] = [
        swapped[index + 1],
        swapped[index]
      ];
    return {
      text: new TextDecoder("utf-16le", { fatal: true }).decode(swapped),
      encoding: "utf-16be"
    };
  }
  try {
    return {
      text: new TextDecoder("utf-8", { fatal: true }).decode(data),
      encoding: "utf-8"
    };
  } catch {
    return {
      text: new TextDecoder("windows-1252").decode(data),
      encoding: "windows-1252"
    };
  }
}
function detectDelimiter(text, candidates) {
  const sample = text.slice(0, 64 * 1024);
  let best = ",";
  let bestScore = -1;
  for (const candidate of candidates) {
    let quoted = false;
    let count = 0;
    let lines = 0;
    for (let index = 0; index < sample.length && lines < 20; index += 1) {
      const character = sample[index];
      if (character === '"') {
        if (quoted && sample[index + 1] === '"') index += 1;
        else quoted = !quoted;
      } else if (!quoted && character === candidate) count += 1;
      else if (!quoted && character === "\n") lines += 1;
    }
    if (count > bestScore) {
      best = candidate;
      bestScore = count;
    }
  }
  return best;
}

// src/csv-worker.ts
var workerScope = self;
workerScope.onmessage = (event) => {
  try {
    const result = parseDelimitedBytes(
      new Uint8Array(event.data.data),
      event.data.format,
      event.data.maxCells
    );
    workerScope.postMessage({ ok: true, result });
  } catch (error) {
    workerScope.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : String(error),
      code: typeof error === "object" && error !== null && "code" in error ? String(error.code) : "invalid-file"
    });
  }
};
