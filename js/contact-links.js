export const contactEmail = "sanchezramil2202@gmail.com";
export const contactPhone = "0927 650 1400";
export const phoneHref = "tel:+639276501400";

export function emailComposeHref(subject = "", body = "") {
  // Mobile browsers hand compose to the system mail app (Gmail when configured).
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
    return `mailto:${contactEmail}${subject ? `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : ""}`;
  }
  const query = new URLSearchParams({ view: "cm", fs: "1", to: contactEmail });
  if (subject) query.set("su", subject);
  if (body) query.set("body", body);
  return `https://mail.google.com/mail/?${query}`;
}
