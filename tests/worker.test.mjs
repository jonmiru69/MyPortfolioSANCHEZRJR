import test from "node:test";
import assert from "node:assert/strict";
import worker from "../cloudflare/worker.js";
import { FILE_TYPES } from "../js/upload-policy.js";
const origin = "https://jonmiru69.github.io";
const env = { PUBLIC_ORIGIN: origin };
test("preflight permits the portfolio origin and upload headers", async () => {
  const res = await worker.fetch(
    new Request("https://api.example/media", {
      method: "OPTIONS",
      headers: { Origin: origin },
    }),
    env,
  );
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), origin);
});
test("rejects untrusted origins and unauthenticated writes", async () => {
  const forbidden = await worker.fetch(
    new Request("https://api.example/media", {
      method: "POST",
      headers: { Origin: "https://other.example" },
    }),
    env,
  );
  assert.equal(forbidden.status, 403);
  const unauthorized = await worker.fetch(
    new Request("https://api.example/media", {
      method: "POST",
      headers: { Origin: origin },
    }),
    env,
  );
  assert.equal(unauthorized.status, 401);
});
test("accepts both modern and legacy Office MIME types and rejects spoofed content", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) =>
    url === "https://api.github.com/user"
      ? Response.json({ id: 291507377 })
      : Response.json({
          full_name: "jonmiru69/MyPortfolioSANCHEZRJR",
          permissions: { push: true },
        });
  let writes = 0;
  const database = {
    prepare: () => ({ bind: () => ({ first: async () => null }) }),
    batch: async () => {
      writes++;
    },
  };
  try {
    for (const ext of ["docx", "pptx", "doc", "ppt"]) {
      const bytes = new Uint8Array(
        ["docx", "pptx"].includes(ext)
          ? [80, 75, 3, 4, 0]
          : [208, 207, 17, 224, 161, 177, 26, 225],
      );
      const request = new Request("https://api.example/media", {
        method: "POST",
        headers: {
          Origin: origin,
          Authorization: "Bearer test-only",
          "Content-Type": FILE_TYPES[ext],
        },
        body: bytes,
      });
      const response = await worker.fetch(request, { ...env, DB: database });
      assert.equal(response.status, 200, await response.clone().text());
      assert.match((await response.json()).url, /\/media\/[a-f0-9]{64}$/);
    }
    assert.equal(writes, 4);
    const response = await worker.fetch(
      new Request("https://api.example/media", {
        method: "POST",
        headers: {
          Authorization: "Bearer test-only",
          "Content-Type": "application/pdf",
        },
        body: "not a PDF",
      }),
      { ...env, DB: database },
    );
    assert.equal(response.status, 415);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("only the fixed owner with repository write access can publish", async () => {
  const originalFetch = globalThis.fetch;
  let writes = 0;
  const DB = {
    prepare: () => ({
      bind: () => ({
        run: async () => {
          writes++;
          return { meta: { changes: 1 } };
        },
      }),
    }),
  };
  try {
    for (const scenario of [
      {
        id: 999,
        repo: "jonmiru69/MyPortfolioSANCHEZRJR",
        push: true,
        status: 401,
      },
      {
        id: 291507377,
        repo: "jonmiru69/MyPortfolioSANCHEZRJR",
        push: false,
        status: 401,
      },
      { id: 291507377, repo: "someone/another-repo", push: true, status: 401 },
      {
        id: 291507377,
        repo: "jonmiru69/MyPortfolioSANCHEZRJR",
        push: true,
        status: 200,
      },
    ]) {
      globalThis.fetch = async (url) =>
        Response.json(
          url === "https://api.github.com/user"
            ? { id: scenario.id }
            : {
                full_name: scenario.repo,
                permissions: { push: scenario.push },
              },
        );
      const response = await worker.fetch(
        new Request("https://api.example/snapshot", {
          method: "PUT",
          headers: {
            Authorization: "Bearer test-only",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            revision: 1,
            document: {
              site: { tabs: [], identity: { name: "Owner" } },
              content: {},
            },
          }),
        }),
        { ...env, DB },
      );
      assert.equal(response.status, scenario.status);
    }
    assert.equal(writes, 1, "denied users must never write to the database");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
