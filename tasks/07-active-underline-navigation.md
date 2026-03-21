# Task 07 — Active Underline Navigation

## Status: Pending

## Context

The `examples/sticky-navigation/` demo shows a sliding underline indicator that tracks the currently active nav tab. A `<span class="et-hero-tab-slider">` is absolutely positioned at the bottom of the nav container; its `width` and `left` are updated via JS to match whichever tab corresponds to the visible section (determined by scroll position). The transition is CSS-driven (`transition: left 0.3s ease`).

The goal is to port this sliding-underline behaviour into the existing Radix-based `components/ui/navigation-menu.tsx` so it can be used by the site's main navigation. The implementation should be React-idiomatic (no jQuery), using refs and state instead of direct DOM manipulation.

---

## Plan

### Step 1 — Add a slider element to `NavigationMenu`

In `components/ui/navigation-menu.tsx`, add a `<span>` inside `NavigationMenu` (after `{children}`) that acts as the sliding underline indicator. Give it `data-slot="navigation-menu-slider"` and absolute positioning at the bottom of the root container. The root already has `relative` — just ensure it also gets `overflow-visible` or the slider is inside the bounding box.

Style the slider span:

```tsx
<span
  data-slot="navigation-menu-slider"
  className="absolute bottom-0 h-[3px] bg-primary transition-all duration-300 ease-in-out"
  style={{ width: sliderStyle.width, left: sliderStyle.left }}
/>
```

### Step 2 — Track the active item via refs and state

Add a React context or callback-ref approach so that each `NavigationMenuLink` (or `NavigationMenuItem`) can report its DOM rect when it becomes active (`data-active="true"`).

Approach:
1. In `NavigationMenu`, create state: `const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 })`.
2. Use a `ref` on the root element and a `MutationObserver` or `useEffect` that watches for `[data-active="true"]` changes among children.
3. When the active link changes, measure its `offsetLeft` and `offsetWidth` relative to the nav root and update `sliderStyle`.

Alternatively, expose a context with a `setActiveRect` callback that `NavigationMenuLink` calls in a `useEffect` when its `data-active` prop is `true`.

### Step 3 — Handle resize

Add a `resize` event listener (via `useEffect`) that recalculates the slider position when the window resizes, mirroring the example's `onResize()`.

### Step 4 — Make the slider opt-in

Add an `activeSlider?: boolean` prop to `NavigationMenu` (default `false`). Only render the slider `<span>` and attach the tracking logic when `activeSlider` is `true`, so existing usages are unaffected.

### Step 5 — Verify

1. Run `npm run build` — no type or lint errors.
2. Test at `http://localhost:3000` — the navigation should show a sliding underline that smoothly transitions between active items.
3. Resize the window — the underline should reposition correctly.

---

## Files Involved

### Modified
- `components/ui/navigation-menu.tsx` — add slider span, tracking state/refs, resize handler, and `activeSlider` prop

### Added
- None expected (all changes in the existing component)

---

## Acceptance Criteria

- [ ] A colored underline bar appears beneath the active navigation link
- [ ] The underline slides smoothly (CSS transition) when the active link changes
- [ ] The underline repositions correctly on window resize
- [ ] The slider is opt-in via an `activeSlider` prop (existing usages unaffected)
- [ ] No jQuery — pure React refs/state
- [ ] `npm run build` passes with no errors
