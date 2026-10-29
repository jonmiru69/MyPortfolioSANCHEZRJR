import { github } from "./github.js";

class CloudClient {
  constructor() {
    this.url = "";
  }
  async init() {
    try {
      const response = await fetch("data/cloud.json", { cache: "no-store" });
      if (response.ok)
        this.url = (await response.json()).api_url?.replace(/\/$/, "") || "";
    } catch {
      /* A static backup can still be viewed offline. */
    }
  }
  async request(path, options = {}) {
    const response = await fetch(this.url + path, {
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
      ...options,
    });
    const result = await response.json();
    if (!response.ok) {
      const error = new Error(
        result.error || `Cloud storage returned ${response.status}.`,
      );
      error.status = response.status;
      throw error;
    }
    return result;
  }
  snapshot() {
    return this.request("/snapshot");
  }
  async publish(bundle, assets, revision) {
    const headers = { Authorization: `Bearer ${github.token || ""}` };
    const replacements = new Map();
    for (const [path, blob] of assets) {
      try {
        const result = await this.request("/media", {
          method: "POST",
          headers: { ...headers, "Content-Type": blob.type },
          body: blob,
        });
        replacements.set(path, result.url);
      } catch (error) {
        if (error.status !== 415) throw error;
        // Older deployed workers only accept images/PDF. Keep supported Office uploads
        // usable during the worker upgrade, with an immutable GitHub document URL.
        const result = await github.publishChanges(
          { [path]: blob },
          "Upload portfolio document",
        );
        replacements.set(
          path,
          `https://raw.githubusercontent.com/${github.owner}/${github.repo}/${result.commitSha}/${path}`,
        );
      }
    }
    const replace = (value) => {
      if (typeof value === "string") return replacements.get(value) || value;
      if (Array.isArray(value)) return value.map(replace);
      if (value && typeof value === "object")
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, replace(v)]),
        );
      return value;
    };
    const document = replace({ site: bundle.site, content: bundle.content });
    const result = await this.request("/snapshot", {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ revision, document }),
    });
    return { ...document, ...result };
  }
}

export const cloud = new CloudClient();
