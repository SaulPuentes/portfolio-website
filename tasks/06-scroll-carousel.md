# Task 06 — Scroll Carousel Component

## Status: Pending

## Context

The `examples/scroll-carousel/` directory contains a vanilla JS implementation of a horizontal carousel that syncs with scroll position using GSAP ScrollTrigger + Swiper. The portfolio needs this as a reusable React component.

The project currently has no GSAP or Swiper dependencies. The existing stack is Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui. A similar scroll-driven pattern already exists in `hooks/use-scroll-cards.ts`.

The example features:
- Horizontal card carousel with image + title + description + CTA
- Scroll-scrubbed navigation (cards advance as user scrolls)
- Per-slide opacity based on distance from center
- Responsive layout: centered slides on desktop, edge-aligned on mobile
- Touch/swipe support with free-swiping when not scrubbing
- GSAP ScrollTrigger pinning the carousel while scrubbing through slides

---

## Plan

### Step 1 — Install dependencies

```bash
npm install gsap swiper
```

### Step 2 — Create the `useScrollCarousel` hook

**File:** `hooks/use-scroll-carousel.ts`

Port the `createCarousel` logic from `examples/scroll-carousel/index.js` into a custom React hook. The hook should:

- Accept a ref to the carousel container element and an options object (`centeredSlides`, `slideOpacity`, `isScrubActive`, `isScrubOnTouchActive`, `scrubDir`)
- Initialize Swiper and GSAP ScrollTrigger on mount
- Handle resize/orientation changes
- Clean up Swiper and ScrollTrigger instances on unmount
- Expose an `update()` method via the hook return

Do **not** use `ScrollSmoother` (requires GSAP Club membership). Use native scroll or CSS `scroll-behavior: smooth` instead.

Replace `utils.*` calls from the example with:
- `utils.device.isTouch()` → `'ontouchstart' in window` or `matchMedia('(pointer: coarse)')`
- `utils.math.clamp` → `Math.min(Math.max(...))`
- `utils.math.interpolateRange` → inline linear interpolation
- `utils.css.getCssVarValue` → `getComputedStyle(el).getPropertyValue(...)`
- `utils.css.getLVH` → `window.innerHeight`
- `utils.dom.addClass/removeClass` → `classList.add/remove`
- `utils.dom.resolveElement` → `document.querySelector`

### Step 3 — Create the `ScrollCarousel` component

**File:** `components/scroll-carousel.tsx`

Props:
- `items: Array<{ image: { src: string; alt: string; width: number; height: number }; title: string; description: string; cta?: { label: string; href: string } }>`
- `heading?: string` (text rendered before the carousel)
- `id?: string`
- `scrub?: boolean` (default `true`)
- `className?: string`

The component should:
- Render the same DOM structure as the example HTML (`.carousel > .wrapper > .text-before + .swiper-container > .swiper-wrapper > .swiper-slide > .card`)
- Use `next/image` for responsive images
- Apply Tailwind classes where possible; use a scoped CSS module or Tailwind `@apply` for Swiper-specific styles that can't be expressed as utilities
- Call `useScrollCarousel` with a ref to the container

### Step 4 — Add carousel styles

**File:** `styles/scroll-carousel.css` (imported in the component)

Port the carousel-specific CSS from `examples/scroll-carousel/index.css` (lines 195–502). Adapt to Tailwind where practical. Keep Swiper structural styles (`.swiper-slide` widths, `.swiper-column-gap`) in CSS since they rely on `calc()` with CSS custom properties.

### Step 5 — Replace the projects section with ScrollCarousel

**File:** `components/projects-section.tsx`

Replace the current projects section implementation with the new `ScrollCarousel` component, feeding it data from `content/data/projects.json`.

Map `projects.json` fields to carousel item props:
- `name[locale]` → `title`
- `description[locale]` → `description`
- Project image (add an `image` field to `projects.json` if missing, or use a placeholder) → `image`
- `technologies` → render as tags/badges on the card
- Link to project detail → `cta`

The section heading should come from i18n (existing projects section heading).

### Step 6 — Update projects.json schema if needed

If `projects.json` items lack an `image` field, add one with `src`, `alt`, `width`, `height` to each project entry. Use placeholder images initially.

### Step 7 — Verify

1. Run `npm run build` — no errors
2. Test at `http://localhost:3000` — carousel scrolls horizontally when page is scrolled
3. Test mobile viewport — slides should be edge-aligned, touch-swipeable
4. Test desktop — slides centered, scroll-scrubbed

---

## Files Involved

### Added
- `hooks/use-scroll-carousel.ts` — scroll-synced carousel hook
- `components/scroll-carousel.tsx` — carousel React component
- `styles/scroll-carousel.css` — carousel-specific styles

### Modified
- `package.json` — add `gsap` and `swiper` dependencies
- `components/projects-section.tsx` — replace current implementation with `ScrollCarousel` rendering `projects.json` data
- `content/data/projects.json` — add `image` field to each project if missing

---

## Acceptance Criteria

- [ ] Carousel renders with cards containing image, title, description, and optional CTA
- [ ] Scroll-scrubbing advances slides horizontally on desktop
- [ ] Per-slide opacity fades slides based on distance from center
- [ ] Responsive: centered on desktop (>51.25rem), edge-aligned on mobile
- [ ] Touch/swipe works on mobile devices
- [ ] Carousel pins in viewport during scroll-scrub
- [ ] Clean unmount with no memory leaks (ScrollTrigger + Swiper destroyed)
- [ ] Projects section renders project data from `projects.json` via the ScrollCarousel
- [ ] Project cards show name, description, technologies, and image
- [ ] i18n works — project name/description change with locale
- [ ] `npm run build` passes
