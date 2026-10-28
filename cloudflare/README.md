# Portfolio shared storage

The GitHub Pages frontend reads the published document from the Cloudflare Worker configured in `data/cloud.json`. No visitor account or token is required. D1 stores the site, section data, revision and uploaded image/PDF bytes. Existing approved certificate files remain in GitHub Pages; newly uploaded files are stored in D1.

Owner mode continues to use the existing GitHub personal access token. Every write is verified server-side against push permission on the fixed `jonmiru69/MyPortfolioSANCHEZRJR` repository. Tokens are forwarded only to GitHub for verification and are never stored in D1. Keep credentials out of source control.

## Editing

New edits save automatically after a short pause. Wait for **All changes saved online**. Older device drafts are recovered only in owner mode and require **Publish saved drafts to all devices** once. Failed saves retain the local draft; click its status to review and retry. A conflicting revision is rejected instead of overwriting changes made on another device. Visitors refresh the published snapshot on page load, window focus and every 30 seconds while visible. Viewer mode never applies local drafts.

This uses standard Workers and D1 free-plan resources; no paid plan or R2 subscription is enabled by this project. Free-tier service limits still apply. Media is split into 512 KiB D1 chunks, with a 20 MiB upload limit. Uploaded media URLs are immutable and derived from their SHA-256 hash. Do not upload private originals: public media URLs can be opened by anyone with the URL.

## Deployment and recovery

Install Node.js and run commands from the repository root:

```sh
npx wrangler login
npx wrangler deploy --config cloudflare/wrangler.jsonc
npx wrangler d1 export ramelito-portfolio --remote --output portfolio-backup.sql --config cloudflare/wrangler.jsonc
```

Keep database exports private; never commit them to this public repository. The existing database ID in the config must be reused. Do not reseed an existing live database from the static JSON files, since live edits are now authoritative in D1. GitHub commits update application code, while owner edits update the database. D1 Free includes a limited Time Travel recovery window; consult Cloudflare's current documentation before a restore.

If the database is temporarily unreachable, a fresh page can display the last GitHub Pages backup. Local failed drafts remain recoverable in owner mode. The original published data files remain a disaster-recovery baseline, not the source for subsequent cloud edits.
