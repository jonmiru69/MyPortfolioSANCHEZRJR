import { store } from "../store.js";
import { openDetailsEditor } from "./item-editor.js";
export function renderTabEditor(container) {
  container.replaceChildren();
  const note = document.createElement("p");
  note.textContent =
    "Edit one section at a time. Changes save only when you choose Save changes.";
  container.append(note);
  const launch = (title, path, defaults) => {
    container.closest("dialog")?.close();
    openDetailsEditor(title, "site.json", path, defaults);
  };
  store.site.tabs.forEach((tab, index) => {
    const row = document.createElement("div");
    row.className = "manager-row";
    const label = document.createElement("span");
    label.textContent = tab.label + (tab.enabled === false ? " (hidden)" : "");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-secondary";
    button.textContent = "Edit section";
    button.onclick = () => launch("Edit section", ["tabs", index]);
    row.append(label, button);
    container.append(row);
  });
  const add = document.createElement("button");
  add.type = "button";
  add.className = "btn btn-primary";
  add.textContent = "Add section";
  add.onclick = () =>
    launch("Add section", ["tabs", store.site.tabs.length], {
      id: "section-" + crypto.randomUUID(),
      slug: "",
      label: "",
      summary: "",
      enabled: true,
      order: store.site.tabs.length + 1,
    });
  container.append(add);
}
