/**
 * Theme & Design Tokens Editor
 * Visual live color picker, tracking intensity, and font customizer.
 */

import { store } from '../store.js';

export function renderThemeEditor(container) {
  const theme = store.site?.theme || {};

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 style="font-size: 1.15rem; color: var(--text-primary);">Design Tokens &amp; Theme Customization</h3>
        <button id="btn-reset-theme" class="btn btn-outline btn-sm">Reset Defaults</button>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
        Changes here are applied immediately to the DOM and saved to your local draft.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
        <div class="form-group">
          <label class="form-label" for="theme-default-mode">Default Theme Mode</label>
          <select id="theme-default-mode" class="form-select">
            <option value="dark" ${theme.default_mode === 'dark' ? 'selected' : ''}>Dark Canvas (Default)</option>
            <option value="light" ${theme.default_mode === 'light' ? 'selected' : ''}>Light Paper</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="theme-color-accent">Primary Accent Color</label>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <input type="color" id="theme-color-accent" value="${theme.color_accent || '#3b8296'}" style="width: 42px; height: 38px; border: none; border-radius: var(--radius-sm); cursor: pointer;" />
            <input type="text" id="theme-color-accent-text" class="form-input text-mono" value="${theme.color_accent || '#3b8296'}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="theme-bg-canvas">Background Canvas Color</label>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <input type="color" id="theme-bg-canvas" value="${theme.bg_canvas || '#0a0b0d'}" style="width: 42px; height: 38px; border: none; border-radius: var(--radius-sm); cursor: pointer;" />
            <input type="text" id="theme-bg-canvas-text" class="form-input text-mono" value="${theme.bg_canvas || '#0a0b0d'}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="theme-tracking-display">Heading Tracking (0.2em - 0.5em)</label>
          <select id="theme-tracking-display" class="form-select">
            <option value="0.25em" ${theme.tracking_display === '0.25em' ? 'selected' : ''}>0.25em (Subtle)</option>
            <option value="0.35em" ${theme.tracking_display === '0.35em' || !theme.tracking_display ? 'selected' : ''}>0.35em (Standard atalanta.tech)</option>
            <option value="0.45em" ${theme.tracking_display === '0.45em' ? 'selected' : ''}>0.45em (Wide Signature)</option>
            <option value="0.55em" ${theme.tracking_display === '0.55em' ? 'selected' : ''}>0.55em (Extreme Spaced)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="theme-transition-speed">Page Turn Transition Speed</label>
          <select id="theme-transition-speed" class="form-select">
            <option value="0ms" ${theme.transition_speed === '0ms' ? 'selected' : ''}>Instant (0ms)</option>
            <option value="200ms" ${theme.transition_speed === '200ms' ? 'selected' : ''}>Snappy (200ms)</option>
            <option value="280ms" ${theme.transition_speed === '280ms' || !theme.transition_speed ? 'selected' : ''}>Natural (280ms)</option>
            <option value="400ms" ${theme.transition_speed === '400ms' ? 'selected' : ''}>Deliberate (400ms)</option>
          </select>
        </div>
      </div>
    </div>
  `;

  // Live Apply Logic
  const accentPicker = container.querySelector('#theme-color-accent');
  const accentText = container.querySelector('#theme-color-accent-text');
  const canvasPicker = container.querySelector('#theme-bg-canvas');
  const canvasText = container.querySelector('#theme-bg-canvas-text');
  const modeSelect = container.querySelector('#theme-default-mode');
  const trackingSelect = container.querySelector('#theme-tracking-display');
  const transitionSelect = container.querySelector('#theme-transition-speed');

  const updateTokens = async () => {
    const accent = accentPicker.value;
    const canvas = canvasPicker.value;
    const mode = modeSelect.value;
    const tracking = trackingSelect.value;
    const transition = transitionSelect.value;

    document.documentElement.style.setProperty('--color-accent', accent);
    document.documentElement.style.setProperty('--bg-canvas', canvas);
    document.documentElement.style.setProperty('--tracking-display', tracking);
    document.documentElement.style.setProperty('--transition-speed', transition);
    store.setTheme(mode);

    // Save to site draft
    store.site.theme = {
      default_mode: mode,
      color_accent: accent,
      bg_canvas: canvas,
      tracking_display: tracking,
      transition_speed: transition
    };
    await store.saveDraft('site.json', store.site);
  };

  accentPicker.addEventListener('input', (e) => {
    accentText.value = e.target.value;
    updateTokens();
  });
  accentText.addEventListener('input', (e) => {
    accentPicker.value = e.target.value;
    updateTokens();
  });

  canvasPicker.addEventListener('input', (e) => {
    canvasText.value = e.target.value;
    updateTokens();
  });
  canvasText.addEventListener('input', (e) => {
    canvasPicker.value = e.target.value;
    updateTokens();
  });

  modeSelect.addEventListener('change', updateTokens);
  trackingSelect.addEventListener('change', updateTokens);
  transitionSelect.addEventListener('change', updateTokens);
}
