import { createDocumentClient } from "../render/document-preview.js";
import { MAX_UPLOAD_BYTES } from "../upload-policy.js";
import { store } from "../store.js";
import { cloud } from "../cloud.js";

const ocrAssets = new URL("../../assets/vendor/ocr/", import.meta.url);
const pageLimit = 24;
const textCache = new Map();

export async function readAttachment(attachment, signal) {
  const draft = await store.loadDraft(attachment.file);
  if (draft instanceof Blob) return draft;
  const url = new URL(attachment.file, document.baseURI);
  const cloudOrigin = cloud.url ? new URL(cloud.url).origin : "";
  const previousUpload =
    url.origin === "https://raw.githubusercontent.com" &&
    url.pathname.startsWith("/jonmiru69/MyPortfolioSANCHEZRJR/");
  if (
    url.origin !== location.origin &&
    url.origin !== cloudOrigin &&
    !previousUpload
  )
    throw new Error(
      "This file is hosted outside your portfolio. Attach a local copy to scan it.",
    );
  const response = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]),
    credentials: "omit",
    redirect: "error",
  });
  if (!response.ok) throw new Error("The attachment could not be opened.");
  if (Number(response.headers.get("Content-Length")) > MAX_UPLOAD_BYTES)
    throw new Error("Choose a file up to 20 MB.");
  return response.blob();
}

async function abortable(promise, signal) {
  signal.throwIfAborted();
  let onAbort;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        onAbort = () => reject(signal.reason);
        signal.addEventListener("abort", onAbort, { once: true });
      }),
    ]);
  } finally {
    signal.removeEventListener("abort", onAbort);
  }
}

export function createDocumentReader() {
  let workerPromise;
  let reportOCR;
  function reset() {
    workerPromise?.then((worker) => worker.terminate()).catch(() => {});
    workerPromise = undefined;
  }

  async function recognize(canvas, signal, onProgress, layout) {
    reportOCR = onProgress;
    workerPromise ??= import(
      "../../assets/vendor/ocr/tesseract.esm.min.js"
    ).then(({ default: { createWorker } }) =>
      createWorker("eng", 1, {
        workerPath: new URL("worker.min.js", ocrAssets).href,
        corePath: new URL("tesseract-core-lstm.wasm.js", ocrAssets).href,
        langPath: ocrAssets.href,
        workerBlobURL: false,
        logger: (message) => reportOCR?.(message.status, message.progress),
        errorHandler: () => {},
      }),
    );
    const worker = await abortable(workerPromise, signal);
    await abortable(
      worker.setParameters({ tessedit_pageseg_mode: layout }),
      signal,
    );
    const result = await abortable(worker.recognize(canvas), signal);
    if (result.data.text.trim() || layout !== "6")
      return result.data.text.trim();
    await abortable(
      worker.setParameters({ tessedit_pageseg_mode: "11" }),
      signal,
    );
    return (await abortable(worker.recognize(canvas), signal)).data.text.trim();
  }

  async function read(
    file,
    {
      name,
      mime,
      signal,
      onPage = () => {},
      onOCR,
      columns = false,
      sparse = false,
    } = {},
  ) {
    const stop = AbortSignal.any([signal, AbortSignal.timeout(120000)]);
    if (!file.size || file.size > MAX_UPLOAD_BYTES)
      throw new Error("Choose a file up to 20 MB.");
    const digest = await crypto.subtle.digest(
      "SHA-256",
      await file.arrayBuffer(),
    );
    stop.throwIfAborted();
    const layout = sparse ? "11" : columns ? "3" : "6";
    const cacheKey =
      layout + ":" + Array.from(new Uint8Array(digest)).join(",");
    if (textCache.has(cacheKey)) return textCache.get(cacheKey);
    const client = await createDocumentClient();
    const canvas = document.createElement("canvas");
    try {
      const viewer = client.createViewer();
      await viewer.load(file, {
        fileName: name,
        contentType: mime,
        signal: stop,
      });
      const { pageCount, format } = viewer.getDocumentInfo();
      if (pageCount > pageLimit)
        throw new Error(
          "This file exceeds 24 pages. Scan a shorter copy or paste its text.",
        );
      const pages = [];
      for (let index = 0; index < pageCount; index++) {
        stop.throwIfAborted();
        onPage(index + 1, pageCount);
        let nativeText = "";
        try {
          nativeText = (await viewer.getPageText(index, stop)).trim();
        } catch (error) {
          stop.throwIfAborted();
        }
        // Office text runs may lack separators and scanned PDFs have no text layer.
        let text = nativeText;
        if (
          columns ||
          sparse ||
          format !== "pdf" ||
          nativeText.length < 60 ||
          !nativeText.includes("\n")
        ) {
          await viewer.renderThumbnail(index, canvas, {
            maxWidth: 2300,
            maxHeight: 2500,
            devicePixelRatio: 1,
            signal: stop,
          });
          const scanned = await recognize(canvas, stop, onOCR, layout);
          text = scanned || nativeText;
        }
        pages.push({ page: index + 1, text });
      }
      if (!pages.some(({ text }) => text))
        throw new Error(
          "No readable text found. Try a clearer scan or paste the text.",
        );
      if (textCache.size >= 64) textCache.delete(textCache.keys().next().value);
      textCache.set(cacheKey, pages);
      return pages;
    } catch (error) {
      reset();
      if (stop.reason?.name === "TimeoutError")
        throw new Error(
          "Reading took too long. Try a smaller or clearer copy.",
        );
      throw error;
    } finally {
      canvas.width = canvas.height = 0;
      await client.destroy();
    }
  }
  return { read, close: reset };
}
