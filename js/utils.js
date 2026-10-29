export const escapeHTML = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function safeURL(value) {
  const text = String(value || "").trim();
  if (!text || /[\u0000-\u001f]/.test(text)) return "";
  try {
    const url = new URL(text, location.href);
    return ["http:", "https:", "blob:"].includes(url.protocol) ? text : "";
  } catch {
    return "";
  }
}
export const labelFor = (key) =>
  ({
    issue_date: "Date issued",
    certificate_kind: "Certificate type",
    delivery_mode: "Delivery mode",
    title: "Title",
    seminar_topic: "Seminar topic",
    organization: "Organization",
    training_code: "Training code",
    cpd_points: "CPD points",
    date_start: "Start date",
    date_end: "End date",
    bio: "Biography",
    cv: "Résumé",
    key_facts: "Key facts",
    official_email: "Public email",
    avatar: "Portrait",
    seo: "Search and sharing",
    positioning_sentence: "Introduction",
  })[key] || key.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
