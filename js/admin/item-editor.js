import { store } from "../store.js";
import { FILE_ACCEPT, prepareUpload } from "../upload-policy.js";
import { escapeHTML as safe, labelFor } from "../utils.js";
import { editorDialog, contentSaved } from "./dialog.js";

export const CERTIFICATE_FIELDS = [
  ["issue_date", "Date issued", "date"],
  ["certificate_kind", "Certificate type"],
  ["delivery_mode", "Delivery mode"],
  ["title", "Seminar title"],
  ["seminar_topic", "Seminar topic", "textarea"],
  ["organization", "Seminar provider"],
  ["training_code", "Training code"],
  ["cpd_points", "CPD points", "number"],
];
const OMIT = new Set([
  "id",
  "schema_version",
  "version",
  "exported_at",
  "preview_images",
  "mime",
  "content_release",
  "bg_canvas",
  "tracking_display",
  "transition_speed",
]);
const templates = {
  education: {
    title: "",
    subtitle: "",
    organization: "",
    date_start: "",
    date_end: "",
    description: "",
    evidence: [],
  },
  teaching: {
    title: "",
    organization: "",
    date_start: "",
    date_end: "",
    curriculum: "",
    grade_levels: "",
    subjects: [],
    responsibilities: [],
    description: "",
    evidence: [],
  },
  research: {
    title: "",
    subtitle: "",
    organization: "",
    date_start: "",
    description: "",
    authors: [],
    links: [],
    evidence: [],
  },
  gallery: { title: "", description: "", evidence: [] },
};
const getAt = (obj, path) => path.reduce((current, key) => current?.[key], obj);
const setAt = (obj, path, value) => {
  let current = obj;
  for (const key of path.slice(0, -1)) current = current[key] ??= {};
  current[path.at(-1)] = value;
};
let fieldSequence = 0;

function field(parent, object, key, label = labelFor(key), type = null) {
  const wrap = document.createElement("div");
  wrap.className = "editor-field";
  const id = "edit-field-" + ++fieldSequence;
  const name = document.createElement("label");
  name.htmlFor = id;
  name.textContent = label;
  const value = object[key];
  type ||=
    typeof value === "boolean"
      ? "checkbox"
      : typeof value === "number"
        ? "number"
        : /email/.test(key)
          ? "email"
          : /description|summary|bio|statement|abstract|topic/.test(key)
            ? "textarea"
            : "text";
  const choices =
    key === "visibility"
      ? ["public", "hidden"]
      : key === "default_mode"
        ? ["light", "dark"]
        : null;
  const control = document.createElement(
    choices ? "select" : type === "textarea" ? "textarea" : "input",
  );
  control.id = id;
  control.name = key;
  control.className = type === "textarea" ? "form-textarea" : "form-input";
  if (choices)
    for (const choice of choices) {
      const option = document.createElement("option");
      option.value = choice;
      option.textContent = labelFor(choice);
      control.append(option);
    }
  else if (type !== "textarea") control.type = type;
  if (type === "checkbox") control.checked = !!value;
  else control.value = value ?? "";
  if (type === "number") {
    control.step = "any";
    if (key === "cpd_points") {
      control.min = "0";
      control.max = "10000";
      control.step = "0.01";
    }
  }
  if (key === "title" || key === "name" || key === "degree" || key === "role")
    control.required = true;
  control.addEventListener("input", () => {
    object[key] =
      type === "checkbox"
        ? control.checked
        : type === "number"
          ? control.value === ""
            ? null
            : Number(control.value)
          : control.value;
  });
  wrap.append(name, control);
  parent.append(wrap);
  return control;
}

function attachments(parent, object, key, api, pending, single = false) {
  object[key] ||= [];
  const section = document.createElement("section");
  section.className = "attachment-editor";
  const heading = document.createElement("h3");
  heading.textContent = single ? "Certificate file" : "Files";
  const help = document.createElement("p");
  help.textContent =
    "Choose an image, PDF, Word or PowerPoint file. Maximum 20 MB per file.";
  const input = document.createElement("input");
  input.type = "file";
  input.accept = FILE_ACCEPT;
  input.id = "upload-" + ++fieldSequence;
  input.multiple = !single;
  input.className = "form-input";
  const label = document.createElement("label");
  label.htmlFor = input.id;
  label.textContent = single ? "Upload or replace certificate" : "Upload files";
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  const list = document.createElement("div");
  list.className = "attachment-list";
  const draw = () => {
    list.replaceChildren();
    for (const ev of object[key]) {
      const row = document.createElement("div");
      row.className = "attachment-row";
      const name = document.createElement("span");
      name.textContent = ev.original_name || ev.label || "Attached file";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn btn-secondary";
      remove.textContent = "Remove file";
      remove.addEventListener("click", () => {
        object[key] = object[key].filter((x) => x !== ev);
        pending.delete(ev.file);
        api.dirty = true;
        draw();
      });
      row.append(name, remove);
      list.append(row);
    }
  };
  input.addEventListener("change", async () => {
    if (!input.files.length) return;
    input.disabled = true;
    api.busy = true;
    status.textContent = "Checking file…";
    try {
      const uploads = [];
      for (const file of input.files) uploads.push(await prepareUpload(file));
      if (single) {
        for (const ev of object[key]) pending.delete(ev.file);
        object[key] = [];
      }
      for (const upload of uploads) {
        pending.set(upload.path, upload.blob);
        object[key].push(upload.evidence);
      }
      api.dirty = true;
      status.textContent = single
        ? "File selected. Save the certificate to upload it."
        : "Files selected. Save this item to upload them.";
      draw();
    } catch (error) {
      status.textContent = error.message;
    } finally {
      input.value = "";
      input.disabled = false;
      api.busy = false;
    }
  });
  section.append(heading, help, label, input, status, list);
  parent.append(section);
  draw();
}

// All structured data stays in normal labelled fields, including nested entries.
function structured(parent, object, api, pending) {
  for (const key of Object.keys(object)) {
    if (OMIT.has(key)) continue;
    const value = object[key];
    if (key === "evidence") {
      attachments(parent, object, key, api, pending);
      continue;
    }
    if (
      [
        "avatar",
        "cover_image",
        "image",
        "image_url",
        "file",
        "download_url",
      ].includes(key)
    ) {
      const section = document.createElement("div");
      section.className = "editor-field";
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "file";
      input.accept = FILE_ACCEPT;
      input.className = "form-input";
      input.id = "file-" + ++fieldSequence;
      label.htmlFor = input.id;
      label.textContent = "Upload " + labelFor(key).toLowerCase();
      const status = document.createElement("p");
      status.textContent = value
        ? "A file is attached. Choose a file to replace it."
        : "No file attached.";
      status.setAttribute("role", "status");
      input.addEventListener("change", async () => {
        if (!input.files[0]) return;
        api.busy = true;
        input.disabled = true;
        try {
          const upload = await prepareUpload(input.files[0]);
          if (
            /avatar|cover_image|image/.test(key) &&
            upload.evidence.type !== "image"
          )
            throw new Error("Choose an image for this picture.");
          pending.delete(object[key]);
          object[key] = upload.path;
          if (key === "file") Object.assign(object, upload.evidence);
          pending.set(upload.path, upload.blob);
          api.dirty = true;
          status.textContent = upload.evidence.label + " selected.";
        } catch (e) {
          status.textContent = e.message;
        } finally {
          api.busy = false;
          input.disabled = false;
          input.value = "";
        }
      });
      section.append(label, input, status);
      parent.append(section);
      continue;
    }
    if (Array.isArray(value)) {
      const section = document.createElement("fieldset");
      section.className = "editor-array";
      const legend = document.createElement("legend");
      legend.textContent = labelFor(key);
      section.append(legend);
      const rows = document.createElement("div");
      section.append(rows);
      const example = value.find((v) => v && typeof v === "object");
      const defaults =
        key === "key_facts"
          ? { label: "", value: "" }
          : key === "links" || key === "social_links"
            ? { label: "", url: "" }
            : key === "experience"
              ? { role: "", organization: "", period: "", highlights: [] }
              : key === "education"
                ? { degree: "", institution: "", period: "", honors: "" }
                : null;
      const draw = () => {
        rows.replaceChildren();
        object[key].forEach((entry, index) => {
          const row = document.createElement("div");
          row.className = "editor-array-row";
          if (entry && typeof entry === "object")
            structured(row, entry, api, pending);
          else {
            const holder = { value: entry };
            const control = field(
              row,
              holder,
              "value",
              labelFor(key).replace(/s$/, ""),
            );
            control.addEventListener(
              "input",
              () => (object[key][index] = holder.value),
            );
          }
          const remove = document.createElement("button");
          remove.type = "button";
          remove.textContent = "Remove";
          remove.className = "btn btn-secondary";
          remove.addEventListener("click", () => {
            object[key].splice(index, 1);
            api.dirty = true;
            draw();
          });
          row.append(remove);
          rows.append(row);
        });
      };
      const add = document.createElement("button");
      add.type = "button";
      add.className = "btn btn-secondary";
      add.textContent = "Add " + labelFor(key).toLowerCase();
      add.addEventListener("click", () => {
        object[key].push(
          example ? blankFrom(example) : structuredClone(defaults ?? ""),
        );
        api.dirty = true;
        draw();
        rows.lastElementChild?.querySelector("input,textarea")?.focus();
      });
      section.append(add);
      parent.append(section);
      draw();
    } else if (value && typeof value === "object") {
      const group = document.createElement("fieldset");
      group.className = "editor-array";
      const legend = document.createElement("legend");
      legend.textContent = labelFor(key);
      group.append(legend);
      structured(group, value, api, pending);
      parent.append(group);
    } else field(parent, object, key);
  }
}
function blankFrom(example) {
  return Object.fromEntries(
    Object.entries(example)
      .filter(([k]) => !OMIT.has(k))
      .map(([k, v]) => [
        k,
        Array.isArray(v)
          ? []
          : typeof v === "boolean"
            ? false
            : typeof v === "number"
              ? null
              : v && typeof v === "object"
                ? blankFrom(v)
                : "",
      ]),
  );
}

function saveControls(form, api, save, existing, onDelete) {
  const status = document.createElement("p");
  status.className = "editor-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const actions = document.createElement("div");
  actions.className = "editor-actions";
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "btn btn-primary";
  submit.textContent = "Save changes";
  if (existing && onDelete) {
    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn btn-secondary";
    del.textContent = "Delete item";
    let armed = false;
    del.addEventListener("click", async () => {
      if (api.busy) return;
      if (!armed) {
        armed = true;
        del.textContent = "Confirm delete";
        status.textContent = "Click Confirm delete to remove this item.";
        return;
      }
      await run(onDelete);
    });
    actions.append(del);
  }
  actions.append(submit);
  form.append(status, actions);
  async function run(operation) {
    if (api.busy) return;
    api.busy = true;
    form.querySelectorAll("button").forEach((b) => (b.disabled = true));
    status.textContent = "Saving…";
    try {
      await operation();
      api.dirty = false;
      api.close();
      contentSaved();
    } catch (error) {
      status.textContent = "Could not save: " + error.message;
      form.querySelectorAll("button").forEach((b) => (b.disabled = false));
    } finally {
      api.busy = false;
    }
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.reportValidity()) run(save);
  });
}

export async function openItemEditor(
  tabId,
  itemId = null,
  collectionPath = ["items"],
) {
  if (!store.isDraftMode) return;
  const certificate = tabId === "certificates";
  const api = editorDialog(
    itemId
      ? certificate
        ? "Edit certificate"
        : "Edit item"
      : certificate
        ? "Add certificate"
        : "Add item",
  );
  if (!api) return;
  try {
    const source = await store.getTabContent(tabId);
    if (!api.element.isConnected) return;
    const items = getAt(source, collectionPath) || [];
    const indexHint = String(itemId || "").startsWith("@index:")
      ? Number(itemId.slice(7))
      : -1;
    const original =
      indexHint >= 0
        ? items[indexHint]
        : itemId
          ? items.find((i) => i.id === itemId)
          : null;
    if (itemId && !original)
      throw new Error(
        "This item is no longer available. Close the editor and refresh.",
      );
    const working = structuredClone(
      original ||
        (certificate
          ? Object.fromEntries(
              CERTIFICATE_FIELDS.map(([key]) => [
                key,
                key === "cpd_points" ? null : "",
              ]),
            )
          : templates[tabId] ||
            blankFrom(
              items[0] || {
                title: "",
                subtitle: "",
                organization: "",
                date_start: "",
                date_end: "",
                description: "",
                evidence: [],
              },
            )),
    );
    working.id ||= `${tabId}-${crypto.randomUUID()}`;
    working.visibility ||= "public";
    working.evidence ||= [];
    const pending = new Map();
    const form = document.createElement("form");
    form.className = "item-editor-form";
    if (certificate) {
      const help = document.createElement("p");
      help.textContent =
        "Enter the details printed on the certificate. Leave unstated dates, training codes and CPD points blank.";
      form.append(help);
      for (const [key, label, type] of CERTIFICATE_FIELDS)
        field(form, working, key, label, type);
      attachments(form, working, "evidence", api, pending, true);
    } else structured(form, working, api, pending);
    const persist = async (remove = false) => {
      if (certificate && !remove && !working.evidence.length)
        throw new Error("Choose a certificate file before saving.");
      const latest = structuredClone(await store.getTabContent(tabId));
      const list = getAt(latest, collectionPath) || [];
      const index =
        indexHint >= 0 && !list[indexHint]?.id
          ? indexHint
          : list.findIndex((i) => i.id === working.id);
      if (remove) {
        if (index >= 0) list.splice(index, 1);
      } else {
        if (certificate) {
          working.date_start = working.issue_date || "";
          working.year = working.issue_date
            ? Number(working.issue_date.slice(0, 4))
            : null;
        }
        if (index >= 0) list[index] = working;
        else list.push(working);
      }
      setAt(latest, collectionPath, list);
      const referenced = new Set();
      const collect = (v) => {
        if (typeof v === "string") referenced.add(v);
        else if (v && typeof v === "object") Object.values(v).forEach(collect);
      };
      collect(latest);
      const assets = remove
        ? []
        : [...pending].filter(([path]) => referenced.has(path));
      await store.saveDraftBatch([
        ...assets,
        [`content/${tabId}.json`, latest],
      ]);
      store.content[tabId] = latest;
    };
    saveControls(
      form,
      api,
      () => persist(),
      !!original,
      () => persist(true),
    );
    api.body.append(form);
    form.querySelector("input,textarea")?.focus();
  } catch (error) {
    api.body.textContent = error.message;
  }
}

export async function openDetailsEditor(
  title,
  sourceKey,
  path = [],
  defaults = {},
  only = null,
) {
  if (!store.isDraftMode) return;
  const api = editorDialog(title);
  if (!api) return;
  try {
    const source =
      sourceKey === "site.json"
        ? store.site
        : await store.getTabContent(sourceKey);
    if (!api.element.isConnected) return;
    const working = {
      ...structuredClone(defaults),
      ...structuredClone(path.length ? getAt(source, path) || {} : source),
    };
    if (only)
      for (const key of Object.keys(working))
        if (!only.includes(key)) delete working[key];
    delete working.items;
    const form = document.createElement("form");
    form.className = "item-editor-form";
    const pending = new Map();
    structured(form, working, api, pending);
    saveControls(form, api, async () => {
      const latest = structuredClone(
        sourceKey === "site.json"
          ? store.site
          : await store.getTabContent(sourceKey),
      );
      if (sourceKey === "site.json" && path[0] === "tabs") {
        if (!working.label?.trim()) throw new Error("Enter a section name.");
        working.slug = working.slug?.trim() || working.id;
        if (!/^[a-z0-9-]+$/.test(working.slug))
          throw new Error(
            "Use lowercase letters, numbers and hyphens in the section address.",
          );
        if (
          latest.tabs.some(
            (tab, index) =>
              index !== path[1] &&
              (tab.id === working.slug || tab.slug === working.slug),
          )
        )
          throw new Error("Another section already uses this address.");
        const full = latest.presets?.find((p) => p.id === "full");
        if (full?.tabs && !full.tabs.includes(working.id))
          full.tabs.push(working.id);
      }
      if (path.length)
        setAt(latest, path, { ...getAt(latest, path), ...working });
      else Object.assign(latest, working);
      const key =
        sourceKey === "site.json" ? sourceKey : `content/${sourceKey}.json`;
      await store.saveDraftBatch([...pending, [key, latest]]);
      if (sourceKey === "site.json") store.site = latest;
      else store.content[sourceKey] = latest;
    });
    api.body.append(form);
    form.querySelector("input,textarea")?.focus();
  } catch (error) {
    api.body.textContent = error.message;
  }
}

export async function renderItemManager(container, tabId = "certificates") {
  const data = await store.getTabContent(tabId);
  if (!container.isConnected) return;
  container.innerHTML = `<div class="manager-header"><label for="manage-section">Section</label><select id="manage-section" class="form-select">${(
    store.site?.tabs || []
  )
    .filter((t) => !["cover", "contents"].includes(t.id))
    .map(
      (t) =>
        `<option value="${safe(t.id)}" ${t.id === tabId ? "selected" : ""}>${safe(t.label)}</option>`,
    )
    .join(
      "",
    )}</select><button class="btn btn-primary" id="manager-add">Add item</button><button class="btn btn-secondary" id="manager-details">Edit section details</button></div><div class="manager-list">${(data.items || []).map((i) => `<div class="manager-row"><span>${safe(i.title || "Untitled item")}</span><button class="btn btn-secondary" data-edit-id="${safe(i.id)}">Edit item</button></div>`).join("") || "<p>No items yet. Add an item to get started.</p>"}</div>`;
  container
    .querySelector("select")
    .addEventListener("change", (e) =>
      renderItemManager(container, e.target.value),
    );
  container.querySelector("#manager-add").onclick = () => openItemEditor(tabId);
  container.querySelector("#manager-details").onclick = () =>
    openDetailsEditor("Edit section details", tabId);
  container
    .querySelectorAll("[data-edit-id]")
    .forEach(
      (b) => (b.onclick = () => openItemEditor(tabId, b.dataset.editId)),
    );
}
