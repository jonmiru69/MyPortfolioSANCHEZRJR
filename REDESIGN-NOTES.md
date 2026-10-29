# Portfolio revision and verification

Prepared 29 October 2026 for Ramelito Jr. C. Sanchez, LPT.

## Delivered behavior

Owner mode exposes a direct Manage certificates shortcut and visible Add/Edit controls. Every record opens one native dialog. The same dialog pattern covers education, teaching, research, custom sections, profile writing, identity/photo, contact, résumé, footer and section settings. Cancel preserves the existing information; unsaved-change and deletion confirmations stay inside that dialog. Changes apply on Save.

The certificate editor and public archive use the exact requested hierarchy: date issued, certificate type, delivery mode, seminar title, seminar topic, seminar provider, training code and CPD points. Unknown details stay blank in the editor and read “Not stated” publicly. Zero CPD points is kept distinct from an unstated award. Provider accreditation numbers and training hours are not treated as CPD points.

File pickers accept JPEG, PNG, WebP, GIF, AVIF, BMP, PDF, DOC, DOCX, PPT and PPTX, up to 20 MB each. Files retain their original bytes and meaningful extensions. Images/PDFs can be previewed; Office files download in their original format. An older deployed Worker can fall back to immutable GitHub document storage when it rejects a supported MIME type.

The supplied résumé is displayed as the original image at wide reading width, with an introduction, actual-size opening, zoom in/out, fit-width, download and print. Its SHA-256 matches the supplied file: `34eea625d74bfb55e598fc343476d3d5c86927dbb4f55f2b11cbb15ad2448cd1`. Resolution remains 1414 × 2000.

The footer has compact 16 px vertical padding and a separate field color from navigation in both light and dark modes.

## Content provenance

The existing 21 certificate records were checked against the supplied folder. One missing certificate, Harnessing Technology for Transformative Education (24 October 2026), was added. The archive contains 22 unique records; two existing hidden records remain hidden from ordinary visitors. Owner mode includes them for editing.

Certificate topics summarize the titles/content of supplied documents. The DICT research webinar's stated training code is included. Documents explicitly marked NON-CPD receive zero points; unstated CPD awards remain unknown. The profile and research introduction use the supplied résumé, existing verified portfolio content and the supplied thesis title/authors. Duplicate scans, transcripts and the payment receipt were not imported as certificates.

All imagery is owner-supplied: the portrait, original certificate scans, PDF-derived certificate previews and the original résumé. No stock photographs, found clips, generated stand-ins, fictional qualifications or sample portfolio records were added. Browser-test fixtures are isolated under tests/fixtures and are never loaded by the public site.

## Design direction

The design-taste-frontend draw dealt The page is the object, seed **1652593495**. The subject inventory included the CPSU Science degree, the 360-hour pre-service placement, Colegio de Sto. Tomas-Recoletos, the original résumé, the sequence of AI courses, physics masterclasses, research workshops and student well-being certificates.

Argument: introduce the science/research teacher through his actual portrait and role; establish his background through the supplied résumé; show his professional learning through original documents; provide a direct route to every complete section; make professional contact possible.

Idea sentence: On this page, Ramelito's progression from science teacher training to documented learning in AI, physics and student well-being becomes a set of readable portfolio sheets.

The live element is the searchable certificate archive with year/type filters, sorting and original-document viewing. The existing cyan brand was mapped onto the dealt paper/ink proportions. The dealt Libre Franklin / Source Serif 4 pairing was used. The unavailable room photograph in the dealt hero was adapted to the owner's real portrait within the dossier sheet; no fictitious room or stock stand-in was introduced. The footer blueprint was shortened to respect the explicit request for a thin footer. No direction rerolls were performed.

### Render critique

ROUND 1

Seen in one second: portrait and teacher name.

Idea: original documents become the material of the portfolio.

Live thing: filter and open certificates.

Layout words by section: hero=paper dossier / about=two-column text / learning=pinned document sequence / index=printed list / contact=filled closing sheet.

Scores: design 7.2 · usability 7.6 · creativity 7.0 · content 8.0 → overall 7.36.

Caps applied: the first new render had fewer than four pictures and a menu shadow flagged by the inspector; the overall was capped at 6.0 until those issues were fixed.

Top three problems:

1. The initial desktop hero portrait made the panel extend beyond the first screen. Changed its frame to square while preserving the mobile crop.
2. The first certificate selection excluded a previously hidden record, leaving too few real pictures. Select three available, visible original-document previews instead.
3. The learning title stayed pinned through too long a document sequence. Kept one dominant document and placed the next two side by side on desktop; the phone keeps a readable stack.

ROUND 2

Seen in one second: the owner's name and original portrait on a paper dossier.

Idea: the supplied documents, rather than invented proof, carry the portfolio.

Live thing: searchable original-document archive and focused owner editor.

Layout words by section: hero=dossier / about=split writing / learning=pinned proof / index=menu sheet / contact=closing panel.

Scores: design 7.8 · usability 8.2 · creativity 7.0 · content 8.5 → overall 7.83.

Caps applied: none on the final homepage render. Creativity is kept at 7.0 because the dossier approach is familiar even though its content is personal.

Top three problems resolved in the final inspection:

1. The phone's final document caption sat too close to the following heading. Increased section separation.
2. The certificate entrance originally moved a whole row. Staggered its document and detail groups instead.
3. The résumé's original view needed real zoom controls. Added actual-size opening, Zoom in, Zoom out and Fit width, and checked their behavior in Chrome.

Remaining visual limit: no authentic video was supplied or needed for reading the personal document archive. The inspector's no-footage warning is accepted; the portrait has slow motion and every animation has a reduced-motion fallback. The résumé detail screen intentionally contains one original document, with few-pictures/still-page allowances for that screen only.

## Verification results

- **25 automated tests passed.** These cover every accepted file extension/MIME, signature/size rejection, Worker authorization and CORS, Office media acceptance, atomic draft transactions, concurrent-save protection, failed online saves, release migration, local asset references, JavaScript syntax/imports and preservation of the original résumé.
- **46 browser workflow checks passed.** Chrome checked all 20 routes; the nine visible content sections were checked at 1440, 768 and 390 px. Workflows covered certificate add/edit/delete, cancellation without orphan drafts, exact field order, genuine Word/PowerPoint/PDF/PNG/JPEG files, file replacement, Office download behavior, search/filters/pagination, draft recovery, public/owner separation, education/profile editing, custom section addresses/export, owner tools, contact validation, keyboard focus and legacy-storage fallback.
- **Focused viewer checks passed:** zoom in/out, fit width, print button invocation, print layout and reduced-motion behavior.
- **Source design lint:** zero failures and zero warnings.
- **Rendered homepage, certificate archive and résumé inspections:** zero failures at desktop/tablet/phone sizes. The remaining warning is no-footage, accepted for the reason above.
- **No uncaught JavaScript exceptions** in the browser workflow suite.

Troubleshooting found and fixed a race that could clear a newer draft while an older publish completed, and a mismatch between custom section addresses and saved content IDs. Regression tests cover both. Other fixes include unique upload filenames, recovery from malformed saved connection settings, full-width original résumé preservation and replacing nested/multi-record editing with a single dialog.

## Validation limits and release state

Browser tests use test-only authentication and mocked online writes against a local copy, so they do not publish test records to the live portfolio. Worker behavior is tested with a mocked database/GitHub authorization response. Actual production credentials, a real cross-device publish and a Worker deployment are outside these local checks. The compatibility fallback is implemented and tested for the currently older Worker.

The source is prepared as a separate reviewed branch/pull request. Main and the live website are unchanged until the reviewed revision is merged and deployed. There are no known failures in the tested flows; these checks do not claim a universal guarantee across every browser, file or external service condition.
