import { contactEmail, contactPhone, emailComposeHref, phoneHref } from "../contact-links.js";
import { store } from "../store.js";
import { escapeHTML as safe } from "../utils.js";
import { openLightbox } from "./lightbox.js";
export async function renderCover(container, site) {
  const identity = site.identity || {}, overview = site.overview || {};
  const certs = (await store.getTabContent("certificates")).items?.filter(i => i.visibility !== "hidden") || [];
  const research = (await store.getTabContent("research")).items?.find(i => i.visibility !== "hidden");
  if (container.dataset.route !== "cover") return;
  const blob = await store.loadDraft(identity.avatar || "");
  const portrait = blob instanceof Blob ? URL.createObjectURL(blob) : identity.avatar;
  if (blob instanceof Blob) window.addEventListener("hashchange", () => URL.revokeObjectURL(portrait), { once: true });
  const previews = certs.filter(i => i.evidence?.[0]?.preview_images?.[0]);
  const preferred = ["certificate-22", "certificate-17", "certificate-5", "certificate-1"].map(id => previews.find(i => i.id === id)).filter(Boolean);
  const selected = [...new Set([...preferred, ...previews])].slice(0, 4);
  const name = identity.name || "", split = name.lastIndexOf(" C. ");
  const displayName = split > 0 ? `${safe(name.slice(0, split))}<br>${safe(name.slice(split + 1))}` : safe(name);
  const arrow = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
  const composeHref = emailComposeHref();
  container.innerHTML = `<div class="page-view cover-page overview">
    <section class="portfolio-card" aria-label="Introduction">
      <div class="hero-stage"><div class="hero-writing"><h1 class="hero-name">${displayName}</h1><p class="hero-role">${safe(identity.title)}</p><p>${safe(identity.institution)}</p><p class="hero-greeting">Known as ${safe(identity.preferred_name || identity.name)}, a ${safe((identity.credentials || "").replace(/\bLPT\b/gi, "Licensed Professional Teacher"))}.</p><div class="hero-actions"><a class="btn btn-primary" href="#/certificates">View certificates ${arrow}</a><a class="hero-secondary" href="#/resume">Read my résumé</a></div></div><div class="portrait-frame"><img src="${safe(portrait)}" alt="Portrait of ${safe(identity.name)}" width="700" height="700" fetchpriority="high"></div></div>

      <div class="card-imprint"><span>Science education. Research. Professional learning.</span></div>
    </section>
    <section class="overview-about"><h2>${safe(overview.heading || "Teaching & inquiry")}</h2><div><p>${safe(overview.biography)}</p><a href="#/profile">Read my profile ${arrow}</a></div></section>
    ${research ? `<section class="inquiry-feature"><div><h2>Research and thesis authored</h2></div><div><p>${safe(research.subtitle || research.description)}</p><p class="feature-context">${safe(research.organization)}</p><a href="#/research">Explore the research ${arrow}</a></div></section>` : ""}
    <section class="overview-learning"><div class="learning-heading"><h2>${safe(overview.learning_heading || "Learning, documented")}</h2><p>${certs.length} certificates, with the original documents available to read.</p><a href="#/certificates">Browse the certificate archive ${arrow}</a><div class="learning-filters" hidden aria-label="Filter featured certificates"><button type="button" data-learning="all" aria-pressed="true">All learning</button><button type="button" data-learning="science" aria-pressed="false">Science</button><button type="button" data-learning="technology" aria-pressed="false">Technology</button></div><p class="learning-status" role="status" aria-live="polite"></p></div><div class="learning-documents"></div></section>
    <section class="overview-index"><h2>Inside the portfolio</h2><div>${store.getVisibleTabs().filter(t => !["cover", "contents"].includes(t.id)).map(t => `<a href="#/${safe(t.slug || t.id)}"><strong>${safe(t.label)} ${arrow}</strong><span>${safe(t.summary)}</span></a>`).join("")}</div></section>
    <section class="overview-contact"><p>For teaching, research and professional inquiries.</p><h2>Start a conversation</h2><a class="contact-display" href="${safe(composeHref)}" ${composeHref.startsWith("https:") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${contactEmail} ${arrow}</a><a href="${phoneHref}">${contactPhone}</a><a href="#/contact">Contact details ${arrow}</a></section>
  </div>`;
  const gallery = container.querySelector(".learning-documents");
  const renderGallery = items => {
    gallery.innerHTML = items.map(i => `<article><button data-certificate="${safe(i.id)}" class="document-sheet" aria-label="View ${safe(i.title)}"><img src="${safe(i.evidence[0].preview_images[0])}" alt="${safe(i.title)} certificate" width="800" height="600" loading="lazy"></button><h3>${safe(i.title)}</h3><p>${safe(i.organization || "")}</p></article>`).join("") || '<p>No featured documents in this category. Browse the full archive for more.</p>';
    gallery.querySelectorAll("[data-certificate]").forEach(b => b.onclick = () => openLightbox(certs.find(i => i.id === b.dataset.certificate).evidence[0], { previewOnly: true }));
  };
  renderGallery(selected);
  container.querySelector(".learning-filters").hidden = false;
  container.querySelectorAll("[data-learning]").forEach(button => button.onclick = () => {
    const filter = button.dataset.learning;
    const items = filter === "all" ? selected : previews.filter(i => `${i.type || ""} ${(i.tags || []).join(" ")} ${i.title}`.toLowerCase().includes(filter)).slice(0, 4);
    container.querySelectorAll("[data-learning]").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
    renderGallery(items);
    container.querySelector(".learning-status").textContent = `${items.length} featured ${items.length === 1 ? "document" : "documents"} shown`;
  });
}
