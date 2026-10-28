/**
 * Site Identity, SEO, Presets & Contact Settings Editor
 */

import { store } from '../store.js';

export async function renderSiteEditor(container) {
  const site = store.site || {};
  const profile = await store.getTabContent("profile");
  const identity = site.identity || {};
  const seo = site.seo || {};
  const contact = site.contact || {};
  const overview = site.overview || {};
  const safe = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 style="font-size: 1.15rem; color: var(--text-primary);">Site Identity &amp; Positioning</h3>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
        <div class="form-group">
          <label class="form-label" for="id-name">Full Legal Name</label>
          <input type="text" id="id-name" class="form-input" value="${safe(identity.name)}" />
        </div>
        <div class="form-group">
          <label class="form-label" for="id-cred">Credentials / Post-Nominals</label>
          <input type="text" id="id-cred" class="form-input" value="${safe(identity.credentials)}" placeholder="e.g. LPT, MAEd" />
        </div>
        <div class="form-group">
          <label class="form-label" for="id-pref">Preferred Name / Alias</label>
          <input type="text" id="id-pref" class="form-input" value="${safe(identity.preferred_name)}" placeholder="e.g. Jonmiru" />
        </div>
        <div class="form-group">
          <label class="form-label" for="id-title">Professional Title</label>
          <input type="text" id="id-title" class="form-input" value="${safe(identity.title)}" />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label" for="id-pos">Mission-First Positioning Sentence</label>
          <textarea id="id-pos" class="form-textarea" style="min-height: 70px;">${safe(identity.positioning_sentence)}</textarea>
        </div>
        <div class="form-group"><label class="form-label" for="id-date">Date range</label><input id="id-date" class="form-input" value="${safe(identity.date_range)}" /></div>
        <div class="form-group"><label class="form-label" for="id-location">Location</label><input id="id-location" class="form-input" value="${safe(identity.location)}" /></div>
        <div class="form-group"><label class="form-label" for="id-institution">Institution</label><input id="id-institution" class="form-input" value="${safe(identity.institution)}" /></div>
        <div class="form-group"><label class="form-label" for="id-licensure-rating">Licensure GWA rating</label><input id="id-licensure-rating" class="form-input" value="${safe(identity.licensure_rating)}" /></div>
        <div class="form-group"><label class="form-label" for="id-email">Public email</label><input id="id-email" type="email" class="form-input" value="${safe(identity.email)}" /></div>
        <div class="form-group"><label class="form-label" for="id-avatar">Portrait image path or URL</label><input id="id-avatar" class="form-input" value="${safe(identity.avatar)}" /></div>
        <div class="form-group"><label class="form-label" for="id-cover">Cover image path or URL</label><input id="id-cover" class="form-input" value="${safe(identity.cover_image)}" /></div>
        <div class="form-group"><label class="form-label" for="id-cover-alt">Cover image description</label><input id="id-cover-alt" class="form-input" value="${safe(identity.cover_image_alt)}" /></div>
        <div class="form-group" style="grid-column: 1 / -1;"><label class="form-label" for="id-footer">Footer text</label><input id="id-footer" class="form-input" value="${safe(identity.footer_text)}" /></div>
      </div>
    </div>

    <div class="admin-card">
      <h3>Overview page</h3>
      <div class="form-group"><label for="overview-heading" class="form-label">Sections heading</label><input id="overview-heading" class="form-input" value="${safe(overview.heading)}" /></div>
      <div class="form-group"><label for="overview-description" class="form-label">Introduction to sections</label><textarea id="overview-description" class="form-textarea">${safe(overview.description)}</textarea></div>
      <div class="form-group"><label for="overview-action" class="form-label">Profile link label</label><input id="overview-action" class="form-input" value="${safe(overview.action_label)}" /></div>
      <div class="form-group"><label for="overview-learning" class="form-label">Learning heading</label><input id="overview-learning" class="form-input" value="${safe(overview.learning_heading)}" /></div>
    </div>

    <div class="admin-card">
      <div class="admin-card-header"><h3>Profile writing</h3></div>
      <p>These fields appear in the Profile section. Changes are saved as a local draft until you publish.</p>
      <div class="form-group"><label class="form-label" for="profile-summary">Summary</label><textarea id="profile-summary" class="form-textarea">${safe(profile.summary)}</textarea></div>
      <div class="form-group"><label class="form-label" for="profile-statement">Personal statement</label><textarea id="profile-statement" class="form-textarea">${safe(profile.statement)}</textarea></div>
      <div class="form-group"><label class="form-label" for="profile-bio">Biography</label><textarea id="profile-bio" class="form-textarea">${safe(profile.bio)}</textarea></div>
      <div class="form-group"><label class="form-label" for="profile-facts">Key facts, one per line as Label: Value</label><textarea id="profile-facts" class="form-textarea">${safe((profile.key_facts || []).map(f => f.label + ': ' + f.value).join('\n'))}</textarea></div>
    </div>
    <!-- SEO & Metadata Card -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 style="font-size: 1.15rem; color: var(--text-primary);">Search Engine &amp; Social Metadata</h3>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label" for="seo-title">Browser &amp; Search Title</label>
          <input type="text" id="seo-title" class="form-input" value="${safe(seo.site_title)}" />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label" for="seo-desc">Meta Description</label>
          <textarea id="seo-desc" class="form-textarea" style="min-height: 70px;">${safe(seo.site_description)}</textarea>
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
          <label class="form-label" for="contact-mailto">Mailto Notification Address</label>
          <input type="email" id="contact-mailto" class="form-input" value="${safe(contact.mailto_address)}" />
        </div>
        <div class="form-group">
          <label class="form-label" for="contact-endpoint">Optional Free Endpoint URL (Formspree, Basin, etc.)</label>
          <input type="url" id="contact-endpoint" class="form-input" value="${safe(contact.endpoint_url)}" placeholder="https://formspree.io/f/..." />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label" for="contact-success">Inline Success Confirmation Message</label>
          <input type="text" id="contact-success" class="form-input" value="${safe(contact.success_message)}" />
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
      positioning_sentence: container.querySelector('#id-pos').value.trim(),
      date_range: container.querySelector('#id-date').value.trim(),
      location: container.querySelector('#id-location').value.trim(),
      institution: container.querySelector('#id-institution').value.trim(),
      licensure_rating: container.querySelector('#id-licensure-rating').value.trim(),
      email: container.querySelector('#id-email').value.trim(),
      avatar: container.querySelector('#id-avatar').value.trim(),
      cover_image: container.querySelector('#id-cover').value.trim(),
      cover_image_alt: container.querySelector('#id-cover-alt').value.trim(),
      footer_text: container.querySelector('#id-footer').value.trim()
    };
    store.site.overview = {
      ...store.site.overview,
      heading: container.querySelector('#overview-heading').value.trim(),
      description: container.querySelector('#overview-description').value.trim(),
      action_label: container.querySelector('#overview-action').value.trim(),
      learning_heading: container.querySelector('#overview-learning').value.trim()
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
    profile.summary = container.querySelector('#profile-summary').value.trim();
    profile.statement = container.querySelector('#profile-statement').value.trim();
    profile.bio = container.querySelector('#profile-bio').value.trim();
    profile.key_facts = container.querySelector('#profile-facts').value.split('\n').map(line => {
      const colon = line.indexOf(':');
      return colon < 0 ? null : { label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() };
    }).filter(f => f && f.label && f.value);
    await store.saveDraft('content/profile.json', profile);
  };

  container.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('change', saveIdentity);
  });
}
