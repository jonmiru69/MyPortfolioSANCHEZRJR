let active = null;
// Every editor shares this one native dialog. It supplies focus trapping and Escape support.
export function editorDialog(title) {
  const existing = document.querySelector("dialog[open]");
  if (existing) {
    existing.focus();
    return null;
  }
  const previous = document.activeElement;
  const element = document.createElement("dialog");
  element.className = "owner-dialog";
  element.setAttribute("aria-labelledby", "editor-title");
  element.dataset.ui = "";
  const header = document.createElement("header");
  header.className = "owner-dialog-header";
  const heading = document.createElement("h2");
  heading.id = "editor-title";
  heading.textContent = title;
  const close = document.createElement("button");
  close.type = "button";
  close.className = "btn btn-secondary";
  close.textContent = "Cancel";
  const body = document.createElement("div");
  body.className = "owner-dialog-body";
  header.append(heading, close);
  element.append(header, body);
  document.body.append(element);
  const api = {
    element,
    body,
    dirty: false,
    busy: false,
    cleanup: [],
    close: () => element.close(),
  };
  active = api;
  const cancel = () => {
    if (api.busy) return;
    if (!api.dirty) {
      element.close();
      return;
    }
    if (body.querySelector(".discard-confirmation")) return;
    const hint = document.createElement("div");
    hint.className = "discard-confirmation";
    hint.setAttribute("role", "alert");
    const message = document.createElement("p");
    message.textContent = "Discard your unsaved changes?";
    const discard = document.createElement("button");
    discard.type = "button";
    discard.className = "btn btn-secondary";
    discard.textContent = "Discard changes";
    discard.onclick = () => element.close();
    const keep = document.createElement("button");
    keep.type = "button";
    keep.className = "btn btn-primary";
    keep.textContent = "Keep editing";
    keep.onclick = () => {
      hint.remove();
      close.focus();
    };
    hint.append(message, discard, keep);
    body.prepend(hint);
    hint.scrollIntoView({ block: "nearest" });
    keep.focus();
  };
  close.addEventListener("click", cancel);
  element.addEventListener("cancel", (e) => {
    e.preventDefault();
    cancel();
  });
  const routeClose = () => cancel();
  window.addEventListener("hashchange", routeClose);
  element.addEventListener("input", () => {
    api.dirty = true;
  });
  element.addEventListener("change", () => {
    api.dirty = true;
  });
  element.addEventListener(
    "close",
    () => {
      api.cleanup.forEach((fn) => fn());
      window.removeEventListener("hashchange", routeClose);
      element.remove();
      if (active === api) active = null;
      if (!document.querySelector("dialog[open]")) {
        document.body.classList.remove("editor-open");
        if (previous?.isConnected) previous.focus();
      }
    },
    { once: true },
  );
  document.body.classList.add("editor-open");
  element.showModal();
  return api;
}
export function contentSaved() {
  document.dispatchEvent(new CustomEvent("portfolio-content-saved"));
}
