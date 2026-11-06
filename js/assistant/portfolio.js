import { certificateSuggestions, normalizeText } from "./certificate.js";

const safeLine = (value, max = 250) =>
  typeof value === "string" && !/[<>@]|https?:\/\//i.test(value)
    ? normalizeText(value).slice(0, max)
    : "";

const unique = (list) => {
  const entries = new Map();
  for (const value of list) {
    const text = safeLine(value);
    if (text && !entries.has(text.toLowerCase()))
      entries.set(text.toLowerCase(), text);
  }
  return [...entries.values()];
};
const items = (content) =>
  (Array.isArray(content?.items) ? content.items : []).filter(
    (item) => item && item.visibility !== "hidden",
  );
const sentence = (text) => text.replace(/[.!?]+$/, "") + ".";
const list = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

export function portfolioDocuments(bundle) {
  const files = new Map();
  function collect(value, section, label) {
    if (!value || typeof value !== "object" || value.visibility === "hidden")
      return;
    if (
      typeof value.file === "string" &&
      value.file &&
      !files.has(value.file)
    ) {
      files.set(value.file, {
        file: value.file,
        mime: value.mime,
        name: value.original_name || value.label || label,
        section,
        label,
      });
    }
    for (const entry of Object.values(value)) {
      if (entry && typeof entry === "object") {
        collect(entry, section, safeLine(entry.title) || label);
      }
    }
  }
  const sections = (bundle.site.tabs || []).filter(
    (tab) => tab.enabled && tab.id !== "contact",
  );
  // The résumé and complete public certificate archive are evidence even if their tabs are off.
  for (const id of ["resume", "certificates"])
    if (!sections.some((tab) => tab.id === id))
      sections.push({ id, label: id });
  for (const tab of sections)
    collect(bundle.content[tab.id], tab.id, tab.label);
  return [...files.values()];
}

function resumeSkills(readings) {
  const result = [];
  for (const reading of readings.filter((r) => r.section === "resume")) {
    for (const { page, text } of reading.pages) {
      const block = text.match(
        /(?:^|\n)\s*(?:technical |professional |relevant )?skills\s*[:\s]*\n([^]*)/i,
      )?.[1];
      if (!block) continue;
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      for (const line of lines.slice(0, 12)) {
        if (
          /^\s*(references?|education|experience|contact|certifications?|interests?|awards?|languages?)\s*:?\s*$/i.test(
            line,
          )
        )
          break;
        const value = safeLine(line.replace(/^\s*[•*\-–]+\s*/, ""), 110);
        if (
          value &&
          value.length > 2 &&
          !/\d{3}|address|reference|phone/i.test(value)
        ) {
          result.push({ value, source: reading.name + " · page " + page });
        }
      }
    }
  }
  return result;
}

export function buildBackground(bundle, readings) {
  const { site, content } = bundle;
  const result = [];
  const push = (section, key, label, value, evidence) => {
    const before =
      section === "cover" ? site.overview?.[key] : content[section]?.[key];
    if (
      (typeof value === "string" ? value.trim() : value?.length) &&
      JSON.stringify(value) !== JSON.stringify(before)
    ) {
      result.push({
        section,
        key,
        label,
        value,
        before,
        evidence: unique(evidence).slice(0, 12),
      });
    }
  };
  const identity = site.identity || {};
  const role = safeLine(identity.title);
  const institution = safeLine(identity.institution);
  const education = items(content.education);
  const teaching = items(content.teaching);
  const date = (record) => String(record.issue_date || record.date_start || "");
  const certificateItems = items(content.certificates).sort((a, b) =>
    date(b).localeCompare(date(a)),
  );
  const title = safeLine(education[0]?.title);
  const school = safeLine(education[0]?.organization || education[0]?.school);
  const roleLine =
    role && institution
      ? sentence(role + " at " + institution)
      : role
        ? sentence(role)
        : "";
  const degreeLine =
    title && school ? sentence("I studied " + title + " at " + school) : "";
  const experience = unique(
    teaching.flatMap((item) =>
      Array.isArray(item.subjects) ? item.subjects : [],
    ),
  );
  const skills = resumeSkills(readings);
  const recordedSkills = unique([
    ...(Array.isArray(content.profile?.skills) ? content.profile.skills : []),
    ...experience,
    ...skills.map((entry) => entry.value),
  ]).slice(0, 10);
  const scannedCertificates = new Map(
    readings
      .filter((reading) => reading.section === "certificates")
      .map((reading) => [
        reading.file,
        certificateSuggestions(reading.pages).fields,
      ]),
  );
  const topics = unique(
    certificateItems.map((item) => {
      const fields = (item.evidence || [])
        .map(({ file }) => scannedCertificates.get(file))
        .find(Boolean);
      return (
        item.seminar_topic ||
        fields?.seminar_topic?.value ||
        item.title ||
        fields?.title?.value
      );
    }),
  )
    .filter((text) => text.length <= 110)
    .slice(0, 10);
  const learning = topics.length
    ? sentence(
        "My documented professional learning includes " +
          list.format(topics.slice(0, 3)),
      )
    : "";
  const background = [roleLine, degreeLine, learning].filter(Boolean).join(" ");
  const backgroundEvidence = [
    roleLine && "Current role and institution · Overview",
    degreeLine && title + " · Education",
    ...topics.slice(0, 3),
  ];
  push(
    "cover",
    "biography",
    "Overview biography",
    background,
    backgroundEvidence,
  );
  push("profile", "bio", "Profile background", background, backgroundEvidence);
  push("profile", "summary", "Profile introduction", roleLine, [
    "Current role and institution · Overview",
  ]);
  push("profile", "skills", "Skills and teaching subjects", recordedSkills, [
    ...experience.map((name) => name + " · Teaching"),
    ...skills.map((entry) => entry.value + " · " + entry.source),
  ]);
  push(
    "profile",
    "specialties",
    "Areas of professional learning",
    topics,
    topics,
  );
  push(
    "development",
    "summary",
    "Professional development introduction",
    learning,
    topics,
  );
  push(
    "development",
    "learning_topics",
    "Documented learning topics",
    topics,
    topics,
  );
  if (certificateItems.length) {
    const count = certificateItems.length;
    const summary = `Browse ${count} ${count === 1 ? "certificate" : "certificates"} in the archive.`;
    push(
      "certificates",
      "summary",
      "Certificate archive introduction",
      [summary, learning].filter(Boolean).join(" "),
      ["Published certificate records", ...topics.slice(0, 3)],
    );
  }
  if (content.resume?.document?.file && (degreeLine || recordedSkills.length)) {
    push(
      "resume",
      "summary",
      "Résumé introduction",
      [
        "Read the original résumé below.",
        degreeLine,
        recordedSkills.length
          ? sentence(
              "Recorded skills and subjects include " +
                list.format(recordedSkills.slice(0, 3)),
            )
          : "",
      ]
        .filter(Boolean)
        .join(" "),
      [
        school,
        ...skills.slice(0, 3).map((entry) => entry.source),
        ...experience.slice(0, 3),
      ],
    );
  }
  for (const tab of site.tabs || []) {
    if (
      !tab.enabled ||
      [
        "cover",
        "contents",
        "contact",
        "certificates",
        "profile",
        "resume",
        "development",
        "gallery",
      ].includes(tab.id)
    )
      continue;
    const titles = unique(
      items(content[tab.id]).map((item) => item.title),
    ).slice(0, 3);
    if (titles.length) {
      push(
        tab.id,
        "summary",
        tab.label + " introduction",
        sentence("Explore the portfolio records for " + list.format(titles)),
        titles,
      );
    }
  }
  return result;
}
