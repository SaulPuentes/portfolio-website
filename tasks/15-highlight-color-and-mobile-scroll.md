# Task 15 — Highlight Color #3B82F6 & Mobile Projects Scroll Fix

## Status: Pending

## Context

The portfolio uses OKLCH grayscale values for `--accent` (and related variables) in both light and dark themes, resulting in no color highlight. The user wants `#3B82F6` (Tailwind blue-500) as the main highlight/accent color for both themes.

Separately, the projects section carousel does not scroll properly on mobile. The `useScrollCarousel` hook adds `swiper-no-swiping` to the swiper container unconditionally (line 246), which disables touch dragging. Combined with `isScrubOnTouchActive: true` passed from the `ScrollCarousel` component, the carousel relies on GSAP ScrollTrigger scrubbing on mobile — this pins the section and hijacks vertical scroll to drive horizontal movement, which creates a confusing UX on touch devices. The carousel should allow native touch swiping on mobile instead.

---

## Plan

### Step 1 — Convert #3B82F6 to OKLCH and update CSS variables

`#3B82F6` in OKLCH is approximately `oklch(0.623 0.214 259.1)`.

In `styles/globals.css`:

**Light theme (`:root`):**
- `--accent: oklch(0.623 0.214 259.1)` (the blue itself)
- `--accent-foreground: oklch(1 0 0)` (white text on blue)
- `--ring: oklch(0.623 0.214 259.1)` (match accent for focus rings)

**Dark theme (`.dark`):**
- `--accent: oklch(0.623 0.214 259.1)` (same blue — adjust lightness if needed for dark bg contrast)
- `--accent-foreground: oklch(1 0 0)` (white text on blue)
- `--ring: oklch(0.623 0.214 259.1)`

Review all usages of `text-accent`, `bg-accent`, `border-accent` across components to ensure contrast is acceptable with a saturated blue instead of gray.

### Step 2 — Fix mobile scrolling in projects carousel

In `hooks/use-scroll-carousel.ts`:
- Move `swiperEl.classList.add("swiper-no-swiping")` inside a condition so it only applies when scrubbing is active (desktop). On mobile/touch, leave swiping enabled.
- Ensure `isScrubOnTouchActive` is `false` (or not passed) from `components/scroll-carousel.tsx` so mobile uses free touch swiping, not scroll-driven scrubbing.

In `components/scroll-carousel.tsx`:
- Change `isScrubOnTouchActive: scrub` to `isScrubOnTouchActive: false` so touch devices get native swipe behavior.

In `hooks/use-scroll-carousel.ts`, around line 246:
```ts
// Only disable swiping when scrub is active
if (scrubActive) {
  swiperEl.classList.add("swiper-no-swiping")
}
```

### Step 3 — Verify

1. Run `npm run build`
2. Test at `http://localhost:3000`:
   - Verify accent color (#3B82F6) appears in both light and dark themes
   - Check contrast of text on accent backgrounds
   - Test projects section on mobile viewport: cards should be swipeable with touch
   - Test projects section on desktop: scroll-driven scrubbing should still work
3. Check no regressions in other sections using accent colors

---

## Files Involved

### Modified
- `styles/globals.css` — update `--accent`, `--accent-foreground`, `--ring` in both `:root` and `.dark`
- `hooks/use-scroll-carousel.ts` — conditionally apply `swiper-no-swiping` only when scrub is active
- `components/scroll-carousel.tsx` — set `isScrubOnTouchActive: false`

---

## Acceptance Criteria

- [ ] `--accent` resolves to #3B82F6 in both light and dark themes
- [ ] Text on accent backgrounds has sufficient contrast (white foreground)
- [ ] Focus rings use the new accent color
- [ ] Projects carousel is swipeable via touch on mobile viewports
- [ ] Desktop scroll-driven scrubbing still works as before
- [ ] `npm run build` passes without errors
