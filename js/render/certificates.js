import { store } from "../store.js";
import { openLightbox } from "./lightbox.js";
import { escapeHTML as safe } from "../utils.js";
export function renderCertificates(container, data) {
  const items = (data?.items || []).filter(
    (i) => store.isDraftMode || i.visibility !== "hidden",
  );
  const date = (i) => i.issue_date || i.date_start || "";
  const type = (i) => i.certificate_kind || "";
  let page = 1;
  const pageSize = 6;
  let urls = [];
  let generation = 0;
  const types = [...new Set(items.map(type).filter(Boolean))].sort();
  const years = [
    ...new Set(
      items.map((i) => date(i).slice(0, 4)).filter((y) => /^\d{4}$/.test(y)),
    ),
  ]
    .sort()
    .reverse();
  container.innerHTML = `<div class="page-view certificates-page"><header class="section-intro"><h1 class="tab-title">Certificates</h1><p class="tab-summary">${safe(data.summary || "A record of professional learning in science, research and education.")}</p></header><form class="certificate-filters" data-ui role="search"><div><label for="cert-search">Find a certificate</label><input class="form-input" id="cert-search" type="search" placeholder="Title, topic or provider"></div><div><label for="filter-type">Certificate type</label><select id="filter-type" class="form-select"><option value="">All types</option>${types.map((t) => `<option>${safe(t)}</option>`).join("")}</select></div><div><label for="filter-year">Date issued</label><select id="filter-year" class="form-select"><option value="">All years</option>${years.map((y) => `<option>${y}</option>`).join("")}</select></div><div><label for="sort-order">Sort by</label><select id="sort-order" class="form-select"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="cpd">CPD points</option></select></div><button type="reset" class="btn btn-secondary">Reset filters</button></form><p id="cert-count" role="status" aria-live="polite"></p><div id="cert-list-container"></div><nav class="certificate-pagination" aria-label="Certificate pages"><button class="btn btn-secondary" id="cert-prev">Previous</button><span id="cert-page"></span><button class="btn btn-secondary" id="cert-next">Next</button></nav></div>`;
  const $ = (selector) => container.querySelector(selector);
  function update() {
    generation++;
    const current = generation;
    urls.forEach((u) => URL.revokeObjectURL(u));
    urls = [];
    const query = $("#cert-search").value.trim().toLocaleLowerCase();
    const wantedType = $("#filter-type").value,
      wantedYear = $("#filter-year").value,
      sort = $("#sort-order").value;
    const filtered = items.filter(
      (i) =>
        (!query ||
          [i.title, i.seminar_topic, i.organization, i.training_code]
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
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.min(page, pages);
    $("#cert-count").textContent =
      `${filtered.length} of ${items.length} certificates`;
    $("#cert-page").textContent = `Page ${page} of ${pages}`;
    $("#cert-prev").disabled = page === 1;
    $("#cert-next").disabled = page === pages;
    $("#cert-list-container").innerHTML =
      filtered
        .slice((page - 1) * pageSize, page * pageSize)
        .map((item) => {
          const ev = item.evidence?.[0];
          const preview =
            ev?.preview_images?.[0] || (ev?.type === "image" ? ev.file : "");
          const fields = [
            ["Date issued", date(item) ? formatDate(date(item)) : "Not stated"],
            ["Certificate type", type(item) || "Not stated"],
            ["Delivery mode", item.delivery_mode || "Not stated"],
            ["Seminar title", item.title || "Untitled certificate"],
            ["Seminar topic", item.seminar_topic || "Not stated"],
            ["Seminar provider", item.organization || "Not stated"],
            ["Training code", item.training_code || "Not stated"],
            [
              "CPD points",
              item.cpd_points == null || item.cpd_points === ""
                ? "Not stated"
                : String(item.cpd_points),
            ],
          ];
          return `<article class="certificate-record" data-owner-item="${safe(item.id)}"><div class="certificate-art">${preview ? `<button class="certificate-image-button" data-view="${safe(item.id)}" aria-label="View ${safe(item.title)}"><img src="${safe(preview)}" alt="Certificate for ${safe(item.title)}" loading="lazy" width="800" height="600"></button>` : `<div class="document-cover"><p>${safe(ev?.original_name || "Certificate document")}</p><span>${safe(ev?.mime?.split("/").pop() || "Document")}</span></div>`}${item.visibility === "hidden" ? '<p class="hidden-item-note">Hidden from visitors</p>' : ""}</div><div class="certificate-information"><dl>${fields.map(([k, v]) => `<div><dt>${k}</dt><dd>${safe(v)}</dd></div>`).join("")}</dl>${ev ? `<button class="btn btn-primary" data-view="${safe(item.id)}">View certificate</button>` : "<p>No file attached</p>"}</div></article>`;
        })
        .join("") ||
      '<div class="empty-state"><h2>No matches</h2><p>Try another title, provider or year, or reset the filters.</p></div>';
    container.querySelectorAll("[data-view]").forEach(
      (b) =>
        (b.onclick = () => {
          const item = items.find((i) => i.id === b.dataset.view);
          openLightbox(item.evidence[0]);
        }),
    );
    container.querySelectorAll(".certificate-art img").forEach(async (img) => {
      const blob = await store.loadDraft(img.getAttribute("src"));
      if (blob instanceof Blob && current === generation && img.isConnected) {
        const url = URL.createObjectURL(blob);
        urls.push(url);
        img.src = url;
      }
    });
    container.dispatchEvent(
      new CustomEvent("portfolio-list-rendered", { bubbles: true }),
    );
  }
  $(".certificate-filters").onsubmit = (e) => e.preventDefault();
  $(".certificate-filters").onreset = () => {
    page = 1;
    setTimeout(update, 0);
  };
  $("#cert-search").oninput = () => {
    page = 1;
    update();
  };
  container.querySelectorAll("select").forEach(
    (s) =>
      (s.onchange = () => {
        page = 1;
        update();
      }),
  );
  $("#cert-prev").onclick = () => {
    page--;
    update();
    $(".certificate-filters").scrollIntoView({ block: "start" });
  };
  $("#cert-next").onclick = () => {
    page++;
    update();
    $(".certificate-filters").scrollIntoView({ block: "start" });
  };
  const cleanup = () => {
    urls.forEach((u) => URL.revokeObjectURL(u));
    urls = [];
  };
  window.addEventListener("hashchange", cleanup, { once: true });
  update();
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
