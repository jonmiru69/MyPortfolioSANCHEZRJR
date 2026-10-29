# Ramelito Sanchez — teaching portfolio

A responsive static portfolio for Ramelito Jr. C. Sanchez, LPT. Runs directly on GitHub Pages with native JavaScript modules; no build or paid service is required for the public site.

## What is included

- A document-inspired design using the owner's actual portrait, certificates and original résumé.
- Readable navigation with direct Certificates and Résumé / CV links.
- A searchable, paginated certificate archive. Each record displays exactly: date issued, certificate type, delivery mode, seminar title, seminar topic, seminar provider, training code and CPD points.
- One native, accessible popup for each Add or Edit action across the portfolio. Save applies the changes together; Cancel leaves existing information intact. Unsaved-change confirmation stays inside the same popup.
- File-picker uploads for JPEG, PNG, WebP, GIF, AVIF, BMP, PDF, DOC, DOCX, PPT and PPTX, up to 20 MB each. No asset paths or JSON editing are needed.
- Full-width original résumé, with full-size viewing, download and print controls.
- Light/dark appearance, keyboard focus support and reduced-motion support.
- A compact footer in a different color from navigation.

## Preview

Run `powershell -ExecutionPolicy Bypass -File ./serve.ps1` and open http://localhost:8080.

Alternatively, use any static HTTP server in this directory. ES modules and content fetches require HTTP; opening index.html directly from disk is not supported.

## Owner editing and online storage

Choose **Owner mode** and connect a GitHub token with write access to this repository. Choose **Manage certificates** to reach the archive immediately. Add and Edit buttons open an editor for a single record. Personal details, contact information, the supplied résumé file and section settings use the same focused editing pattern.

Saved records and files are first committed together to this device's IndexedDB. The configured Cloudflare service then saves them online. Check the sync message before leaving. Failed saves retain local drafts for retry; recovered drafts require review before publishing. Ordinary visitors see published content, not another visitor's device drafts.

The updated Worker accepts all supported formats. If an older Worker returns “unsupported format,” the client stores that file through the existing GitHub connection and saves an immutable document URL in the cloud record. A Word or PowerPoint file downloads in its original format; the site does not send it to an external document viewer. PDFs and images can be previewed.

The release migration adds the supplied résumé and newly supplied certificate to older cloud snapshots without overwriting owner-authored details or visibility choices. Two existing hidden certificate records remain hidden from public view and can be edited in owner mode.

## Checks

Run `npm test` with Node 22 or newer. Tests cover every accepted file format, signature/size rejection, Worker authorization/CORS, draft transactions, concurrent saves, failed-sync recovery, release migration, asset references, module syntax and preservation of the original résumé. No install is needed for these tests.

Browser verification additionally covered all sections, real Word/PowerPoint/PDF/image uploads, certificate CRUD, cancellation, file replacement, custom section addresses, draft recovery, full-size viewing, and nine visible sections at 1440, 768 and 390 px. See REDESIGN-NOTES.md for the design and validation record.

The repeatable browser suite is `npm run test:browser`. It needs an existing Playwright installation and Chrome; `PLAYWRIGHT_MODULE` can point to an installed Playwright module, and `CHROME_PATH` can select another Chromium executable. Its test server disables online storage and uses test-only credentials, so it does not modify the live portfolio. Results and screenshots are written to `.test-results/`.

## Structure

- `index.html`, `css/`: shell and visual system.
- `js/render/`: public views and file viewer.
- `js/admin/item-editor.js`, `dialog.js`: shared focused editors.
- `js/store.js`: transactional device drafts and cloud synchronization.
- `js/upload-policy.js`: shared browser/Worker file policy.
- `data/`: identity, sections and portfolio content.
- `assets/`: owner-supplied portrait, résumé and certificate documents.
- `cloudflare/`: optional online storage Worker and database schema.
