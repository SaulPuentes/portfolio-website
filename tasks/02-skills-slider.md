# Task 02 — Skills Marquee Slider

## Status: Done

## Context

The portfolio has a `content/data/skills.json` with 5 categories (frontend, backend, cloud, databases, practices) totalling ~30 skills. Currently there is no skills section rendered on the page (`skills-section.tsx` was deleted). The goal is to create a two-row infinite marquee slider that lives **inside the hero banner**, fitting within the first screen (above the fold). It displays all skill names with opposing scroll directions and opacity effects on the edge items. It should not be a separate section — it is part of `HeroSection`.

---

## Plan

### Step 1 — Create `components/skills-section.tsx`

Build a `SkillsSection` component that:

1. Reads skills from `content/data/skills.json` via `lib/data.ts` (`getSkills()`).
2. Flattens all skill items into a single array of names.
3. Splits them into two rows (e.g., odd/even index or first-half/second-half).
4. Renders two horizontal marquee strips:
   - **Row 1**: scrolls right → left (default marquee direction).
   - **Row 2**: scrolls left → right (reverse).
5. Each row duplicates its content 3–4× for seamless looping.
6. Uses CSS `@keyframes` for the infinite scroll animation via Tailwind `animate-` utilities or inline `<style>`.
7. Applies an opacity gradient on the left and right edges of each row using a CSS mask (`mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent)`).

#### Animation approach (pure CSS)

```css
@keyframes marquee-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marquee-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
```

Each row renders its items list twice inside a flex container. The animation shifts by exactly 50% (one copy's width) for a seamless loop.

#### Skill item styling

- Render each skill as a `<span>` with Tailwind classes: `text-sm md:text-base font-medium text-muted-foreground whitespace-nowrap px-4 py-2`.
- Optionally wrap in a subtle border/badge style for visual separation.

### Step 2 — Integrate into HeroSection

Import and render the marquee component **inside** `components/hero-section.tsx`, positioned below the hero text/CTA but still within the hero banner so the entire first viewport includes the marquee. Do **not** add a separate section in `app/page.tsx`.

### Step 3 — Ensure i18n section title

Check `content/i18n/{en,es,de}.json` for a `skills.title` key (e.g., "Skills", "Habilidades", "Fähigkeiten"). Add if missing. Use it as the section heading.

### Step 4 — Verify

1. Run `npm run build`
2. Test at `http://localhost:3000` — confirm:
   - Two rows scroll in opposite directions continuously
   - Edge opacity fade is visible
   - Responsive on mobile and desktop
   - No layout shift or jank

---

## Files Involved

### Modified
- `components/hero-section.tsx` — integrate marquee inside the hero banner
- `content/i18n/en.json` — add `skills.title` if missing
- `content/i18n/es.json` — add `skills.title` if missing
- `content/i18n/de.json` — add `skills.title` if missing

### Added
- `components/skills-marquee.tsx` — new marquee skills component (rendered inside hero)

---

## Acceptance Criteria

- [ ] Marquee lives inside the hero banner, visible above the fold on first screen
- [ ] Two-row infinite marquee with all skills from `skills.json`
- [ ] Row 1 scrolls right-to-left, Row 2 scrolls left-to-right
- [ ] Opacity fade on left/right edges of each row
- [ ] Pure CSS animation (no JS intervals)
- [ ] Section title uses i18n translations
- [ ] `npm run build` passes
- [ ] Responsive layout
