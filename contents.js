/**
 * Table of Contents Page Renderer
 * Auto-generated list of all visible tabs with index numbers, deep links, and summaries.
 */

import { store } from '../store.js';
import { router } from '../router.js';

export function renderContents(container) {
  const visibleTabs = store.getVisibleTabs();

  let itemsHtml = visibleTabs.map((tab, idx) => {
    const num = (idx + 1).toString().padStart(2, '0');
    return `
      <div class="toc-item" style="display: flex; align-items: baseline; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1px dashed var(--border-color); gap: 1rem;">
        <div style="display: flex; align-items: baseline; gap: 1.25rem; flex: 1;">
          <span style="font-family: var(--font-mono); color: var(--color-accent); font-weight: 700; font-size: 0.9rem;">TAB ${num}</span>
          <div>
            <a href="#/${tab.slug || tab.id}" class="toc-link" style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; letter-spacing: var(--tracking-normal); color: var(--text-primary); text-decoration: none;">
              ${tab.label}
            </a>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem; margin-bottom: 0;">
              ${tab.summary || ''}
            </p>
          </div>
        </div>
        <a href="#/${tab.slug || tab.id}" class="btn btn-outline btn-sm" style="font-family: var(--font-mono); font-size: 0.72rem; white-space: nowrap;">
          Jump →
        </a>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="page-view contents-page">
      <span class="signature-heading">TABLE OF CONTENTS</span>
      <h2 class="tab-title">Portfolio Evidence Index</h2>
      <p class="tab-summary">
        Choose a section to explore the portfolio.
      </p>

      <div style="display: flex; gap: 0.75rem; margin-bottom: 2rem;">
        <button id="btn-print-binder" class="btn btn-secondary btn-sm">
          Print this page
        </button>
      </div>

      <div class="toc-list" style="margin-top: 1rem;">
        ${itemsHtml}
      </div>
    </div>
  `;

  container.querySelector('#btn-print-binder')?.addEventListener('click', () => {
    window.print();
  });
}
