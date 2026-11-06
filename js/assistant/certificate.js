import { ACTIVITY_TYPES } from "../certificate-details.js";

const months =
  "January February March April May June July August September October November December".split(
    " ",
  );
const dateToken =
  /\b(?:(\d{4})-(\d{2})-(\d{2})|(\d{1,2})(?:st|nd|rd|th)?\s+(?:day\s+of\s+)?([A-Za-z]+),?\s+(\d{4})|([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4}))\b/i;

function isoDate(text) {
  const match = text.match(dateToken);
  if (!match) return "";
  const [
    ,
    year,
    month,
    day,
    dayFirst,
    monthSecond,
    yearLast,
    monthFirst,
    daySecond,
    yearEnd,
  ] = match;
  const monthName = monthSecond || monthFirst;
  const monthNumber =
    month ||
    months.findIndex(
      (m) =>
        m.toLowerCase().startsWith(monthName.toLowerCase()) &&
        monthName.length >= 3,
    ) + 1;
  const iso = [
    year || yearLast || yearEnd,
    String(monthNumber).padStart(2, "0"),
    (day || dayFirst || daySecond).padStart(2, "0"),
  ].join("-");
  const parsed = new Date(iso);
  return Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === iso
    ? iso
    : "";
}

export const normalizeText = (text) =>
  text.normalize("NFKC").replace(/\s+/gu, " ").trim();
const clean = (text) =>
  normalizeText(text)
    .replace(/^[“"']|[”"']$/gu, "")
    .trim();

const rules = [
  [
    "title",
    /(?:^|\n)\s*(?:(?:seminar|activity|course|training|program(?:me)?)\s+title|title)\s*[:–]\s*([^\n]{3,250})/i,
  ],
  ["title", /(?:entitled|titled)\s*[:–]?\s*[“"]([^”"\n]{3,250})[”"]/i],
  ["title", /(?:entitled|titled)[ \t]*[:–]?[ \t]*\r?\n[ \t]*([^\n]{3,250})/i],
  [
    "certificate_kind",
    /\bCertificate of (Participation|Completion|Attendance|Recognition|Appreciation|Achievement|Training)\b/i,
    (_, kind) =>
      "Certificate of " + kind[0].toUpperCase() + kind.slice(1).toLowerCase(),
  ],
  ["certificate_kind", /(?:^|\n)\s*Certificate type\s*[:–]\s*([^\n]{2,100})/i],
  [
    "delivery_mode",
    /(?:^|\n)\s*(?:Delivery(?: mode)?|Modality|Mode of delivery)\s*[:–]\s*([^\n]{2,90})/i,
  ],
  [
    "delivery_mode",
    /\b(online|virtual|face-to-face|in-person|hybrid)\s+(?:training|seminar|workshop|conference|course|session)\b/i,
  ],
  [
    "delivery_mode",
    /\b(?:delivered|conducted|held)\s+(online|virtually|face-to-face|in-person|in person)\b/i,
  ],
  [
    "seminar_topic",
    /(?:^|\n)\s*(?:(?:seminar|activity)\s+)?topic\s*[:–]\s*([^\n]{2,250})/i,
  ],
  [
    "organization",
    /(?:^|\n)\s*(?:provider|issued by|organized by|organised by|conducted by)\s*[:–]?\s+([^\n]{3,200})/i,
  ],
  [
    "organization",
    /\bdelivered\s+(?:online|virtually|in person)(?:[ \t]+via[ \t]+[^\n]{1,45}?)?[ \t]+by[ \t]+([^\n]{3,200})/i,
  ],
  [
    "training_code",
    /\b(?:(?:training|activity|program(?:me)?)\s+(?:code|(?:accreditation\s+)?(?:no\.?|number)))\s*[:#–]?\s*([A-Z0-9][A-Z0-9._/-]{2,39})\b/i,
  ],
  [
    "cpd_points",
    /\bCPD\s+(?:credit\s+)?(?:points?|units?|credits?)\s*[:=–]?\s*(\d+(?:\.\d{1,2})?)(?![\d.,/-])/i,
    (_, number) => Number(number),
  ],
  [
    "cpd_points",
    /(?<![\d.,-])(\d+(?:\.\d{1,2})?)\s+CPD\s+(?:credit\s+)?(?:points?|units?|credits?)\b/i,
    (_, number) => Number(number),
  ],
  [
    "hours",
    /\b(?:duration|training hours|hours)\s*[:=–]\s*(\d+(?:\.\d{1,2})?)(?![\d.,/-])/i,
    (_, number) => Number(number),
  ],
  [
    "hours",
    /(?<![\d.,-])(\d+(?:\.\d{1,2})?)\s+(?:training\s+)?hours?\b/i,
    (_, number) => Number(number),
  ],
  [
    "issue_date",
    /\b(?:date issued|date of issue|issue date|issued on|given on|given this|awarded on|signed on)\s*[:–]?\s*([^\n]{6,95})/i,
    (_, date) => isoDate(date),
  ],
];

export function certificateSuggestions(pages) {
  const fields = {};
  const conflicts = new Set();
  function offer(key, value, quote, page) {
    if (
      value === "" ||
      (typeof value === "number" && (value < 0 || value > 10000))
    )
      return;
    if (
      fields[key] &&
      String(fields[key].value).toLowerCase() !== String(value).toLowerCase()
    )
      conflicts.add(key);
    else fields[key] ||= { value, quote: quote.trim(), page };
  }
  for (const { text, page } of pages) {
    for (const [key, pattern, convert] of rules) {
      for (const match of text.matchAll(
        new RegExp(pattern.source, pattern.flags + "g"),
      )) {
        offer(
          key,
          convert ? convert(...match) : clean(match[1]),
          match[0],
          page,
        );
      }
    }
    const activityLine = text.match(
      /\b(?:attended|completed|participated in)\s+(?:the\s+)?(webinar|workshop|seminar|conference|masterclass|training)[ \t]*\r?\n((?:[^\n]{3,110}\r?\n){1,3}?)[ \t]*(?=(?:delivered|held|conducted|organized|organised|hosted)\b)/i,
    );
    if (activityLine) {
      const [, type, title] = activityLine;
      offer(
        "activity_type",
        ACTIVITY_TYPES.find(
          (entry) => entry.toLowerCase() === type.toLowerCase(),
        ),
        activityLine[0],
        page,
      );
      offer("title", clean(title), activityLine[0], page);
    }
    const activity = new RegExp(
      "^(?:Activity type\\s*[:–]\\s*)?(" + ACTIVITY_TYPES.join("|") + ")$",
      "i",
    );
    for (const line of text.split(/\r?\n/)) {
      const match = line.trim().match(activity);
      if (match)
        offer(
          "activity_type",
          ACTIVITY_TYPES.find(
            (type) => type.toLowerCase() === match[1].toLowerCase(),
          ),
          line,
          page,
        );
    }
  }
  for (const key of conflicts) delete fields[key];
  return { fields, conflicts: [...conflicts] };
}
