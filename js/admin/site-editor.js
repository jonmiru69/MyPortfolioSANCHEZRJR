import { openDetailsEditor } from "./item-editor.js";
export function renderSiteEditor(container) {
  container.innerHTML =
    '<p>Choose the details to edit. Each opens in its own popup.</p><div class="manager-list"></div>';
  for (const [label, key, path] of [
    ["Identity and photo", "site.json", ["identity"]],
    ["Overview writing", "site.json", ["overview"]],
    ["Profile writing", "profile", []],
    ["Contact details", "contact", []],
    ["Contact settings", "site.json", ["contact"]],
    ["Search and sharing", "site.json", ["seo"]],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-secondary";
    button.textContent = "Edit " + label.toLowerCase();
    button.onclick = () => openDetailsEditor(label, key, path);
    container.querySelector(".manager-list").append(button);
  }
}
