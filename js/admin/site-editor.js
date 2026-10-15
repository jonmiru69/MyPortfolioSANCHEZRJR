/**
 * Site Identity, SEO, Presets & Contact Settings Editor
 */

import { store } from '../store.js';

export function renderSiteEditor(container) {
  const site = store.site || {};
  const identity = site.identity || {};
  const seo = site.seo || {};
  const contact = site.contact || {};
  const presets = site.presets || [];

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 style="font-size: 1.15rem; color: var(--text-primary);">Site Identity &amp; Positioning</h3>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
        <div class="form-group">
          <label class="form-label">Full Legal Name</label>
          <input type="text" id="id-name" class="form-input" value="${identity.name || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label">Credentials / Post-Nominals</label>
          <input type="text" id="id-cred" class="form-input" value="${identity.credentials || ''}" placeholder="e.g. LPT, MAEd" />
        </div>
        <div class="form-group">
          <label class="form-label">Preferred Name / Alias</label>
          <input type="text" id="id-pref" class="form-input" value="${identity.preferred_name || ''}" placeholder="e.g. Jonmiru" />
        </div>
        <div class="form-group">
          <label class="form-label">Professional Title</label>
          <input type="text" id="id-title" class="form-input" value="${identity.title || ''}" />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label">Mission-First Positioning Sentence</label>
          <textarea id="id-pos" class="form-textarea" style="min-height: 70px;">${identity.positioning_sentence || ''}</textarea>
        </div>
      </div>
    </div>

    <!-- SEO & Metadata Card -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 style="font-size: 1.15rem; color: var(--text-primary);">Search Engine &amp; Social Metadata</h3>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label">Browser &amp; Search Title</label>
          <input type="text" id="seo-title" class="form-input" value="${seo.site_title || ''}" />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label">Meta Description</label>
          <textarea id="seo-desc" class="form-textarea" style="min-height: 70px;">${seo.site_description || ''}</textarea>
        </div>
      </div>
    </div>

    <!-- Contact Settings Card -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 style="font-size: 1.15rem; color: var(--text-primary);">Contact &amp; Inquiry Settings</h3>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
        <div class="form-group">
          <label class="form-label">Mailto Notification Address</label>
          <input type="email" id="contact-mailto" class="form-input" value="${contact.mailto_address || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label">Optional Free Endpoint URL (Formspree, Basin, etc.)</label>
          <input type="url" id="contact-endpoint" class="form-input" value="${contact.endpoint_url || ''}" placeholder="https://formspree.io/f/..." />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label">Inline Success Confirmation Message</label>
          <input type="text" id="contact-success" class="form-input" value="${contact.success_message || ''}" />
        </div>
      </div>
    </div>
  `;

  // Save changes handler
  const saveIdentity = async () => {
    store.site.identity = {
      ...store.site.identity,
      name: container.querySelector('#id-name').value.trim(),
      credentials: container.querySelector('#id-cred').value.trim(),
      preferred_name: container.querySelector('#id-pref').value.trim(),
      title: container.querySelector('#id-title').value.trim(),
      positioning_sentence: container.querySelector('#id-pos').value.trim()
    };
    store.site.seo = {
      ...store.site.seo,
      site_title: container.querySelector('#seo-title').value.trim(),
      site_description: container.querySelector('#seo-desc').value.trim()
    };
    store.site.contact = {
      ...store.site.contact,
      mailto_address: container.querySelector('#contact-mailto').value.trim(),
      endpoint_url: container.querySelector('#contact-endpoint').value.trim(),
      success_message: container.querySelector('#contact-success').value.trim()
    };
    await store.saveDraft('site.json', store.site);
  };

  container.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('change', saveIdentity);
  });
}
