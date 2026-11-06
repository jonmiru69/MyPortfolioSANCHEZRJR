import test from "node:test";
import assert from "node:assert/strict";
import { certificateSuggestions } from "../js/assistant/certificate.js";
import { enrichCertificate } from "../js/assistant/model.js";
import {
  buildBackground,
  portfolioDocuments,
} from "../js/assistant/portfolio.js";

test("reads explicit certificate values while keeping CPD units, hours and training codes separate", () => {
  const result = certificateSuggestions([
    {
      page: 2,
      text:
        "Certificate of Completion\nActivity title: Designing Science Investigations\n" +
        "Provider: Example Science Institute\nDelivery mode: Online\nActivity type: Workshop\n" +
        "Date issued: 7 October 2026\nTraining code: SCI-2026-007\n" +
        "12 training hours\n0 CPD units\nTopic: Experimental design",
    },
  ]);
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(result.fields).map(([key, field]) => [key, field.value]),
    ),
    {
      title: "Designing Science Investigations",
      certificate_kind: "Certificate of Completion",
      delivery_mode: "Online",
      seminar_topic: "Experimental design",
      organization: "Example Science Institute",
      training_code: "SCI-2026-007",
      cpd_points: 0,
      hours: 12,
      issue_date: "2026-10-07",
      activity_type: "Workshop",
    },
  );
  assert.equal(result.fields.cpd_points.page, 2);
});

test("does not infer issue date or CPD from event dates, hours or provider accreditation", () => {
  const { fields } = certificateSuggestions([
    {
      page: 1,
      text:
        "Held on 4 March 2026. Provider accreditation number 2026-123. 4 hours.\n" +
        "Date issued: 31 February 2026",
    },
  ]);
  assert.equal(fields.hours.value, 4);
  for (const key of ["issue_date", "cpd_points", "training_code"])
    assert.equal(fields[key], undefined);
});

test("reads an attendance certificate with a title across multiple lines", () => {
  const { fields } = certificateSuggestions([
    {
      page: 1,
      text: "attended the webinar\nIntroduction to the Common European\nFramework of Reference for Languages\ndelivered online via Zoom by British Council Philippines\non Tuesday, 15 September 2026",
    },
  ]);
  assert.equal(
    fields.title.value,
    "Introduction to the Common European Framework of Reference for Languages",
  );
  assert.equal(fields.activity_type.value, "Webinar");
  assert.equal(fields.delivery_mode.value, "online");
  assert.equal(fields.organization.value, "British Council Philippines");
  assert.equal(fields.issue_date, undefined);
});

test("flags contradictory explicit values and keeps the other grounded suggestions", () => {
  const result = certificateSuggestions([
    { page: 1, text: "CPD points: 2\nTraining code: SCI-01" },
    { page: 2, text: "CPD points: 3" },
  ]);
  assert.deepEqual(result.conflicts, ["cpd_points"]);
  assert.equal(result.fields.cpd_points, undefined);
  assert.equal(result.fields.training_code.value, "SCI-01");
});

test("rejects model results without literal evidence, wrong pages and sensitive fields", async () => {
  const model = {
    prompt: async () =>
      JSON.stringify([
        {
          field: "title",
          value: "Real activity",
          quote: "Activity title: Real activity",
          page: 1,
        },
        {
          field: "organization",
          value: "Invented company",
          quote: "Activity title: Real activity",
          page: 1,
        },
        { field: "delivery_mode", value: "Online", quote: "Online", page: 3 },
        { field: "cpd_points", value: "12", quote: "12 hours", page: 1 },
      ]),
  };
  const result = await enrichCertificate(model, [
    { page: 1, text: "Activity title: Real activity\nOnline\n12 hours" },
  ]);
  assert.deepEqual(Object.keys(result), ["title"]);
});

test("background proposals use current institution, résumé skills, and public evidence only", () => {
  const bundle = {
    site: {
      identity: { title: "Science teacher", institution: "Current School" },
      tabs: [
        { id: "resume", enabled: true },
        { id: "certificates", enabled: true },
        { id: "contact", enabled: true },
      ],
    },
    content: {
      resume: { document: { file: "resume.png" } },
      certificates: {
        items: [
          { title: "Visible seminar", evidence: [{ file: "visible.pdf" }] },
          {
            title: "Private seminar",
            visibility: "hidden",
            evidence: [{ file: "private.pdf" }],
          },
        ],
      },
      contact: { evidence: [{ file: "contact.pdf" }] },
    },
  };
  assert.deepEqual(
    portfolioDocuments(bundle).map(({ file }) => file),
    ["resume.png", "visible.pdf"],
  );
  const result = buildBackground(bundle, [
    {
      section: "resume",
      name: "Résumé",
      pages: [
        {
          page: 1,
          text: "Skills\nLab safety\nname@example.test\nReferences\nPerson Name",
        },
      ],
    },
  ]);
  assert.match(
    result.find((item) => item.section === "cover").value,
    /Current School/,
  );
  assert.deepEqual(result.find((item) => item.key === "skills").value, [
    "Lab safety",
  ]);
  assert.doesNotMatch(
    JSON.stringify(result),
    /Private seminar|Person Name|example\.test/,
  );
});
