import { github } from "./github.js";
import { store } from "./store.js";
import { renderPublish } from "./admin/publish.js";
import { renderTabEditor } from "./admin/tab-editor.js";
import { openItemEditor, openDetailsEditor } from "./admin/item-editor.js";
import { editorDialog } from "./admin/dialog.js";

export function setupInlineOwner(app) {
  let enabled = store.isDraftMode;
  const controls = document.querySelector(".top-bar-controls");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-toggle-btn";
  button.textContent = "Owner mode";
  button.setAttribute("aria-pressed", "false");
  const shortcut = document.createElement("a");
  shortcut.href = "#/certificates";
  shortcut.className = "btn btn-primary owner-shortcut";
  shortcut.textContent = "Manage certificates";
  shortcut.hidden = true;
  const sync = document.createElement("button");
  sync.type = "button";
  sync.className = "cloud-sync-status";
  sync.hidden = true;
  sync.onclick = () => {
    const api = editorDialog("Sync portfolio");
    if (api) renderPublish(api.body);
  };
  controls.append(shortcut, sync, button);
  const update = () => {
    enabled = store.isDraftMode;
    document.body.classList.toggle("owner-mode", enabled);
    button.textContent = enabled ? "Exit owner mode" : "Owner mode";
    button.setAttribute("aria-pressed", String(enabled));
    shortcut.hidden = !enabled;
    sync.hidden = !enabled;
    sync.textContent = store.cloudStatus || "Saved on this device";
  };
  store.subscribe("cloud-status", update);
  async function activate() {
    await store.setOwnerMode(true);
    update();
    app.renderTabs();
    await app.handleRoute(app.currentRoute());
  }
  function authenticate() {
    const api = editorDialog("Connect owner access");
    if (!api) return;
    api.body.innerHTML =
      '<p>Connect your GitHub owner access to edit this portfolio.</p><form><label for="inline-token">GitHub token</label><input id="inline-token" type="password" autocomplete="off" required class="form-input"><button type="submit" class="btn btn-primary">Connect</button><p role="status"></p></form>';
    api.body.querySelector("form").onsubmit = async (e) => {
      e.preventDefault();
      if (api.busy) return;
      api.busy = true;
      const form = e.currentTarget;
      const status = form.querySelector('[role="status"]');
      const submit = form.querySelector("button");
      submit.disabled = true;
      status.textContent = "Checking owner access…";
      try {
        github.setCredentials(
          form.querySelector("input").value,
          "jonmiru69",
          "MyPortfolioSANCHEZRJR",
          "main",
          false,
        );
        const result = await github.testConnection();
        if (!result.ok) {
          github.disconnect();
          throw new Error(result.error || "Could not verify owner access.");
        }
        await activate();
        api.dirty = false;
        api.close();
      } catch (error) {
        status.textContent = error.message;
        submit.disabled = false;
      } finally {
        api.busy = false;
      }
    };
  }
  button.onclick = async () => {
    if (enabled) {
      button.disabled = true;
      try {
        if (store.cloudSaving) await store.cloudSaving;
        if (store.changedFiles.size && !store.cloudNeedsReview) {
          try {
            await store.publishCloud();
          } catch {}
        }
        await store.setOwnerMode(false);
        update();
        await app.handleRoute(app.currentRoute());
      } finally {
        button.disabled = false;
      }
      return;
    }
    if (!github.isAuthenticated()) {
      authenticate();
      return;
    }
    button.disabled = true;
    try {
      const result = await github.testConnection();
      if (!result.ok) {
        authenticate();
        return;
      }
      await activate();
    } finally {
      button.disabled = false;
    }
  };
  function action(label, handler, primary = false) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn " + (primary ? "btn-primary" : "btn-secondary");
    b.textContent = label;
    b.onclick = handler;
    return b;
  }
  function decorate() {
    document
      .querySelectorAll(".owner-inline-control")
      .forEach((el) => el.remove());
    update();
    if (!enabled || app.currentRoute() === "admin") return;
    const route = app.currentRoute();
    const page = app.pageContainer.querySelector(".page-view");
    if (!page) return;
    const bar = document.createElement("div");
    bar.className = "owner-inline-control owner-page-actions";
    bar.dataset.ui = "";
    bar.setAttribute("aria-label", "Owner editing actions");
    if (route === "cover") {
      bar.append(
        action("Edit introduction", () =>
          openDetailsEditor("Edit introduction", "site.json", ["overview"]),
        ),
        action("Edit identity & photo", () =>
          openDetailsEditor("Edit identity & photo", "site.json", ["identity"]),
        ),
      );
    } else if (route === "profile") {
      bar.append(
        action("Edit profile", () =>
          openDetailsEditor("Edit profile", "profile"),
        ),
        action("Edit identity & photo", () =>
          openDetailsEditor("Edit identity & photo", "site.json", ["identity"]),
        ),
      );
    } else if (route === "contact") {
      bar.append(
        action("Edit contact", () =>
          openDetailsEditor("Edit contact", "contact"),
        ),
        action("Edit inquiry settings", () =>
          openDetailsEditor("Edit inquiry settings", "site.json", ["contact"]),
        ),
      );
    } else if (route === "resume") {
      bar.append(
        action("Edit résumé & file", () =>
          openDetailsEditor("Edit résumé & file", "resume"),
        ),
      );
    } else {
      bar.append(
        action(
          route === "certificates" ? "Add certificate" : "Add item",
          () => openItemEditor(route),
          true,
        ),
      );
      if (route !== "certificates")
        bar.append(
          action("Edit section details", () =>
            openDetailsEditor("Edit section details", route),
          ),
        );
    }
    bar.append(
      action("Manage sections", () => {
        const api = editorDialog("Manage sections");
        if (api) renderTabEditor(api.body);
      }),
    );
    page.prepend(bar);
    page.querySelectorAll("[data-owner-item]").forEach((card) => {
      const wrap = document.createElement("div");
      wrap.className = "owner-inline-control owner-item-actions";
      wrap.dataset.ui = "";
      wrap.append(
        action(
          route === "certificates" ? "Edit certificate" : "Edit item",
          () =>
            openItemEditor(route, card.dataset.ownerItem, [
              card.dataset.ownerCollection || "items",
            ]),
        ),
      );
      card.prepend(wrap);
    });
    page.querySelectorAll("[data-owner-collection-add]").forEach((target) => {
      const wrap = document.createElement("div");
      wrap.className = "owner-inline-control";
      wrap.append(
        action("Add item", () =>
          openItemEditor(route, null, [target.dataset.ownerCollectionAdd]),
        ),
      );
      target.append(wrap);
    });
    const footer = document.querySelector(".site-footer");
    const edit = action("Edit footer", () =>
      openDetailsEditor("Edit footer", "site.json", ["identity"], {}, [
        "footer_text",
      ]),
    );
    edit.classList.add("owner-inline-control");
    footer.append(edit);
  }
  app.pageContainer.addEventListener("portfolio-list-rendered", () =>
    queueMicrotask(decorate),
  );
  document.addEventListener("portfolio-content-saved", () => {
    app.setupFooter();
    app.renderTabs();
    app.handleRoute(app.currentRoute());
  });
  update();
  return { decorate, isEnabled: () => enabled };
}
