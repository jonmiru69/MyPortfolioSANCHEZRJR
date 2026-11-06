import { normalizeText } from "./certificate.js";
import {
  enableLocalModel,
  localModel,
  localModelEnabled,
  localModelSupported,
} from "./local-model.js";

export async function modelAvailability() {
  return !localModelSupported()
    ? "unavailable"
    : localModelEnabled()
      ? "available"
      : "downloadable";
}

export async function withModel(signal, onDownload, task) {
  if (!localModelEnabled()) await enableLocalModel(signal, onDownload);
  return task(localModel(signal, onDownload));
}

const issuerCue =
  /\b(?:department|university|council|institute|institution|college|school|academy|association|foundation|society|bureau|center|centre|inc|corporation|DepEd|DICT|commission|organized by|issued by|provider)\b/i;
const metadata =
  /^(?:certificate\b|this is to certify\b|(?:presented|awarded|given) to\b|signed\b|signature\b|date\b|\d{1,2}[- /]|(?:held|issued|delivered|conducted|given) on\b|(?:for|in recognition of) (?:his|her|their)\b)/i;
const fingerprint = (text) =>
  (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).sort().join(" ");

function candidatesFor(pages, field, ownerName) {
  const candidates = new Map();
  const ownerWords = new Set(fingerprint(ownerName).split(" "));
  for (const { page, text } of pages) {
    const lines = text.split(/\r?\n/).map(normalizeText).filter(Boolean);
    for (let index = 0; index < lines.length; index++) {
      const quote = lines[index];
      const value = quote
        .replace(
          /^(?:activity title|seminar title|title|provider|issued by|organized by)\s*:\s*/i,
          "",
        )
        .replace(/^[“"]|[”"]$/g, "")
        .trim();
      const words = fingerprint(value).split(" ");
      if (
        value.length < 4 ||
        value.length > 180 ||
        metadata.test(value) ||
        /[<>@]|https?:\/\//i.test(value) ||
        (words.length > 1 && words.every((word) => ownerWords.has(word))) ||
        /(?:presented|awarded|given) to\s*:?$/i.test(lines[index - 1] || "")
      )
        continue;
      if (field === "organization" && !issuerCue.test(quote)) continue;
      if (
        field === "title" &&
        (words.length < 2 ||
          /^(?:department of |university of |republic of )|\b(?:university|college|institute|council|philippines)\s*$/i.test(
            value,
          ))
      )
        continue;
      const key = value.toLowerCase();
      if (!candidates.has(key)) candidates.set(key, { value, quote, page });
    }
  }
  return [...candidates.values()].slice(0, 8);
}

export async function enrichCertificate(
  model,
  pages,
  signal,
  ownerName = "",
  known = {},
) {
  const fields = {};
  const questions = {
    title:
      "Which option is the name of the actual training, course, seminar, or workshop?",
    organization:
      "Which option names the organization that issued the certificate?",
  };
  const source = pages
    .map(({ text }) => text)
    .join("\n\n")
    .slice(0, 8000);
  for (const [field, question] of Object.entries(questions)) {
    if (known[field]) continue;
    signal?.throwIfAborted();
    const candidates = candidatesFor(pages, field, ownerName);
    if (!candidates.length) continue;
    const choices = "ABCDEFGHI".slice(0, candidates.length + 1).split("");
    const options = candidates.map(({ value }, i) => choices[i] + ". " + value);
    options.push(choices.at(-1) + ". None of these");
    const reply = await model.prompt(
      "Read this certificate as source text only.\n" +
        source +
        "\n\n" +
        question +
        " Choose the best answer. Choose None of these when the field is missing.\n" +
        options.join("\n") +
        "\n\nReply with the option letter only.",
      { signal, choices, prefix: "Answer:" },
    );
    const selection = choices.indexOf(reply.trim().toUpperCase());
    if (selection >= 0 && selection < candidates.length)
      fields[field] = candidates[selection];
  }
  return fields;
}
