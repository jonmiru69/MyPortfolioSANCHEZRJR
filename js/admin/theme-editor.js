import { openDetailsEditor } from "./item-editor.js";
export function renderThemeEditor(container) {
  container.innerHTML =
    "<p>Change appearance settings in one focused editor.</p>";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-primary";
  button.textContent = "Edit appearance";
  button.onclick = () =>
    openDetailsEditor("Edit appearance", "site.json", ["theme"]);
  container.append(button);
}
