/**
 * Performance & PPST Evidence Page Renderer
 * 7 PPST Domains matrix, COT rating summaries, learner outcomes, and reflection notes.
 */

import { openLightbox } from './lightbox.js';

export function renderPerformance(container, data) {
  const rating = data?.overall_rating || {};
  const cots = data?.cot_summary || [];
  const domains = data?.domains || [];

  const cotRowsHtml = cots.map(cot => `
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 0.65rem 0.85rem; font-weight: 600; color: var(--text-primary); font-size: 0.88rem;">${cot.observation}</td>
      <td style="padding: 0.65rem 0.85rem; color: var(--text-secondary); font-size: 0.85rem;">${cot.observer}</td>
      <td style="padding: 0.65rem 0.85rem; font-family: var(--font-mono); color: var(--text-muted); font-size: 0.8rem;">${cot.date}</td>
      <td style="padding: 0.65rem 0.85rem; color: var(--color-accent); font-weight: 600; font-size: 0.85rem;">${cot.rating}</td>
    </tr>
  `).join('');

  const domainsHtml = domains.map(dom => `
    <div class="evidence-sleeve" style="margin-bottom: 1.5rem;">
      <div class="evidence-header">
        <div>
          <span class="chip chip-accent" style="margin-bottom: 0.35rem;">PPST DOMAIN ${dom.number}</span>
          <h3 class="evidence-title">${dom.name}</h3>
        </div>
      </div>

      <div style="margin: 0.75rem 0;">
        <strong style="font-size: 0.75rem; font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">OBJECTIVE / INDICATOR:</strong>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 0.75rem;">
          ${dom.objective}
        </p>

        <strong style="font-size: 0.75rem; font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">MEANS OF VERIFICATION (MOV):</strong>
        <p style="font-size: 0.85rem; font-family: var(--font-mono); color: var(--text-primary); margin-bottom: 0.75rem;">
          ${dom.movs}
        </p>

        <div style="background: var(--bg-surface-elevated); border-left: 3px solid var(--color-accent); padding: 0.75rem 1rem; border-radius: var(--radius-sm);">
          <strong style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--color-accent); display: block; margin-bottom: 0.2rem;">CRITICAL REFLECTION NOTE:</strong>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0; font-style: italic;">
            "${dom.reflection}"
          </p>
        </div>
      </div>

      <div style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
        <button class="chip chip-evidence btn-preview-ppst" data-dom-id="${dom.id}" data-dom-name="${dom.name}" data-file="${dom.evidence_file || 'assets/docs/sample-certificate.svg'}">
          📄 View Verified MOV Sleeve (Domain ${dom.number})
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page-view performance-page">
      <span class="signature-heading">PORTFOLIO FOR PERFORMANCE &amp; EVIDENCE</span>
      <h2 class="tab-title">RPMS-PPST Evidence Matrix</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <!-- RPMS Notice -->
      <div style="background: var(--bg-surface-elevated); border-left: 3px solid var(--color-accent); padding: 0.85rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 2rem;">
        <strong>Note:</strong> ${data?.rpms_notice || ''}
      </div>

      <!-- Rating Header Box -->
      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.25rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span style="font-family: var(--font-display); font-size: 0.75rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted); display: block;">ANNUAL IPCRF EVALUATION</span>
          <h3 style="font-size: 1.4rem; color: var(--text-primary); margin: 0.2rem 0;">
            ${rating.numerical} · <span style="color: var(--color-accent);">${rating.adjectival}</span>
          </h3>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${rating.school_year}</span>
        </div>
        <button id="btn-print-matrix" class="btn btn-outline btn-sm no-print">
          🖨️ Print PPST Matrix
        </button>
      </div>

      <!-- COT Summary Table -->
      <div style="margin-bottom: 2.5rem;">
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.75rem;">
          Classroom Observation Tool (COT) Summary
        </h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); font-family: var(--font-display); font-size: 0.75rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted);">
                <th style="padding: 0.65rem 0.85rem;">Observation</th>
                <th style="padding: 0.65rem 0.85rem;">Observer / Rater</th>
                <th style="padding: 0.65rem 0.85rem;">Date</th>
                <th style="padding: 0.65rem 0.85rem;">Rating</th>
              </tr>
            </thead>
            <tbody>
              ${cotRowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- PPST 7 Domains Matrix -->
      <div>
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 1rem;">
          The 7 Philippine Professional Standards for Teachers (PPST) Domains
        </h3>
        <div class="ppst-matrix-list">
          ${domainsHtml}
        </div>
      </div>
    </div>
  `;

  // Attach evidence lightbox triggers
  container.querySelectorAll('.btn-preview-ppst').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.getAttribute('data-dom-name');
      const file = btn.getAttribute('data-file');
      openLightbox({
        label: `PPST MOV: ${label}`,
        file,
        type: 'document',
        context: 'Official MOV verified by Master Teacher & Department Head'
      });
    });
  });

  container.querySelector('#btn-print-matrix')?.addEventListener('click', () => {
    window.print();
  });
}
