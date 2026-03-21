# Task 17 — Redesign Project Detail Modal Content

## Status: Pending

## Context

The project detail modal (`components/projects/project-detail-modal.tsx`) currently renders 5–6 separate titled sections (Problem, Architecture, Decisions, Challenges, Results, Lessons) each with their own heading. This creates visual noise and unnecessary structure. The goal is to unify all descriptive text into a single paragraph/div, keep the Tech Stack and Links sections as-is, and remove the now-unnecessary section labels from i18n.

---

## Plan

### Step 1 — Replace `ProjectDetail` fields with a single `summary` field

**File:** `lib/types.ts`

Replace:
```ts
export interface ProjectDetail {
  problem: Record<Locale, string>
  architecture: Record<Locale, string>
  decisions: Record<Locale, string>
  challenges: Record<Locale, string>
  results: Record<Locale, string>
  lessons?: Record<Locale, string>
}
```

With:
```ts
export interface ProjectDetail {
  summary: Record<Locale, string>
}
```

### Step 2 — Merge detail texts in `content/data/projects.json`

For each project, combine the `problem`, `architecture`, `decisions`, `challenges`, `results`, and `lessons` texts into a single `summary` field per locale. Join the sentences naturally into a cohesive paragraph. Remove the individual fields.

**Before (example):**
```json
"detail": {
  "problem": { "en": "...", "es": "...", "de": "..." },
  "architecture": { "en": "...", "es": "...", "de": "..." },
  ...
}
```

**After:**
```json
"detail": {
  "summary": { "en": "Combined paragraph...", "es": "Párrafo combinado...", "de": "Zusammengefasster Absatz..." }
}
```

Also update `content/data/projects.sample.json` to match the new structure.

### Step 3 — Remove detail section labels from i18n

**Files:**
- `content/i18n/en.json` — remove keys: `problem`, `architecture`, `decisions`, `challenges`, `results`, `lessons` from `projects` object
- `content/i18n/es.json` — same
- `content/i18n/de.json` — same

### Step 4 — Remove detail section label types from i18n types

**File:** `lib/i18n/types.ts`

Remove these fields from the `projects` section of the `Translations` interface:
- `problem`, `architecture`, `decisions`, `challenges`, `results`, `lessons`

### Step 5 — Simplify the modal component

**File:** `components/projects/project-detail-modal.tsx`

- Remove the `details` array construction (lines 27–34)
- Remove the "Detail sections" `div` (lines 129–141)
- Add a single `<div>` or `<p>` after the description that renders `project.detail.summary[locale]` with appropriate styling (`text-sm leading-relaxed text-muted-foreground`)
- Keep the Image Carousel, Description, Tech Stack, and Links sections unchanged

### Step 6 — Verify

1. Run `npm run build` — ensure no type errors
2. Test at `http://localhost:3000` — open each project modal, verify:
   - Image carousel still works
   - Description shows
   - Unified summary paragraph appears
   - Tech Stack badges display
   - Links buttons work
3. Check all three locales (en, es, de)

---

## Files Involved

### Modified
- `lib/types.ts` — simplify `ProjectDetail` interface to single `summary` field
- `content/data/projects.json` — merge detail fields into `summary` per project
- `content/data/projects.sample.json` — match new structure
- `content/i18n/en.json` — remove 6 detail section labels
- `content/i18n/es.json` — remove 6 detail section labels
- `content/i18n/de.json` — remove 6 detail section labels
- `lib/i18n/types.ts` — remove 6 fields from `Translations.projects`
- `components/projects/project-detail-modal.tsx` — replace detail sections with single summary

---

## Acceptance Criteria

- [ ] `ProjectDetail` has a single `summary` field instead of 6 separate fields
- [ ] All projects in `projects.json` have merged, natural-reading `summary` text in en/es/de
- [ ] Modal shows unified summary paragraph below description
- [ ] Tech Stack and Links sections remain unchanged
- [ ] Removed section labels (problem, architecture, etc.) from all i18n files and types
- [ ] `npm run build` passes with no errors
- [ ] All three locales render correctly
