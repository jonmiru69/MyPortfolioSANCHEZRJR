export function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

export function button(label, handler, primary = false) {
  const node = element(
    "button",
    label,
    primary ? "btn btn-primary" : "btn btn-secondary",
  );
  node.type = "button";
  node.addEventListener("click", handler);
  return node;
}

export function statusLine() {
  const node = element("p", "", "assistant-status");
  node.setAttribute("role", "status");
  return node;
}
