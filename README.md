# Tabbed Portfolio Website: Professional Teaching Binder

> **A physical tabbed binder web portfolio engineered for Ramelito Jr. C. Sanchez, LPT (Jonmiru)**  
> *Secondary Science Educator & STE Program Faculty · Department of Education*  
> *Production-Ready · Zero Cost ($0) · Zero-Build Static Architecture on GitHub Pages*

---

## Highlights & Design Architecture

- **Physical Binder Metaphor:** Centered canvas surface with divider index tabs along the right edge, spine rings on the left, sheet protector evidence cards, and 250ms page-turn animation.
- **Design Restraint (atalanta.tech Inferred Principles):** Mission-first hero positioning statement, wide signature display tracking (`0.35em` to `0.45em`), near-black `#0A0B0D` default background with refined paper theme toggle, and proof over claims.
- **20 Structured Tabs:**
  1. Cover · 2. Contents · 3. Profile · 4. Résumé / CV · 5. Philosophy · 6. Education · 7. Eligibilities (Masked) · 8. Certificates · 9. Research · 10. Teaching · 11. Materials · 12. Performance (7 PPST Domains) · 13. Awards · 14. Service · 15. Digital Tools · 16. Development Plan · 17. Reading & Memberships · 18. References (Opt-In) · 19. Gallery · 20. Contact
- **Owner Admin Panel (`#/admin`):**
  - Authenticated directly via fine-grained GitHub Personal Access Token (PAT) with `Contents: Read and write`.
  - Visual editors for tabs (drag/order/rename/hide/custom), theme tokens, content items, and SEO.
  - Client-side WebP compression and media validation.
  - 1-Commit publishing directly to GitHub Pages via the Git Data API.
  - Single-file JSON export and import for complete offline portability.
- **Total Cost:** USD 0. No paid hosting, database, CMS, or domain required.

---

## Local Development & Testing

Since this website uses plain HTML5, CSS custom properties, and native ES modules with zero build steps, you can run it using any static web server:

### Option A: Using PowerShell (Built into Windows)
```powershell
# From the project directory:
powershell -ExecutionPolicy Bypass -File ./serve.ps1
# Open http://localhost:8080 in your browser
```

### Option B: Using Python (if installed)
```bash
python -m http.server 8000
# Open http://localhost:8000
```

### Option C: Using VS Code / IDE Live Server
Right-click `index.html` and click **Open with Live Server**.

---

## Repository Structure

```text
portfolio-binder/
├── index.html              # Main static binder interface & JSON-LD
├── 404.html                # GitHub Pages redirect handler for hash routing
├── .nojekyll               # Disables Jekyll processing on GitHub Pages
├── robots.txt              # Search engine crawling rules
├── sitemap.xml             # Search engine site index
├── README.md               # Project overview & running instructions
├── OWNER-GUIDE.md          # Step-by-step owner operational guide
├── .github/
│   └── workflows/
│       └── validate.yml    # Free CI workflow testing JSON syntax and asset limits
├── css/
│   ├── tokens.css          # Design tokens & CSS custom properties (dark & paper)
│   ├── base.css            # Typography, resets, buttons, chips, form controls
│   ├── binder.css          # Physical binder layout, spine rings, tabs, sleeves, lightbox
│   ├── admin.css           # Owner admin panel, editors, modal dialogs
│   └── print.css           # Paper & PDF optimized print stylesheets
├── js/
│   ├── app.js              # Central entry point & renderer router
│   ├── router.js           # Hash-based routing & keyboard navigation
│   ├── store.js            # State store, IndexedDB drafts, presets, event emitter
│   ├── schema.js           # Shared item schema validation & version migrations
│   ├── media.js            # Client-side WebP compression & budget meter
│   ├── github.js           # GitHub REST Git Data API 1-commit publisher
│   ├── render/             # 21 modular tab renderers
│   └── admin/              # Admin subview controllers & editors
├── data/
│   ├── site.json           # Site identity, theme tokens, tab definitions, SEO
│   └── content/            # 18 structured content files for all evidence tabs
└── assets/
    ├── docs/               # Official verification and evidence documents
    └── images/             # Vector portraits, cover art, and photo evidence
```

---

## Operational Guide

See [OWNER-GUIDE.md](OWNER-GUIDE.md) for full instructions on setting up GitHub Pages, creating a fine-grained Personal Access Token, publishing updates, and safety guidelines.
