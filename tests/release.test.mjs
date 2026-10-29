import test from "node:test";
import assert from "node:assert/strict";
import { releaseMigration } from "../js/release.js";
test("legacy cloud content gains the supplied resume and missing certificate without overwriting owner edits", async () => {
  const previous = globalThis.fetch;
  const fixtures = {
    certificates: {
      items: [
        {
          id: "existing",
          seminar_topic: "Original topic",
          training_code: "CODE",
          cpd_points: 0,
        },
        { id: "certificate-22", title: "New certificate" },
      ],
    },
    resume: { summary: "Supplied resume", document: { file: "resume.png" } },
    research: { items: [{ id: "research-new" }] },
  };
  globalThis.fetch = async (path) =>
    Response.json(fixtures[path.match(/([^/]+)\.json$/)[1]]);
  try {
    const migrate = await releaseMigration({ content_release: "test-release" });
    const old = {
      site: {
        tabs: [
          { id: "resume", enabled: false },
          { id: "research", enabled: false },
        ],
      },
      content: {
        certificates: {
          items: [
            {
              id: "existing",
              title: "Owner title",
              seminar_topic: "Owner topic",
            },
          ],
        },
      },
    };
    const migrated = migrate(old);
    assert.equal(migrated.content.certificates.items[0].title, "Owner title");
    assert.equal(
      migrated.content.certificates.items[0].seminar_topic,
      "Owner topic",
    );
    assert.equal(migrated.content.certificates.items[0].training_code, "CODE");
    assert.equal(migrated.content.certificates.items.length, 2);
    assert.equal(migrated.content.resume.document.file, "resume.png");
    assert.equal(migrated.site.tabs[0].enabled, true);
    assert.equal(old.content.certificates.items.length, 1);
    assert.deepEqual(migrate(migrated), migrated);
  } finally {
    globalThis.fetch = previous;
  }
});
