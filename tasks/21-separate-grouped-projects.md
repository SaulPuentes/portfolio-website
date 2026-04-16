# Task 21 — Separate Grouped Projects into Individual Entries

## Status: Done

## Context

Currently, `content/data/projects.json` contains two entries that bundle multiple client projects under a single card:

- **`corporate-websites`** — groups Evalor, Grupo DAGS, and Salsa World (all WordPress builds).
- **`shopify-ecommerce`** — groups Simonett and Twelve Thirty Four (both Shopify Themes 2.0).

Each grouped entry uses a single `image`, a shared `gallery`, and combined descriptions that speak about "brands" in plural. Splitting them into individual entries will let each project stand on its own with its own description, images, live URL, and identity in the scroll carousel.

Images currently live in `public/projects/corporativos/` and `public/projects/ecommerce/`. They are not labeled by brand, so the right screenshots must be identified and optionally reorganized into per-brand subfolders.

---

## Plan

### Step 1 — Identify which screenshots belong to which brand

Review the images in:
- `public/projects/corporativos/` — contains `shot-1.png` through `shot-6.png` plus raw screenshots with timestamps
- `public/projects/ecommerce/` — contains `screenshot-1.png` through `screenshot-4.png`, `simonett.png`, plus raw screenshots

Map each file to its brand visually. Optionally move them into per-brand subfolders (e.g. `public/projects/evalor/`, `public/projects/grupodags/`, `public/projects/salsaworld/`, `public/projects/simonett/`, `public/projects/twelvethirtyfour/`) for clarity.

### Step 2 — Write individual project entries in `content/data/projects.json`

Replace the two grouped entries with one entry per brand. Each entry should follow the existing schema:

```json
{
  "id": "evalor",
  "name": { "de": "...", "en": "Evalor", "es": "Evalor" },
  "description": { "de": [...], "en": [...], "es": [...] },
  "technologies": ["WordPress", "PHP", "CSS", "JavaScript", "ACF"],
  "featured": true,
  "liveUrl": "https://saulpuentes.com/evalor",
  "image": "/projects/evalor/shot-1.png",
  "gallery": [...]
}
```

New IDs and live URLs:
- `evalor` → `https://saulpuentes.com/evalor`
- `grupo-dags` → `https://grupodags.com/`
- `salsa-world` → `https://salsaworld.mx`
- `simonett` → `https://simonett.us/`
- `twelve-thirty-four` → `https://twelvethirtyfourflowers.com/`

Descriptions should be rewritten per brand (not generic "the brands needed…" language). Keep 4 paragraphs per locale to match the existing pattern: summary → problem → approach/challenge → result.

### Step 3 — Verify image paths

After updating the JSON, confirm that all `image` and `gallery` paths resolve to real files under `public/`. Broken image paths will show blank cards.

### Step 4 — Check modal and carousel rendering

Run `npm run dev` and:
- Open the Projects section; confirm 7 cards appear (5 original + 2 new from split, minus 2 grouped = net +3).
- Open each new project's modal and verify description, gallery, and links render correctly.
- Check the scroll carousel layout still works with the increased card count.

### Step 5 — Verify build

Run `npm run build` — it should complete without errors.

---

## Files Involved

### Modified
- `content/data/projects.json` — replace 2 grouped entries with 5 individual entries

### Potentially Modified
- `public/projects/corporativos/` → may be reorganized into per-brand subfolders
- `public/projects/ecommerce/` → same

---

## Acceptance Criteria

- [ ] `corporate-websites` entry removed; Evalor, Grupo DAGS, and Salsa World each have their own entry
- [ ] `shopify-ecommerce` entry removed; Simonett and Twelve Thirty Four each have their own entry
- [ ] Each new entry has individual name, description (all 3 locales), technologies, liveUrl, image, and gallery
- [ ] No broken image paths
- [ ] Modal renders correctly for all new entries
- [ ] `npm run build` passes
