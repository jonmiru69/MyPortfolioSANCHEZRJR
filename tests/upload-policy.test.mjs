import test from "node:test";
import assert from "node:assert/strict";
import {
  prepareUpload,
  FILE_TYPES,
  FILE_ACCEPT,
  MAX_UPLOAD_BYTES,
  matchesFileSignature,
} from "../js/upload-policy.js";

const samples = {
  jpg: [255, 216, 255, 224],
  jpeg: [255, 216, 255, 224],
  png: [137, 80, 78, 71, 13, 10, 26, 10],
  webp: [...Buffer.from("RIFF0000WEBP")],
  gif: [...Buffer.from("GIF89a")],
  bmp: [66, 77],
  avif: [0, 0, 0, 32, ...Buffer.from("ftypavif")],
  pdf: [...Buffer.from("%PDF-1.7\n")],
  docx: [80, 75, 3, 4],
  pptx: [80, 75, 3, 4],
  doc: [208, 207, 17, 224, 161, 177, 26, 225],
  ppt: [208, 207, 17, 224, 161, 177, 26, 225],
};
for (const [ext, mime] of Object.entries(FILE_TYPES))
  test(`upload ${ext}: preserves bytes, infers MIME and creates a unique safe path`, async () => {
    const file = new File(
      [new Uint8Array(samples[ext])],
      `My certificate.${ext.toUpperCase()}`,
      { type: "" },
    );
    const first = await prepareUpload(file);
    const second = await prepareUpload(file);
    assert.equal(first.blob.type, mime);
    assert.deepEqual(await first.blob.arrayBuffer(), await file.arrayBuffer());
    assert.ok(first.path.endsWith("." + ext));
    assert.notEqual(first.path, second.path);
    assert.ok(!first.path.includes(" "));
    assert.equal(first.evidence.original_name, file.name);
    assert.equal(
      first.evidence.preview_images.length,
      mime.startsWith("image/") ? 1 : 0,
    );
    assert.ok(FILE_ACCEPT.includes("." + ext));
  });
test("rejects executable, SVG, empty and oversized uploads", async () => {
  for (const file of [
    new File(["abc"], "x.exe"),
    new File(["<svg/>"], "x.svg"),
    new File([], "empty.pdf"),
    new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], "large.pdf"),
  ])
    await assert.rejects(() => prepareUpload(file));
});
test("rejects renamed scripts and incorrect image signatures", async () => {
  await assert.rejects(() =>
    prepareUpload(new File(["<script>alert(1)</script>"], "certificate.pdf")),
  );
  assert.equal(
    matchesFileSignature(new Uint8Array([80, 75, 3, 4]), "image/png"),
    false,
  );
});
