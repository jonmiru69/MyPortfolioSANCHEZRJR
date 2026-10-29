import { renderItemManager, openItemEditor } from "./item-editor.js";
export function renderContentEditor(
  container,
  tabId = "certificates",
  itemId = null,
) {
  if (itemId) return openItemEditor(tabId, itemId);
  return renderItemManager(container, tabId || "certificates");
}
