# Task 04 — Hero Section Text Cleanup

## Status: Done

## Context

The hero section currently has two problems:

1. **"Full Stack Developer" appears twice** — once from `siteConfig.tagline` (line 22 of `hero-section.tsx`) and again from `t.hero.title` (line 28). Both resolve to "Full Stack Developer" in all locales.

2. **Too much text in the hero** — `t.hero.description` contains 3 long paragraphs that repeat information already present in the separate "About/Profile" section (`t.about.content`). This makes the hero feel heavy and redundant.

---

## Plan

### Step 1 — Remove duplicate "Full Stack Developer"

Either:
- **Option A (recommended):** Remove `siteConfig.tagline` from the hero (line 21-23) since the h1 name + `t.hero.title` already establish identity. Keep tagline available for meta/SEO use only.
- **Option B:** Change `t.hero.title` in each locale JSON to something distinct (e.g., a short role description or value proposition), keeping tagline as the small uppercase label.

File: `components/hero-section.tsx` — remove or repurpose the `<p>` on lines 21-23.

### Step 2 — Trim hero description

Remove `t.hero.description` from the hero section entirely (lines 62-68 in `hero-section.tsx`) and remove the divider (line 60). The about/profile section already covers this content.

Alternatively, replace the 3-paragraph description with a single concise sentence (≤ 30 words) in each locale file.

Files:
- `components/hero-section.tsx` — remove description block and divider
- `content/i18n/es.json` — remove or shorten `hero.description`
- `content/i18n/en.json` — remove or shorten `hero.description`
- `content/i18n/de.json` — remove or shorten `hero.description`

### Step 3 — Adjust layout

With less text on the right column, reconsider the `lg:grid-cols-5` split. A simpler centered single-column or `lg:grid-cols-2` layout may work better with the reduced content.

File: `components/hero-section.tsx` — adjust grid classes.

### Step 4 — Verify

1. Run `npm run build`
2. Test at `http://localhost:3000` — check hero in all 3 locales (de, en, es)
3. Confirm no duplicate "Full Stack Developer" text
4. Confirm hero feels concise and not redundant with the profile section

---

## Files Involved

### Modified
- `components/hero-section.tsx` — remove duplicate tagline, trim description block, adjust layout
- `content/i18n/en.json` — remove or shorten `hero.description`
- `content/i18n/es.json` — remove or shorten `hero.description`
- `content/i18n/de.json` — remove or shorten `hero.description`

---

## Acceptance Criteria

- [ ] "Full Stack Developer" appears only once in the hero
- [ ] Hero description is either removed or reduced to ≤ 1 short paragraph
- [ ] No content duplication between hero and about/profile sections
- [ ] Build passes, all 3 locales render correctly
