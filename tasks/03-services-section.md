# Task 03 — Services Section

## Status: Done

## Context

The homepage currently flows Hero → Projects → Contact. A new **Services** section needs to be added between Hero and Projects to showcase four service offerings. The section uses a scroll-driven quadrant layout: the viewport is divided into a 2×2 grid on desktop, and each quadrant reveals sequentially with a fade-up animation as the user scrolls, locking into place before the next one appears.

Service content:

| # | Title | Description |
|---|-------|-------------|
| 01 | Planning & Strategising | You can't afford to keep your marketing efforts basic. By understanding your goals, I will develop effective digital strategies which will give you an edge over your competition. |
| 02 | Development & Management | Whether you need a new Webflow site or want to manage an existing one, I'm here for all of your needs. I will do everything in my power to make sure that your website is perfect. |
| 03 | Analysis & Automation | There is nothing worse than spending countless hours on tedious tasks as a founder. I will help you identify what is slowing down your business and how we can speed it up. |
| 04 | Digital Consulting & Audit | Through a structured audit of your existing operations, I will provide you with actionable insights for your business and help you figure out what's stopping you from growing. |

---

## Plan

### Step 1 — Add services data

Create `content/data/services.json` with an array of four service objects (`number`, `title`, `description`).

### Step 2 — Add i18n keys

Add `services` section keys to `content/i18n/en.json`, `es.json`, and `de.json` (section title + each service's title and description). Update `lib/i18n/types.ts` with the new keys.

### Step 3 — Create the Services component

Create `components/services-section.tsx`:

- Outer wrapper uses CSS `position: sticky` + a tall scroll container (e.g. `400vh`) so the quadrant grid stays pinned while the user scrolls through it.
- A 2×2 CSS grid (`grid-cols-2 grid-rows-2`) filling the viewport.
- Each quadrant contains: small mono number (`01`–`04`), title, description, and a bottom border/`<hr>`.
- Use `IntersectionObserver` or scroll-position thresholds to trigger fade-up (`opacity-0 translate-y-4 → opacity-100 translate-y-0`) for each quadrant in order: top-left → top-right → bottom-left → bottom-right.
- On mobile, stack quadrants vertically (single column) with the same fade-up on scroll.

### Step 4 — Wire into page

In `app/page.tsx`, import `ServicesSection` and place it between `<HeroSection />` and `<ProjectsSection />`.

### Step 5 — Add data loader

In `lib/data.ts`, add a `getServices()` function following the existing pattern.

### Step 6 — Verify

1. Run `npm run build`
2. Test at `http://localhost:3000` — scroll through the services section, confirm quadrants appear in order with fade-up animation
3. Test responsive: on mobile, quadrants should stack vertically
4. Test i18n: switch language and confirm translated content

---

## Files Involved

### Added
- `content/data/services.json` — service data
- `components/services-section.tsx` — scroll-driven quadrant component

### Modified
- `app/page.tsx` — add ServicesSection between Hero and Projects
- `content/i18n/en.json`, `es.json`, `de.json` — service translation keys
- `lib/i18n/types.ts` — new i18n key types
- `lib/data.ts` — `getServices()` loader

---

## Acceptance Criteria

- [ ] Four quadrants displayed in a 2×2 grid on desktop
- [ ] Quadrants reveal sequentially (TL → TR → BL → BR) with fade-up animation on scroll
- [ ] Section pins in viewport while all four quadrants animate in
- [ ] Each quadrant shows number, title, description, and bottom border
- [ ] Mobile: single-column stack with fade-up on scroll
- [ ] Content is data-driven (JSON + i18n), not hardcoded
- [ ] `npm run build` passes
