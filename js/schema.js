/**
 * Data Schemas & Validation Logic
 * Handles shared item schema, tab schema definitions, and migration functions.
 */

export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Shared item schema structure
 */
export function createDefaultItem(tabId) {
  return {
    id: `${tabId}-${Date.now()}`,
    title: "New Item Title",
    subtitle: "",
    organization: "",
    date_start: new Date().getFullYear().toString(),
    date_end: "Present",
    description: "",
    tags: [],
    evidence: [],
    links: [],
    visibility: "public",
    featured: false,
    order: 99
  };
}

/**
 * Validates site.json structure
 */
export function validateSiteConfig(config) {
  const errors = [];
  if (!config) {
    errors.push("Configuration object is missing.");
    return { valid: false, errors };
  }
  if (!config.identity || !config.identity.name) {
    errors.push("identity.name is required.");
  }
  if (!Array.isArray(config.tabs) || config.tabs.length === 0) {
    errors.push("At least one tab definition is required in tabs array.");
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Schema migration function for future schema upgrades
 */
export function migrateData(data, fromVersion, toVersion) {
  if (fromVersion === toVersion) return data;
  let migrated = JSON.parse(JSON.stringify(data));

  // Future migrations can be chained here:
  // if (fromVersion < 2) { ... }
  
  migrated.version = toVersion;
  return migrated;
}
