/**
 * Licenses & Eligibilities Page Renderer
 * Displays professional board licenses and civil service credentials with masked numbers.
 */

import { openLightbox } from './lightbox.js';

export function renderLicenses(container, data) {
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
          <span class="chip chip-accent" style="font-family: var(--font-mono); font-size: 0.75rem;">
            ${item.status || 'Active'}
          </span>
        </div>

        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem 1rem; margin: 0.75rem 0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); display: block;">MASKED REGISTRATION / SERIAL:</span>
            <strong style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--text-primary); letter-spacing: 0.05em;">${item.license_number_masked}</strong>
          </div>
          <div>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); display: block;">VERIFIED RATING:</span>
            <strong style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--color-accent);">${item.rating || 'Verified'}</strong>
          </div>
        </div>

        <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 0.75rem;">
          ${item.description}
        </p>

        ${evidenceChips ? `
          <div style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">VERIFICATION EVIDENCE:</span>
            <div class="evidence-chips">${evidenceChips}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="page-view licenses-page">
      <span class="signature-heading">PORTFOLIO FOR LICENSES &amp; ELIGIBILITIES</span>
      <h2 class="tab-title">Board Accreditations &amp; Civil Service</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div style="background: var(--bg-surface-elevated); border-left: 3px solid var(--color-accent); padding: 0.85rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 2rem;">
        <strong>Privacy &amp; Data Protection Compliance:</strong> ${data?.notice || ''}
      </div>

      <div class="licenses-list">
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
