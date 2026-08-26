# React Native & .NET CV Variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two English-only CV variants — React Native ("Senior Full Stack Developer — Mobile") and .NET ("Senior Full Stack Developer — .NET") — and enrich the shared experience with Blue People .NET/Vue.js maintenance, iOS/Android market delivery, and Gluo GCP cloud work.

**Architecture:** The CV generator is data-driven. `scripts/cv-templates/shared.ts` holds all content keyed by a `Variant` union; `tech.ts` renders the English (ATS) HTML and `lebenslauf.ts` renders the German one; `generate-cv.ts` loops variants × languages through Puppeteer to emit PDFs into `public/`. We extend the `Variant` union with two new members, add their title/summary/skills entries, restrict the new members to English-only generation, and update the shared `experience` list (which every variant renders). No template/CSS changes.

**Tech Stack:** TypeScript, `tsx` runner, Puppeteer (Chrome). No test framework exists; verification is a small `node:assert` script run via `tsx` plus one full PDF generation pass.

## Global Constraints

- New variants (`reactnative`, `dotnet`) are **English-only**. They must never emit a German (`de`) PDF. German (`fullstack`, `frontend`) generation must remain unchanged.
- New experience facts are **shared across all variants** (they live in the single `experience` list). Because `fullstack` and `frontend` render German, the German bullets for the affected roles (Blue People, Gluo) **must also be updated** to stay in sync with English.
- Exact new titles (em dash `—`, U+2014): `Senior Full Stack Developer — Mobile` and `Senior Full Stack Developer — .NET`.
- `.NET` and `Vue.js` appear in the .NET variant's **skills and summary only — never in its title**. Blue People used more technologies than just those two.
- Framing stays honest: the Blue People .NET/Vue.js work is **maintenance-level** (fixing/extending an existing project-management app), not greenfield ownership. Copy must not over-claim.
- No new npm dependencies. No test framework. No template/CSS edits.

---

### Task 1: Update shared experience (Blue People + Gluo) with a content self-check

**Files:**
- Create: `scripts/cv-templates/check.ts`
- Modify: `scripts/cv-templates/shared.ts` (Blue People bullets ~271-284, Gluo bullets ~251-267)

**Interfaces:**
- Consumes: `buildTechHtml(variant: Variant, overrides?): string` from `./tech`; `getCvData(variant, lang): CvData` from `./shared`.
- Produces: `scripts/cv-templates/check.ts` — a standalone assertion script run with `pnpm tsx scripts/cv-templates/check.ts`. Tasks 2 and 3 extend it. After this task it asserts the three shared facts hold for `fullstack` and `frontend`.

- [ ] **Step 1: Write the failing check**

Create `scripts/cv-templates/check.ts`:

```ts
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
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `pnpm tsx scripts/cv-templates/check.ts`
Expected: FAIL — `AssertionError: fullstack: missing Blue People .NET/Vue.js maintenance bullet`

- [ ] **Step 3: Update the Blue People bullets in `shared.ts`**

In `scripts/cv-templates/shared.ts`, replace the Blue People `bullets` block (the entry with `company: "Blue People"`):

```ts
    bullets: {
      en: [
        "Led development of a serverless SaaS logistics platform on AWS, applying SOLID principles and architecture best practices.",
        "Built and shipped React Native apps (food ordering, event scheduling), delivering to both the iOS App Store and Google Play with push notifications and authentication.",
        "Maintained and extended a project-management platform built with .NET and Vue.js — resolving production issues and adding features across the C# backend and Vue frontend.",
        "Integrated AWS end to end: Cognito, Lambda, API Gateway, SNS, SES, S3, DynamoDB, and CloudFormation.",
      ],
      de: [
        "Leitung der Entwicklung einer serverlosen SaaS-Logistikplattform auf AWS nach SOLID-Prinzipien und Architektur-Best-Practices.",
        "Entwicklung und Veröffentlichung von React-Native-Apps (Essensbestellung, Event-Planung) im iOS App Store und bei Google Play, inkl. Push-Benachrichtigungen und Authentifizierung.",
        "Wartung und Erweiterung einer Projektmanagement-Plattform mit .NET und Vue.js — Behebung von Produktionsfehlern und neue Features im C#-Backend und Vue-Frontend.",
        "End-to-End-Integration von AWS: Cognito, Lambda, API Gateway, SNS, SES, S3, DynamoDB und CloudFormation.",
      ],
    },
```

- [ ] **Step 4: Update the Gluo bullets in `shared.ts`**

In `scripts/cv-templates/shared.ts`, replace the Gluo `bullets` block (the entry with `company: "Gluo"`):

```ts
    bullets: {
      en: [
        "Built Galerías' (galerias.com) nationwide shopping-mall platform with user auth, interactive maps, and a fully customizable CMS.",
        "Redesigned NordicTrack's e-commerce site with dynamic components, light/dark themes, and CMS-integrated content.",
        "Provisioned and deployed application services on Google Cloud Platform (GCP), managing cloud infrastructure for production client applications.",
        "Automated product-variant imports into CommerceTools with custom data pipelines, eliminating hours of manual catalog work.",
        "Drove code quality through code reviews and unit tests for data transformation logic.",
      ],
      de: [
        "Entwicklung der landesweiten Shopping-Center-Plattform von Galerías (galerias.com) mit Authentifizierung, interaktiven Karten und voll anpassbarem CMS.",
        "Redesign des E-Commerce-Shops von NordicTrack mit dynamischen Komponenten, Light/Dark-Themes und CMS-integrierten Inhalten.",
        "Bereitstellung und Deployment von Anwendungsdiensten auf der Google Cloud Platform (GCP), inkl. Verwaltung der Cloud-Infrastruktur für produktive Kundenanwendungen.",
        "Automatisierung von Produktvarianten-Importen in CommerceTools durch eigene Daten-Pipelines — Wegfall stundenlanger manueller Katalogpflege.",
        "Sicherung der Codequalität durch Code-Reviews und Unit-Tests für Datentransformationslogik.",
      ],
    },
```

- [ ] **Step 5: Run the check to verify it passes**

Run: `pnpm tsx scripts/cv-templates/check.ts`
Expected: PASS — prints `CV checks passed.`

- [ ] **Step 6: Commit**

```bash
git add scripts/cv-templates/shared.ts scripts/cv-templates/check.ts
git commit -m "Add Blue People .NET/Vue maintenance, iOS/Android delivery, and Gluo GCP to CV experience"
```

---

### Task 2: Add the React Native variant (`reactnative`)

**Files:**
- Modify: `scripts/cv-templates/shared.ts` (`Variant` union ~1, `titles` ~44-47, `summaries` ~49-58, `skills` ~60-190)
- Modify: `scripts/generate-cv.ts` (`VARIANTS` ~8, add EN-only handling + variant labels ~32-66)
- Modify: `package.json` (scripts block ~10-14)
- Modify: `scripts/cv-templates/check.ts`

**Interfaces:**
- Consumes: `Variant` union, `titles`, `summaries`, `skills`, `getCvData` from Task 1's `shared.ts`; `check.ts` from Task 1.
- Produces: `Variant` now includes `"reactnative"`. `getCvData("reactnative", "en").title === "Senior Full Stack Developer — Mobile"`. `generate-cv.ts` emits `public/Saul-Puentes-CV-ReactNative-EN.pdf` only (no `-DE`). New npm script `generate:cv:reactnative`.

- [ ] **Step 1: Extend the check for the React Native variant**

In `scripts/cv-templates/check.ts`, add before the final `console.log`:

```ts
// ── React Native variant ──
import { getCvData } from "./shared";
const rn = buildTechHtml("reactnative");
assert(
  getCvData("reactnative", "en").title === "Senior Full Stack Developer — Mobile",
  "reactnative: wrong title",
);
assert(/React Native/.test(rn), "reactnative: skills missing React Native");
assert(/App Store/.test(rn) && /Play Store/.test(rn), "reactnative: skills missing iOS/Android stores");
```

Move the `import { getCvData } ...` line up to the top with the other imports (do not leave a mid-file import). Final top import block:

```ts
import assert from "node:assert";
import { buildTechHtml } from "./tech";
import { getCvData, Variant } from "./shared";
```

And drop the inline `import { getCvData } from "./shared";` you just added below — keep only the assertions there.

- [ ] **Step 2: Run the check to verify it fails**

Run: `pnpm tsx scripts/cv-templates/check.ts`
Expected: FAIL — runtime error because `summaries["reactnative"]` is `undefined` (e.g. `TypeError: Cannot read properties of undefined`).

- [ ] **Step 3: Add `reactnative` to the `Variant` union**

In `scripts/cv-templates/shared.ts` line 1:

```ts
export type Variant = "fullstack" | "frontend" | "reactnative" | "dotnet";
```

(Both new members are added now so the type is final; their data entries land in this task and Task 3.)

- [ ] **Step 4: Add the `reactnative` title**

In `scripts/cv-templates/shared.ts`, extend `titles`:

```ts
const titles: Record<Variant, string> = {
  fullstack: "Senior Full Stack Developer",
  frontend: "Senior Frontend Developer",
  reactnative: "Senior Full Stack Developer — Mobile",
  dotnet: "Senior Full Stack Developer — .NET",
};
```

- [ ] **Step 5: Add the `reactnative` summary**

In `scripts/cv-templates/shared.ts`, add to the `summaries` object (before its closing `};`). The `de` value duplicates `en` because this variant is English-only and `de` is never rendered:

```ts
  reactnative: {
    en: "Senior Full Stack Developer with a mobile focus and 8+ years shipping cross-platform apps with React Native, delivered end to end to the iOS App Store and Google Play. Strong across the JavaScript/TypeScript ecosystem — React, Next.js, Node.js, AWS serverless — with native mobile integrations such as push notifications, authentication, and offline support. Works with an AI-augmented workflow (Claude Code, Claude Design, Cursor, custom agents) to move from idea to store-ready builds at exceptional speed. Built mobile and web products for Grupo Xcaret, VMware, NordicTrack, and Galerías.",
    // ponytail: reactnative is EN-only; de duplicates en and is never rendered
    de: "Senior Full Stack Developer with a mobile focus and 8+ years shipping cross-platform apps with React Native, delivered end to end to the iOS App Store and Google Play. Strong across the JavaScript/TypeScript ecosystem — React, Next.js, Node.js, AWS serverless — with native mobile integrations such as push notifications, authentication, and offline support. Works with an AI-augmented workflow (Claude Code, Claude Design, Cursor, custom agents) to move from idea to store-ready builds at exceptional speed. Built mobile and web products for Grupo Xcaret, VMware, NordicTrack, and Galerías.",
  },
```

- [ ] **Step 6: Add the `reactnative` skills**

In `scripts/cv-templates/shared.ts`, add to the `skills` object (before its closing `};`). Again `de` duplicates `en`:

```ts
  reactnative: {
    en: [
      {
        label: "Mobile",
        values: ["React Native", "Expo", "iOS (App Store)", "Android (Play Store)", "Push Notifications"],
      },
      {
        label: "Frontend",
        values: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        label: "Backend",
        values: ["Node.js", "NestJS", "REST / GraphQL", "MongoDB"],
      },
      {
        label: "Cloud & DevOps",
        values: ["AWS (Lambda, Cognito, S3, DynamoDB)", "Docker", "CI/CD", "Git"],
      },
      {
        label: "AI Tooling",
        values: ["Claude Code", "Claude Design", "AI Agents (MCP)", "Cursor"],
      },
    ],
    // ponytail: reactnative is EN-only; de duplicates en and is never rendered
    de: [
      {
        label: "Mobile",
        values: ["React Native", "Expo", "iOS (App Store)", "Android (Play Store)", "Push Notifications"],
      },
      {
        label: "Frontend",
        values: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        label: "Backend",
        values: ["Node.js", "NestJS", "REST / GraphQL", "MongoDB"],
      },
      {
        label: "Cloud & DevOps",
        values: ["AWS (Lambda, Cognito, S3, DynamoDB)", "Docker", "CI/CD", "Git"],
      },
      {
        label: "AI Tooling",
        values: ["Claude Code", "Claude Design", "AI Agents (MCP)", "Cursor"],
      },
    ],
  },
```

- [ ] **Step 7: Add EN-only generation + nicer filenames in `generate-cv.ts`**

In `scripts/generate-cv.ts`, change the `VARIANTS` constant (line 8):

```ts
const VARIANTS: Variant[] = ["fullstack", "frontend", "reactnative", "dotnet"];
const EN_ONLY: Variant[] = ["reactnative", "dotnet"];

const variantLabels: Record<Variant, string> = {
  fullstack: "Fullstack",
  frontend: "Frontend",
  reactnative: "ReactNative",
  dotnet: "DotNet",
};
```

Delete the now-unused `fileLabel` helper (lines 32-34) and replace the generation loop (lines 47-66) so the language list is filtered per variant and filenames use `variantLabels`:

```ts
  for (const variant of variants) {
    const variantLangs = EN_ONLY.includes(variant)
      ? langs.filter((l) => l === "en")
      : langs;
    for (const lang of variantLangs) {
      const fileName = `Saul-Puentes-CV-${variantLabels[variant]}-${lang.toUpperCase()}.pdf`;
      jobs.push(
        lang === "en"
          ? {
              name: `${variantLabels[variant]} EN (ATS)`,
              html: buildTechHtml(variant),
              outPath: path.join(outDir, fileName),
              margins: { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" },
            }
          : {
              name: `${variantLabels[variant]} DE (Lebenslauf)`,
              html: buildLebenslaufHtml(variant),
              outPath: path.join(outDir, fileName),
              margins: { top: "0", bottom: "0", left: "0", right: "0" },
            },
      );
    }
  }
```

- [ ] **Step 8: Add the npm script**

In `package.json`, add to the `scripts` block after `generate:cv:frontend`:

```json
    "generate:cv:reactnative": "pnpm tsx scripts/generate-cv.ts --variant reactnative",
```

- [ ] **Step 9: Run the check to verify it passes**

Run: `pnpm tsx scripts/cv-templates/check.ts`
Expected: PASS — prints `CV checks passed.`

- [ ] **Step 10: Verify the PDF is generated English-only**

Run: `pnpm tsx scripts/generate-cv.ts --variant reactnative`
Expected: prints `✓ ReactNative EN (ATS) → public/Saul-Puentes-CV-ReactNative-EN.pdf` and `Done.` — exactly one PDF, no `-DE` file.

Confirm no German file was produced:

Run: `ls public/Saul-Puentes-CV-ReactNative-*.pdf`
Expected: only `public/Saul-Puentes-CV-ReactNative-EN.pdf`

- [ ] **Step 11: Commit**

```bash
git add scripts/cv-templates/shared.ts scripts/generate-cv.ts scripts/cv-templates/check.ts package.json
git commit -m "Add English React Native CV variant (Senior Full Stack Developer — Mobile)"
```

---

### Task 3: Add the .NET variant (`dotnet`)

**Files:**
- Modify: `scripts/cv-templates/shared.ts` (`summaries`, `skills`)
- Modify: `package.json` (scripts block)
- Modify: `scripts/cv-templates/check.ts`

**Interfaces:**
- Consumes: `Variant` union (already includes `"dotnet"` from Task 2), `titles.dotnet` (already set in Task 2 Step 4), `summaries`, `skills`, `generate-cv.ts` EN-only handling (already covers `dotnet` via Task 2's `EN_ONLY`/`variantLabels`).
- Produces: `getCvData("dotnet", "en").title === "Senior Full Stack Developer — .NET"`. `generate-cv.ts` emits `public/Saul-Puentes-CV-DotNet-EN.pdf` only. New npm script `generate:cv:dotnet`.

- [ ] **Step 1: Extend the check for the .NET variant**

In `scripts/cv-templates/check.ts`, add before the final `console.log`:

```ts
// ── .NET variant ──
const net = buildTechHtml("dotnet");
assert(
  getCvData("dotnet", "en").title === "Senior Full Stack Developer — .NET",
  "dotnet: wrong title",
);
assert(/\.NET \/ C#/.test(net), "dotnet: skills missing .NET / C#");
assert(/Vue\.js/.test(net), "dotnet: skills missing Vue.js");
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `pnpm tsx scripts/cv-templates/check.ts`
Expected: FAIL — runtime error because `summaries["dotnet"]` is `undefined`.

- [ ] **Step 3: Add the `dotnet` summary**

In `scripts/cv-templates/shared.ts`, add to the `summaries` object (before its closing `};`). `de` duplicates `en` because this variant is English-only:

```ts
  dotnet: {
    en: "Senior Full Stack Developer with 8+ years building web and mobile products, experienced across .NET/C# and Vue.js alongside the JavaScript/TypeScript ecosystem — React, Next.js, Node.js. Comfortable maintaining and extending production platforms on both .NET backends and modern JS frontends, backed by AWS and GCP cloud and Python automation. Works with an AI-augmented workflow (Claude Code, Claude Design, Cursor, custom agents) to deliver at exceptional speed. Delivered enterprise platforms for Grupo Xcaret, VMware, NordicTrack, and Galerías.",
    // ponytail: dotnet is EN-only; de duplicates en and is never rendered
    de: "Senior Full Stack Developer with 8+ years building web and mobile products, experienced across .NET/C# and Vue.js alongside the JavaScript/TypeScript ecosystem — React, Next.js, Node.js. Comfortable maintaining and extending production platforms on both .NET backends and modern JS frontends, backed by AWS and GCP cloud and Python automation. Works with an AI-augmented workflow (Claude Code, Claude Design, Cursor, custom agents) to deliver at exceptional speed. Delivered enterprise platforms for Grupo Xcaret, VMware, NordicTrack, and Galerías.",
  },
```

- [ ] **Step 4: Add the `dotnet` skills**

In `scripts/cv-templates/shared.ts`, add to the `skills` object (before its closing `};`). `de` duplicates `en`:

```ts
  dotnet: {
    en: [
      {
        label: ".NET & Backend",
        values: [".NET / C#", "ASP.NET", "Node.js", "REST / GraphQL", "MongoDB"],
      },
      {
        label: "Frontend",
        values: ["Vue.js", "React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        label: "Cloud & DevOps",
        values: ["AWS", "GCP", "Docker", "CI/CD", "Git"],
      },
      {
        label: "CMS & E-Commerce",
        values: ["Shopify", "WordPress", "CommerceTools", "Stripe"],
      },
      {
        label: "AI Tooling",
        values: ["Claude Code", "Claude Design", "AI Agents (MCP)", "Cursor"],
      },
    ],
    // ponytail: dotnet is EN-only; de duplicates en and is never rendered
    de: [
      {
        label: ".NET & Backend",
        values: [".NET / C#", "ASP.NET", "Node.js", "REST / GraphQL", "MongoDB"],
      },
      {
        label: "Frontend",
        values: ["Vue.js", "React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        label: "Cloud & DevOps",
        values: ["AWS", "GCP", "Docker", "CI/CD", "Git"],
      },
      {
        label: "CMS & E-Commerce",
        values: ["Shopify", "WordPress", "CommerceTools", "Stripe"],
      },
      {
        label: "AI Tooling",
        values: ["Claude Code", "Claude Design", "AI Agents (MCP)", "Cursor"],
      },
    ],
  },
```

- [ ] **Step 5: Add the npm script**

In `package.json`, add to the `scripts` block after `generate:cv:reactnative`:

```json
    "generate:cv:dotnet": "pnpm tsx scripts/generate-cv.ts --variant dotnet",
```

- [ ] **Step 6: Run the check to verify it passes**

Run: `pnpm tsx scripts/cv-templates/check.ts`
Expected: PASS — prints `CV checks passed.`

- [ ] **Step 7: Verify the PDF is generated English-only**

Run: `pnpm tsx scripts/generate-cv.ts --variant dotnet`
Expected: prints `✓ DotNet EN (ATS) → public/Saul-Puentes-CV-DotNet-EN.pdf` and `Done.` — exactly one PDF, no `-DE` file.

Run: `ls public/Saul-Puentes-CV-DotNet-*.pdf`
Expected: only `public/Saul-Puentes-CV-DotNet-EN.pdf`

- [ ] **Step 8: Commit**

```bash
git add scripts/cv-templates/shared.ts package.json scripts/cv-templates/check.ts
git commit -m "Add English .NET CV variant (Senior Full Stack Developer — .NET)"
```

---

### Task 4: Full generation pass and visual verification

**Files:**
- None modified. Generated PDFs land in `public/` and are git-ignored (per commit 49353d2) — nothing to commit.

**Interfaces:**
- Consumes: complete `generate-cv.ts`, `shared.ts`, `check.ts` from Tasks 1-3.
- Produces: verified PDF set. `fullstack` and `frontend` still emit EN + DE; `reactnative` and `dotnet` emit EN only.

- [ ] **Step 1: Run the full check**

Run: `pnpm tsx scripts/cv-templates/check.ts`
Expected: PASS — `CV checks passed.`

- [ ] **Step 2: Generate every variant**

Run: `pnpm generate:cv`
Expected output includes, in some order:
```
✓ Fullstack EN (ATS) → public/Saul-Puentes-CV-Fullstack-EN.pdf
✓ Fullstack DE (Lebenslauf) → public/Saul-Puentes-CV-Fullstack-DE.pdf
✓ Frontend EN (ATS) → public/Saul-Puentes-CV-Frontend-EN.pdf
✓ Frontend DE (Lebenslauf) → public/Saul-Puentes-CV-Frontend-DE.pdf
✓ ReactNative EN (ATS) → public/Saul-Puentes-CV-ReactNative-EN.pdf
✓ DotNet EN (ATS) → public/Saul-Puentes-CV-DotNet-EN.pdf
Done.
```

- [ ] **Step 3: Confirm the file set**

Run: `ls public/Saul-Puentes-CV-*.pdf`
Expected: exactly six files — Fullstack EN/DE, Frontend EN/DE, ReactNative EN, DotNet EN. **No** `ReactNative-DE` or `DotNet-DE`.

- [ ] **Step 4: Eyeball the two new PDFs**

Open `public/Saul-Puentes-CV-ReactNative-EN.pdf` and `public/Saul-Puentes-CV-DotNet-EN.pdf`. Confirm by eye:
- Header subtitle reads `Senior Full Stack Developer — Mobile` / `Senior Full Stack Developer — .NET`.
- ReactNative: skills lead with a **Mobile** row (React Native, Expo, iOS/Android); summary mentions App Store + Google Play delivery.
- DotNet: skills show a **.NET & Backend** row (.NET / C#, ASP.NET) and **Vue.js** under Frontend; title has no Vue.js.
- Both: Blue People shows the .NET/Vue.js maintenance bullet and iOS/Android delivery; Gluo shows the GCP bullet.
- Layout still fits cleanly (no overflow onto an unexpected extra page from the added Gluo bullet).

If the added Gluo bullet pushes content awkwardly, that is a layout-only follow-up — note it, do not block completion.

---

## Self-Review

**Spec coverage:**
- "two more variants … ReactNative and .NET" → Tasks 2 and 3. ✓
- "variants of the english CV" (EN-only) → Global Constraints + `EN_ONLY` in Task 2 Step 7; verified in Tasks 2/3/4. ✓
- "enhance the previous technologies correspondingly" → RN summary/skills lead with mobile; .NET summary/skills add .NET & Vue.js. ✓
- "Blue People … maintenance in a Project management app built with .NET and Vue.js" → Task 1 Step 3 (en + de). ✓
- "Gluo … experience with GCP cloud" → Task 1 Step 4 (en + de). ✓
- "RN version enhance that I built app and deliver them for iOS and Android markets" → Task 1 Step 3 (bullet rewrite: iOS App Store + Google Play) + RN summary/skills. ✓
- "don't use [.NET/Vue.js] in the title" → `dotnet` title is `Senior Full Stack Developer — .NET`; Vue.js only in skills/summary. Enforced by Global Constraints and Task 3 checks. ✓

**Placeholder scan:** No TBD/TODO/"add error handling"/"similar to Task N". All copy and code are literal. ✓

**Type consistency:** `Variant` union gains `"reactnative"` and `"dotnet"` in Task 2 Step 3 (both at once). `titles`/`summaries`/`skills` are `Record<Variant, …>`, so every key is supplied: `titles` fully in Task 2 Step 4; `summaries`/`skills` `reactnative` in Task 2, `dotnet` in Task 3. Between Task 2 and Task 3, `summaries.dotnet`/`skills.dotnet` are absent — but `titles.dotnet` is set and `dotnet` is only rendered starting in Task 3, and `tsx` transpiles without type-checking, so Task 2's build and check run. `check.ts` imports (`buildTechHtml`, `getCvData`, `Variant`) match `shared.ts`/`tech.ts` exports. `variantLabels`/`EN_ONLY` are `Record<Variant,…>`/`Variant[]` and cover all four members. Filenames use `variantLabels` consistently. Em dash `—` (U+2014) is identical in `titles` and in the `check.ts` string comparisons. ✓
