/**
 * Publish Dialog & Git Data API Publisher
 * Displays changed files diff, commit message input, progress states, and single-commit execution.
 */

import { store } from '../store.js';
import { github } from '../github.js';

export function renderPublish(container) {
  const changedFiles = Array.from(store.changedFiles);

  const changedListHtml = changedFiles.map(file => `
    <li style="display: flex; justify-content: space-between; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.82rem;">
      <span style="color: var(--color-accent);">${file}</span>
      <span class="chip chip-accent" style="font-size: 0.7rem;">Modified Draft</span>
    </li>
  `).join('');

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 style="font-size: 1.15rem; color: var(--text-primary);">Publish to GitHub Pages</h3>
        <span class="chip ${changedFiles.length > 0 ? 'chip-accent' : ''}">
          ${changedFiles.length} Changed File(s)
        </span>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
        All modifications in IndexedDB are published in <strong>a single unified Git commit</strong> directly via GitHub's Git Data API, preventing build spikes and protecting Pages limits.
      </p>

      ${changedFiles.length > 0 ? `
        <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 1.5rem; max-height: 220px; overflow-y: auto;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${changedListHtml}
          </ul>
        </div>

        <div class="form-group">
          <label class="form-label" for="publish-commit-msg">Commit Message</label>
          <input 
            type="text" 
            id="publish-commit-msg" 
            class="form-input" 
            value="Update portfolio content &amp; evidence (${new Date().toLocaleDateString()})" 
          />
        </div>

        <div id="publish-status-box" style="display: none; padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-family: var(--font-mono); font-size: 0.85rem;"></div>

        <div style="display: flex; gap: 0.75rem;">
          <button id="btn-execute-publish" class="btn btn-primary" style="padding: 0.75rem 1.5rem;">
            🚀 Publish 1-Commit Now
          </button>
          <button id="btn-discard-drafts" class="btn btn-outline" style="color: var(--color-danger); border-color: rgba(248, 113, 113, 0.3);">
            Discard All Drafts
          </button>
        </div>
      ` : `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted); border: 1px dashed var(--border-color); border-radius: var(--radius-sm);">
          ✓ All files are up to date with no pending drafts.
        </div>
      `}
    </div>
  `;

  const btnPublish = container.querySelector('#btn-execute-publish');
  const btnDiscard = container.querySelector('#btn-discard-drafts');
  const statusBox = container.querySelector('#publish-status-box');

  btnDiscard?.addEventListener('click', async () => {
    if (confirm('Discard all local drafts and reload published site data?')) {
      await store.clearDrafts();
      await store.loadSiteConfig();
      renderPublish(container);
    }
  });

  btnPublish?.addEventListener('click', async () => {
    if (!github.isAuthenticated()) {
      alert('GitHub token and repository are not connected. Please connect in the GitHub Connection section first.');
      return;
    }

    const msgInput = container.querySelector('#publish-commit-msg');
    const commitMsg = msgInput ? msgInput.value : 'Update portfolio';

    btnPublish.disabled = true;
    statusBox.style.display = 'block';
    statusBox.style.background = 'var(--bg-surface-elevated)';
    statusBox.style.border = '1px solid var(--border-color)';
    statusBox.textContent = 'Preparing files for single-commit publish...';

    // Build changed map
    const changedFilesMap = {};
    for (const key of changedFiles) {
      if (key === 'site.json') {
        changedFilesMap['data/site.json'] = store.site;
      } else if (key.startsWith('content/')) {
        changedFilesMap[`data/${key}`] = store.drafts[key] || await store.loadDraft(key);
      } else {
        changedFilesMap[key] = store.drafts[key] || await store.loadDraft(key);
      }
    }

    try {
      const result = await github.publishChanges(changedFilesMap, commitMsg, (progress) => {
        statusBox.textContent = `[${progress.step.toUpperCase()}] ${progress.message}`;
      });

      statusBox.style.background = 'rgba(52, 211, 153, 0.1)';
      statusBox.style.border = '1px solid var(--color-success)';
      statusBox.innerHTML = `
        ✓ <strong>Published Successfully!</strong><br />
        Commit SHA: <code>${result.commitSha.substring(0, 7)}</code><br />
        <a href="${result.commitUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--color-accent); text-decoration: underline;">
          View Commit on GitHub →
        </a>
      `;

      // Clear published drafts
      await store.clearDrafts();
    } catch (err) {
      statusBox.style.background = 'rgba(248, 113, 113, 0.1)';
      statusBox.style.border = '1px solid var(--color-danger)';
      statusBox.textContent = `Publish failed: ${err.message}`;
      btnPublish.disabled = false;
    }
  });
}
