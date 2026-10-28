# Owner's Operational Guide: Physical Tabbed Portfolio Website

**Prepared for Ramelito Jr. C. Sanchez, LPT (Jonmiru)**  
*Special Science Program (STE) Faculty · Department of Education*  
*Zero-Cost (USD 0), Zero-Build Static Portfolio Binder on GitHub Pages*

---

## 1. Zero-Cost Confirmation & Architecture Principles

- **Total Cost:** Exactly **USD 0.00**.
- **No Paid Dependencies:** No paid hosting, domain subscription, database, CMS, or external build runner.
- **No NPM or Build Step:** The website runs on native HTML5, modern CSS custom properties, and ES-module JavaScript. What you commit is what GitHub Pages serves immediately.
- **Portability:** All asset and module paths are **relative**. The site functions identically whether served from a root custom domain (`jonmiru.github.io`) or any repository subpath (`jonmiru.github.io/portfolio-binder/`).

---

## 2. Initial Setup: Creating Your Free Repository

1. Log in to [GitHub.com](https://github.com).
2. Click the **+** icon in the upper-right corner and select **New repository**.
3. Choose a name: for example `portfolio-binder` (or `<your-username>.github.io` if you want it at your user root).
4. Set the visibility to **Public** (GitHub Pages is free for public repositories).
5. Leave "Add a README file" unchecked if you are pushing these created files.
6. Click **Create repository**.
7. Push or upload all files from this directory to the `main` branch.

---

## 3. Enabling Free GitHub Pages Hosting

1. In your GitHub repository, navigate to **Settings** (tab at the top right).
2. In the left navigation menu, click **Pages** (under the "Code and automation" heading).
3. Under **Build and deployment**:
   - **Source:** Select `Deploy from a branch`.
   - **Branch:** Select `main` and folder `/ (root)`.
4. Click **Save**.
5. Within 1 to 2 minutes, GitHub will display your live URL (e.g., `https://<your-username>.github.io/portfolio-binder/`).

---

## 4. Creating Your Fine-Grained Personal Access Token (Step-by-Step)

The owner admin panel (`#/admin`) connects directly to GitHub's REST API from your browser to commit changes. Only you with your token can publish edits.

1. In GitHub, click your **Profile picture** in the upper-right corner and click **Settings**.
2. Scroll to the very bottom of the left sidebar and click **Developer settings**.
3. Under **Personal access tokens**, click **Fine-grained tokens**, then click **Generate new token**.
4. Configure the token details:
   - **Token name:** `Portfolio Binder Admin - Jonmiru`
   - **Expiration:** Select `90 days` or `1 year` (GitHub will email you a reminder before it expires).
   - **Repository access:** Select **Only select repositories**, then choose your portfolio repository (`portfolio-binder`).
   - **Permissions -> Repository permissions:**
     - Locate **Contents**: Change from *No access* to **Read and write**.
     - (All other permissions should remain *No access*).
5. Click **Generate token** at the bottom.
6. **Copy your token immediately** (`github_pat_11...`). GitHub will not show it again once you leave the page.

---

## 5. Connecting and Managing Content in the Admin Panel

1. Open your live website in any modern web browser.
2. In the browser address bar, add `#/admin` (e.g., `https://username.github.io/portfolio-binder/#/admin`), or click **Owner Access** in the footer.
3. In **1. GitHub Connection**:
   - Enter your GitHub username (`Owner`).
   - Enter your repository name (`Repo`).
   - Paste your fine-grained token.
   - Check *Remember on this device* only if using your personal computer.
   - Click **Save & Test Connection**. You will see a green confirmation badge when connected.
4. **Editing Your Binder:**
   - **Tabs Manager:** Rename tab titles, reorder sections using the arrow buttons, toggle visibility, or add custom tabs.
   - **Content Items:** Select any section from the dropdown to add, edit, duplicate, reorder, or delete items. Attach certificate scans or PDF documents with client-side WebP compression and mandatory context statements.
   - **Theme & Tokens:** Adjust your primary accent color, dark/paper default modes, and wide display letter-spacing with live preview.
   - **Identity & SEO:** Update your professional credentials, positioning statement, DepEd email, and inquiry settings.
5. **Publishing Changes in 1 Commit:**
   - Whenever you make changes, an **Unsaved Changes** bar appears at the bottom.
   - Click **Review & Publish**.
   - Review the modified files list and enter a commit message.
   - Click **Publish 1-Commit Now**. Your changes are bundled and pushed to GitHub Pages in a single Git commit via the Git Data API.

---

## 6. Security and Privacy Rules for Public Static Repositories

> [!CAUTION]
> **Persistent Safety Warning:** Anything pushed to a public GitHub repository is permanently accessible on the internet, even if marked "Hidden" in the website interface.

1. **Masked Numbers:** Never store full Professional Regulation Commission (PRC) license registration numbers, Civil Service numbers, or government IDs. Always use masked representations (e.g., `No. ****8492`).
2. **Student Data:** Never upload learner grades, home addresses, disciplinary records, or identifiable minor student photos without signed DepEd parent consent forms.
3. **Token Revocation:** If you ever suspect your device or token was compromised:
   - Go to GitHub -> Settings -> Developer settings -> Personal access tokens.
   - Find your token and click **Revoke**.
   - Create a fresh replacement token and reconnect in the admin panel.

---

## 7. Backups and Offline Portability

- In the admin panel under **Backup & Storage**, click **Export Full Site as JSON**.
- This downloads a complete single-file backup (`portfolio-backup-YYYY-MM-DD.json`) containing all your site settings, themes, and content items.
- If you ever need to restore your portfolio or switch repositories, click **Import Full Site JSON** to restore everything instantly.

---

## 8. Troubleshooting Guide

| Problem | Cause | Solution |
| --- | --- | --- |
| **Blank White Screen on GitHub Pages** | Missing `.nojekyll` or wrong path casing | Verify `.nojekyll` exists in repo root. Ensure all filenames in `data/` and `assets/` are lowercase with no spaces. |
| **Changes Don't Appear Immediately** | Browser caching or Pages build queue | Hard refresh the browser (`Ctrl + F5` or `Cmd + Shift + R`). GitHub Pages typically completes builds within 60–90 seconds. |
| **Image or PDF Fails to Load** | Incorrect relative path | Ensure asset paths start with `assets/...` without leading slashes (`/assets/...`). |
| **Admin Reports "401 Unauthorized"** | Token has expired or lacks permissions | Check that your token has not expired and has `Contents: Read and write` permission on the specific repo. |
| **404 When Refreshing Deep Links** | Static host route mismatch | The included `404.html` automatically catches subpath requests and redirects back to the correct hash route (`index.html#/tab-slug`). |
