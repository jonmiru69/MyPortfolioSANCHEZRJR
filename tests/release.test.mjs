import test from "node:test";
import assert from "node:assert/strict";
import { releaseMigration, reconcileCertificates } from "../js/release.js";
test("legacy cloud content gains the supplied resume and missing certificate without overwriting owner edits", async () => {
  const previous = globalThis.fetch;
  const fixtures = {
    certificates: {
      items: [
        {
          id: "existing",
          title: "OWNER TITLE",
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

test("a reused certificate ID cannot attach another seminar's details or duplicate an existing upload", () => {
  const source = [
    {
      id: "certificate-1",
      title: "AI learning modules",
      issue_date: "2026-05-23",
      seminar_topic: "AI fundamentals",
    },
    {
      id: "certificate-22",
      title: "Harnessing Technology",
      issue_date: "2026-10-24",
      seminar_topic: "Technology in education",
      evidence: [{ file: "assets/docs/harnessing.pdf" }],
    },
  ];
  const cloud = [
    {
      id: "certificate-1",
      title: "HARNESSING TECHNOLOGY",
      issue_date: "2026-10-24",
      seminar_topic: null,
      evidence: [{ file: "https://api.example/media/abc" }],
    },
  ];
  const result = reconcileCertificates(cloud, source);
  assert.equal(result.length, 2);
  assert.equal(result[0].seminar_topic, "Technology in education");
  assert.equal(result[0].evidence[0].file, cloud[0].evidence[0].file);
  assert.equal(result[1].id, "imported-certificate-1");
  assert.equal(
    result.filter(
      (item) => item.title.toLowerCase() === "harnessing technology",
    ).length,
    1,
  );
  assert.equal(cloud[0].seminar_topic, null);
});

test("only empty legacy placeholders are removed; owner-entered details are retained", () => {
  const cloud = [
    { id: "empty", title: "New Item Title", description: "", evidence: [] },
    {
      id: "with-file",
      title: "New Item Title",
      evidence: [{ file: "owner.pdf" }],
    },
    {
      id: "with-notes",
      title: "New Item Title",
      description: "A record I am completing",
      evidence: [],
    },
  ];
  assert.deepEqual(
    reconcileCertificates(cloud, []).map((i) => i.id),
    ["with-file", "with-notes"],
  );
});

test("a known imported duplicate is reconciled with the owner's original record", () => {
  const source = [
    {
      id: "certificate-22",
      title: "Harnessing Technology",
      issue_date: "2026-10-24",
      evidence: [{ file: "assets/docs/harnessing.pdf" }],
    },
  ];
  const result = reconcileCertificates(
    [
      {
        id: "owner-upload",
        title: "HARNESSING TECHNOLOGY",
        issue_date: "2026-10-24",
        evidence: [{ file: "owner.pdf" }],
      },
      source[0],
    ],
    source,
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "owner-upload");
});
