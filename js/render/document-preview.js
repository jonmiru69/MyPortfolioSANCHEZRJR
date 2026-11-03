import { store } from "../store.js";
import { MAX_UPLOAD_BYTES } from "../upload-policy.js";

const assetBaseUrl = new URL("../../assets/vendor/zrimo/", import.meta.url);

async function createDocumentClient() {
  const { ViewerClient } = await import("../../assets/vendor/zrimo/index.js");
  return ViewerClient.create({
    assetBaseUrl,
    limits: { maxInputBytes: MAX_UPLOAD_BYTES },
  });
}

async function loadDocument(viewer, file, fileName, mime, signal) {
  const draft = await store.loadDraft(file);
  await viewer.load(draft instanceof Blob ? draft : new URL(file, location.href), {
    fileName,
    contentType: mime,
    signal,
  });
}

export async function renderDocumentThumbnail(evidence, canvas, signal) {
  const client = await createDocumentClient();
  try {
    signal.throwIfAborted();
    const viewer = client.createViewer();
    await loadDocument(viewer, evidence.file, evidence.original_name, evidence.mime, signal);
    await viewer.renderThumbnail(0, canvas, {
      maxWidth: 600,
      maxHeight: 450,
      devicePixelRatio: 1,
      signal,
    });
  } finally {
    await client.destroy();
  }
}

export async function renderDocumentPreview({
  header, viewport, file, fileName, mime, signal,
}) {
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.textContent = "Loading document preview…";
  viewport.append(status);
  let client;
  const destroy = () => client?.destroy();
  signal.addEventListener("abort", destroy, { once: true });

  try {
    client = await createDocumentClient();
    if (signal.aborted) {
      await destroy();
      return;
    }
    const surface = document.createElement("div");
    surface.className = "document-preview-surface";
    viewport.append(surface);
    viewport.classList.add("has-document-preview");
    const viewer = client.createViewer({
      container: surface,
      fit: "page",
      layout: "single",
      ui: false,
    });
    await loadDocument(viewer, file, fileName, mime, signal);
    if (signal.aborted) return;

    const controls = document.createElement("div");
    controls.className = "viewer-zoom";
    const button = (label, action) => {
      const control = document.createElement("button");
      control.type = "button";
      control.className = "btn btn-secondary";
      control.textContent = label;
      control.onclick = action;
      return control;
    };
    const previous = button("Previous page", () => viewer.previous());
    const next = button("Next page", () => viewer.next());
    const count = document.createElement("span");
    count.className = "viewer-page-count";
    count.setAttribute("role", "status");
    const updatePage = ({ pageIndex, pageCount }) => {
      previous.disabled = pageIndex === 0;
      next.disabled = pageIndex >= pageCount - 1;
      count.textContent = `Page ${pageIndex + 1} of ${pageCount}`;
    };
    viewer.on("pagechange", updatePage);
    updatePage(viewer.state);
    if (viewer.state.pageCount > 1) controls.append(previous, count, next);
    controls.append(
      button("Fit page", () => viewer.fitPage()),
      button("Fit width", () => viewer.fitWidth()),
      button("Zoom out", () => viewer.zoomOut()),
      button("Zoom in", () => viewer.zoomIn()),
    );
    header.after(controls);
    status.remove();
  } catch (error) {
    if (signal.aborted) return;
    signal.removeEventListener("abort", destroy);
    await destroy();
    viewport.classList.remove("has-document-preview");
    viewport.replaceChildren(status);
    status.textContent = error.code === "network-error"
      ? "The document could not be loaded. Check your connection and reopen the preview."
      : "This file could not be rendered. It may be damaged, password-protected, or use a format this viewer does not support.";
  }
}
