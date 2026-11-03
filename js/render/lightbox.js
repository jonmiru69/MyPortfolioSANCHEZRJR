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
  const file = safeURL(evidenceItem.file);
  if (!file) return;
  let download;
  if (!options.previewOnly) {
    download = document.createElement("a");
    download.className = "btn btn-primary";
    download.textContent = "Download file";
    download.target = "_blank";
    download.rel = "noopener noreferrer";
    download.download = evidenceItem.original_name || file.split("/").pop();
  }
  const viewport = document.createElement("div");
  viewport.className = "document-viewport";
  header.append(title);
  if (download) header.append(download);
  header.append(close);
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
  const resolved = download ? await getURL(file) : null;
  if (!dialog.isConnected) return;
  if (download) download.href = resolved;
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
    let pageIndex = 0;
    const controls = document.createElement("div");
    controls.className = "viewer-zoom";
    const setZoom = (value) => {
      dialog.classList.remove("is-fit-page");
      zoom = Math.max(0.5, Math.min(8, value));
      sheets.style.width = `${zoom * 100}%`;
    };
    const fitPage = () => {
      zoom = 1;
      sheets.style.width = "100%";
      dialog.classList.add("is-fit-page");
    };
    for (const [label, action] of [
      ["Fit page", fitPage],
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
      img.className = "document-page";
      img.hidden = i !== pageIndex;
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
    if (!options.actualSize) fitPage();
    if (pages.length > 1) {
      const previousPage = document.createElement("button");
      const nextPage = document.createElement("button");
      const count = document.createElement("span");
      count.className = "viewer-page-count";
      count.setAttribute("role", "status");
      const showPage = () => {
        [...sheets.children].forEach((img, index) => { img.hidden = index !== pageIndex; });
        previousPage.disabled = pageIndex === 0;
        nextPage.disabled = pageIndex === pages.length - 1;
        count.textContent = `Document page ${pageIndex + 1} of ${pages.length}`;
        fitPage();
      };
      for (const [button, label, step] of [[previousPage, "Previous document page", -1], [nextPage, "Next document page", 1]]) {
        button.type = "button";
        button.className = "btn btn-secondary";
        button.textContent = label;
        button.onclick = () => { pageIndex += step; showPage(); };
      }
      controls.append(previousPage, count, nextPage);
      showPage();
    }
  } else if (options.previewOnly) {
    const message = document.createElement("p");
    message.textContent = "An online preview is unavailable for this certificate.";
    viewport.append(message);
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
