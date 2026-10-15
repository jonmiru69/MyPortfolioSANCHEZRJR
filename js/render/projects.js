/**
 * Projects & Digital Tools Page Renderer
 * Displays educational web tools, simulations, repos, live demos, and community impact.
 */

import { openLightbox } from './lightbox.js';

export function renderProjects(container, data) {
  const items = (data?.items || []).filter(i => i.visibility !== 'hidden');

  const itemsHtml = items.map(item => {
    const techChips = (item.tech || []).map(t => `<span class="chip chip-accent">${t}</span>`).join('');

    const evidenceChips = (item.evidence || []).map((ev, evIdx) => `
      <button class="chip chip-evidence btn-preview-evidence" data-item-id="${item.id}" data-ev-idx="${evIdx}">
        📄 ${ev.label}
      </button>
    `).join('');

    return `
      <div class="evidence-sleeve">
        <div class="evidence-header">
          <div>
            <h3 class="evidence-title">💻 ${item.title}</h3>
            <p class="evidence-subtitle">${item.subtitle || ''}</p>
          </div>
        </div>

        <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 0.75rem;">
          ${item.description}
        </p>

        <div style="background: var(--bg-surface-elevated); border-left: 3px solid var(--color-accent); padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin: 0.75rem 0;">
          <strong style="font-size: 0.75rem; font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-accent); display: block; margin-bottom: 0.25rem;">PROVEN CLASSROOM / COMMUNITY IMPACT:</strong>
          <span style="font-size: 0.88rem; color: var(--text-primary);">${item.impact}</span>
        </div>

        <div style="margin: 0.75rem 0;">
          <strong style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); display: block; margin-bottom: 0.35rem;">TECHNOLOGY STACK:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${techChips}
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin: 1rem 0; flex-wrap: wrap;">
          ${item.live_link ? `
            <a href="${item.live_link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              🌐 Launch Live App →
            </a>
          ` : ''}
          ${item.repo_link ? `
            <a href="${item.repo_link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              📂 View Source Code
            </a>
          ` : ''}
        </div>

        ${evidenceChips ? `
          <div style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">VERIFIED EVALUATION REPORT:</span>
            <div class="evidence-chips">${evidenceChips}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="page-view projects-page">
      <span class="signature-heading">PORTFOLIO FOR DIGITAL TOOLS &amp; PROJECTS</span>
      <h2 class="tab-title">Educational Software &amp; Simulations</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div class="projects-list">
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
