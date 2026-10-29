import { store } from "../store.js";
import { escapeHTML as safe, safeURL, labelFor } from "../utils.js";
import { openLightbox } from "./lightbox.js";
export function renderRecords(container, data, route) {
  const items = (data.items || []).filter(
    (i) => store.isDraftMode || i.visibility !== "hidden",
  );
  const heading =
    {
      education: "Education",
      teaching: "Teaching",
      licenses: "Professional license",
      research: "Research",
    }[route] ||
    store.getTabMeta(route)?.label ||
    "Portfolio";
  const detail = (label, value) =>
    value ? `<div><dt>${safe(label)}</dt><dd>${safe(value)}</dd></div>` : "";
  container.innerHTML = `<div class="page-view records-page ${safe(route)}-page"><header class="section-intro"><h1 class="tab-title">${safe(heading)}</h1><p class="tab-summary">${safe(data.summary)}</p></header><div class="records-list">${
    items
      .map(
        (i) =>
          `<article class="portfolio-record" data-owner-item="${safe(i.id)}"><div><h2>${safe(i.title || "Untitled item")}</h2>${i.subtitle ? `<p class="record-lead">${safe(i.subtitle)}</p>` : ""}<p>${safe(i.organization || i.school || "")}</p>${i.date_start || i.date_end ? `<p>${safe([i.date_start, i.date_end].filter(Boolean).join(" – "))}</p>` : ""}</div><div>${i.description ? `<p>${safe(i.description)}</p>` : ""}${[
            "subjects",
            "responsibilities",
            "authors",
            "tags",
          ]
            .filter((k) => i[k]?.length)
            .map(
              (k) =>
                `<section class="record-details"><h3>${safe(labelFor(k))}</h3><ul>${i[k].map((v) => `<li>${safe(v)}</li>`).join("")}</ul></section>`,
            )
            .join("")}<dl>${Object.entries(i)
            .filter(
              ([k, v]) =>
                ![
                  "title",
                  "subtitle",
                  "organization",
                  "school",
                  "date_start",
                  "date_end",
                  "description",
                  "subjects",
                  "responsibilities",
                  "authors",
                  "tags",
                  "evidence",
                  "links",
                  "id",
                  "order",
                  "featured",
                  "visibility",
                ].includes(k) &&
                v &&
                typeof v !== "object",
            )
            .map(([k, v]) => detail(labelFor(k), v))
            .join(
              "",
            )}</dl><div class="record-files">${(i.evidence || []).map((ev, index) => `<button class="btn btn-secondary" data-item="${safe(i.id)}" data-file="${index}">${safe(ev.label || "View file")}</button>`).join("")}${(
            i.links || []
          )
            .filter((l) => safeURL(l.url))
            .map(
              (l) =>
                `<a href="${safe(l.url)}" target="_blank" rel="noopener noreferrer">${safe(l.label || "Open link")}</a>`,
            )
            .join("")}</div></div></article>`,
      )
      .join("") || "<p>No items have been added yet.</p>"
  }</div></div>`;
  const extras = document.createElement("div");
  extras.className = "additional-information";
  const renderValue = (value) => {
    if (value == null || value === "") return "";
    if (Array.isArray(value))
      return value.length
        ? `<ul>${value.map((v) => `<li>${renderValue(v)}</li>`).join("")}</ul>`
        : "";
    if (typeof value === "object")
      return `<dl>${Object.entries(value)
        .filter(
          ([key]) => !["id", "order", "visibility", "featured"].includes(key),
        )
        .map(
          ([key, v]) =>
            `<div><dt>${safe(labelFor(key))}</dt><dd>${renderValue(v)}</dd></div>`,
        )
        .join("")}</dl>`;
    return safe(value);
  };
  for (const [key, value] of Object.entries(data)) {
    if (["items", "summary"].includes(key) || value == null || value === "")
      continue;
    const group = document.createElement("section");
    group.className = "additional-group";
    if (Array.isArray(value)) {
      group.innerHTML = `<div data-owner-collection-add="${safe(key)}"><h2>${safe(labelFor(key))}</h2></div>${value.map((entry, index) => (!store.isDraftMode && entry?.visibility === "hidden" ? "" : `<article class="additional-entry" ${entry && typeof entry === "object" ? `data-owner-item="${safe(entry.id || "@index:" + index)}" data-owner-collection="${safe(key)}"` : ""}>${renderValue(entry)}</article>`)).join("")}`;
      if (!value.length && !store.isDraftMode) continue;
    } else {
      if (
        typeof value === "object" &&
        !Object.keys(value).length &&
        !store.isDraftMode
      )
        continue;
      group.innerHTML = `<h2>${safe(labelFor(key))}</h2>${renderValue(value)}`;
    }
    extras.append(group);
  }
  container.querySelector(".page-view").append(extras);
  container
    .querySelectorAll("[data-file]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          openLightbox(
            items.find((i) => i.id === b.dataset.item).evidence[
              Number(b.dataset.file)
            ],
          )),
    );
}
