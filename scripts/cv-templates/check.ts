import assert from "node:assert";
import { buildTechHtml } from "./tech";
import { getCvData, Variant } from "./shared";

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

console.log("CV checks passed.");
