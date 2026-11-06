import { store } from "../store.js";
import { certificateSuggestions } from "../assistant/certificate.js";
import { createDocumentReader, readAttachment } from "../assistant/reader.js";
import {
  enrichCertificate,
  modelAvailability,
  withModel,
} from "../assistant/model.js";
import { button, element, statusLine } from "./assistant-controls.js";

export function certificateAssistant(api, fields, controls) {
  const panel = element("section", "", "assistant-panel");
  panel.setAttribute("aria-label", "Certificate assistant");
  panel.hidden = true;
  const status = statusLine();
  const progress = element("progress");
  progress.hidden = true;
  progress.setAttribute("aria-label", "Certificate scan progress");
  const actions = element("div", "", "assistant-actions");
  const review = element("div");
  const stopButton = button("Stop reading", () => operation?.abort());
  const scanButton = button("Read attached certificate", () => scan());
  const textButton = button("Use certificate text", () => {
    transcript.hidden = false;
    transcript.open = true;
    input.focus();
  });
  const transcript = element("details", "", "assistant-transcript");
  transcript.hidden = true;
  const input = element("textarea", "", "form-textarea");
  input.setAttribute("aria-label", "Certificate transcript");
  input.rows = 7;
  const analyze = button("Read transcript", () => {
    if (!input.value.trim()) {
      status.textContent = "Paste or correct the certificate text first.";
      return;
    }
    pages = [{ page: 1, text: input.value }];
    display(certificateSuggestions(pages), true);
  });
  transcript.append(
    element("summary", "Review or correct the transcript"),
    input,
    analyze,
  );
  const modelButton = button("Find more fields with browser AI", async () => {
    const controller = start("Starting browser AI…");
    try {
      const extra = await withModel(
        controller.signal,
        (progress) =>
          setStatus(
            controller,
            `Preparing browser model · ${Math.round(progress * 100)}%`,
          ),
        (model) => enrichCertificate(model, pages, controller.signal),
      );
      if (!current(controller)) return;
      const base = certificateSuggestions(pages);
      for (const key of base.conflicts) delete extra[key];
      display({
        fields: { ...extra, ...base.fields },
        conflicts: base.conflicts,
      });
    } catch (error) {
      setStatus(
        controller,
        controller.signal.aborted
          ? "AI reading stopped."
          : "Browser AI could not finish. The document suggestions are still available.",
      );
    } finally {
      finish(controller);
    }
  });
  modelButton.hidden = true;
  actions.append(stopButton, scanButton, textButton, modelButton);
  panel.append(
    element("h3", "Certificate assistant"),
    status,
    progress,
    actions,
    review,
    transcript,
  );

  let operation;
  let attachment;
  let pages = [];
  let modelReady = false;
  const autoFilled = new Map();
  const manuallyEdited = new Set();
  let applying = false;
  for (const [key, control] of controls) {
    control.addEventListener("input", () => {
      if (applying) return;
      manuallyEdited.add(key);
      autoFilled.delete(key);
    });
  }
  api.cleanup.push(() => operation?.abort());
  function updateButtons() {
    stopButton.hidden = !operation;
    scanButton.hidden = !attachment || !!operation;
    textButton.hidden = !!operation || !attachment;
    modelButton.hidden = !!operation || !modelReady || !pages.length;
    analyze.disabled = !!operation;
    input.readOnly = !!operation;
  }

  function current(controller) {
    return operation === controller && api.element.open && store.isDraftMode;
  }
  function setStatus(controller, message) {
    if (current(controller)) status.textContent = message;
  }
  function start(message) {
    operation?.abort();
    operation = new AbortController();
    status.textContent = message;
    updateButtons();
    return operation;
  }
  function finish(controller) {
    if (operation !== controller) return;
    operation = null;
    progress.hidden = true;
    updateButtons();
  }

  function write(key, value, automatic = false) {
    const control = controls.get(key);
    applying = true;
    try {
      control.value = String(value);
      control.dispatchEvent(new Event("input", { bubbles: true }));
      if (automatic) autoFilled.set(key, control.value);
      else autoFilled.delete(key);
    } finally {
      applying = false;
    }
  }

  function display(result, fillEmpty = false) {
    if (!api.element.open || !store.isDraftMode || api.busy) return;
    review.replaceChildren();
    transcript.hidden = false;
    let added = 0;
    let found = 0;
    const list = element("ul", "", "assistant-findings");
    for (const [key, label] of fields) {
      const entry = result.fields[key];
      if (!entry) continue;
      found++;
      const control = controls.get(key);
      if (fillEmpty && control.value === "" && !manuallyEdited.has(key)) {
        write(key, entry.value, true);
        added++;
      }
      const row = element("li");
      const value = element("strong", label + " · " + entry.value);
      const quote = element("small", `Page ${entry.page} · “${entry.quote}”`);
      const use = button("Use value", () => {
        if (!store.isDraftMode || api.busy) return;
        write(key, entry.value);
        use.disabled = true;
        status.textContent = label + " updated. Review the form before saving.";
      });
      use.setAttribute("aria-label", "Use suggested " + label.toLowerCase());
      use.disabled = String(entry.value) === control.value;
      row.append(value, quote, use);
      list.append(row);
    }
    if (found) {
      const details = element("details");
      details.append(
        element(
          "summary",
          `Review ${found} sourced ${found === 1 ? "suggestion" : "suggestions"}`,
        ),
        list,
      );
      review.append(details);
    }
    if (result.conflicts.length) {
      const labels = fields
        .filter(([key]) => result.conflicts.includes(key))
        .map(([, label]) => label);
      review.append(
        element(
          "p",
          "Conflicting values need review: " + labels.join(", ") + ".",
        ),
      );
    }
    status.textContent = found
      ? `${added ? added + " blank fields filled. " : ""}Check suggestions against the original before saving. Fill any missing fields manually.`
      : "No reliable fields found. Review the transcript or enter the details manually.";
    updateButtons();
  }

  async function scan() {
    if (!attachment || !store.isDraftMode || !api.element.open) return;
    const controller = start("Opening the certificate on this device…");
    const reader = createDocumentReader();
    let currentPage = 0;
    progress.hidden = false;
    progress.removeAttribute("value");
    review.replaceChildren();
    try {
      const file =
        attachment.blob ||
        (await readAttachment(attachment, controller.signal));
      const scanned = await reader.read(file, {
        name: attachment.name,
        mime: attachment.mime,
        signal: controller.signal,
        onPage: (page, total) => {
          if (!current(controller)) return;
          currentPage = page;
          progress.max = total;
          progress.value = page - 1;
          setStatus(controller, `Reading page ${page} of ${total}…`);
        },
        onOCR: (phase, fraction) => {
          if (current(controller) && phase === "recognizing text")
            progress.value = currentPage - 1 + fraction;
        },
      });
      if (!current(controller) || controller.signal.aborted) return;
      pages = scanned;
      input.value = pages.map(({ text }) => text).join("\n\n");
      const result = certificateSuggestions(pages);
      display(result, true);
    } catch (error) {
      if (current(controller)) {
        transcript.hidden = false;
        setStatus(
          controller,
          controller.signal.aborted
            ? "Reading stopped. The selected file is ready to save."
            : `Could not read this file. ${error.message || "Try a clearer copy or use the transcript."}`,
        );
      }
    } finally {
      reader.close();
      finish(controller);
    }
  }

  function setAttachment(evidence, blob) {
    operation?.abort();
    operation = null;
    progress.hidden = true;
    for (const [key, value] of autoFilled) {
      if (controls.get(key).value === value) write(key, "");
    }
    autoFilled.clear();
    pages = [];
    input.value = "";
    transcript.open = false;
    transcript.hidden = true;
    review.replaceChildren();
    attachment = evidence && {
      ...evidence,
      blob,
      name: evidence.original_name || evidence.label || "certificate",
    };
    panel.hidden = !attachment;
    status.textContent = "Read the attached certificate to suggest fields.";
    updateButtons();
    if (blob) void scan();
  }

  modelAvailability().then((state) => {
    modelReady = state !== "unavailable";
    updateButtons();
  });
  updateButtons();
  return { panel, setAttachment };
}
