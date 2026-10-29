import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = resolve(import.meta.dirname, ".."),
  out = resolve(root, ".test-results");
await mkdir(out, { recursive: true });
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (pathname === "/data/cloud.json") {
      res.setHeader("Content-Type", "application/json");
      res.end('{"api_url":""}');
      return;
    }
    const file = resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (!file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const bytes = await readFile(file);
    res.setHeader(
      "Content-Type",
      mime[extname(file)] || "application/octet-stream",
    );
    res.end(bytes);
  } catch {
    res.writeHead(404).end("Not found");
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : { channel: process.env.PLAYWRIGHT_CHANNEL || "chrome" }),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("dialog", (d) => d.accept());
const checks = [];
const check = (name) => {
  checks.push(name);
  console.log("PASS " + name);
};
const go = async (route) => {
  await page.goto(`${base}/#/${route}`);
  await page.waitForSelector(".page-view");
  await page.evaluate(() => document.fonts.ready);
};
const state = () =>
  page.evaluate(async () => {
    const { store } = await import("/js/store.js");
    return {
      items: (await store.getTabContent("certificates")).items,
      changed: [...store.changedFiles],
      mode: store.isDraftMode,
    };
  });
const owner = async () => {
  await page.evaluate(async () => {
    const { github } = await import("/js/github.js");
    github.setCredentials(
      "test-only",
      "jonmiru69",
      "MyPortfolioSANCHEZRJR",
      "main",
      false,
    );
    github.testConnection = async () => ({ ok: true });
  });
  await page.getByRole("button", { name: "Owner mode", exact: true }).click();
  await page.getByRole("button", { name: "Exit owner mode" }).waitFor();
};
const fixtureFolder = resolve(root, "tests/fixtures");
const upload = {
  name: "certificate.docx",
  mimeType:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  buffer: await readFile(fixtureFolder + "/certificate.docx"),
};
const shot = async (path, fullPage = true) => {
  for (const img of await page.locator(".page-view img").all()) {
    await img.scrollIntoViewIfNeeded().catch(() => {});
    await img.evaluate((el) => el.decode().catch(() => {}));
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path, fullPage, animations: "disabled" });
};
try {
  await go("cover");
  assert.equal(
    await page.locator(".cover-page h1").innerText(),
    "Ramelito Jr. C. Sanchez",
  );
  assert.equal(await page.locator(".cover-page img").count(), 4);
  check("overview loads real portrait and three original certificate images");
  assert.match(
    await page.locator(".hero-role").innerText(),
    /Licensed Professional Teacher/,
  );
  assert.doesNotMatch(await page.locator(".hero-role").innerText(), /\bLPT\b/);
  check("overview spells out Licensed Professional Teacher");
  for (const route of [
    "profile",
    "resume",
    "education",
    "licenses",
    "certificates",
    "research",
    "teaching",
    "contact",
    "contents",
    "philosophy",
    "materials",
    "performance",
    "awards",
    "service",
    "projects",
    "development",
    "reading",
    "testimonials",
    "gallery",
  ]) {
    await go(route);
    assert.equal(
      await page.getByText("Unable to load", { exact: true }).count(),
      0,
      route,
    );
    check(`section ${route} renders`);
  }
  await go("certificates");
  const publicCount = (await state()).items.filter(
    (i) => i.visibility !== "hidden",
  ).length;
  assert.equal(
    await page.locator("#cert-count").innerText(),
    `${publicCount} of ${publicCount} certificates`,
  );
  const labels = await page
    .locator(".certificate-record")
    .first()
    .locator("dt")
    .allTextContents();
  assert.deepEqual(labels, [
    "Date issued",
    "Certificate type",
    "Delivery mode",
    "Seminar title",
    "Seminar topic",
    "Seminar provider",
    "Training code",
    "CPD points",
  ]);
  check(
    "certificate details follow exactly the requested eight-field hierarchy",
  );
  await page.locator("#cert-search").fill("no-such-certificate");
  await page.getByRole("heading", { name: "No matches" }).waitFor();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.waitForFunction(
    () => document.querySelectorAll(".certificate-record").length === 6,
  );
  await page.locator("#filter-year").selectOption("2025");
  assert.equal(
    await page.locator("#cert-count").innerText(),
    `1 of ${publicCount} certificates`,
  );
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.waitForFunction(
    () => document.querySelectorAll(".certificate-record").length === 6,
  );
  await page.getByRole("button", { name: "Next", exact: true }).click();
  assert.equal(await page.locator("#cert-page").innerText(), "Page 2 of 4");
  check("search, empty state, reset, year filter and pagination work");
  await page.locator(".certificate-record button[data-view]").first().click();
  await page.locator(".document-viewer[open]").waitFor();
  assert.equal(await page.locator("dialog[open]").count(), 1);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog[open]").count(), 0);
  check(
    "certificate viewer opens one accessible dialog and closes with Escape",
  );
  await owner();
  assert.equal(
    await page.getByRole("link", { name: "Manage certificates" }).isVisible(),
    true,
  );
  await page
    .getByRole("button", { name: "Add certificate", exact: true })
    .click();
  await page.locator(".item-editor-form").waitFor();
  assert.equal(await page.locator("dialog[open]").count(), 1);
  assert.deepEqual(
    (
      await page
        .locator(".item-editor-form > .editor-field > label")
        .allTextContents()
    ).slice(0, 8),
    labels,
  );
  await page
    .locator("dialog")
    .getByLabel("Seminar title", { exact: true })
    .fill("Cancelled certificate");
  await page.locator("dialog input[type=file]").setInputFiles(upload);
  await page
    .getByText("File selected. Save the certificate to upload it.", {
      exact: true,
    })
    .waitFor();
  assert.equal((await state()).changed.length, 0);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page
    .getByRole("button", { name: "Discard changes", exact: true })
    .click();
  assert.equal((await state()).items.length, 22);
  check(
    "Cancel discards an unsaved certificate and its file without creating a draft",
  );
  await page
    .getByRole("button", { name: "Add certificate", exact: true })
    .click();
  await page.locator(".item-editor-form").waitFor();
  await page
    .locator("dialog")
    .getByLabel("Date issued", { exact: true })
    .fill("2026-10-29");
  await page
    .locator("dialog")
    .getByLabel("Certificate type", { exact: true })
    .fill("Participation");
  await page
    .locator("dialog")
    .getByLabel("Delivery mode", { exact: true })
    .fill("Online");
  await page
    .locator("dialog")
    .getByLabel("Seminar title", { exact: true })
    .fill("Browser-tested certificate");
  await page
    .locator("dialog")
    .getByLabel("Seminar topic", { exact: true })
    .fill("Research and science");
  await page
    .locator("dialog")
    .getByLabel("Seminar provider", { exact: true })
    .fill("Test provider");
  await page
    .locator("dialog")
    .getByLabel("Training code", { exact: true })
    .fill("TEST-2026");
  await page
    .locator("dialog")
    .getByLabel("CPD points", { exact: true })
    .fill("2.5");
  await page.locator("dialog input[type=file]").setInputFiles(upload);
  await page
    .getByText("File selected. Save the certificate to upload it.", {
      exact: true,
    })
    .waitFor();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.locator("dialog").waitFor({ state: "detached" });
  let saved = (await state()).items.find(
    (i) => i.title === "Browser-tested certificate",
  );
  assert.equal(saved.cpd_points, 2.5);
  assert.equal(saved.training_code, "TEST-2026");
  assert.equal((await state()).changed.length, 2);
  assert.equal(
    await page.evaluate(async (path) => {
      const { store } = await import("/js/store.js");
      return (await store.loadDraft(path)).size;
    }, saved.evidence[0].file),
    upload.buffer.length,
  );
  check("Word upload saves its original bytes and all eight fields atomically");
  await page.locator("#cert-search").fill("Browser-tested certificate");
  await page.locator(".certificate-record .owner-item-actions button").click();
  await page.locator(".item-editor-form").waitFor();
  assert.equal(await page.locator("dialog[open]").count(), 1);
  assert.equal(
    await page
      .locator("dialog")
      .getByLabel("Seminar title", { exact: true })
      .inputValue(),
    saved.title,
  );
  await page.locator("dialog input[type=file]").setInputFiles({
    ...upload,
    name: "replacement.pptx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    buffer: await readFile(fixtureFolder + "/certificate.pptx"),
  });
  await page
    .getByText("File selected. Save the certificate to upload it.", {
      exact: true,
    })
    .waitFor();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.locator("dialog").waitFor({ state: "detached" });
  const replaced = (await state()).items.find((i) => i.id === saved.id);
  assert.equal((await state()).items.length, 23);
  assert.notEqual(replaced.evidence[0].file, saved.evidence[0].file);
  assert.match(replaced.evidence[0].file, /\.pptx$/);
  check(
    "editing and replacing a file updates the same record without duplicating certificates",
  );
  await page.locator("#cert-search").fill("Browser-tested certificate");
  await page.locator(".certificate-record button[data-view]").first().click();
  await page
    .getByText("This Word or PowerPoint document is ready to download.", {
      exact: false,
    })
    .waitFor();
  assert.equal(
    await page.locator(".document-viewer a").getAttribute("download"),
    "replacement.pptx",
  );
  assert.match(
    await page.locator(".document-viewer a").getAttribute("href"),
    /^blob:/,
  );
  await page.keyboard.press("Escape");
  check(
    "Office documents use a working download link without a broken embedded preview",
  );
  await page.reload();
  await page.locator(".certificates-page").waitFor();
  assert.equal((await state()).mode, false);
  assert.equal((await state()).items.length, 22);
  await owner();
  assert.equal((await state()).items.length, 23);
  check(
    "reload keeps private drafts out of public mode and restores them after owner authentication",
  );
  await page.locator("#cert-search").fill("Browser-tested certificate");
  await page.locator(".certificate-record .owner-item-actions button").click();
  await page.getByRole("button", { name: "Delete item", exact: true }).click();
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await page.locator("dialog").waitFor({ state: "detached" });
  assert.equal((await state()).items.length, 22);
  check("two-step deletion removes only the selected certificate");
  for (const ext of ["png", "jpg", "pdf"]) {
    await page
      .getByRole("button", { name: "Add certificate", exact: true })
      .click();
    await page
      .locator("dialog")
      .getByLabel("Seminar title", { exact: true })
      .fill("Test " + ext + " upload");
    await page
      .locator("dialog input[type=file]")
      .setInputFiles(fixtureFolder + "/certificate." + ext);
    await page
      .getByText("File selected. Save the certificate to upload it.", {
        exact: true,
      })
      .waitFor();
    await page
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await page.locator("dialog").waitFor({ state: "detached" });
    await page.locator("#cert-search").fill("Test " + ext + " upload");
    await page.locator(".certificate-record button[data-view]").first().click();
    await page.locator(".document-viewer").waitFor();
    if (ext === "pdf")
      assert.equal(await page.locator(".document-viewer iframe").count(), 1);
    else {
      await page.waitForFunction(
        () => document.querySelector(".document-viewer img")?.naturalWidth > 0,
      );
      assert.equal(
        await page
          .locator(".document-viewer img")
          .evaluate((i) => i.naturalWidth),
        640,
      );
    }
    await page.keyboard.press("Escape");
    check(
      `real ${ext.toUpperCase()} file uploads, saves and previews correctly`,
    );
  }
  await page
    .getByRole("button", { name: "Add certificate", exact: true })
    .click();
  await page.locator("dialog input[type=file]").setInputFiles({
    name: "renamed.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("not a PDF"),
  });
  await page
    .getByText(
      "This file does not match its file extension. Choose the original file in a supported format.",
      { exact: true },
    )
    .waitFor();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page
    .getByRole("button", { name: "Discard changes", exact: true })
    .click();
  check("a renamed invalid file is rejected inline without leaving the editor");
  await page
    .getByRole("button", { name: "Manage sections", exact: true })
    .click();
  await page.getByRole("button", { name: "Add section", exact: true }).click();
  await page
    .locator("dialog")
    .getByLabel("Label", { exact: true })
    .fill("Test custom section");
  await page
    .locator("dialog")
    .getByLabel("Slug", { exact: true })
    .fill("test-custom-section");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.locator("dialog").waitFor({ state: "detached" });
  assert.equal(
    await page.locator('nav a[href="#/test-custom-section"]').count(),
    1,
  );
  await page.goto(`${base}/#/test-custom-section`);
  await page.getByRole("button", { name: "Add item", exact: true }).waitFor();
  await page.getByRole("button", { name: "Add item", exact: true }).click();
  await page
    .locator("dialog")
    .getByLabel("Title", { exact: true })
    .fill("A custom-section item");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.locator("dialog").waitFor({ state: "detached" });
  await page.getByRole("heading", { name: "A custom-section item" }).waitFor();
  const customCorrect = await page.evaluate(async () => {
    const { store } = await import("/js/store.js");
    const tab = store.site.tabs.find((t) => t.slug === "test-custom-section");
    const bundle = await store.exportFullSiteData();
    return bundle.content[tab.id].items[0].title;
  });
  assert.equal(customCorrect, "A custom-section item");
  check(
    "custom sections open one popup, appear in navigation and export content under the correct ID",
  );
  await page.goto(`${base}/#/education`);
  await page.getByRole("button", { name: "Add item", exact: true }).waitFor();
  await page.getByRole("button", { name: "Add item", exact: true }).click();
  await page
    .locator("dialog")
    .getByLabel("Title", { exact: true })
    .fill("Test education entry");
  await page
    .locator("dialog")
    .getByLabel("Organization", { exact: true })
    .fill("Test institution");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.locator("dialog").waitFor({ state: "detached" });
  await page.getByRole("heading", { name: "Test education entry" }).waitFor();
  check("the same focused Add and Save workflow works for education");
  await page.goto(`${base}/#/profile`);
  await page
    .getByRole("button", { name: "Edit profile", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  await page
    .locator("dialog")
    .getByLabel("Biography", { exact: true })
    .fill("Updated profile from browser test.");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page
    .getByText("Updated profile from browser test.", { exact: true })
    .waitFor();
  check(
    "profile editing uses one popup, explicit Save, and refreshes the displayed content",
  );
  await page.goto(`${base}/#/resume`);
  await page.locator(".resume-canvas img").waitFor();
  await page.waitForFunction(
    () => document.querySelector(".resume-canvas img").naturalWidth > 0,
  );
  assert.equal(
    await page
      .locator(".resume-canvas img")
      .evaluate((img) => img.naturalWidth),
    1414,
  );
  assert.ok(
    (await page
      .locator(".resume-canvas img")
      .evaluate((img) => img.clientWidth)) > 900,
  );
  await page.getByRole("button", { name: "Open full size" }).click();
  await page.locator(".document-viewer img").waitFor();
  await page.keyboard.press("Escape");
  check(
    "the supplied original résumé displays at wide reading width and opens at full size",
  );
  await shot(out + "/resume-desktop.png");
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "cover",
      "certificates",
      "resume",
      "profile",
      "education",
      "teaching",
      "research",
      "licenses",
      "contact",
    ]) {
      await page.goto(`${base}/#/${route}`);
      await page.locator(".page-view").waitFor();
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      assert.equal(overflow, false, `${route} at ${width}`);
      assert.equal(
        await page
          .locator("img")
          .evaluateAll(
            (imgs) => imgs.filter((i) => i.complete && !i.naturalWidth).length,
          ),
        0,
        `${route} image at ${width}`,
      );
      if (["cover", "certificates", "resume"].includes(route))
        await shot(`${out}/${route}-${width}.png`);
    }
    check(
      `all nine visible sections fit ${width}px without horizontal overflow or broken images`,
    );
  }
  await page.goto(`${base}/#/certificates`);
  await page
    .getByRole("button", { name: "Add certificate", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Add certificate", exact: true })
    .click();
  await page.locator(".item-editor-form").waitFor();
  assert.equal(
    await page
      .locator("dialog")
      .evaluate((el) => el.scrollWidth > el.clientWidth + 1),
    false,
  );
  await page.screenshot({ path: out + "/certificate-editor-mobile.png" });
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  check("phone editor stays within the screen and scrolls internally");
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await shot(out + "/certificates-dark-mobile.png");
  const colors = await page.evaluate(() => ({
    nav: getComputedStyle(document.querySelector(".top-bar")).backgroundColor,
    footer: getComputedStyle(document.querySelector(".site-footer"))
      .backgroundColor,
  }));
  assert.notEqual(colors.nav, colors.footer);
  check(
    "dark theme works and the compact footer differs from the navigation color",
  );
  await page.goto(`${base}/#/contact`);
  await page.locator(".inquiry-form").waitFor();
  assert.equal(await page.locator(".inquiry-form input[required]").count(), 3);
  assert.equal(
    await page.locator(".inquiry-form textarea[required]").count(),
    1,
  );
  assert.equal(
    await page.getByRole("button", { name: "Compose email" }).count(),
    1,
  );
  check("contact inquiry fields validate before composing a real email draft");
  await page.goto(`${base}/#/admin`);
  await page.locator(".admin-panel").waitFor();
  for (const label of [
    "Content Items",
    "Theme & Tokens",
    "Identity & SEO",
    "Backup & Storage",
  ]) {
    await page.getByRole("button", { name: label, exact: false }).click();
    assert.equal(
      await page.locator("#admin-subview-container").isVisible(),
      true,
    );
  }
  await page
    .getByRole("button", { name: "Identity & SEO", exact: false })
    .click();
  await page
    .getByRole("button", { name: "Edit identity and photo", exact: true })
    .click();
  await page.locator("dialog[open]").waitFor();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  assert.equal(
    await page.evaluate(() => !!document.activeElement.closest("dialog")),
    true,
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  check("admin tools remain usable and native dialogs retain keyboard focus");
  const cloudFallback = await page.evaluate(async () => {
    const { cloud } = await import("/js/cloud.js");
    const { github } = await import("/js/github.js");
    const oldRequest = cloud.request,
      oldPublish = github.publishChanges;
    let uploaded = false;
    cloud.request = async (path, options) => {
      if (path === "/media") {
        const error = new Error("Unsupported by old worker");
        error.status = 415;
        throw error;
      }
      return { revision: 8 };
    };
    github.publishChanges = async (map) => {
      uploaded = Object.values(map)[0] instanceof Blob;
      return { commitSha: "abc123" };
    };
    try {
      const result = await cloud.publish(
        {
          site: {},
          content: { certificate: { file: "assets/uploads/test.docx" } },
        },
        [
          [
            "assets/uploads/test.docx",
            new Blob(["PK"], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }),
          ],
        ],
        7,
      );
      return {
        uploaded,
        url: result.content.certificate.file,
        revision: result.revision,
      };
    } finally {
      cloud.request = oldRequest;
      github.publishChanges = oldPublish;
    }
  });
  assert.ok(cloudFallback.uploaded);
  assert.match(
    cloudFallback.url,
    /raw\.githubusercontent\.com\/jonmiru69\/MyPortfolioSANCHEZRJR\/abc123/,
  );
  assert.equal(cloudFallback.revision, 8);
  check(
    "legacy online storage falls back to an immutable GitHub Office document and saves its URL",
  );
  assert.deepEqual(errors, []);
  check("no uncaught JavaScript errors across the tested workflows");
  await writeFile(
    out + "/results.json",
    JSON.stringify({ checks, errors }, null, 2),
  );
} catch (error) {
  await page
    .screenshot({ path: out + "/failure.png", fullPage: true })
    .catch(() => {});
  console.error(error);
  console.error("Browser errors:", errors);
  process.exitCode = 1;
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
