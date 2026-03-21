# Task 13 — Fix or Remove Card Gallery Hover Image Cycling

## Status: Pending

## Context

When hovering a project card in the scroll carousel, the `SlideCard` component cycles through gallery images every 3 seconds. Each image swap re-mounts the `<Image>` component (via `key={currentImage.src}`) which can trigger a brief layout reflow inside the Swiper slide. Because the carousel uses `centeredSlides: true` with GSAP ScrollTrigger scrubbing, this reflow can cause Swiper to recalculate positions and snap the card toward the center of the viewport — even though the card was already scrolled/translated to the right.

**Root cause:** The `key` prop on `<Image>` forces a full unmount/remount. During the transition frame the new `<img>` element has no decoded pixels yet, which can momentarily affect Swiper's internal size calculations and trigger a translate jump. The `animate-fade-in` animation (starting at `opacity: 0`) compounds the visual jolt.

---

## Plan

### Option A — Fix: preload all gallery images and crossfade (preferred if gallery cycling is wanted)

#### Step 1 — Render all gallery images in a stack

In `components/scroll-carousel.tsx` `SlideCard`, instead of conditionally rendering one `<Image>` by index, render **all** gallery images stacked via the existing `grid-area: 1 / -1` in `.media-container`, and toggle visibility with opacity only:

```tsx
{images ? (
  <div className="media-container">
    {images.map((img, i) => (
      <Image
        key={img.src}
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        className={`object-cover w-full h-full transition-opacity duration-400 ${
          i === imgIndex ? "opacity-100" : "opacity-0"
        }`}
        sizes="(max-width: 51.29875em) 100vw, 500px"
      />
    ))}
    {/* dot indicators */}
  </div>
) : /* ... */ }
```

This keeps all images in the DOM (preloaded), avoids remounting, and prevents any layout shift.

#### Step 2 — Remove `animate-fade-in` keyframe usage

The `animate-fade-in` class and `@keyframes fade-in` in `styles/scroll-carousel.css` are no longer needed for gallery transitions; the `transition-opacity` handles it. Keep the keyframe only if used elsewhere, otherwise remove it.

#### Step 3 — Verify

1. Run `npm run build`
2. Test at `http://localhost:3000` — hover each project card, confirm smooth crossfade with no card jump
3. Scroll through the carousel while a card is cycling to ensure no position glitches

---

### Option B — Remove gallery hover cycling entirely (simpler)

#### Step 1 — Simplify `SlideCard`

Remove `imgIndex`, `intervalRef`, `startCycling`, `stopCycling` state and callbacks. Always show only the first image (`item.gallery?.[0] ?? item.image`). Remove `onMouseEnter`/`onMouseLeave` from the card div. Remove the dot indicators.

#### Step 2 — Remove `animate-fade-in`

Remove the keyframe and class from `styles/scroll-carousel.css`.

#### Step 3 — Verify

Same verification as Option A.

---

## Files Involved

### Modified
- `components/scroll-carousel.tsx` — `SlideCard` component (gallery rendering logic)
- `styles/scroll-carousel.css` — remove/update `animate-fade-in` keyframe

---

## Acceptance Criteria

- [ ] Hovering a project card does NOT cause it to jump/snap to the viewport center
- [ ] If Option A: gallery images crossfade smoothly on hover
- [ ] If Option B: no gallery cycling on hover, single static image shown
- [ ] `npm run build` passes without errors
- [ ] Scroll-scrub carousel positioning remains stable during hover interactions
