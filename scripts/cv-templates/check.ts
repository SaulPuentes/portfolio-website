import assert from "node:assert";
import { buildTechHtml } from "./tech";
import { getCvData, getCvFacts, Variant } from "./shared";
import { buildRequest, CvDraft, parseResponse, unknownSkills, validateDraft } from "./ai";

// ── Shared experience facts (present in every variant that renders full bullets) ──
const sharedFactVariants: Variant[] = ["fullstack", "frontend"];
for (const v of sharedFactVariants) {
  const html = buildTechHtml(v);
  assert(
    /built with \.NET and Vue\.js/.test(html),
    `${v}: missing Blue People .NET/Vue.js maintenance bullet`,
  );
  assert(
    /iOS App Store and Google Play/.test(html),
    `${v}: missing Blue People iOS/Android market delivery`,
  );
  assert(
    /Google Cloud Platform \(GCP\)/.test(html),
    `${v}: missing Gluo GCP cloud bullet`,
  );
}

// ── React Native variant ──
const rn = buildTechHtml("reactnative");
assert(
  getCvData("reactnative", "en").title === "Senior Full Stack Developer — Mobile",
  "reactnative: wrong title",
);
assert(/React Native/.test(rn), "reactnative: skills missing React Native");
assert(/App Store/.test(rn) && /Play Store/.test(rn), "reactnative: skills missing iOS/Android stores");

// ── .NET variant ──
const net = buildTechHtml("dotnet");
assert(
  getCvData("dotnet", "en").title === "Senior Full Stack Developer — .NET",
  "dotnet: wrong title",
);
assert(/\.NET \/ C#/.test(net), "dotnet: skills missing .NET / C#");
assert(/Vue\.js/.test(net), "dotnet: skills missing Vue.js");

// ── Backend variant ──
const be = buildTechHtml("backend");
assert(getCvData("backend", "en").title === "Senior Backend Developer", "backend: wrong title");
assert(/custom state machine/.test(be), "backend: missing Helicon production-control bullet");
assert(/production traceability/.test(be), "backend: Helicon bullets truncated");
assert(!/Designed and prototyped high-fidelity UI/.test(be), "backend: shared bullets not overridden");

// ── AI draft: facts ──
const facts = getCvFacts();
const companies = facts.experience.map((e) => e.company);
assert.deepStrictEqual(
  companies,
  ["Freelance", "Orium", "Gluo", "Blue People", "Enroute", "Helicon", "Grupo 4S"],
  "facts: company list or order changed",
);
assert(
  facts.experience[5].bullets.some((b) => /custom state machine/.test(b)),
  "facts: variant-only bullets missing",
);
assert(facts.skills.includes("Stripe"), "facts: skills missing");
assert.strictEqual(new Set(facts.skills).size, facts.skills.length, "facts: skills not deduplicated");

// ── AI draft: validation ──
const draft: CvDraft = {
  title: "Senior Backend Developer",
  summary: "Backend developer with 8+ years.",
  skills: [{ label: "Backend", values: ["Node.js", "Kubernetes"] }],
  experience: companies.map((company) => ({ company, bullets: [`${company} bullet.`] })),
};
assert.deepStrictEqual(validateDraft(draft), draft);
assert.throws(
  () => validateDraft({ ...draft, experience: draft.experience.slice(1) }),
  /must be, in order/,
);
assert.throws(
  () => validateDraft({ ...draft, experience: draft.experience.map((e) => ({ ...e, bullets: Array(6).fill("x") })) }),
  /1–5 bullets/,
);
assert.throws(() => validateDraft({ ...draft, title: " " }), /title/);
assert.deepStrictEqual(unknownSkills(draft), ["Kubernetes"], "unknownSkills: wrong result");

// ── AI draft: request ──
const req = buildRequest("We need a Go engineer.");
assert.strictEqual(req.model, "gpt-6-sol");
assert.strictEqual(req.store, false, "request: must not be stored");
assert.match(req.input, /JOB POSTING:\nWe need a Go engineer\./);
assert.match(req.input, /custom state machine/, "request: facts not sent");
assert.strictEqual(req.text.format.strict, true);
assert.deepStrictEqual(req.text.format.schema.properties.experience.items.properties.company.enum, companies);

// ── AI draft: response parsing ──
const okResponse = {
  status: "completed",
  output: [
    { type: "reasoning" },
    { type: "message", content: [{ type: "output_text", text: JSON.stringify(draft) }] },
  ],
};
assert.deepStrictEqual(parseResponse(okResponse), draft);
assert.throws(
  () => parseResponse({ status: "incomplete", incomplete_details: { reason: "max_output_tokens" }, output: [] }),
  /max_output_tokens/,
);
assert.throws(
  () => parseResponse({ status: "completed", output: [{ type: "message", content: [{ type: "refusal", refusal: "No." }] }] }),
  /refused: No\./,
);
assert.throws(
  () => parseResponse({
    status: "completed",
    output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ ...draft, experience: [] }) }] }],
  }),
  /must be, in order/,
);

// ── AI draft: rendering ──
const rendered = buildTechHtml("fullstack", {}, {
  ...draft,
  summary: "Cut p95 latency to <200ms & more.",
  experience: draft.experience.map((e) => ({ ...e, bullets: [`${e.company} one.`, `${e.company} two.`] })),
});
assert(/<div class="subtitle">Senior Backend Developer<\/div>/.test(rendered), "draft: title not rendered");
assert(rendered.includes("&lt;200ms &amp; more"), "draft: text not HTML-escaped");
assert(rendered.includes('<span class="skill-chip">Kubernetes</span>'), "draft: skills not rendered");
assert(rendered.includes("Grupo 4S two."), "draft: old roles still truncated");
assert(!/Designed and prototyped high-fidelity UI/.test(rendered), "draft: variant bullets leaked through");

console.log("CV checks passed.");
