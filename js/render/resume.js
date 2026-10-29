import { store } from "../store.js";
import { escapeHTML as safe, safeURL } from "../utils.js";
import { openLightbox } from "./lightbox.js";
export async function renderResume(container, data) {
  const doc = data.document;
  container.innerHTML = `<div class="page-view resume-page"><header class="section-intro"><h1 class="tab-title">Résumé / CV</h1><p class="tab-summary">${safe(data.summary || "Read my education, experience and professional skills in the original résumé below.")}</p></header><div class="resume-tools" data-ui><button class="btn btn-primary" id="resume-full">Open full size</button><a class="btn btn-secondary" id="resume-download" download="Ramelito-Sanchez-Resume.png">Download résumé</a><button class="btn btn-secondary" id="resume-print">Print résumé</button></div><div class="resume-canvas" id="resume-canvas" aria-label="Original résumé"></div></div>`;
  if (!doc?.file) {
    container.querySelector("#resume-canvas").innerHTML =
      "<p>A résumé file has not been added yet.</p>";
    container.querySelector(".resume-tools").hidden = true;
    return;
  }
  const blob = await store.loadDraft(doc.file);
  if (!container.querySelector("#resume-canvas")) return;
  const url =
    blob instanceof Blob ? URL.createObjectURL(blob) : safeURL(doc.file);
  if (!url) return;
  if (blob instanceof Blob)
    window.addEventListener("hashchange", () => URL.revokeObjectURL(url), {
      once: true,
    });
  const download = container.querySelector("#resume-download");
  download.href = url;
  download.download = doc.original_name || doc.file.split("/").pop();
  download.target = "_blank";
  download.rel = "noopener noreferrer";
  const isImage = doc.type === "image";
  const canvas = container.querySelector("#resume-canvas");
  if (isImage) {
    const image = document.createElement("img");
    image.src = url;
    image.alt =
      "Original résumé of Ramelito C. Sanchez, Jr., including education, work philosophy, experience and skills.";
    image.width = 1414;
    image.height = 2000;
    canvas.append(image);
  } else if (doc.mime === "application/pdf" || /\.pdf$/i.test(doc.file)) {
    const frame = document.createElement("iframe");
    frame.src = url;
    frame.title = "Original résumé";
    canvas.append(frame);
  } else {
    const p = document.createElement("p");
    p.textContent =
      "Download the original résumé to open it in a compatible document application.";
    canvas.append(p);
  }
  container.querySelector("#resume-full").onclick = () =>
    openLightbox(doc, { actualSize: true });
  container.querySelector("#resume-print").onclick = () => {
    if (isImage) window.print();
    else openLightbox(doc);
  };
}
