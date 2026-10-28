/**
 * Tab Manager Editor
 * Rename, reorder, show/hide, add custom tabs, and delete custom tabs.
 */

import { store } from '../store.js';

export function renderTabEditor(container) {
  function renderList() {
    const tabs = store.site?.tabs || [];

    const itemsHtml = tabs.map((tab, idx) => `
      <div class="sortable-item" data-tab-id="${tab.id}" data-idx="${idx}">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
          <span class="sortable-handle" title="Move Tab">⠿</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-accent); font-weight: 700;">
            #${(idx + 1).toString().padStart(2, '0')}
          </span>
          <div style="flex: 1;">
            <input 
              type="text" 
              class="form-input tab-label-input" 
              data-tab-id="${tab.id}" 
              value="${tab.label}" 
              style="padding: 0.25rem 0.5rem; font-size: 0.88rem; font-weight: 600;" 
            />
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.2rem;">
              Slug: #${tab.slug || tab.id} ${tab.is_custom ? '· (Custom Tab)' : ''}
            </span>
          </div>
        </div>

        <div class="item-actions">
          <button class="btn btn-secondary btn-sm btn-move-up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} title="Move Up">↑</button>
          <button class="btn btn-secondary btn-sm btn-move-down" data-idx="${idx}" ${idx === tabs.length - 1 ? 'disabled' : ''} title="Move Down">↓</button>
          <button class="btn ${tab.enabled !== false ? 'btn-primary' : 'btn-outline'} btn-sm btn-toggle-vis" data-tab-id="${tab.id}">
            ${tab.enabled !== false ? 'Visible' : 'Hidden'}
          </button>
          ${tab.is_custom ? `
            <button class="btn btn-outline btn-sm btn-delete-tab" data-tab-id="${tab.id}" style="color: var(--color-danger); border-color: rgba(248, 113, 113, 0.3);">
              Delete
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 style="font-size: 1.15rem; color: var(--text-primary);">Binder Tabs &amp; Divider Management</h3>
          <button id="btn-add-custom-tab" class="btn btn-primary btn-sm">+ Add Custom Tab</button>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Reorder tabs with arrow buttons, rename labels in place, or toggle tab visibility.
        </p>

        <div class="item-list">
          ${itemsHtml}
        </div>
      </div>
    `;

    // Attach Action Listeners
    container.querySelectorAll('.tab-label-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const tabId = e.target.getAttribute('data-tab-id');
        const tab = store.site.tabs.find(t => t.id === tabId);
        if (tab) {
          tab.label = e.target.value.trim();
          await store.saveDraft('site.json', store.site);
        }
      });
    });

    container.querySelectorAll('.btn-move-up').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx > 0) {
          const temp = store.site.tabs[idx];
          store.site.tabs[idx] = store.site.tabs[idx - 1];
          store.site.tabs[idx - 1] = temp;
          store.site.tabs.forEach((t, i) => t.order = i + 1);
          await store.saveDraft('site.json', store.site);
          renderList();
        }
      });
    });

    container.querySelectorAll('.btn-move-down').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx < store.site.tabs.length - 1) {
          const temp = store.site.tabs[idx];
          store.site.tabs[idx] = store.site.tabs[idx + 1];
          store.site.tabs[idx + 1] = temp;
          store.site.tabs.forEach((t, i) => t.order = i + 1);
          await store.saveDraft('site.json', store.site);
          renderList();
        }
      });
    });

    container.querySelectorAll('.btn-toggle-vis').forEach(btn => {
      btn.addEventListener('click', async () => {
        const tabId = btn.getAttribute('data-tab-id');
        const tab = store.site.tabs.find(t => t.id === tabId);
        if (tab) {
          tab.enabled = tab.enabled === false ? true : false;
          await store.saveDraft('site.json', store.site);
          renderList();
        }
      });
    });

    container.querySelectorAll('.btn-delete-tab').forEach(btn => {
      btn.addEventListener('click', async () => {
        const tabId = btn.getAttribute('data-tab-id');
        if (confirm(`Are you sure you want to delete custom tab "${tabId}"?`)) {
          store.site.tabs = store.site.tabs.filter(t => t.id !== tabId);
          await store.saveDraft('site.json', store.site);
          renderList();
        }
      });
    });

    container.querySelector('#btn-add-custom-tab')?.addEventListener('click', async () => {
      const name = prompt('Enter a label for the new custom tab:');
      if (name && name.trim()) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newTab = {
          id: `custom-${slug}-${Date.now()}`,
          slug: slug || `tab-${Date.now()}`,
          label: name.trim(),
          summary: `Evidence and documents for ${name.trim()}.`,
          enabled: true,
          is_custom: true,
          order: store.site.tabs.length + 1
        };
        store.site.tabs.push(newTab);
        // Create initial empty content draft for custom tab
        await store.saveDraft(`content/${newTab.id}.json`, { summary: newTab.summary, items: [] });
        await store.saveDraft('site.json', store.site);
        renderList();
      }
    });
  }

  renderList();
}
