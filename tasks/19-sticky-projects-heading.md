# Task 19 — Sticky Projects Section Heading

## Status: Done

## Context

The projects section uses a GSAP ScrollTrigger-powered horizontal scroll carousel (`ScrollCarousel`). The section heading (e.g. "Projects") is rendered inside `.wrapper` but **outside** the `.swiper-container` element that gets pinned by ScrollTrigger. As a result, when the user scrolls and the carousel pins, the heading scrolls away off-screen instead of staying visible.

The heading should remain fixed at the top of the viewport (or section) while the project cards scroll horizontally beneath it.

---

## Plan

### Why CSS `position: sticky` doesn't work here

The original plan (Option B) moved the heading into the `<section>` with `position: sticky`. However, GSAP's `pin-spacer` inflates the section height to cover the full horizontal scroll distance. Because the section stays tall the entire time, the heading remains sticky long after the cards have finished scrolling — it never un-sticks until the (very tall) section scrolls out.

### Chosen approach — Pin `.wrapper` with GSAP instead of `.swiper-container`

Keep the heading inside `ScrollCarousel`'s `.wrapper` (as a sibling above `.swiper-container`). Change GSAP's `pin` target from `.swiper-container` to `.wrapper`. This pins both the heading and the carousel together — they stay fixed during the horizontal scroll and unpin together when it ends.

### Step 1 — Change the GSAP pin target

**`hooks/use-scroll-carousel.ts`:**
- Query `.wrapper` alongside the existing element lookups:
  ```ts
  const outerWrapperEl = el.querySelector<HTMLElement>(".wrapper")
  ```
- Guard: `if (!outerWrapperEl || !swiperEl || !wrapperEl) return`
- In the ScrollTrigger config, change `pin: swiperEl` → `pin: outerWrapperEl`

### Step 2 — Add background to the heading

**`components/scroll-carousel.tsx`:**
- Wrap the heading in `relative z-10 bg-background` so cards don't bleed through when scrolling underneath it.

### Step 3 — Keep projects/index.tsx unchanged

The heading stays as the `heading` prop on `<ScrollCarousel>`, no CSS sticky needed.

### Step 4 — Verify

1. Run `npm run build`
2. Test at `http://localhost:3000` — scroll to Projects section
3. Confirm heading stays pinned at top while cards scroll horizontally
4. Confirm heading scrolls away when the horizontal carousel finishes
5. Check mobile breakpoint — heading should also stay visible
6. Check that the heading doesn't overlap the main navigation

---

## Files Involved

### Modified
- `hooks/use-scroll-carousel.ts` — pin `.wrapper` instead of `.swiper-container`
- `components/scroll-carousel.tsx` — add `bg-background` wrapper around heading

---

## Acceptance Criteria

- [x] Projects section title stays visible/fixed while scrolling through the horizontal card carousel
- [x] Heading scrolls away when the projects section ends (does not persist into the next section)
- [x] Heading does not overlap the main navigation bar
- [x] Cards scroll underneath the heading cleanly (no visual bleed-through)
- [x] Works on both desktop (scrub mode) and mobile
- [x] `npm run build` passes with no errors
