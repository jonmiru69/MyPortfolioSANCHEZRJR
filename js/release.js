const IMPORT_VERSION = 2;
const normalizedTitle = (item) =>
  String(item.title || "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
const sameCertificate = (a, b) => {
  if (!normalizedTitle(a) || normalizedTitle(a) !== normalizedTitle(b))
    return false;
  const first = String(a.issue_date || a.date_start || "").slice(0, 10);
  const second = String(b.issue_date || b.date_start || "").slice(0, 10);
  return (
    !first || !second || first.startsWith(second) || second.startsWith(first)
  );
};
const emptyLegacyPlaceholder = (item) =>
  item.title?.trim() === "New Item Title" &&
  ![
    "subtitle",
    "organization",
    "description",
    "seminar_topic",
    "training_code",
    "issue_date",
    "delivery_mode",
    "certificate_kind",
    "type",
  ].some((key) => String(item[key] || "").trim()) &&
  !["evidence", "links", "tags", "skills"].some((key) => item[key]?.length) &&
  (item.cpd_points == null || item.cpd_points === "") &&
  (item.hours == null || item.hours === "") &&
  !item.featured;

export function reconcileCertificates(items, source) {
  const retained = structuredClone(items).filter(
    (item) => !emptyLegacyPlaceholder(item),
  );
  // Only remove the known imported copy when an owner's matching record exists.
  const imported = source.find((item) => item.id === "certificate-22");
  const importedPath = imported?.evidence?.[0]?.file;
  const result = retained.filter(
    (item) =>
      !(
        importedPath &&
        item.id === "certificate-22" &&
        item.evidence?.[0]?.file === importedPath &&
        retained.some((other) => other !== item && sameCertificate(other, item))
      ),
  );
  for (const original of source) {
    const existing = result.find((item) => sameCertificate(item, original));
    if (existing) {
      const staleSource = source.find(
        (candidate) =>
          !sameCertificate(candidate, original) &&
          candidate.evidence?.some((sourceFile) =>
            existing.evidence?.some((file) => file.file === sourceFile.file),
          ),
      );
      if (staleSource && original.evidence?.length) {
        // The old editor could change the title while leaving another bundled
        // certificate attached. Repair only those provable legacy references.
        const stalePaths = new Set(
          staleSource.evidence.map((file) => file.file),
        );
        existing.evidence = [
          ...existing.evidence.filter((file) => !stalePaths.has(file.file)),
          ...structuredClone(original.evidence),
        ];
        for (const key of [
          "certificate_kind",
          "delivery_mode",
          "seminar_topic",
          "training_code",
          "cpd_points",
        ])
          if (existing[key] === staleSource[key]) existing[key] = original[key];
      }
      for (const key of ["seminar_topic", "training_code", "cpd_points"])
        if (existing[key] == null) existing[key] = original[key];
      continue;
    }
    const added = structuredClone(original);
    if (result.some((item) => item.id === added.id)) {
      const base = `imported-${original.id}`;
      added.id = base;
      let suffix = 2;
      while (result.some((item) => item.id === added.id))
        added.id = `${base}-${suffix++}`;
    }
    result.push(added);
  }
  return result;
}

// A one-time reconciliation of the supplied folder with existing owner records.
export async function releaseMigration(bundledSite) {
  const names = ["certificates", "resume", "research"];
  const bundled = {};
  await Promise.all(
    names.map(async (name) => {
      const response = await fetch(`data/content/${name}.json`);
      if (!response.ok) throw new Error("Could not load portfolio content.");
      bundled[name] = await response.json();
    }),
  );
  return (snapshot) => {
    if (
      snapshot.site?.content_release === bundledSite.content_release &&
      snapshot.site?.certificate_import_version === IMPORT_VERSION
    )
      return snapshot;
    const result = structuredClone(snapshot);
    result.content ||= {};
    const source = bundled.certificates.items;
    if (!result.content.certificates)
      result.content.certificates = structuredClone(bundled.certificates);
    else
      result.content.certificates.items = reconcileCertificates(
        result.content.certificates.items || [],
        source,
      );
    if (!result.content.resume?.document)
      result.content.resume = {
        ...result.content.resume,
        ...structuredClone(bundled.resume),
      };
    if (!result.content.research?.items?.length)
      result.content.research = structuredClone(bundled.research);
    for (const id of ["resume", "research"]) {
      const tab = result.site.tabs.find((t) => t.id === id);
      if (tab) tab.enabled = true;
    }
    result.site.content_release = bundledSite.content_release;
    result.site.certificate_import_version = IMPORT_VERSION;
    return result;
  };
}
