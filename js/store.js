/**
 * Central State Store & IndexedDB Draft Manager
 * Handles data fetching, client-side draft caching, autosave, and event dispatching.
 */

import { validateSiteConfig, CURRENT_SCHEMA_VERSION, migrateData } from './schema.js';

const DB_NAME = 'portfolio_binder_db';
const DB_VERSION = 1;
const DRAFT_STORE = 'drafts';

class Store {
  constructor() {
    this.site = null;
    this.content = {};
    this.drafts = {};
    this.changedFiles = new Set();
    this.activePreset = 'full';
    this.themeMode = 'dark';
    this.listeners = new Map();
    this.db = null;
    this.isDraftMode = false;
  }

  async init() {
    await this.initDB();
    await this.loadSiteConfig();
    await this.checkDrafts();
  }

  // --- IndexedDB Setup ---
  initDB() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to in-memory state.');
        return resolve(null);
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DRAFT_STORE)) {
          db.createObjectStore(DRAFT_STORE, { keyPath: 'key' });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = () => {
        console.warn('IndexedDB open error, using memory fallback.');
        resolve(null);
      };
    });
  }

  async saveDraft(key, data) {
    this.drafts[key] = data;
    this.changedFiles.add(key);
    this.emit('unsaved-changed', { count: this.changedFiles.size, changed: Array.from(this.changedFiles) });

    if (!this.db) return;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([DRAFT_STORE], 'readwrite');
        const store = tx.objectStore(DRAFT_STORE);
        store.put({ key, data, updatedAt: Date.now() });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  }

  async loadDraft(key) {
    if (!this.db) return this.drafts[key] || null;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([DRAFT_STORE], 'readonly');
        const store = tx.objectStore(DRAFT_STORE);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ? req.result.data : null);
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  }

  async clearDrafts() {
    this.drafts = {};
    this.changedFiles.clear();
    this.emit('unsaved-changed', { count: 0, changed: [] });

    if (!this.db) return;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([DRAFT_STORE], 'readwrite');
        const store = tx.objectStore(DRAFT_STORE);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  }

  async checkDrafts() {
    const siteDraft = await this.loadDraft('site.json');
    if (siteDraft) {
      this.site = siteDraft;
      this.isDraftMode = true;
      this.changedFiles.add('site.json');
    }
  }

  // --- Site & Content Fetching ---
  async loadSiteConfig() {
    try {
      const res = await fetch('data/site.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
      data = migrateData(data, data.version || 1, CURRENT_SCHEMA_VERSION);
      const validation = validateSiteConfig(data);
      if (!validation.valid) {
        console.error('Config validation errors:', validation.errors);
      }
      this.site = data;
      this.themeMode = data.theme?.default_mode || 'dark';
      this.emit('site-loaded', this.site);
    } catch (err) {
      console.error('Failed to load site.json:', err);
      // Fallback minimal configuration
      this.site = {
        version: 1,
        identity: { name: "Ramelito Jr. C. Sanchez", credentials: "LPT", title: "Educator" },
        theme: { default_mode: "dark" },
        tabs: [{ id: "cover", slug: "cover", label: "Cover", enabled: true, order: 1 }]
      };
    }
  }

  async getTabContent(tabId) {
    if (tabId === 'cover' || tabId === 'contents') {
      return { tabId, summary: this.getTabMeta(tabId)?.summary || '' };
    }

    const draftKey = `content/${tabId}.json`;
    if (this.drafts[draftKey]) {
      return this.drafts[draftKey];
    }
    const dbDraft = await this.loadDraft(draftKey);
    if (dbDraft) {
      this.drafts[draftKey] = dbDraft;
      return dbDraft;
    }

    if (this.content[tabId]) {
      return this.content[tabId];
    }

    try {
      const res = await fetch(`data/content/${tabId}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.content[tabId] = data;
      return data;
    } catch (err) {
      console.warn(`Tab content data/content/${tabId}.json not found or failed to parse.`);
      return { summary: "This section is currently being updated.", items: [] };
    }
  }

  getTabMeta(tabId) {
    if (!this.site || !this.site.tabs) return null;
    return this.site.tabs.find(t => t.id === tabId || t.slug === tabId);
  }

  getVisibleTabs() {
    if (!this.site || !this.site.tabs) return [];
    let tabs = this.site.tabs.filter(t => t.enabled !== false);

    // Apply active preset filter
    if (this.activePreset && this.site.presets) {
      const preset = this.site.presets.find(p => p.id === this.activePreset);
      if (preset && Array.isArray(preset.tabs)) {
        tabs = tabs.filter(t => preset.tabs.includes(t.id));
      }
    }

    return tabs.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  setPreset(presetId) {
    this.activePreset = presetId;
    this.emit('preset-changed', presetId);
  }

  setTheme(mode) {
    this.themeMode = mode;
    document.documentElement.setAttribute('data-theme', mode);
    this.emit('theme-changed', mode);
  }

  toggleTheme() {
    const next = this.themeMode === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  // --- Event Emitter ---
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const cb of this.listeners.get(event)) {
        try { cb(data); } catch (e) { console.error(e); }
      }
    }
  }

  // --- Full Site Export / Import ---
  async exportFullSiteData() {
    const bundle = {
      exported_at: new Date().toISOString(),
      version: CURRENT_SCHEMA_VERSION,
      site: this.site,
      content: {}
    };

    if (this.site && this.site.tabs) {
      for (const tab of this.site.tabs) {
        if (tab.id !== 'cover' && tab.id !== 'contents') {
          bundle.content[tab.id] = await this.getTabContent(tab.id);
        }
      }
    }
    return bundle;
  }

  async importFullSiteData(bundle) {
    if (!bundle || !bundle.site) {
      throw new Error("Invalid import package: missing site configuration.");
    }
    this.site = bundle.site;
    await this.saveDraft('site.json', this.site);

    if (bundle.content) {
      for (const [tabId, data] of Object.entries(bundle.content)) {
        this.content[tabId] = data;
        await this.saveDraft(`content/${tabId}.json`, data);
      }
    }
    this.emit('site-loaded', this.site);
  }
}

export const store = new Store();
