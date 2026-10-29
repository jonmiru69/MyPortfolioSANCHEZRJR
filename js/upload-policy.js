// Shared by the browser and Cloudflare so every supported file can actually be saved.
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
export const FILE_TYPES = Object.freeze({
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  bmp: "image/bmp",
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  doc: "application/msword",
  ppt: "application/vnd.ms-powerpoint",
});
export const FILE_ACCEPT = Object.keys(FILE_TYPES)
  .map((ext) => "." + ext)
  .join(",");
export function matchesFileSignature(bytes, mime) {
  const starts = (values) => values.every((v, i) => bytes[i] === v);
  const text = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  if (mime === "image/jpeg") return starts([255, 216, 255]);
  if (mime === "image/png") return starts([137, 80, 78, 71, 13, 10, 26, 10]);
  if (mime === "image/gif") return ["GIF87a", "GIF89a"].includes(text(0, 6));
  if (mime === "image/webp")
    return text(0, 4) === "RIFF" && text(8, 12) === "WEBP";
  if (mime === "image/avif")
    return text(4, 8) === "ftyp" && /avif|avis/.test(text(8, 40));
  if (mime === "image/bmp") return text(0, 2) === "BM";
  if (mime === "application/pdf") return text(0, 1024).includes("%PDF-");
  if (mime.includes("openxmlformats")) return starts([80, 75, 3, 4]);
  if (mime === FILE_TYPES.doc || mime === FILE_TYPES.ppt)
    return starts([208, 207, 17, 224, 161, 177, 26, 225]);
  return false;
}
export async function prepareUpload(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const mime = FILE_TYPES[ext];
  if (!mime)
    throw new Error(
      "Choose an image, PDF, Word (.doc/.docx) or PowerPoint (.ppt/.pptx) file.",
    );
  if (!file.size || file.size > MAX_UPLOAD_BYTES)
    throw new Error("Choose a non-empty file no larger than 20 MB.");
  if (
    !matchesFileSignature(
      new Uint8Array(await file.slice(0, 1024).arrayBuffer()),
      mime,
    )
  )
    throw new Error(
      "This file does not match its file extension. Choose the original file in a supported format.",
    );
  const name =
    file.name
      .replace(/\.[^.]+$/, "")
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9-]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 70) || "document";
  const path = `assets/uploads/${name}-${crypto.randomUUID()}.${ext}`;
  return {
    path,
    blob: new Blob([file], { type: mime }),
    evidence: {
      label: file.name,
      original_name: file.name,
      file: path,
      type: mime.startsWith("image/") ? "image" : "document",
      mime,
      preview_images: mime.startsWith("image/") ? [path] : [],
    },
  };
}
