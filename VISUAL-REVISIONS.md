# Visual revisions — 1 November 2026

Retained the dark-room direction (seed 434418671), Imbue/Albert Sans typography, original portrait and certificate documents. This is a bounded revision of an existing design; no direction redraw, stock imagery or invented content.

- Overview now uses two equal columns separated by a fluid 32–72px gutter. The portrait is 480px square at desktop, centred in its column and vertically aligned to the introduction. On phones it becomes a large centred image, with the name and primary actions immediately after it.
- A single reveal controller now observes DOM additions across routes, certificate pagination, filters and owner edits. Newly inserted text receives the same 700ms rise with 70ms stagger. Removed nodes are unobserved; reduced-motion preferences remain respected. Resting content remains visible if animation is unavailable.
- Certificates use one complete record per page instead of six large stacked records. All eight metadata fields retain 16px text. Compact laptop composition keeps the record and pagination within 1366×768; desktop also verified at 1440×900. Phones retain natural scrolling for readable details.
- Document previews default to Fit page, with zoom/fit-width and explicit navigation for multi-page documents. The original resume's actual-size mode is preserved.
- Overview heading now reads “Research and thesis authored”; the actual biofuel thesis title remains in the accompanying description and research record.

## Verification
30 existing Node tests passed. All 47 existing browser regression checks passed with updated one-record pagination expectations. New `tests/visual-revisions.mjs` verifies portrait dimensions and centre alignment, all eight metadata reveals on certificate pages 1–3, visible desktop/laptop pagination, fit-page/no-overflow viewer, zoom, multi-page navigation, 320/390/768px routes and reduced motion. No uncaught browser errors.

Design source lint: zero failures/warnings. Design inspector: zero failures, one warning for no footage, retained because original professional documents and portrait are appropriate to this portfolio. The portrait provides gentle movement; no unrelated stock video was introduced.

Screenshots reviewed at desktop, tablet and phone sizes, plus certificate and fit-page views. Final critique: composition 8.5/10, typography 8.5, media integration 8.5, motion consistency 8.5, mobile 8, reading ergonomics 8.5. These are subjective design assessments. The main remaining constraint is long metadata on small phones, which intentionally scrolls instead of shrinking text.
