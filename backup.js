/**
 * Backup, Portability & Storage Manager
 * Export full site JSON, Import validation, Reset to sample (typed confirmation), and storage meter.
 */

import { store } from '../store.js';
import { formatBytes, REPO_BUDGET_BYTES } from '../media.js';

export function renderBackup(container) {
  // Calculate approximate local draft storage
  let estimatedBytes = JSON.stringify(store.site || {}).length;
  for (const [k, v] of Object.entries(store.drafts)) {
    estimatedBytes += JSON.stringify(v).length;
  }

  const usedPercentage = Math.min(100, Math.max(1, (estimatedBytes / REPO_BUDGET_BYTES) * 100));

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 style="font-size: 1.15rem; color: var(--text-primary);">Site Portability &amp; Backups</h3>
      </div>

      <!-- Storage Meter -->
      <div class="storage-meter-box">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
          <strong style="color: var(--text-primary);">Estimated Storage Budget (GitHub Pages)</strong>
          <span style="font-family: var(--font-mono); color: var(--color-accent);">
            ${formatBytes(estimatedBytes)} / ${formatBytes(REPO_BUDGET_BYTES)} (${usedPercentage.toFixed(2)}%)
          </span>
        </div>
        <div class="storage-meter-bar">
          <div class="storage-meter-fill" style="width: ${usedPercentage}%;"></div>
        </div>
        <span style="font-size: 0.75rem; color: var(--text-muted);">
          Recommended GitHub repository limit is 1 GB; portfolio budget target is 300 MB.
        </span>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
        Export your complete portfolio configuration and content as a single portable JSON file for offline backup, migration, or external version control.
      </p>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
        <button id="btn-export-json" class="btn btn-primary">
          💾 Export Full Site as JSON
        </button>

        <label class="btn btn-secondary" style="cursor: pointer;">
          📥 Import Full Site JSON
          <input type="file" id="input-import-json" accept=".json" style="display: none;" />
        </label>
      </div>

      <!-- Reset Section -->
      <div style="border-top: 1px solid var(--border-color); padding-top: 1.5rem; margin-top: 1.5rem;">
        <h4 style="font-size: 0.95rem; color: var(--color-danger); margin-bottom: 0.4rem;">Reset to Default Sample Data</h4>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
          This will wipe all local drafts and restore the clean baseline educator template. Requires typing confirmation.
        </p>
        <button id="btn-reset-sample" class="btn btn-outline btn-sm" style="color: var(--color-danger); border-color: rgba(248, 113, 113, 0.4);">
          Reset to Sample Data...
        </button>
      </div>
    </div>
  `;

  // Export
  container.querySelector('#btn-export-json')?.addEventListener('click', async () => {
    const bundle = await store.exportFullSiteData();
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import
  container.querySelector('#input-import-json')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const bundle = JSON.parse(text);
      if (confirm('Import this portfolio backup? This will overwrite your current drafts.')) {
        await store.importFullSiteData(bundle);
        alert('Portfolio imported successfully! Review changes and publish when ready.');
        renderBackup(container);
      }
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    }
  });

  // Reset to sample
  container.querySelector('#btn-reset-sample')?.addEventListener('click', async () => {
    const word = prompt('To confirm reset to sample data, type the confirmation word "RESET":');
    if (word === 'RESET') {
      await store.clearDrafts();
      await store.loadSiteConfig();
      alert('Portfolio has been reset to default sample data.');
      window.location.reload();
    } else if (word !== null) {
      alert('Confirmation word did not match. Reset cancelled.');
    }
  });
}
