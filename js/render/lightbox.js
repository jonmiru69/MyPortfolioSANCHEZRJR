import { store } from "../store.js";
import { safeURL } from "../utils.js";
export async function openLightbox(evidenceItem, options = {}) {
  if (document.querySelector("dialog[open]")) return;
  const previous = document.activeElement;
  const urls = [];
  const dialog = document.createElement("dialog");
  dialog.className = "document-viewer";
  dialog.setAttribute("aria-labelledby", "viewer-title");
  dialog.dataset.ui = "";
  const header = document.createElement("header");
  header.className = "viewer-header";
  const title = document.createElement("p");
  title.id = "viewer-title";
  title.textContent =
    evidenceItem.original_name || evidenceItem.label || "Document";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "btn btn-secondary";
  close.textContent = "Close";
  close.onclick = () => dialog.close();
  const download = document.createElement("a");
  download.className = "btn btn-primary";
  download.textContent = "Download file";
  const file = safeURL(evidenceItem.file);
  if (!file) return;
  download.href = file;
  download.target = "_blank";
  download.rel = "noopener noreferrer";
  download.download = evidenceItem.original_name || file.split("/").pop();
  const viewport = document.createElement("div");
  viewport.className = "document-viewport";
  header.append(title, download, close);
  dialog.append(header, viewport);
  document.body.append(dialog);
  document.body.classList.add("editor-open");
  dialog.showModal();
  const getURL = async (path) => {
    const blob = await store.loadDraft(path);
    if (blob instanceof Blob && dialog.isConnected) {
      const url = URL.createObjectURL(blob);
      urls.push(url);
      return url;
    }
    return safeURL(path);
  };
  const cleanup = () => {
    window.removeEventListener("hashchange", routeClose);
    urls.forEach((u) => URL.revokeObjectURL(u));
    dialog.remove();
    if (!document.querySelector("dialog[open]")) {
      document.body.classList.remove("editor-open");
      if (previous?.isConnected) previous.focus();
    }
  };
  const routeClose = () => dialog.close();
  window.addEventListener("hashchange", routeClose);
  dialog.addEventListener("close", cleanup, { once: true });
  const resolved = await getURL(file);
  if (!dialog.isConnected) return;
  download.href = resolved;
  const pages = evidenceItem.preview_images?.length
    ? evidenceItem.preview_images
    : evidenceItem.type === "image" ||
        /\.(png|jpe?g|webp|gif|avif|bmp)$/i.test(file)
      ? [file]
      : [];
  if (pages.length) {
    const sheets = document.createElement("div");
    sheets.className = "document-pages";
    viewport.append(sheets);
    let zoom = 1;
    const controls = document.createElement("div");
    controls.className = "viewer-zoom";
    const setZoom = (value) => {
      zoom = Math.max(0.5, Math.min(8, value));
      sheets.style.width = `${zoom * 100}%`;
    };
    for (const [label, action] of [
      ["Zoom out", () => setZoom(zoom - 0.25)],
      ["Zoom in", () => setZoom(zoom + 0.25)],
      ["Fit width", () => setZoom(1)],
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-secondary";
      button.textContent = label;
      button.onclick = action;
      controls.append(button);
    }
    header.after(controls);
    for (let i = 0; i < pages.length; i++) {
      const src = await getURL(pages[i]);
      if (!dialog.isConnected) return;
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${evidenceItem.label || "Certificate"}, page ${i + 1}`;
      img.loading = i ? "lazy" : "eager";
      sheets.append(img);
      if (i === 0 && options.actualSize) {
        await img.decode().catch(() => {});
        if (dialog.isConnected)
          setZoom(img.naturalWidth / Math.max(1, sheets.clientWidth));
      }
    }
  } else if (evidenceItem.mime === "application/pdf" || /\.pdf$/i.test(file)) {
    const frame = document.createElement("iframe");
    frame.src = resolved;
    frame.title = evidenceItem.label || "PDF document";
    viewport.append(frame);
    const hint = document.createElement("p");
    hint.textContent =
      "If the PDF does not display on your device, use Download file to open it.";
    viewport.append(hint);
  } else {
    const message = document.createElement("p");
    message.textContent =
      "This Word or PowerPoint document is ready to download. Open it in Word, PowerPoint or a compatible app.";
    viewport.append(message);
  }
  close.focus();
}
