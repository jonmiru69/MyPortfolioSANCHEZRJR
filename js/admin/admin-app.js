/**
 * Master Admin Panel Controller
 * Handles GitHub PAT connection, safety notices, sub-navigation tabs, and unsaved changes banner.
 */

import { store } from '../store.js';
import { router } from '../router.js';
import { github } from '../github.js';
import { renderTabEditor } from './tab-editor.js';
import { renderContentEditor } from './content-editor.js';
import { renderThemeEditor } from './theme-editor.js';
import { renderSiteEditor } from './site-editor.js';
import { renderPublish } from './publish.js';
import { renderBackup } from './backup.js';

export async function renderAdmin(container) {
  if (github.isAuthenticated() && !store.isDraftMode) {
    const access = await github.testConnection();
    if (access.ok) await store.setOwnerMode(true);
  }
  let activeSubTab = 'connection';

  function renderView() {
    const isAuthed = github.isAuthenticated();
    const changedCount = store.changedFiles.size;

    container.innerHTML = `
      <div class="admin-panel">
        <div class="admin-header">
          <div class="admin-title-group">
            <span class="signature-heading">OWNER ADMINISTRATION</span>
            <h2>Portfolio Control Panel</h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0;">
              Portfolio content and photos sync through Cloudflare D1. The GitHub token verifies owner access.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div class="admin-status-badge">
              <span class="status-dot ${isAuthed ? 'connected' : 'disconnected'}"></span>
              <span>${isAuthed ? 'GitHub Connected' : 'Not Connected'}</span>
            </div>
            <button id="btn-view-public" class="btn btn-secondary btn-sm">
              ← Return to Binder
            </button>
          </div>
        </div>

        <!-- Persistent Safety Notice Banner -->
        <div class="admin-safety-notice">
          <span style="font-size: 1.4rem;">⚠️</span>
          <div>
            <strong>DATA PRIVACY &amp; REPOSITORY SAFETY NOTICE:</strong>
            <p style="margin: 0.25rem 0 0; font-size: 0.82rem; color: inherit; line-height: 1.5;">
              Anything committed to a public GitHub repository is permanently public on the web, even if marked "Hidden" in the UI. 
              <strong>Never upload government IDs, unmasked license numbers, birth certificates, home addresses, or private student academic/disciplinary records.</strong>
            </p>
          </div>
        </div>

        <!-- Admin Sub-Navigation -->
        <nav class="admin-nav" role="tablist">
          <button class="admin-nav-btn ${activeSubTab === 'connection' ? 'active' : ''}" data-subtab="connection">1. GitHub Connection</button>
          <button class="admin-nav-btn ${activeSubTab === 'tabs' ? 'active' : ''}" data-subtab="tabs">2. Tabs Manager</button>
          <button class="admin-nav-btn ${activeSubTab === 'content' ? 'active' : ''}" data-subtab="content">3. Content Items</button>
          <button class="admin-nav-btn ${activeSubTab === 'theme' ? 'active' : ''}" data-subtab="theme">4. Theme &amp; Tokens</button>
          <button class="admin-nav-btn ${activeSubTab === 'identity' ? 'active' : ''}" data-subtab="identity">5. Identity &amp; SEO</button>
          <button class="admin-nav-btn ${activeSubTab === 'publish' ? 'active' : ''}" data-subtab="publish">
            6. Publish ${changedCount > 0 ? `(${changedCount})` : ''}
          </button>
          <button class="admin-nav-btn ${activeSubTab === 'backup' ? 'active' : ''}" data-subtab="backup">7. Backup &amp; Storage</button>
        </nav>

        <!-- Dynamic Admin Content Pane -->
        <div id="admin-subview-container"></div>

        <!-- Unsaved Changes Bar -->
        ${changedCount > 0 ? `
          <div class="admin-unsaved-bar">
            <div>
              <strong style="color: var(--color-warning);">⚡ You have ${changedCount} pending change(s) in local draft.</strong>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Changes sync online automatically. Recovered drafts and failed saves remain on this device until you publish successfully.</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button id="btn-shortcut-preview" class="btn btn-secondary btn-sm">Preview Public Site</button>
              <button id="btn-shortcut-publish" class="btn btn-primary btn-sm">Review &amp; Publish →</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Subtab Click Handler
    container.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!store.isDraftMode && btn.getAttribute('data-subtab') !== 'connection') return;
        activeSubTab = btn.getAttribute('data-subtab');
        renderView();
      });
    });

    // Header & Shortcut Handlers
    container.querySelector('#btn-view-public')?.addEventListener('click', () => {
      router.navigate('cover');
    });

    container.querySelector('#btn-shortcut-preview')?.addEventListener('click', () => {
      router.navigate('cover');
    });

    container.querySelector('#btn-shortcut-publish')?.addEventListener('click', () => {
      activeSubTab = 'publish';
      renderView();
    });

    // Render Subview
    const subContainer = container.querySelector('#admin-subview-container');
    if (!subContainer) return;

    if (activeSubTab === 'connection') {
      renderConnectionTab(subContainer);
    } else if (activeSubTab === 'tabs') {
      renderTabEditor(subContainer);
    } else if (activeSubTab === 'content') {
      renderContentEditor(subContainer);
    } else if (activeSubTab === 'theme') {
      renderThemeEditor(subContainer);
    } else if (activeSubTab === 'identity') {
      renderSiteEditor(subContainer);
    } else if (activeSubTab === 'publish') {
      renderPublish(subContainer);
    } else if (activeSubTab === 'backup') {
      renderBackup(subContainer);
    }
  }

  function renderConnectionTab(subContainer) {
    const isAuthed = github.isAuthenticated();

    subContainer.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 style="font-size: 1.15rem; color: var(--text-primary);">GitHub Repository &amp; PAT Connection</h3>
          ${isAuthed ? '<button id="btn-disconnect-gh" class="btn btn-outline btn-sm" style="color: var(--color-danger);">Disconnect</button>' : ''}
        </div>

        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          To verify owner access for Cloudflare saves, provide a <strong>Fine-Grained Personal Access Token (PAT)</strong> scoped specifically to this repository with <code>Contents: Read and write</code> permission.
        </p>

        <form id="gh-auth-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label class="form-label" for="gh-owner">Repository Owner (Username)</label>
              <input type="text" id="gh-owner" class="form-input" value="${github.owner}" required placeholder="e.g. jonmiru" />
            </div>

            <div class="form-group">
              <label class="form-label" for="gh-repo">Repository Name</label>
              <input type="text" id="gh-repo" class="form-input" value="${github.repo}" required placeholder="e.g. portfolio-binder" />
            </div>

            <div class="form-group">
              <label class="form-label" for="gh-branch">Branch</label>
              <input type="text" id="gh-branch" class="form-input" value="${github.branch || 'main'}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="gh-token">GitHub Personal Access Token (PAT)</label>
            <input 
              type="password" 
              id="gh-token" 
              class="form-input" 
              value="${github.token || ''}" 
              required 
              placeholder="github_pat_11..." 
            />
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.35rem;">
              Your token is sent securely to the portfolio’s Cloudflare API and GitHub to verify owner access. It is never stored in the database.
            </span>
          </div>

          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="gh-remember" ${github.remember ? 'checked' : ''} />
              <span>Remember token on this device (stores in localStorage; leave unchecked on shared/school computers)</span>
            </label>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <button type="submit" class="btn btn-primary">
              ${isAuthed ? 'Update &amp; Test Connection' : 'Save &amp; Test Connection'}
            </button>
          </div>
        </form>

        <div id="gh-test-result" style="display: none; margin-top: 1.25rem; padding: 1rem; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.82rem;"></div>
      </div>
    `;

    // Handle Auth Form
    const authForm = subContainer.querySelector('#gh-auth-form');
    const resultBox = subContainer.querySelector('#gh-test-result');

    authForm?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const owner = subContainer.querySelector('#gh-owner').value;
      const repo = subContainer.querySelector('#gh-repo').value;
      const branch = subContainer.querySelector('#gh-branch').value;
      const token = subContainer.querySelector('#gh-token').value;
      const remember = subContainer.querySelector('#gh-remember').checked;

      github.setCredentials(token, owner, repo, branch, remember);

      resultBox.style.display = 'block';
      resultBox.style.background = 'var(--bg-surface)';
      resultBox.style.border = '1px solid var(--border-color)';
      resultBox.textContent = 'Verifying credentials with GitHub REST API...';

      const test = await github.testConnection();
      if (test.ok) {
        await store.setOwnerMode(true);
        resultBox.style.background = 'rgba(52, 211, 153, 0.1)';
        resultBox.style.border = '1px solid var(--color-success)';
        resultBox.innerHTML = `✓ <strong>Connected!</strong> Repository <code>${test.repoName}</code> found with push permissions. Ready to publish.`;
      } else {
        resultBox.style.background = 'rgba(248, 113, 113, 0.1)';
        resultBox.style.border = '1px solid var(--color-danger)';
        resultBox.innerHTML = `✕ <strong>Connection Failed:</strong> ${test.error}`;
      }
    });

    subContainer.querySelector('#btn-disconnect-gh')?.addEventListener('click', async () => {
      if (confirm('Disconnect GitHub credentials from this session?')) {
        github.disconnect();
        await store.setOwnerMode(false);
        renderView();
      }
    });
  }

  // Subscribe to changes
  store.subscribe('unsaved-changed', ({ count }) => {
    const publish = container.querySelector('[data-subtab="publish"]');
    if (publish) publish.textContent = `6. Publish${count ? ` (${count})` : ''}`;
  });

  renderView();
}
