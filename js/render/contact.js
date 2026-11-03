import { contactEmail, contactPhone, emailComposeHref, phoneHref } from "../contact-links.js";
import { escapeHTML as safe } from "../utils.js";
export function renderContact(container, data, site) {
  const settings = site.contact || {};
  const institution = data.office_location || site.identity?.institution || "";
  const formSettings = data.form_settings || {};
  const fields = (formSettings.fields || []).filter((f) =>
    ["text", "email", "textarea"].includes(f.type),
  );
  const endpoint =
    settings.method !== "mailto" &&
    /^https:\/\//i.test(settings.endpoint_url || "")
      ? settings.endpoint_url
      : "";
  const composeHref = emailComposeHref();
  container.innerHTML = `<div class="page-view contact-page"><header class="section-intro"><h1 class="tab-title">Contact</h1><p class="tab-summary">${safe(data.summary || "Get in touch for professional inquiries and collaboration.")}</p></header><div class="contact-layout"><div class="contact-details">${institution ? `<div><h2>Institution</h2><p>${safe(institution)}</p></div>` : ""}<div><h2>Email</h2><a href="${safe(composeHref)}" ${composeHref.startsWith("https:") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${contactEmail}</a></div><div><h2>Phone</h2><a href="${phoneHref}">${contactPhone}</a></div>${data.consultation_hours ? `<div><h2>Consultation</h2><p>${safe(data.consultation_hours)}</p></div>` : ""}${(
    data.social_links || []
  )
    .filter((l) => /^https?:\/\//i.test(l.url || ""))
    .map(
      (l) =>
        `<a href="${safe(l.url)}" target="_blank" rel="noopener noreferrer">${safe(l.platform || l.label || "Profile")}</a>`,
    )
    .join(
      "",
    )}</div>${fields.length ? `<form class="inquiry-form" data-ui><h2>${safe(formSettings.title || "Professional inquiries")}</h2><p>${safe(formSettings.subtitle || "Share the details of your inquiry.")}</p>${fields.map((f, index) => `<div class="form-group"><label for="inquiry-${index}">${safe(f.label)}</label>${f.type === "textarea" ? `<textarea id="inquiry-${index}" name="${safe(f.id || "field-" + index)}" class="form-textarea" ${f.required ? "required" : ""} maxlength="10000"></textarea>` : `<input id="inquiry-${index}" name="${safe(f.id || "field-" + index)}" type="${f.type}" class="form-input" ${f.required ? "required" : ""} maxlength="500">`}</div>`).join("")}<button class="btn btn-primary" type="submit">${endpoint ? "Send inquiry" : "Compose email"}</button><p role="status">${endpoint ? "" : "Opens a draft in your email application for you to review and send."}</p></form>` : ""}</div></div>`;
  const form = container.querySelector(".inquiry-form");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const body = fields
      .map(
        (f, index) =>
          `${f.label}: ${values.get(f.id || "field-" + index) || ""}`,
      )
      .join("\n\n");
    const status = form.querySelector("[role=status]");
    const button = form.querySelector("button");
    if (!endpoint) {
      const href = emailComposeHref("Portfolio inquiry", body);
      if (href.startsWith("mailto:")) location.href = href;
      else window.open(href, "_blank", "noopener,noreferrer");
      status.textContent =
        "Review the draft in your email application and send it when ready.";
      return;
    }
    button.disabled = true;
    status.textContent = "Sending your inquiry…";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: values,
        headers: { Accept: "application/json" },
      });
      if (!response.ok)
        throw new Error("Please try again or use the email link.");
      status.textContent =
        settings.success_message || "Your inquiry has been submitted.";
      form.reset();
    } catch (error) {
      status.textContent = "Could not send your inquiry. " + error.message;
    } finally {
      button.disabled = false;
    }
  });
}
