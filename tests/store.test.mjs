import test from "node:test";
import assert from "node:assert/strict";
const storage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.sessionStorage = storage;
globalThis.localStorage = storage;
const { Store } = await import("../js/store.js");
const { cloud } = await import("../js/cloud.js");

function fakeDB(delay = 5, fail = false) {
  const data = new Map();
  let active = Promise.resolve();
  return {
    data,
    transaction() {
      const actions = [];
      const tx = {
        objectStore: () => ({
          put: (entry) => actions.push(() => data.set(entry.key, entry)),
          clear: () => actions.push(() => data.clear()),
        }),
      };
      active = active.then(
        () =>
          new Promise((resolve) =>
            setTimeout(() => {
              if (fail) tx.onerror?.();
              else {
                actions.forEach((f) => f());
                tx.oncomplete?.();
              }
              resolve();
            }, delay),
          ),
      );
      return tx;
    },
  };
}
test("batch saves retain both the record and file in the same transaction", async () => {
  const store = new Store();
  store.db = fakeDB();
  await store.saveDraftBatch([
    ["assets/a.pdf", new Blob(["%PDF-"])],
    ["content/certificates.json", { items: [{ title: "A" }] }],
  ]);
  assert.equal(store.db.data.size, 2);
  assert.equal(store.changedFiles.size, 2);
  assert.equal(store.draftVersion, 1);
});
test("a failed transaction does not report success or mutate the live draft", async () => {
  const store = new Store();
  store.db = fakeDB(1, true);
  await assert.rejects(
    () => store.saveDraftBatch([["content/a.json", { items: [] }]]),
    /storage/,
  );
  assert.equal(store.changedFiles.size, 0);
  assert.deepEqual(store.drafts, {});
});
test("a newer save queued during publishing survives draft cleanup", async () => {
  const store = new Store();
  store.db = fakeDB(20);
  store.site = { identity: { name: "Test" }, tabs: [] };
  store.published = { site: store.site, content: {} };
  store.loadDraft = async (key) => store.drafts[key] || null;
  await store.saveDraft("site.json", store.site);
  const previous = cloud.publish;
  cloud.publish = async () => {
    const newest = { identity: { name: "Newer edit" }, tabs: [] };
    // This transaction starts while the cloud response is in flight.
    void store.saveDraft("site.json", newest);
    return { site: store.site, content: {}, revision: 2 };
  };
  try {
    await store.publishCloud();
    await store.draftQueue;
    assert.equal(store.drafts["site.json"].identity.name, "Newer edit");
    assert.ok(store.changedFiles.has("site.json"));
    assert.ok(store.db.data.has("site.json"));
  } finally {
    cloud.publish = previous;
    clearTimeout(store.cloudTimer);
  }
});
test("a failed online save keeps drafts available for retry", async () => {
  const store = new Store();
  store.site = { identity: { name: "Test" }, tabs: [] };
  await store.saveDraft("site.json", store.site);
  const previous = cloud.publish;
  cloud.publish = async () => {
    throw new Error("Network unavailable");
  };
  try {
    await assert.rejects(() => store.publishCloud(), /Network unavailable/);
    assert.ok(store.changedFiles.has("site.json"));
    assert.equal(store.cloudNeedsReview, true);
    assert.match(store.cloudStatus, /Not synced/);
  } finally {
    cloud.publish = previous;
  }
});
