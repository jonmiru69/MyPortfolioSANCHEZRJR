/**
 * Instructional Materials Page Renderer
 * Lesson plans, learner activity sheets (LAS), laboratory guides, and assessment TOS with competency codes.
 */

import { openLightbox } from './lightbox.js';

export function renderMaterials(container, data) {
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
            <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.25rem; flex-wrap: wrap;">
              <span class="chip chip-accent">${item.type}</span>
              <span class="chip">${item.subject}</span>
              <span class="chip">${item.quarter}</span>
            </div>
            <h3 class="evidence-title">${item.title}</h3>
            <p class="evidence-subtitle">${item.subtitle || ''}</p>
          </div>
          <span class="chip text-mono" style="background: rgba(59, 130, 150, 0.1); border-color: var(--color-accent-border); color: var(--color-accent);">
            ${item.competency_code || 'COMPETENCY'}
          </span>
        </div>

        <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1rem;">
          ${item.description}
        </p>

        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
          ${(item.tags || []).map(t => `<span class="chip">${t}</span>`).join('')}
        </div>

        ${evidenceChips ? `
          <div style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">MATERIAL DOCUMENT / EXEMPLAR SLEEVE:</span>
            <div class="evidence-chips">${evidenceChips}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="page-view materials-page">
      <span class="signature-heading">PORTFOLIO FOR INSTRUCTIONAL MATERIALS</span>
      <h2 class="tab-title">Lesson Exemplars, LAS &amp; TOS</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div class="materials-list">
        ${itemsHtml}
      </div>
    </div>
  `;

  // Attach evidence lightbox triggers
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
