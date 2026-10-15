/**
 * Research & Thesis Page Renderer
 * Displays academic theses, student investigatory projects, methods, findings, and PDF downloads.
 */

import { openLightbox } from './lightbox.js';

export function renderResearch(container, data) {
  const items = (data?.items || []).filter(i => i.visibility !== 'hidden');

  const itemsHtml = items.map(item => {
    const keywordsHtml = (item.keywords || []).map(k => `<span class="chip">${k}</span>`).join('');
    const awardsHtml = (item.awards || []).map(a => `<span class="chip chip-accent">🏆 ${a}</span>`).join('');
    const presentationsHtml = (item.presentations || []).map(p => `<li>${p}</li>`).join('');

    const evidenceChips = (item.evidence || []).map((ev, evIdx) => `
      <button class="chip chip-evidence btn-preview-evidence" data-item-id="${item.id}" data-ev-idx="${evIdx}">
        📄 ${ev.label}
      </button>
    `).join('');

    return `
      <div class="evidence-sleeve">
        <div class="evidence-header">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.25rem;">
              <span class="chip chip-accent">${item.status || 'Completed'}</span>
              <span class="chip text-mono">${item.year}</span>
            </div>
            <h3 class="evidence-title">${item.title}</h3>
            <p class="evidence-subtitle">Role: <strong>${item.role}</strong> · Adviser: ${item.adviser}</p>
          </div>
        </div>

        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.25rem; margin: 1rem 0;">
          <h4 style="font-family: var(--font-display); font-size: 0.78rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.4rem;">
            Abstract &amp; Problem Statement
          </h4>
          <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 0.75rem;">
            ${item.abstract}
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem; border-top: 1px dashed var(--border-color); padding-top: 0.75rem;">
            <div>
              <strong style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--text-muted); display: block;">METHODOLOGY:</strong>
              <span style="font-size: 0.85rem; color: var(--text-primary);">${item.methods || 'Empirical experimental design'}</span>
            </div>
            <div>
              <strong style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--text-muted); display: block;">KEY FINDINGS:</strong>
              <span style="font-size: 0.85rem; color: var(--text-primary);">${item.key_findings || 'Statistically significant gains'}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem;">
          ${keywordsHtml}
        </div>

        ${item.awards?.length ? `
          <div style="margin-bottom: 0.75rem; display: flex; gap: 0.4rem; flex-wrap: wrap;">
            ${awardsHtml}
          </div>
        ` : ''}

        ${presentationsHtml ? `
          <div style="margin-bottom: 1rem;">
            <strong style="font-size: 0.78rem; font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">CONFERENCE PRESENTATIONS:</strong>
            <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-secondary);">
              ${presentationsHtml}
            </ul>
          </div>
        ` : ''}

        ${evidenceChips ? `
          <div style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">RESEARCH EVIDENCE &amp; APPROVALS:</span>
            <div class="evidence-chips">${evidenceChips}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="page-view research-page">
      <span class="signature-heading">PORTFOLIO FOR RESEARCH &amp; THESIS</span>
      <h2 class="tab-title">Scientific Inquiry &amp; Action Research</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div class="research-list">
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
