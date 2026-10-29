/**
 * GitHub REST API Client (Git Data API & Contents)
 * Implements token auth, push verification, blob creation, tree updates, and single-commit publish.
 */

const TOKEN_KEY_SESSION = "portfolio_github_token";
const TOKEN_KEY_LOCAL = "portfolio_github_token_local";
const REPO_CONFIG_KEY = "portfolio_repo_config";

class GitHubClient {
  constructor() {
    this.token = null;
    this.owner = "";
    this.repo = "";
    this.branch = "main";
    this.remember = false;
    this.loadStoredCredentials();
  }

  loadStoredCredentials() {
    this.token =
      sessionStorage.getItem(TOKEN_KEY_SESSION) ||
      localStorage.getItem(TOKEN_KEY_LOCAL) ||
      null;
    let repoConfig = {};
    try {
      repoConfig =
        JSON.parse(localStorage.getItem(REPO_CONFIG_KEY) || "{}") || {};
    } catch {
      localStorage.removeItem(REPO_CONFIG_KEY);
    }
    this.owner = repoConfig.owner || "";
    this.repo = repoConfig.repo || "";
    this.branch = repoConfig.branch || "main";
    this.remember = !!localStorage.getItem(TOKEN_KEY_LOCAL);
  }

  setCredentials(token, owner, repo, branch = "main", remember = false) {
    this.token = token.trim();
    this.owner = owner.trim();
    this.repo = repo.trim();
    this.branch = branch.trim() || "main";
    this.remember = remember;

    if (remember) {
      localStorage.setItem(TOKEN_KEY_LOCAL, this.token);
      sessionStorage.removeItem(TOKEN_KEY_SESSION);
    } else {
      sessionStorage.setItem(TOKEN_KEY_SESSION, this.token);
      localStorage.removeItem(TOKEN_KEY_LOCAL);
    }

    localStorage.setItem(
      REPO_CONFIG_KEY,
      JSON.stringify({
        owner: this.owner,
        repo: this.repo,
        branch: this.branch,
      }),
    );
  }

  disconnect() {
    this.token = null;
    sessionStorage.removeItem(TOKEN_KEY_SESSION);
    localStorage.removeItem(TOKEN_KEY_LOCAL);
  }

  isAuthenticated() {
    return !!this.token && !!this.owner && !!this.repo;
  }

  async testConnection() {
    if (!this.isAuthenticated()) {
      return { ok: false, error: "No GitHub token or repository configured." };
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      if (!res.ok) {
        if (res.status === 401)
          throw new Error("Invalid or expired Personal Access Token.");
        if (res.status === 404)
          throw new Error(
            `Repository "${this.owner}/${this.repo}" not found or token lacks access.`,
          );
        throw new Error(`GitHub API error: ${res.statusText}`);
      }

      const repoData = await res.json();
      const hasPush =
        repoData.permissions &&
        (repoData.permissions.push || repoData.permissions.admin);
      if (!hasPush) {
        throw new Error(
          "Token does not have write (push) permission to this repository. Please grant Contents: Read and Write.",
        );
      }

      return {
        ok: true,
        repoName: repoData.full_name,
        defaultBranch: repoData.default_branch,
        sizeKb: repoData.size,
        visibility: repoData.visibility,
      };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  /**
   * Single Commit Publish using GitHub Git Data API
   * Blobs -> Tree -> Commit -> Update Ref
   */
  async publishChanges(changedFilesMap, commitMessage, onProgress = () => {}) {
    if (!this.isAuthenticated()) {
      throw new Error("Please connect your GitHub repository and token first.");
    }

    onProgress({
      step: "init",
      message: "Connecting to GitHub Git Data API...",
    });

    const headers = {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };

    // 1. Get branch reference (head commit SHA)
    onProgress({
      step: "ref",
      message: `Fetching latest commit from branch "${this.branch}"...`,
    });
    const refRes = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/git/ref/heads/${this.branch}`,
      { headers },
    );
    if (!refRes.ok)
      throw new Error(
        `Could not get ref for branch "${this.branch}": ${refRes.statusText}`,
      );
    const refData = await refRes.json();
    const latestCommitSha = refData.object.sha;

    // 2. Get commit details for the base tree SHA
    const commitRes = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/git/commits/${latestCommitSha}`,
      { headers },
    );
    if (!commitRes.ok)
      throw new Error(`Could not get base commit: ${commitRes.statusText}`);
    const commitData = await commitRes.json();
    const baseTreeSha = commitData.tree.sha;

    // 3. Create Git Blobs for each changed file
    const treeEntries = [];
    const entries = Object.entries(changedFilesMap);
    let index = 0;

    for (const [path, content] of entries) {
      index++;
      onProgress({
        step: "blobs",
        message: `Creating Git blob ${index}/${entries.length}: ${path}...`,
      });

      let blobPayload;
      if (typeof content === "string") {
        blobPayload = { content, encoding: "utf-8" };
      } else if (content instanceof Blob) {
        // Base64 encode binary blob
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.readAsDataURL(content);
        });
        blobPayload = { content: base64, encoding: "base64" };
      } else {
        blobPayload = {
          content: JSON.stringify(content, null, 2),
          encoding: "utf-8",
        };
      }

      const blobRes = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/blobs`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(blobPayload),
        },
      );
      if (!blobRes.ok)
        throw new Error(
          `Failed to create blob for ${path}: ${blobRes.statusText}`,
        );
      const blobData = await blobRes.json();

      treeEntries.push({
        path: path.replace(/^\/+/, ""), // strip leading slash
        mode: "100644", // normal file
        type: "blob",
        sha: blobData.sha,
      });
    }

    // 4. Create new Git Tree
    onProgress({ step: "tree", message: "Assembling unified Git tree..." });
    const treeRes = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/git/trees`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treeEntries,
        }),
      },
    );
    if (!treeRes.ok)
      throw new Error(`Failed to create Git tree: ${treeRes.statusText}`);
    const treeData = await treeRes.json();

    // 5. Create new Commit
    onProgress({ step: "commit", message: "Creating unified commit..." });
    const newCommitRes = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/git/commits`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          message:
            commitMessage ||
            `Update portfolio data via owner admin (${new Date().toLocaleDateString()})`,
          tree: treeData.sha,
          parents: [latestCommitSha],
        }),
      },
    );
    if (!newCommitRes.ok)
      throw new Error(`Failed to create commit: ${newCommitRes.statusText}`);
    const newCommitData = await newCommitRes.json();

    // 6. Update Branch Ref to new commit
    onProgress({
      step: "update-ref",
      message: `Updating branch "${this.branch}" head...`,
    });
    const updateRefRes = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/git/refs/heads/${this.branch}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          sha: newCommitData.sha,
          force: false,
        }),
      },
    );
    if (!updateRefRes.ok)
      throw new Error(
        `Failed to update branch ref: ${updateRefRes.statusText}`,
      );

    onProgress({
      step: "done",
      message: "Published successfully in 1 commit!",
      commitSha: newCommitData.sha,
    });
    return {
      success: true,
      commitSha: newCommitData.sha,
      commitUrl: `https://github.com/${this.owner}/${this.repo}/commit/${newCommitData.sha}`,
    };
  }
}

export const github = new GitHubClient();
