/**
 * Custom Tab Page Renderer
 * Renders user-defined custom binder tabs dynamically based on item schemas.
 */

import { openLightbox } from './lightbox.js';

export function renderCustom(container, tabMeta, data) {
  const items = (data?.items || []).filter(i => i.visibility !== 'hidden');

  const itemsHtml = items.map(item => {
    const evidenceChips = (item.evidence || []).map((ev, evIdx) => `
      <button class="chip chip-evidence btn-preview-evidence" data-item-id="${item.id}" data-ev-idx="${evIdx}">
        📄 ${ev.label}
      </button>
    `).join('');

    return `
      <div class="evidence-sleeve">
        <div class="evidence-header">
          <div>
            <h3 class="evidence-title">${item.title}</h3>
            <p class="evidence-subtitle">${item.subtitle || ''}</p>
          </div>
          <span class="evidence-meta">${item.date_start || ''} ${item.date_end ? `– ${item.date_end}` : ''}</span>
        </div>
        ${item.organization ? `<p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.5rem;"><strong>${item.organization}</strong></p>` : ''}
        <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 0.75rem;">
          ${item.description || ''}
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
          ${(item.tags || []).map(t => `<span class="chip">${t}</span>`).join('')}
        </div>
        ${evidenceChips ? `
          <div style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
            <div class="evidence-chips">${evidenceChips}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="page-view custom-page">
      <span class="signature-heading">PORTFOLIO FOR ${tabMeta.label.toUpperCase()}</span>
      <h2 class="tab-title">${tabMeta.label}</h2>
      <p class="tab-summary">${tabMeta.summary || data?.summary || ''}</p>

      <div class="custom-list">
        ${itemsHtml.length > 0 ? itemsHtml : '<div style="padding: 2rem; color: var(--text-muted); border: 1px dashed var(--border-color);">This custom tab currently has no published items. Add items in the Owner Admin panel.</div>'}
      </div>
    </div>
  `;

  container.querySelectorAll('.btn-preview-evidence').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-item-id');
      const evIdx = parseInt(btn.getAttribute('data-ev-idx'), 10);
      const item = items.find(i => i.id === itemId);
      if (item && item.evidence && item.evidence[evIdx]) {
        openLightbox(item.evidence[evIdx]);
      }
    });
  });
}
