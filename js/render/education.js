/**
 * Education Page Renderer
 * Degrees, Latin honors, academic scholarships, and evidence sleeves.
 */

import { openLightbox } from './lightbox.js';

export function renderEducation(container, data) {
  const items = (data?.items || []).filter(i => i.visibility !== 'hidden');

  const itemsHtml = items.map(item => {
    const evidenceChips = (item.evidence || []).map((ev, evIdx) => `
      <button class="chip chip-evidence btn-preview-evidence" data-item-id="${item.id}" data-ev-idx="${evIdx}">
        📄 ${ev.label}
      </button>
    `).join('');

    const tagsHtml = (item.tags || []).map(t => `<span class="chip">${t}</span>`).join('');

    return `
      <div class="evidence-sleeve">
        <div class="evidence-header">
          <div>
            <h3 class="evidence-title">${item.title}</h3>
            <p class="evidence-subtitle">${item.subtitle || ''}</p>
          </div>
          <span class="evidence-meta">${item.date_start} – ${item.date_end}</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
          <strong>${item.organization}</strong>
        </p>
        <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1rem;">
          ${item.description}
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
          ${tagsHtml}
        </div>
        ${evidenceChips ? `
          <div style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">OFFICIAL EVIDENCE SLEEVE:</span>
            <div class="evidence-chips">${evidenceChips}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="page-view education-page">
      <span class="signature-heading">PORTFOLIO FOR EDUCATION</span>
      <h2 class="tab-title">Academic Qualifications &amp; Honors</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div class="education-list">
        ${itemsHtml}
      </div>
    </div>
  `;

  // Attach evidence lightbox triggers
  container.querySelectorAll('.btn-preview-evidence').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = btn.getAttribute('data-item-id');
      const evIdx = parseInt(btn.getAttribute('data-ev-idx'), 10);
      const item = items.find(i => i.id === itemId);
      if (item && item.evidence && item.evidence[evIdx]) {
        openLightbox(item.evidence[evIdx]);
      }
    });
  });
}
