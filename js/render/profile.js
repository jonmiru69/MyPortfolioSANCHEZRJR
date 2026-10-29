import { store } from "../store.js";
import { escapeHTML as safe } from "../utils.js";
export async function renderProfile(container, data, site) {
  const identity = site.identity || {};
  const blob = await store.loadDraft(identity.avatar || "");
  const url =
    blob instanceof Blob ? URL.createObjectURL(blob) : identity.avatar;
  if (blob instanceof Blob)
    window.addEventListener("hashchange", () => URL.revokeObjectURL(url), {
      once: true,
    });
  container.innerHTML = `<div class="page-view profile-page"><header class="section-intro"><h1 class="tab-title">Profile</h1><p class="tab-summary">${safe(data.summary)}</p></header><section class="profile-layout"><img class="profile-portrait" src="${safe(url)}" alt="${safe(identity.name)}" width="700" height="700"><div><h2>${safe(identity.preferred_name || identity.name)}</h2><p>${safe(data.bio)}</p>${data.statement ? `<blockquote>${safe(data.statement)}</blockquote>` : ""}<dl class="profile-facts">${(data.key_facts || []).map((f) => `<div><dt>${safe(f.label)}</dt><dd>${safe(f.value)}</dd></div>`).join("")}</dl><a class="btn btn-primary" href="#/resume">Read my résumé</a></div></section></div>`;
}
