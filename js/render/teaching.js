/**
 * Teaching Experience Page Renderer
 * Displays teaching assignments, STE special science loads, and MATATAG curriculum duties.
 */

import { openLightbox } from './lightbox.js';

export function renderTeaching(container, data) {
  const items = (data?.items || []).filter(i => i.visibility !== 'hidden');

  const itemsHtml = items.map(item => {
    const subjectsHtml = (item.subjects || []).map(s => `<span class="chip chip-accent">${s}</span>`).join('');
    const responsibilitiesHtml = (item.responsibilities || []).map(r => `<li>${r}</li>`).join('');

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
          <span class="evidence-meta">${item.date_start} – ${item.date_end}</span>
        </div>

        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem 1rem; margin: 0.75rem 0;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: block;">INSTITUTION:</span>
              <strong style="font-size: 0.85rem; color: var(--text-primary);">${item.school || item.organization}</strong>
            </div>
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: block;">CURRICULUM FRAMEWORK:</span>
              <strong style="font-size: 0.85rem; color: var(--color-accent);">${item.curriculum || 'MATATAG Curriculum'}</strong>
            </div>
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: block;">TARGET GRADE LEVELS:</span>
              <strong style="font-size: 0.85rem; color: var(--text-primary);">${item.grade_levels || 'Junior High'}</strong>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <strong style="font-size: 0.75rem; font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">SUBJECTS TAUGHT:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${subjectsHtml}
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <strong style="font-size: 0.75rem; font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">KEY INSTRUCTIONAL DUTIES:</strong>
          <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
            ${responsibilitiesHtml}
          </ul>
        </div>

        ${evidenceChips ? `
          <div style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">SERVICE RECORD &amp; PROGRAM LOAD:</span>
            <div class="evidence-chips">${evidenceChips}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="page-view teaching-page">
      <span class="signature-heading">PORTFOLIO FOR TEACHING EXPERIENCE</span>
      <h2 class="tab-title">Classroom Faculty Assignments</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div class="teaching-list">
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
