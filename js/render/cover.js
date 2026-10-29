import { store } from "../store.js";
import { escapeHTML as safe } from "../utils.js";
import { openLightbox } from "./lightbox.js";
export async function renderCover(container, site) {
  const identity = site.identity || {};
  const overviewCredentials = (identity.credentials || "").replace(
    /\bLPT\b/gi,
    "Licensed Professional Teacher",
  );
  const overview = site.overview || {};
  const certs =
    (await store.getTabContent("certificates")).items?.filter(
      (i) => i.visibility !== "hidden",
    ) || [];
  if (container.dataset.route !== "cover") return;
  const portraitBlob = await store.loadDraft(identity.avatar || "");
  const portrait =
    portraitBlob instanceof Blob
      ? URL.createObjectURL(portraitBlob)
      : identity.avatar;
  if (portraitBlob instanceof Blob)
    window.addEventListener("hashchange", () => URL.revokeObjectURL(portrait), {
      once: true,
    });
  const preferred = ["certificate-22", "certificate-17", "certificate-5"]
    .map((id) => certs.find((i) => i.id === id))
    .filter(Boolean);
  const selected = [
    ...new Set([
      ...preferred,
      ...certs.filter((i) => i.evidence?.[0]?.preview_images?.[0]),
    ]),
  ]
    .filter((i) => i.evidence?.[0]?.preview_images?.[0])
    .slice(0, 3);
  container.innerHTML = `<div class="page-view cover-page overview"><section class="portfolio-card"><div class="hero-writing"><h1>${safe(identity.name)}</h1><p class="hero-role">${safe(identity.title)}${overviewCredentials ? ", " + safe(overviewCredentials) : ""}</p><p>${safe(identity.institution)}</p><a class="btn btn-primary" href="#/certificates">View certificates</a><a class="hero-secondary" href="#/resume">Read my résumé</a></div><div class="portrait-frame"><img src="${safe(portrait)}" alt="Portrait of ${safe(identity.name)}" width="700" height="700" fetchpriority="high"></div><div class="card-imprint"><span>Science education</span><span>Research & professional learning</span></div></section><section class="overview-about"><h2>${safe(overview.heading || "Teaching & inquiry")}</h2><div><p>${safe(overview.biography)}</p><a href="#/profile">Read my profile</a></div></section><section class="overview-learning"><div class="learning-heading"><h2>${safe(overview.learning_heading || "Learning, documented")}</h2><p>${certs.length} certificates, with the original documents available to read.</p><a href="#/certificates">Browse the certificate archive</a></div><div class="learning-documents">${selected.map((i) => `<article><button data-certificate="${safe(i.id)}" class="document-sheet" aria-label="View ${safe(i.title)}"><img src="${safe(i.evidence[0].preview_images[0])}" alt="${safe(i.title)} certificate" width="800" height="600" loading="lazy"></button><p>${safe(i.title)}</p></article>`).join("")}</div></section><section class="overview-index"><h2>Inside the portfolio</h2><div>${store
    .getVisibleTabs()
    .filter((t) => !["cover", "contents"].includes(t.id))
    .map(
      (t) =>
        `<a href="#/${safe(t.slug || t.id)}"><strong>${safe(t.label)}</strong><span>${safe(t.summary)}</span></a>`,
    )
    .join(
      "",
    )}</div></section><section class="overview-contact"><h2>Start a conversation</h2><p>For teaching, research and professional inquiries.</p><a class="btn btn-primary" href="#/contact">Contact me</a></section></div>`;
  container
    .querySelectorAll("[data-certificate]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          openLightbox(
            certs.find((i) => i.id === b.dataset.certificate).evidence[0],
          )),
    );
}
