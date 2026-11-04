export const ACTIVITY_TYPES = [
  "Training", "Seminar", "Webinar", "Workshop", "Masterclass", "Conference", "Service", "Other",
];

export function positiveNumber(value) {
  const number = typeof value === "number" || typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(number) && number > 0 ? number : 0;
}

const numberFormat = new Intl.NumberFormat("en", { maximumFractionDigits: 8 });
export const formatCertificateNumber = value => positiveNumber(value)
  ? numberFormat.format(positiveNumber(value))
  : "—";
