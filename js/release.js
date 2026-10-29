// A one-time, additive migration of the older cloud snapshot. Owner edits win.
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
    if (snapshot.site?.content_release === bundledSite.content_release)
      return snapshot;
    const result = structuredClone(snapshot);
    result.content ||= {};
    const source = bundled.certificates.items;
    if (!result.content.certificates)
      result.content.certificates = structuredClone(bundled.certificates);
    else {
      for (const item of result.content.certificates.items || []) {
        const original = source.find((i) => i.id === item.id);
        if (original)
          for (const key of ["seminar_topic", "training_code", "cpd_points"])
            if (item[key] === undefined) item[key] = original[key];
      }
      if (
        !result.content.certificates.items?.some(
          (i) => i.id === "certificate-22",
        )
      )
        (result.content.certificates.items ||= []).push(
          structuredClone(source.find((i) => i.id === "certificate-22")),
        );
    }
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
    return result;
  };
}
