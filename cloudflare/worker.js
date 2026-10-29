const REPOSITORY = "jonmiru69/MyPortfolioSANCHEZRJR";
const MAX_MEDIA = 20 * 1024 * 1024;
const CHUNK = 512 * 1024;
import { FILE_TYPES, matchesFileSignature } from "../js/upload-policy.js";
const TYPES = new Set(Object.values(FILE_TYPES));

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function authorized(request) {
  const authorization = request.headers.get("Authorization") || "";
  if (!/^Bearer [^\s]+$/.test(authorization)) return false;
  // Validate against this fixed repository; credentials never enter the database.
  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}`, {
    headers: {
      Authorization: authorization,
      Accept: "application/vnd.github+json",
      "User-Agent": "Ramelito-Portfolio",
    },
  });
  if (!response.ok) return false;
  const repo = await response.json();
  return (
    repo.full_name?.toLowerCase() === REPOSITORY.toLowerCase() &&
    repo.permissions?.push === true
  );
}

function validDocument(document) {
  return (
    document &&
    document.site &&
    Array.isArray(document.site.tabs) &&
    typeof document.site.identity?.name === "string" &&
    document.content &&
    typeof document.content === "object" &&
    !Array.isArray(document.content)
  );
}

async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === "GET" && url.pathname === "/snapshot") {
    const row = await env.DB.prepare(
      "SELECT document, revision, updated_at FROM portfolio WHERE id=1",
    ).first();
    if (!row)
      return json({ error: "Portfolio has not been initialized." }, 503);
    return json({
      ...JSON.parse(row.document),
      revision: row.revision,
      updatedAt: row.updated_at,
    });
  }
  const match = url.pathname.match(/^\/media\/([a-f0-9]{64})$/);
  if (request.method === "GET" && match) {
    const media = await env.DB.prepare("SELECT mime,size FROM media WHERE id=?")
      .bind(match[1])
      .first();
    if (!media) return json({ error: "Image or document not found." }, 404);
    const { results } = await env.DB.prepare(
      "SELECT bytes FROM media_chunks WHERE media_id=? ORDER BY position",
    )
      .bind(match[1])
      .all();
    const chunks = results.map((row) => new Uint8Array(row.bytes));
    return new Response(new Blob(chunks, { type: media.mime }), {
      headers: {
        "Content-Type": media.mime,
        "Content-Length": String(media.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition":
          media.mime.startsWith("image/") || media.mime === "application/pdf"
            ? "inline"
            : "attachment",
      },
    });
  }
  if (!["PUT", "POST"].includes(request.method))
    return json({ error: "Not found." }, 404);
  if (!(await authorized(request)))
    return json(
      {
        error:
          "Owner access could not be verified. Reconnect your GitHub token.",
      },
      401,
    );

  if (request.method === "POST" && url.pathname === "/media") {
    const mime = request.headers.get("Content-Type")?.split(";")[0];
    if (!TYPES.has(mime))
      return json(
        { error: "Choose an image, PDF, Word or PowerPoint file." },
        415,
      );
    if (Number(request.headers.get("Content-Length")) > MAX_MEDIA)
      return json({ error: "The file limit is 20 MB." }, 413);
    const bytes = await request.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > MAX_MEDIA)
      return json({ error: "The file must be between 1 byte and 20 MB." }, 413);
    if (!matchesFileSignature(new Uint8Array(bytes.slice(0, 1024)), mime))
      return json(
        { error: "The file does not match its declared format." },
        415,
      );
    const hash = [
      ...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
    ]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const exists = await env.DB.prepare("SELECT id FROM media WHERE id=?")
      .bind(hash)
      .first();
    if (!exists) {
      const statements = [
        env.DB.prepare(
          "INSERT OR IGNORE INTO media(id,mime,size,created_at) VALUES(?,?,?,?)",
        ).bind(hash, mime, bytes.byteLength, new Date().toISOString()),
      ];
      for (let offset = 0; offset < bytes.byteLength; offset += CHUNK) {
        statements.push(
          env.DB.prepare(
            "INSERT OR IGNORE INTO media_chunks(media_id,position,bytes) VALUES(?,?,?)",
          ).bind(hash, offset / CHUNK, bytes.slice(offset, offset + CHUNK)),
        );
      }
      await env.DB.batch(statements);
    }
    return json({ url: `${url.origin}/media/${hash}` });
  }
  if (request.method === "PUT" && url.pathname === "/snapshot") {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 1800000)
      return json(
        {
          error:
            "Portfolio text exceeds the storage limit. Upload images separately.",
        },
        413,
      );
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      return json({ error: "Invalid JSON." }, 400);
    }
    if (
      !validDocument(payload.document) ||
      !Number.isSafeInteger(payload.revision)
    )
      return json({ error: "Invalid portfolio document." }, 400);
    const now = new Date().toISOString();
    const document = JSON.stringify({
      site: payload.document.site,
      content: payload.document.content,
    });
    const result = await env.DB.prepare(
      "UPDATE portfolio SET document=?,revision=revision+1,updated_at=? WHERE id=1 AND revision=?",
    )
      .bind(document, now, payload.revision)
      .run();
    if (result.meta.changes !== 1)
      return json(
        {
          error:
            "Another device has published newer changes. Your draft is safe. Reload the published version before merging your edits.",
        },
        409,
      );
    return json({ revision: payload.revision + 1, updatedAt: now });
  }
  return json({ error: "Not found." }, 404);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowed =
      !origin ||
      origin === env.PUBLIC_ORIGIN ||
      origin === new URL(request.url).origin;
    if (!allowed) return json({ error: "Origin not allowed." }, 403);
    let response;
    if (request.method === "OPTIONS")
      response = new Response(null, { status: 204 });
    else {
      try {
        response = await route(request, env);
      } catch {
        response = json(
          {
            error:
              "Cloud storage is temporarily unavailable. Your local draft is safe; try again.",
          },
          503,
        );
      }
    }
    response.headers.set(
      "Access-Control-Allow-Origin",
      origin || env.PUBLIC_ORIGIN,
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type",
    );
    response.headers.set("Vary", "Origin");
    response.headers.set("X-Content-Type-Options", "nosniff");
    return response;
  },
};
