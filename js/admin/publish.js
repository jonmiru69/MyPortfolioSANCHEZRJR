import { store } from '../store.js';
import { github } from '../github.js';
import { cloud } from '../cloud.js';

export function renderPublish(container) {
  container.innerHTML = `
    <div class="admin-card">
      <h3>Sync portfolio across devices</h3>
      <p>Owner edits and photos save automatically to Cloudflare. Everyone sees the saved version without a GitHub token. Recovered device drafts need to be published once.</p>
      <p id="publish-status-box" role="status"></p>
      <p id="cloud-pending-count"></p>
      <div class="cloud-publish-actions">
        <button id="btn-execute-publish" class="btn btn-primary">Publish saved drafts to all devices</button>
        <button id="btn-discard-drafts" class="btn btn-secondary">Discard device drafts</button>
      </div>
    </div>`;
  const status = container.querySelector('#publish-status-box');
  const button = container.querySelector('#btn-execute-publish');
  const update = () => {
    if (!container.isConnected) return;
    status.textContent = store.cloudStatus || 'All changes saved online';
    container.querySelector('#cloud-pending-count').textContent = `${store.changedFiles.size} pending file(s) on this device.`;
    button.disabled = !store.changedFiles.size;
  };
  update();
  const unsubscribe = store.subscribe('cloud-status', () => {
    if (!container.isConnected) { unsubscribe(); return; }
    update();
  });
  button.addEventListener('click', async () => {
    if (!github.isAuthenticated()) { status.textContent = 'Connect owner access before publishing.'; return; }
    if (!cloud.url) { status.textContent = 'Cloud storage is not configured. Your drafts remain on this device.'; return; }
    button.disabled = true;
    try { await store.publishCloud(); }
    catch (error) { status.textContent = 'Not synced — ' + error.message; }
    update();
  });
  container.querySelector('#btn-discard-drafts').addEventListener('click', async () => {
    if (!confirm('Discard unpublished drafts on this device and reload the shared online portfolio?')) return;
    clearTimeout(store.cloudTimer);
    if (store.cloudSaving) { status.textContent = 'A save is in progress. Wait until it finishes before discarding drafts.'; return; }
    await store.clearDrafts();
    await store.setOwnerMode(false);
    await store.setOwnerMode(true);
    update();
  });
}
