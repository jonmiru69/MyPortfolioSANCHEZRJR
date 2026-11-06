import { formatCertificateNumber, positiveNumber } from "../certificate-details.js";
import { store } from "../store.js";
import { renderDocumentThumbnail } from "./document-preview.js";
import { openLightbox } from "./lightbox.js";
import { escapeHTML as safe, safeURL } from "../utils.js";
export function renderCertificates(container, data) {
  const items = (data?.items || []).filter(
    (i) => store.isDraftMode || i.visibility !== "hidden",
  );
  const date = (i) => i.issue_date || i.date_start || "";
  const type = (i) => i.certificate_kind || "";
  let urls = [];
  let thumbnails;
  let observer;
  let queue = Promise.resolve();
  const byId = new Map(items.map(item => [item.id, item]));
  const types = [...new Set(items.map(type).filter(Boolean))].sort();
  const years = [
    ...new Set(
      items.map((i) => date(i).slice(0, 4)).filter((y) => /^\d{4}$/.test(y)),
    ),
  ]
    .sort()
    .reverse();
  container.innerHTML = `<div class="page-view certificates-page"><header class="section-intro"><h1 class="tab-title">Certificates</h1><p class="tab-summary">${safe(data.summary || "A record of professional learning in science, research and education.")}</p></header><form class="certificate-filters" data-ui role="search"><div><label for="cert-search">Find a certificate</label><input class="form-input" id="cert-search" type="search" placeholder="Title, topic or provider"></div><div><label for="filter-type">Certificate type</label><select id="filter-type" class="form-select"><option value="">All types</option>${types.map((t) => `<option>${safe(t)}</option>`).join("")}</select></div><div><label for="filter-year">Date issued</label><select id="filter-year" class="form-select"><option value="">All years</option>${years.map((y) => `<option>${y}</option>`).join("")}</select></div><div><label for="sort-order">Sort by</label><select id="sort-order" class="form-select"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="cpd">CPD points</option></select></div><button type="reset" class="btn btn-secondary">Reset filters</button></form><p id="cert-count" role="status" aria-live="polite"></p><p id="cert-hours" role="status" aria-live="polite"></p><div id="cert-list-container"></div></div>`;
  const $ = (selector) => container.querySelector(selector);
  function update() {
    thumbnails?.abort();
    observer?.disconnect();
    thumbnails = new AbortController();
    const { signal } = thumbnails;
    urls.forEach((u) => URL.revokeObjectURL(u));
    urls = [];
    const query = $("#cert-search").value.trim().toLocaleLowerCase();
    const wantedType = $("#filter-type").value,
      wantedYear = $("#filter-year").value,
      sort = $("#sort-order").value;
    const filtered = items.filter(
      (i) =>
        (!query ||
          [i.title, i.seminar_topic, i.organization, i.training_code, i.activity_type]
            .join(" ")
            .toLocaleLowerCase()
            .includes(query)) &&
        (!wantedType || type(i) === wantedType) &&
        (!wantedYear || date(i).startsWith(wantedYear)),
    );
    filtered.sort((a, b) =>
      sort === "cpd"
        ? (Number(b.cpd_points) || 0) - (Number(a.cpd_points) || 0)
        : sort === "oldest"
          ? date(a).localeCompare(date(b))
          : date(b).localeCompare(date(a)),
    );
    $("#cert-count").textContent =
      `${filtered.length} of ${items.length} certificates`;
    const hours = new Map([["Training", 0], ["Seminar", 0], ["Webinar", 0], ["Other", 0]]);
    let total = 0;
    for (const item of filtered) {
      const duration = positiveNumber(item.hours);
      const category = hours.has(item.activity_type) ? item.activity_type : "Other";
      hours.set(category, hours.get(category) + duration);
      total += duration;
    }
    $("#cert-hours").textContent = [
      `Total hours shown: ${formatCertificateNumber(total)}`,
      ...Array.from(hours, ([category, value]) => `${category}: ${formatCertificateNumber(value)}`),
    ].join(" · ");
    $("#cert-list-container").innerHTML =
      filtered
        .map((item) => {
          const ev = item.evidence?.[0];
          const preview = safeURL(ev?.preview_images?.[0] ||
            (ev?.type === "image" || ev?.mime?.startsWith("image/") ? ev.file : ""));
          const thumbnail = preview
            ? `<img src="${safe(preview)}" alt="Certificate for ${safe(item.title)}" loading="lazy" width="800" height="600">`
            : `<span class="document-cover">Preview loading…</span><canvas class="certificate-thumbnail" hidden></canvas>`;
          const fields = [
            ["Date issued", date(item) ? formatDate(date(item)) : "—"],
            ["Certificate type", type(item) || "—"],
            ["Delivery mode", item.delivery_mode || "—"],
            ["Activity title", item.title || "Untitled certificate"],
            ["Activity topic", item.seminar_topic || "—"],
            ["Provider", item.organization || "—"],
            ["Training code", item.training_code || "—"],
            ["CPD points", item.cpd_points === 0 || item.cpd_points === "0" ? "0" : formatCertificateNumber(item.cpd_points)],
            ["Activity type", item.activity_type || "—"],
            ["Hours", formatCertificateNumber(item.hours)],
          ];
          return `<article class="certificate-record" data-owner-item="${safe(item.id)}"><div class="certificate-art">${ev ? `<button class="certificate-image-button" data-view="${safe(item.id)}" aria-label="View ${safe(item.title)}">${thumbnail}</button>` : ""}${item.visibility === "hidden" ? '<p class="hidden-item-note">Hidden from visitors</p>' : ""}</div><div class="certificate-information"><dl>${fields.map(([k, v]) => `<div><dt>${k}</dt><dd>${safe(v)}</dd></div>`).join("")}</dl>${ev ? `<button class="btn btn-primary" data-view="${safe(item.id)}">View certificate</button>` : "<p>No file attached</p>"}</div></article>`;
        })
        .join("") ||
      '<div class="empty-state"><h2>No matches</h2><p>Try another title, provider or year, or reset the filters.</p></div>';
    container.querySelectorAll("[data-view]").forEach(
      (b) =>
        (b.onclick = () => {
          const item = byId.get(b.dataset.view);
          openLightbox(item.evidence[0], { previewOnly: true });
        }),
    );
    container.querySelectorAll(".certificate-art img").forEach(async (img) => {
      const blob = await store.loadDraft(img.getAttribute("src"));
      if (blob instanceof Blob && !signal.aborted && img.isConnected) {
        const url = URL.createObjectURL(blob);
        urls.push(url);
        img.src = url;
      }
    });
    const enqueue = (canvas) => {
      const button = canvas.closest("button");
      const evidence = byId.get(button.dataset.view).evidence[0];
      const placeholder = button.querySelector(".document-cover");
      queue = queue.then(async () => {
        if (signal.aborted || !container.contains(canvas)) return;
        try {
          if (!safeURL(evidence.file)) throw new Error("Invalid certificate URL");
          await renderDocumentThumbnail(evidence, canvas, signal);
          if (signal.aborted) return;
          canvas.hidden = false;
          placeholder.remove();
        } catch {
          if (!signal.aborted) placeholder.textContent = "Preview unavailable";
        }
      });
    };
    const canvases = container.querySelectorAll(".certificate-thumbnail");
    if (canvases.length && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries, activeObserver) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          activeObserver.unobserve(entry.target);
          enqueue(entry.target.querySelector("canvas"));
        }
      }, { rootMargin: "200px" });
      canvases.forEach(canvas => observer.observe(canvas.closest("button")));
    } else {
      canvases.forEach(enqueue);
    }
    container.dispatchEvent(
      new CustomEvent("portfolio-list-rendered", { bubbles: true }),
    );
  }
  $(".certificate-filters").onsubmit = (e) => e.preventDefault();
  $(".certificate-filters").onreset = () => setTimeout(update, 0);
  $("#cert-search").oninput = update;
  container.querySelectorAll("select").forEach((select) => {
    select.onchange = update;
  });
  const cleanup = () => {
    thumbnails?.abort();
    observer?.disconnect();
    urls.forEach((u) => URL.revokeObjectURL(u));
    urls = [];
  };
  update();
  return cleanup;
}
function formatDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value + "T00:00:00Z"));
}
