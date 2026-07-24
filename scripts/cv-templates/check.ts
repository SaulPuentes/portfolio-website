import assert from "node:assert";
import { buildTechHtml } from "./tech";
import { Variant } from "./shared";

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

console.log("CV checks passed.");
