/**
 * Central State Store & IndexedDB Draft Manager
 * Handles data fetching, client-side draft caching, autosave, and event dispatching.
 */

import { cloud } from "./cloud.js";
import { releaseMigration } from "./release.js";
import {
  validateSiteConfig,
  CURRENT_SCHEMA_VERSION,
  migrateData,
} from "./schema.js";

const DB_NAME = "portfolio_binder_db";
const DB_VERSION = 1;
const DRAFT_STORE = "drafts";

export class Store {
  constructor() {
    this.site = null;
    this.content = {};
    this.drafts = {};
    this.changedFiles = new Set();
    this.activePreset = "full";
    this.themeMode = "dark";
    this.listeners = new Map();
    this.db = null;
    this.isDraftMode = false;
    this.published = null;
    this.revision = 0;
    this.draftVersion = 0;
    this.cloudTimer = null;
    this.cloudSaving = null;
    this.cloudNeedsReview = false;
    this.cloudStatus = "";
    this.draftQueue = Promise.resolve();
  }

  async init() {
    await this.initDB();
    await this.loadSiteConfig();
    this.migratePublished = await releaseMigration(this.site);
    await cloud.init();
    if (cloud.url) {
      try {
        this.acceptPublished(await cloud.snapshot());
      } catch {
        this.cloudStatus =
          "Cloud unavailable — showing the last published website backup.";
      }
    }
    if (!this.published)
      this.published = { site: structuredClone(this.site), content: {} };
    const refresh = async () => {
      if (!cloud.url || this.isDraftMode || document.hidden) return;
      try {
        const snapshot = await cloud.snapshot();
        if (snapshot.revision !== this.revision) {
          this.acceptPublished(snapshot);
          this.emit("published-updated", snapshot);
        }
      } catch {
        /* Keep the current published view during a temporary outage. */
      }
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    setInterval(refresh, 30000);
  }

  // --- IndexedDB Setup ---
  initDB() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn(
          "IndexedDB not supported, falling back to in-memory state.",
        );
        return resolve(null);
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DRAFT_STORE)) {
          db.createObjectStore(DRAFT_STORE, { keyPath: "key" });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = () => {
        console.warn("IndexedDB open error, using memory fallback.");
        resolve(null);
      };
    });
  }

  async saveDraft(key, data) {
    return this.saveDraftBatch([[key, data]]);
  }

  async saveDraftBatch(entries) {
    return this.withDraftLock(async () => {
      // Files and their record commit together before autosync starts.
      if (this.db)
        await new Promise((resolve, reject) => {
          const tx = this.db.transaction([DRAFT_STORE], "readwrite");
          for (const [key, data] of entries)
            tx.objectStore(DRAFT_STORE).put({
              key,
              data,
              updatedAt: Date.now(),
            });
          tx.oncomplete = resolve;
          tx.onabort = tx.onerror = () =>
            reject(
              new Error(
                "Device storage is full or unavailable. Your changes are still open in the editor.",
              ),
            );
        });
      for (const [key, data] of entries) {
        this.drafts[key] = data;
        this.changedFiles.add(key);
      }
      this.draftVersion++;
      this.emit("unsaved-changed", {
        count: this.changedFiles.size,
        changed: [...this.changedFiles],
      });
      if (this.isDraftMode && cloud.url) this.scheduleCloudSave();
      else
        this.setCloudStatus("Saved on this device — publish to share changes.");
    });
  }

  withDraftLock(operation) {
    const next = this.draftQueue.then(operation, operation);
    this.draftQueue = next.catch(() => {});
    return next;
  }

  async loadDraft(key) {
    if (!this.isDraftMode && !key.startsWith("content/") && key !== "site.json")
      return null;
    if (!this.db) return this.drafts[key] || null;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([DRAFT_STORE], "readonly");
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
    return this.withDraftLock(() => this.clearDraftEntries());
  }

  async clearDraftEntries() {
    if (this.db)
      await new Promise((resolve, reject) => {
        const tx = this.db.transaction([DRAFT_STORE], "readwrite");
        tx.objectStore(DRAFT_STORE).clear();
        tx.oncomplete = resolve;
        tx.onabort = tx.onerror = () =>
          reject(new Error("Could not clear saved device drafts."));
      });
    this.drafts = {};
    this.changedFiles.clear();
    this.emit("unsaved-changed", { count: 0, changed: [] });
  }

  acceptPublished(snapshot) {
    snapshot = this.migratePublished
      ? this.migratePublished(snapshot)
      : snapshot;
    this.published = structuredClone(snapshot);
    this.revision = snapshot.revision || 0;
    this.site = structuredClone(snapshot.site);
    this.content = structuredClone(snapshot.content || {});
  }

  async readDraftEntries() {
    if (!this.db)
      return Object.entries(this.drafts).map(([key, data]) => ({ key, data }));
    return new Promise((resolve) => {
      const request = this.db
        .transaction([DRAFT_STORE], "readonly")
        .objectStore(DRAFT_STORE)
        .getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  async setOwnerMode(enabled) {
    clearTimeout(this.cloudTimer);
    this.isDraftMode = enabled;
    if (!enabled) {
      if (cloud.url) {
        try {
          this.acceptPublished(await cloud.snapshot());
        } catch {
          this.acceptPublished(this.published);
        }
      } else this.acceptPublished(this.published);
      return;
    }
    const entries = await this.readDraftEntries();
    for (const { key, data } of entries) {
      this.drafts[key] = data;
      this.changedFiles.add(key);
      if (key === "site.json") this.site = structuredClone(data);
      if (key.startsWith("content/"))
        this.content[key.slice(8, -5)] = structuredClone(data);
    }
    if (entries.length) {
      this.cloudNeedsReview = true;
      this.setCloudStatus(
        "Recovered device drafts — review and publish to sync them.",
      );
    } else
      this.setCloudStatus(
        cloud.url ? "All changes saved online" : "Local drafts",
      );
  }

  setCloudStatus(message) {
    this.cloudStatus = message;
    this.emit("cloud-status", message);
  }

  scheduleCloudSave() {
    clearTimeout(this.cloudTimer);
    if (this.cloudNeedsReview) return;
    this.setCloudStatus("Saving changes online…");
    this.cloudTimer = setTimeout(
      () => this.publishCloud().catch(() => {}),
      1200,
    );
  }

  async publishCloud() {
    clearTimeout(this.cloudTimer);
    if (this.cloudSaving) return this.cloudSaving;
    if (!this.changedFiles.size) return;
    this.cloudNeedsReview = false;
    this.cloudSaving = (async () => {
      const generation = this.draftVersion;
      this.setCloudStatus("Saving changes online…");
      try {
        const bundle = structuredClone(await this.exportFullSiteData());
        const referenced = new Set();
        const collect = (value) => {
          if (typeof value === "string") referenced.add(value);
          else if (value && typeof value === "object")
            Object.values(value).forEach(collect);
        };
        collect(bundle);
        const assets = [];
        for (const key of this.changedFiles) {
          const data = await this.loadDraft(key);
          if (data instanceof Blob && referenced.has(key))
            assets.push([key, data]);
        }
        const snapshot = await cloud.publish(bundle, assets, this.revision);
        this.published = structuredClone(snapshot);
        this.revision = snapshot.revision;
        if (generation === this.draftVersion) {
          const cleared = await this.withDraftLock(async () => {
            if (generation !== this.draftVersion) return false;
            await this.clearDraftEntries();
            this.site = structuredClone(snapshot.site);
            this.content = structuredClone(snapshot.content);
            return true;
          });
          if (cleared && generation === this.draftVersion)
            this.setCloudStatus("All changes saved online");
          else this.scheduleCloudSave();
        } else this.scheduleCloudSave();
        this.emit("cloud-saved", snapshot);
        return snapshot;
      } catch (error) {
        this.cloudNeedsReview = true;
        this.setCloudStatus("Not synced — " + error.message);
        throw error;
      }
    })();
    try {
      return await this.cloudSaving;
    } finally {
      this.cloudSaving = null;
    }
  }

  // --- Site & Content Fetching ---
  async loadSiteConfig() {
    try {
      const res = await fetch("data/site.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
      data = migrateData(data, data.version || 1, CURRENT_SCHEMA_VERSION);
      const validation = validateSiteConfig(data);
      if (!validation.valid) {
        console.error("Config validation errors:", validation.errors);
      }
      this.site = data;
      this.themeMode = data.theme?.default_mode || "dark";
      this.emit("site-loaded", this.site);
    } catch (err) {
      console.error("Failed to load site.json:", err);
      // Fallback minimal configuration
      this.site = {
        version: 1,
        identity: { name: "Portfolio owner", credentials: "", title: "" },
        theme: { default_mode: "dark" },
        tabs: [
          {
            id: "cover",
            slug: "cover",
            label: "Cover",
            enabled: true,
            order: 1,
          },
        ],
      };
    }
  }

  async getTabContent(tabId) {
    if (tabId === "cover" || tabId === "contents") {
      return { tabId, summary: this.getTabMeta(tabId)?.summary || "" };
    }

    const draftKey = `content/${tabId}.json`;
    if (this.isDraftMode && this.drafts[draftKey]) {
      return this.drafts[draftKey];
    }
    const dbDraft = this.isDraftMode ? await this.loadDraft(draftKey) : null;
    if (dbDraft) {
      this.drafts[draftKey] = dbDraft;
      return dbDraft;
    }

    if (this.content[tabId]) {
      return this.content[tabId];
    }

    try {
      const res = await fetch(`data/content/${tabId}.json`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.content[tabId] = data;
      return data;
    } catch (err) {
      console.warn(
        `Tab content data/content/${tabId}.json not found or failed to parse.`,
      );
      return { summary: "This section is currently being updated.", items: [] };
    }
  }

  getTabMeta(tabId) {
    if (!this.site || !this.site.tabs) return null;
    return this.site.tabs.find((t) => t.id === tabId || t.slug === tabId);
  }

  getVisibleTabs() {
    if (!this.site || !this.site.tabs) return [];
    let tabs = this.site.tabs.filter((t) => t.enabled !== false);

    // Apply active preset filter
    if (this.activePreset && this.site.presets) {
      const preset = this.site.presets.find((p) => p.id === this.activePreset);
      if (preset && Array.isArray(preset.tabs)) {
        tabs = tabs.filter((t) => preset.tabs.includes(t.id));
      }
    }

    return tabs.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  setPreset(presetId) {
    this.activePreset = presetId;
    this.emit("preset-changed", presetId);
  }

  setTheme(mode) {
    this.themeMode = mode;
    document.documentElement.setAttribute("data-theme", mode);
    this.emit("theme-changed", mode);
  }

  toggleTheme() {
    const next = this.themeMode === "dark" ? "light" : "dark";
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
        try {
          cb(data);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  // --- Full Site Export / Import ---
  async exportFullSiteData() {
    const bundle = {
      exported_at: new Date().toISOString(),
      version: CURRENT_SCHEMA_VERSION,
      site: this.site,
      content: {},
    };

    if (this.site && this.site.tabs) {
      for (const tab of this.site.tabs) {
        if (tab.id !== "cover" && tab.id !== "contents") {
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
    await this.saveDraft("site.json", this.site);

    if (bundle.content) {
      for (const [tabId, data] of Object.entries(bundle.content)) {
        this.content[tabId] = data;
        await this.saveDraft(`content/${tabId}.json`, data);
      }
    }
    this.emit("site-loaded", this.site);
  }
}

export const store = new Store();
