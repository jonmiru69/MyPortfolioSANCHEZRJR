/**
 * Certificates & Trainings Page Renderer
 * Filterable by year and training type, sortable by hours and date, with evidence sleeves.
 */

import { openLightbox } from './lightbox.js';

export function renderCertificates(container, data) {
  let items = (data?.items || []).filter(i => i.visibility !== 'hidden');
  let currentTypeFilter = 'all';
  let currentYearFilter = 'all';
  let currentSort = 'newest';

  // Extract unique years and types
  const years = Array.from(new Set(items.map(i => i.year || new Date(i.date_start).getFullYear()))).filter(Boolean).sort((a, b) => b - a);
  const types = Array.from(new Set(items.map(i => i.type))).filter(Boolean);

  function getFilteredItems() {
    let result = [...items];
    if (currentTypeFilter !== 'all') {
      result = result.filter(i => i.type === currentTypeFilter);
    }
    if (currentYearFilter !== 'all') {
      result = result.filter(i => (i.year?.toString() || '') === currentYearFilter);
    }
    if (currentSort === 'newest') {
      result.sort((a, b) => (b.date_start || '').localeCompare(a.date_start || ''));
    } else if (currentSort === 'oldest') {
      result.sort((a, b) => (a.date_start || '').localeCompare(b.date_start || ''));
    } else if (currentSort === 'hours') {
      result.sort((a, b) => (b.hours || 0) - (a.hours || 0));
    }
    return result;
  }

  function updateList() {
    const listContainer = container.querySelector('#cert-list-container');
    if (!listContainer) return;

    const filtered = getFilteredItems();
    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted); border: 1px dashed var(--border-color); border-radius: var(--radius-sm);">
          No certificates matching the selected filters.
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(item => {
      const evidenceChips = (item.evidence || []).map((ev, evIdx) => `
        <button class="chip chip-evidence btn-preview-evidence" data-item-id="${item.id}" data-ev-idx="${evIdx}">
          📄 ${ev.label}
        </button>
      `).join('');

      const skillsChips = (item.skills || []).map(s => `<span class="chip">${s}</span>`).join('');

      return `
        <div class="evidence-sleeve">
          <div class="evidence-header">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.25rem;">
                <span class="chip chip-accent">${item.type || 'Training'}</span>
                <span class="chip">${item.hours || 0} Hours</span>
              </div>
              <h3 class="evidence-title">${item.title}</h3>
              <p class="evidence-subtitle">${item.subtitle || ''}</p>
            </div>
            <span class="evidence-meta">${item.date_start}</span>
          </div>

          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
            Provider: <strong>${item.organization}</strong>
          </p>

          <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 0.75rem;">
            ${item.description}
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.75rem;">
            ${skillsChips}
          </div>

          ${evidenceChips ? `
            <div style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">CERTIFICATE SLEEVE / MOV:</span>
              <div class="evidence-chips">${evidenceChips}</div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    // Reattach preview listeners
    listContainer.querySelectorAll('.btn-preview-evidence').forEach(btn => {
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

  const typeOptions = types.map(t => `<option value="${t}">${t}</option>`).join('');
  const yearOptions = years.map(y => `<option value="${y}">${y}</option>`).join('');

  container.innerHTML = `
    <div class="page-view certificates-page">
      <span class="signature-heading">PORTFOLIO FOR CERTIFICATES &amp; TRAININGS</span>
      <h2 class="tab-title">Professional Development &amp; MOVs</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <!-- Filter Controls Bar -->
      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 2rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <div>
          <label style="font-size: 0.75rem; font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">Training Type</label>
          <select id="filter-type" class="form-select" style="padding: 0.35rem 0.65rem; font-size: 0.85rem;">
            <option value="all">All Types</option>
            ${typeOptions}
          </select>
        </div>

        <div>
          <label style="font-size: 0.75rem; font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">Year</label>
          <select id="filter-year" class="form-select" style="padding: 0.35rem 0.65rem; font-size: 0.85rem;">
            <option value="all">All Years</option>
            ${yearOptions}
          </select>
        </div>

        <div>
          <label style="font-size: 0.75rem; font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">Sort By</label>
          <select id="sort-order" class="form-select" style="padding: 0.35rem 0.65rem; font-size: 0.85rem;">
            <option value="newest">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="hours">Training Hours (Highest)</option>
          </select>
        </div>
      </div>

      <div id="cert-list-container"></div>
    </div>
  `;

  // Attach filter change listeners
  container.querySelector('#filter-type')?.addEventListener('change', (e) => {
    currentTypeFilter = e.target.value;
    updateList();
  });

  container.querySelector('#filter-year')?.addEventListener('change', (e) => {
    currentYearFilter = e.target.value;
    updateList();
  });

  container.querySelector('#sort-order')?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    updateList();
  });

  updateList();
}
