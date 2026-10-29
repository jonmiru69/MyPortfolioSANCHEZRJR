import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const root = resolve(import.meta.dirname, "..");
async function files(folder, extension) {
  const result = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = resolve(folder, entry.name);
    if (entry.isDirectory()) result.push(...(await files(path, extension)));
    else if (entry.name.endsWith(extension)) result.push(path);
  }
  return result;
}
test("every bundled content file parses and its local asset references exist", async () => {
  const references = [];
  const collect = (value) => {
    if (typeof value === "string" && value.startsWith("assets/"))
      references.push(value);
    else if (value && typeof value === "object")
      Object.values(value).forEach(collect);
  };
  for (const file of await files(resolve(root, "data"), ".json"))
    collect(JSON.parse(await readFile(file, "utf8")));
  for (const file of new Set(references))
    await assert.doesNotReject(
      () => access(resolve(root, file)),
      `Missing ${file}`,
    );
});
test("the supplied resume is preserved byte-for-byte at its full original resolution", async () => {
  const bytes = await readFile(
    resolve(root, "assets/docs/resume/ramelito-sanchez-resume.png"),
  );
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    "34eea625d74bfb55e598fc343476d3d5c86927dbb4f55f2b11cbb15ad2448cd1",
  );
  assert.equal(bytes.readUInt32BE(16), 1414);
  assert.equal(bytes.readUInt32BE(20), 2000);
});
test("all JavaScript modules parse and relative imports resolve", async () => {
  for (const file of [
    ...(await files(resolve(root, "js"), ".js")),
    resolve(root, "cloudflare/worker.js"),
  ]) {
    assert.doesNotThrow(
      () =>
        execFileSync(process.execPath, ["--check", file], { stdio: "pipe" }),
      `Syntax error in ${file}`,
    );
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g))
      if (match[1].startsWith("."))
        await access(resolve(dirname(file), match[1]));
  }
});
