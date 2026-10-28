/**
 * Gallery Page Renderer
 * Photographic evidence with required context sentences, captions, and lightbox integration.
 */

import { openLightbox } from './lightbox.js';

export function renderGallery(container, data) {
  const items = (data?.items || []).filter(i => i.visibility !== 'hidden');

  const itemsHtml = items.map((item, idx) => `
    <div class="evidence-sleeve" style="display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      <div style="position: relative; overflow: hidden; max-height: 260px; cursor: pointer;" class="gallery-img-wrapper" data-gallery-idx="${idx}">
        <img 
          src="${item.image || 'assets/images/cover-hero.svg'}" 
          alt="${item.title}" 
          style="width: 100%; height: 260px; object-fit: cover; display: block; transition: transform 0.3s ease;"
          loading="lazy"
        />
        <span class="chip chip-accent" style="position: absolute; top: 0.75rem; left: 0.75rem; background: rgba(18, 20, 23, 0.85); backdrop-filter: blur(4px);">
          ${item.category || 'Classroom Evidence'}
        </span>
      </div>

      <div style="padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem;">
          <h3 style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary);">${item.title}</h3>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${item.date || ''}</span>
        </div>

        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
          ${item.caption}
        </p>

        <div style="background: var(--bg-surface-elevated); border-left: 3px solid var(--color-accent); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); margin-bottom: 0.75rem;">
          <strong style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-accent); display: block; margin-bottom: 0.15rem;">REQUIRED CONTEXT:</strong>
          <span style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; display: block;">
            ${item.context}
          </span>
        </div>

        <button class="btn btn-outline btn-sm btn-zoom-gallery" data-gallery-idx="${idx}" style="width: 100%; justify-content: center;">
          🔍 Expand Evidence in Lightbox
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page-view gallery-page">
      <span class="signature-heading">PORTFOLIO FOR GALLERY &amp; EVIDENCE</span>
      <h2 class="tab-title">Classroom &amp; Laboratory Documentation</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
        ${itemsHtml}
      </div>
    </div>
  `;

  // Attach lightbox opening
  const triggerLightbox = (idx) => {
    const item = items[idx];
    if (item) {
      openLightbox({
        label: item.title,
        file: item.image || 'assets/images/cover-hero.svg',
        type: 'image',
        context: item.context
      });
    }
  };

  container.querySelectorAll('.gallery-img-wrapper').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-gallery-idx'), 10);
      triggerLightbox(idx);
    });
  });

  container.querySelectorAll('.btn-zoom-gallery').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-gallery-idx'), 10);
      triggerLightbox(idx);
    });
  });
}
