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

test("reads a printed activity title between a recipient and date without treating the date as issued", () => {
  const { fields } = certificateSuggestions([
    {
      page: 1,
      text: "CERTIFICATE OF COMPLETION\nCENTRAL PHILIPPINES STATE UNIVERSITY\nPresented to Maria Reyes\nScience Inquiry in the Classroom\n12 September 2026",
    },
  ]);
  assert.equal(fields.title.value, "Science Inquiry in the Classroom");
  assert.equal(fields.issue_date, undefined);
});

test("restricts the language model to sourced options and excludes the recipient", async () => {
  const model = {
    prompt: async (input, { choices }) => {
      assert.ok(input.includes("A. Teaching Inquiry Through Physics"));
      assert.ok(!input.includes("A. Maria Reyes"));
      assert.deepEqual(choices, ["A", "B"]);
      return "A";
    },
  };
  const result = await enrichCertificate(model, [
    {
      page: 1,
      text: "CERTIFICATE OF COMPLETION\nPresented to:\nMaria Reyes\nTeaching Inquiry Through Physics",
    },
  ]);
  assert.deepEqual(Object.keys(result), ["title"]);
  assert.equal(result.title.value, "Teaching Inquiry Through Physics");
  const recipient = await enrichCertificate(
    { prompt: async () => "Invented Activity" },
    [
      {
        page: 1,
        text: "Certificate of Completion\nPresented to:\nMaria Reyes\nPhysics in the Classroom",
      },
    ],
  );
  assert.deepEqual(recipient, {});
});

test("balances relevant evidence and gives the real thesis and science major a place in the draft", () => {
  const result = buildBackground(
    {
      site: {
        identity: { title: "Science teacher", institution: "Current School" },
      },
      content: {
        education: {
          items: [
            {
              title: "Bachelor of Secondary Education",
              subtitle: "Major in Science",
              organization: "University",
            },
          ],
        },
        research: { items: [{ title: "Agricultural residues as biofuel" }] },
        certificates: {
          items: [
            { title: "Office filing webinar", issue_date: "2026-11-06" },
            { title: "Generative AI Foundations", issue_date: "2026-11-05" },
            { title: "AI Literacy", issue_date: "2026-11-04" },
            { title: "Hands-on Physics", issue_date: "2026-10-01" },
            { title: "Classroom Assessment", issue_date: "2026-09-01" },
          ],
        },
      },
    },
    [],
  );
  const bio = result.find((item) => item.section === "cover").value;
  assert.match(
    bio,
    /Major in Science.*Agricultural residues as biofuel.*Classroom Assessment.*Hands-on Physics.*Generative AI Foundations/,
  );
  assert.doesNotMatch(bio, /Office filing|AI Literacy/);
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
