/**
 * Content Item Editor
 * Create, edit, duplicate, delete, reorder items, and manage evidence attachments for any active tab.
 */

import { store } from '../store.js';
import { createDefaultItem } from '../schema.js';
import { processImageUpload, validateDocumentUpload, formatBytes } from '../media.js';
const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderContentEditor(container) {
  const tabs = (store.site?.tabs || []).filter(t => t.id !== 'cover' && t.id !== 'contents');
  let selectedTabId = tabs[0]?.id || 'profile';

  async function renderEditor() {
    const content = await store.getTabContent(selectedTabId);
    const items = content.items || [];

    const tabOptions = tabs.map(t => `
      <option value="${t.id}" ${t.id === selectedTabId ? 'selected' : ''}>${t.label} (${t.id})</option>
    `).join('');

    const itemsHtml = items.map((item, idx) => `
      <div class="admin-card" style="margin-bottom: 1rem; border-left: 3px solid ${item.visibility === 'hidden' ? 'var(--text-muted)' : 'var(--color-accent)'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-accent);">ITEM #${idx + 1} · ID: ${item.id}</span>
            <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-top: 0.2rem;">${item.title || '(Untitled Item)'}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${item.subtitle || ''}</p>
          </div>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <button class="btn btn-secondary btn-sm btn-item-up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>↑</button>
            <button class="btn btn-secondary btn-sm btn-item-down" data-idx="${idx}" ${idx === items.length - 1 ? 'disabled' : ''}>↓</button>
            <button class="btn ${item.visibility !== 'hidden' ? 'btn-primary' : 'btn-outline'} btn-sm btn-item-vis" data-idx="${idx}">
              ${item.visibility !== 'hidden' ? 'Public' : 'Hidden'}
            </button>
            <button class="btn ${item.featured ? 'btn-primary' : 'btn-outline'} btn-sm btn-item-feat" data-idx="${idx}">
              ★ ${item.featured ? 'Featured' : 'Standard'}
            </button>
            <button class="btn btn-secondary btn-sm btn-item-dup" data-idx="${idx}" title="Duplicate Item">📋</button>
            <button class="btn btn-outline btn-sm btn-item-del" data-idx="${idx}" style="color: var(--color-danger);" title="Delete Item">✕</button>
          </div>
        </div>

        <!-- Inline Editor Form -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div class="form-group">
            <label class="form-label">Item Title</label>
            <input type="text" class="form-input item-field" data-idx="${idx}" data-field="title" value="${item.title || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Subtitle / Specialization</label>
            <input type="text" class="form-input item-field" data-idx="${idx}" data-field="subtitle" value="${item.subtitle || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Organization / School</label>
            <input type="text" class="form-input item-field" data-idx="${idx}" data-field="organization" value="${item.organization || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Date Range</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" class="form-input item-field" data-idx="${idx}" data-field="date_start" value="${item.date_start || ''}" placeholder="Start" />
              <input type="text" class="form-input item-field" data-idx="${idx}" data-field="date_end" value="${item.date_end || ''}" placeholder="End" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description / Abstract</label>
          <textarea class="form-textarea item-field" data-idx="${idx}" data-field="description" style="min-height: 80px;">${item.description || ''}</textarea>
        </div>

        ${selectedTabId === 'certificates' ? `
        <fieldset class="admin-card"><legend>Certificate and training details</legend>
          ${[['type','Category'], ['hours','Training hours'], ['issue_date','Issue date'], ['valid_until','Valid until'], ['credential_id','Credential or certificate number'], ['verification_url','Verification URL'], ['delivery_mode','Delivery mode'], ['preview_image','Cover preview image path']].map(([field,label]) => `
            <div class="form-group"><label class="form-label" for="certificate-${idx}-${field}">${label}</label>
              <input id="certificate-${idx}-${field}" class="form-input item-field" data-idx="${idx}" data-field="${field}" value="${String(item[field] ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}" />
            </div>`).join('')}
          <p>Leave a field blank when the document does not state it. Details do not establish independent verification.</p>
        </fieldset>` : ''}
        <!-- Evidence Attachment Management -->
        <div style="background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-sm); padding: 1rem; margin-top: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong style="font-size: 0.78rem; font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-accent);">
              Attached Evidence Sleeves (${(item.evidence || []).length})
            </strong>
            <button class="btn btn-outline btn-sm btn-attach-evidence" data-idx="${idx}">+ Attach Evidence File</button>
          </div>

          ${(item.evidence && item.evidence.length > 0) ? `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${item.evidence.map((ev, evIdx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; background: var(--bg-surface-elevated); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">
                  <span><strong>${safe(ev.label)}</strong> <em class="text-muted">(${safe(ev.file || 'no file')})</em></span>
                  <button class="btn btn-outline btn-sm btn-del-evidence" data-item-idx="${idx}" data-ev-idx="${evIdx}" style="color: var(--color-danger); padding: 0.15rem 0.4rem; font-size: 0.7rem;">Remove</button>
                </div>
                ${selectedTabId === 'certificates' ? `<div class="form-group"><label class="form-label" for="preview-${idx}-${evIdx}">Preview image paths (one per line)</label><textarea id="preview-${idx}-${evIdx}" class="form-textarea preview-paths" data-item-idx="${idx}" data-ev-idx="${evIdx}">${safe((ev.preview_images || []).join('\n'))}</textarea></div>` : ''}
              `).join('')}
            </div>
          ` : `
            <span class="no-evidence-marker">No evidence attached yet</span>
          `}
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <div>
            <h3 style="font-size: 1.15rem; color: var(--text-primary);">Content Item Editor</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Editing items for section: <strong>${selectedTabId}</strong>
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <select id="select-active-tab" class="form-select" style="padding: 0.35rem 0.65rem; font-size: 0.85rem;">
              ${tabOptions}
            </select>
            <button id="btn-add-item" class="btn btn-primary btn-sm">+ New Item</button>
          </div>
        </div>

        <div class="content-items-list" style="margin-top: 1.5rem;">
          ${itemsHtml.length > 0 ? itemsHtml : `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted); border: 1px dashed var(--border-color); border-radius: var(--radius-sm);">
              This tab currently contains no structured items. Click "+ New Item" to create one.
            </div>
          `}
        </div>
        <details class="advanced-editor">
          <summary>Advanced: edit all section data</summary>
          <p>Edit the section data as JSON. This includes fields not shown in the item editor. Save a backup first.</p>
          <label class="form-label" for="raw-content">Section data</label>
          <textarea id="raw-content" class="form-textarea" rows="20">${safe(JSON.stringify(content, null, 2))}</textarea>
          <button id="save-raw-content" type="button" class="btn btn-secondary">Save section data</button>
          <p id="raw-content-status" role="status"></p>
        </details>
      </div>
    `;

    container.querySelector('#save-raw-content')?.addEventListener('click', async () => {
      try {
        const parsed = JSON.parse(container.querySelector('#raw-content').value);
        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error('Section data must be a JSON object.');
        store.content[selectedTabId] = parsed;
        await store.saveDraft(`content/${selectedTabId}.json`, parsed);
        renderEditor();
      } catch (err) { container.querySelector('#raw-content-status').textContent = 'Could not save: ' + err.message; }
    });

    // Tab Switcher
    container.querySelector('#select-active-tab')?.addEventListener('change', (e) => {
      selectedTabId = e.target.value;
      renderEditor();
    });

    // Add Item
    container.querySelector('#btn-add-item')?.addEventListener('click', async () => {
      const newItem = createDefaultItem(selectedTabId);
      if (!content.items) content.items = [];
      content.items.push(newItem);
      await store.saveDraft(`content/${selectedTabId}.json`, content);
      renderEditor();
    });

    // Field Edits
    container.querySelectorAll('.item-field').forEach(input => {
      input.addEventListener('change', async (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        const field = e.target.getAttribute('data-field');
        if (content.items[idx]) {
          content.items[idx][field] = field === 'hours' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value;
          await store.saveDraft(`content/${selectedTabId}.json`, content);
        }
      });
    });

    // Item Up/Down
    container.querySelectorAll('.btn-item-up').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx > 0) {
          const temp = content.items[idx];
          content.items[idx] = content.items[idx - 1];
          content.items[idx - 1] = temp;
          await store.saveDraft(`content/${selectedTabId}.json`, content);
          renderEditor();
        }
      });
    });

    container.querySelectorAll('.btn-item-down').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx < content.items.length - 1) {
          const temp = content.items[idx];
          content.items[idx] = content.items[idx + 1];
          content.items[idx + 1] = temp;
          await store.saveDraft(`content/${selectedTabId}.json`, content);
          renderEditor();
        }
      });
    });

    // Visibility & Featured
    container.querySelectorAll('.btn-item-vis').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (content.items[idx]) {
          content.items[idx].visibility = content.items[idx].visibility === 'hidden' ? 'public' : 'hidden';
          await store.saveDraft(`content/${selectedTabId}.json`, content);
          renderEditor();
        }
      });
    });

    container.querySelectorAll('.btn-item-feat').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (content.items[idx]) {
          content.items[idx].featured = !content.items[idx].featured;
          await store.saveDraft(`content/${selectedTabId}.json`, content);
          renderEditor();
        }
      });
    });

    // Duplicate
    container.querySelectorAll('.btn-item-dup').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (content.items[idx]) {
          const dup = JSON.parse(JSON.stringify(content.items[idx]));
          dup.id = `${selectedTabId}-${Date.now()}`;
          dup.title = `${dup.title} (Copy)`;
          content.items.splice(idx + 1, 0, dup);
          await store.saveDraft(`content/${selectedTabId}.json`, content);
          renderEditor();
        }
      });
    });

    // Delete
    container.querySelectorAll('.btn-item-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (confirm('Are you sure you want to delete this item?')) {
          content.items.splice(idx, 1);
          await store.saveDraft(`content/${selectedTabId}.json`, content);
          renderEditor();
        }
      });
    });

    // Attach Evidence Upload
    container.querySelectorAll('.btn-attach-evidence').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        promptEvidenceUpload(idx);
      });
    });

    // Remove Evidence
    container.querySelectorAll('.preview-paths').forEach(input => input.addEventListener('change', async e => {
      const itemIdx = Number(e.target.dataset.itemIdx), evIdx = Number(e.target.dataset.evIdx);
      content.items[itemIdx].evidence[evIdx].preview_images = e.target.value.split('\n').map(x => x.trim()).filter(Boolean);
      await store.saveDraft(`content/${selectedTabId}.json`, content);
    }));
    container.querySelectorAll('.btn-del-evidence').forEach(btn => {
      btn.addEventListener('click', async () => {
        const itemIdx = parseInt(btn.getAttribute('data-item-idx'), 10);
        const evIdx = parseInt(btn.getAttribute('data-ev-idx'), 10);
        if (content.items[itemIdx]?.evidence) {
          content.items[itemIdx].evidence.splice(evIdx, 1);
          await store.saveDraft(`content/${selectedTabId}.json`, content);
          renderEditor();
        }
      });
    });
  }

  function promptEvidenceUpload(itemIdx) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = selectedTabId === 'certificates' ? 'image/jpeg,image/png,image/webp' : 'image/*,.pdf,.svg';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (selectedTabId === 'certificates' && !['image/jpeg','image/png','image/webp'].includes(file.type)) {
        alert('For certificate previews, choose a JPG, PNG or WebP image.'); return;
      }

      const label = prompt('Enter a label for this evidence document (e.g. "Certificate Scan", "Approved MOV"):');
      if (!label) return;

      const context = prompt('Enter a required context sentence explaining this evidence:');
      if (!context) {
        alert('A context sentence is required for every evidence item.');
        return;
      }

      try {
        let filePath = `assets/docs/${file.name.toLowerCase().replace(/\s+/g, '-')}`;

        if (file.type.startsWith('image/')) {
          // Process WebP
          const processed = await processImageUpload(file);
          filePath = `assets/images/${file.name.split('.')[0].toLowerCase().replace(/\s+/g, '-')}.webp`;
          await store.saveDraft(filePath, processed.blob);
          alert(`Image compressed to WebP: ${formatBytes(processed.compressedSize)} (${processed.savingsPercent}% saved).`);
        } else {
          // PDF / Document
          const docValidation = validateDocumentUpload(file);
          if (!docValidation.valid) {
            alert(docValidation.error);
            return;
          }
          if (docValidation.warning) alert(docValidation.warning);
          await store.saveDraft(filePath, file);
        }

        const content = await store.getTabContent(selectedTabId);
        if (!content.items[itemIdx].evidence) content.items[itemIdx].evidence = [];
        content.items[itemIdx].evidence.push({
          label,
          file: filePath,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          preview_images: file.type.startsWith('image/') ? [filePath] : [],
          context
        });

        await store.saveDraft(`content/${selectedTabId}.json`, content);
        renderEditor();
      } catch (err) {
        alert(`Upload error: ${err.message}`);
      }
    };
    fileInput.click();
  }

  renderEditor();
}
