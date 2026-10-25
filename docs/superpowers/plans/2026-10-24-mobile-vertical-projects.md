# Mobile Vertical Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Below the md breakpoint the Projects cards stack in a normal vertical list instead of a horizontal Swiper carousel; desktop is unchanged.

**Architecture:** `useScrollCarousel` tracks the existing md media query and skips Swiper + GSAP entirely while it matches, so the slides are plain DOM that CSS stacks into a column. Crossing the breakpoint re-runs the hook's effect (destroy ↔ init). The guided tour learns a stacked-projects mode that steps down the cards the same way it already steps through stacked services.

**Tech Stack:** Next.js 16, React 19, Swiper 12, GSAP ScrollTrigger, plain CSS (`app/styles/scroll-carousel.css`), `node:test` via `pnpm test`.

**Spec:** the request in chat: "update the Projects section only in mobile. The scroll must be vertical instead of horizontal." No design doc.

## Global Constraints

- "Mobile" = the breakpoint the carousel CSS already uses: `(max-width: 51.29875em)`. Decided by viewport width, not touch, so a narrow desktop window also stacks. *(Planner's call.)*
- Desktop/wide layout, scrub pinning, and slide opacity fade must behave exactly as today.
- No new dependencies.
- The working tree has unrelated uncommitted edits in `components/scroll-carousel.tsx`, `components/projects/*`, `content/i18n/*`, `lib/i18n/types.ts`. This plan does not touch those files; stage only the files each task lists.
- Public repo: run the CLAUDE.md personal-data grep on the staged diff before each commit.

## Review Focus

1. Resizing a desktop window across the breakpoint (both ways) rebuilds cleanly: no leftover pin spacer, inline `transform`/`opacity`, or stale `data-scrub-start`/`data-scrub-end` on `#projects-carousel`. → Task 1 step 4.
2. On mobile, "View details" opens the modal and "View live" opens a new tab: slides must not keep the `no-interaction` class (which disables `.cta-button`), since Swiper's `init` is what normally removes it. → Task 1 step 4.
3. Card-click → modal index still matches: `ProjectsSection.handleCtaClick` finds the index from `.swiper-slide` siblings, so slide markup/classes stay. → Task 1 step 4.
4. Phone tour walks every project card and never calls into a missing Swiper. → Task 2 tests + step 6.
5. A touch tablet wider than the breakpoint keeps today's horizontal swipe. → Task 1 step 4.

---

### Task 1: Stack project cards below the breakpoint

**Files:**
- Modify: `hooks/use-scroll-carousel.ts`
- Modify: `app/styles/scroll-carousel.css` (the `@media (max-width: 51.29875em)` block at the end)

**Interfaces:**
- Produces: below the breakpoint `#projects .swiper-wrapper` has computed `flex-direction: column` and no Swiper instance on `.swiper-container`. Task 2 reads the former.

- [ ] **Step 1: Track the breakpoint in `useScrollCarousel`**

Add `const STACK_QUERY = "(max-width: 51.29875em)"` next to the other constants, with a comment that it must match the CSS media block. Inside the hook, `const stacked = useSyncExternalStore(subscribe, () => matchMedia(STACK_QUERY).matches, () => false)` where `subscribe` adds/removes a `change` listener on `matchMedia(STACK_QUERY)`. Server snapshot `false` is fine: init is async and checks `destroyed`, so the first pass is torn down before Swiper is constructed.

- [ ] **Step 2: Skip Swiper while stacked**

In the main effect: if `stacked`, remove `no-interaction` from every `.swiper-slide` under `el` and `return` (no cleanup needed). Change the deps from `[]` to `[stacked]` (keep the eslint-disable). In the existing cleanup also `delete el.dataset.scrubStart` and `delete el.dataset.scrubEnd` and remove `swiper-no-swiping` from `.swiper-container`, so a later stacked pass leaves nothing stale. `swiper.destroy(true, true)` already clears inline slide/wrapper styles.

- [ ] **Step 3: Stack the slides in CSS**

In the existing mobile media block, replace the `.carousel .swiper-slide` width rule with `width: 100%` and add:

```css
.carousel .swiper-wrapper {
  flex-direction: column;
  gap: var(--swiper-column-gap);
  padding-inline: 1rem; /* matches the heading's px-4 */
}
```

Leave the `.swiper-column-gap` mobile rule alone (unused while stacked, harmless).

- [ ] **Step 4: Verify in the browser**

Run: `pnpm dev`, then check with browser tools:
- 390×844: cards stacked full-width, page scrolls vertically through all of them, no horizontal swipe, no section pinning; "View details" opens the right project's modal; "View live" opens a new tab.
- 1280×800: identical to `main` (pinned scrub carousel, opacity fade).
- Resize 1280 → 390 → 1280 without reload: both layouts correct each time; at 390 `#projects-carousel` has no `data-scrub-start`, slides have no inline `opacity`/`transform`.
- 1024×768 touch emulation: horizontal swipe as before.

Run: `pnpm lint` → no new errors in the two files.

- [ ] **Step 5: Commit**

```bash
git add hooks/use-scroll-carousel.ts app/styles/scroll-carousel.css
git diff --cached -U0 | grep -inE '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\+[0-9][0-9 ()-]{8,}'
git commit -m "Stack project cards vertically on mobile"
```

---

### Task 2: Tour steps through stacked project cards

**Files:**
- Modify: `lib/autoplay.ts` (`PageMetrics`, `buildStops`)
- Modify: `hooks/use-autoplay.ts` (`getStops`)
- Test: `lib/autoplay.test.ts`

**Interfaces:**
- Consumes: Task 1's `flex-direction: column` on `#projects .swiper-wrapper`.
- Produces: `PageMetrics.projectBottoms: number[] | null`. Page y of each project card's bottom edge when the cards stack; `null` when they sit in the carousel.

- [ ] **Step 1: Write the failing tests**

Add `projectBottoms: null` to the shared `M` fixture, then:

```ts
test("buildStops steps stacked projects until every card is on screen", () => {
  const stops = buildStops({ ...M, servicesSticky: false, scrub: null, projectBottoms: [4600, 5200, 5800] })
  const projects = stops.filter((x) => x.y >= 4036 && x.hash !== "#contact")
  assert.deepEqual(projects.map((x) => x.y), [4036, 4200, 4800])
  assert.deepEqual(projects.map((x) => x.hash), ["#projects", undefined, undefined])
  assert.ok(projects.every((x) => x.slide === undefined && x.pauseMs === undefined))
})

test("buildStops gives stacked projects one stop when they all fit", () => {
  const stops = buildStops({ ...M, servicesSticky: false, scrub: null, projectBottoms: [4300, 4500, 4900] })
  assert.equal(stops.filter((x) => x.y >= 4036 && x.hash !== "#contact").length, 1)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test`
Expected: the two new tests FAIL (projects still produce `slide` stops); everything else passes.

- [ ] **Step 3: Implement in `lib/autoplay.ts`**

Add `projectBottoms` to `PageMetrics` with the doc comment above. Extract the stacked-services loop into a local `stepDown(top: number, bottoms: number[], hash: string, pauseMs?: number)` inside `buildStops` that pushes the `top - headerPx` stop then one stop per bottom still below the fold. Services call it with `SERVICE_PAUSE_MS`; projects call it (no `pauseMs`) when `m.projectBottoms` is non-null, ahead of the existing scrub / slide branches.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test`
Expected: all PASS, including the untouched existing `buildStops` tests.

- [ ] **Step 5: Feed it from `hooks/use-autoplay.ts`**

In `getStops`, pass `projectBottoms`: if `getComputedStyle` of `#projects .swiper-wrapper` has `flexDirection === "column"`, map `#projects .swiper-slide` to `getBoundingClientRect().bottom + window.scrollY`; else `null`. Same "read what rendered" idiom as `servicesSticky`.

- [ ] **Step 6: Verify in the browser**

At 390×844 press the hero tour CTA: it pauses on `#projects`, then scrolls down until the last card's bottom is visible, then goes to contact. At 1280×800 the tour still scrubs through the carousel slides as before.

- [ ] **Step 7: Commit**

```bash
git add lib/autoplay.ts lib/autoplay.test.ts hooks/use-autoplay.ts
git diff --cached -U0 | grep -inE '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\+[0-9][0-9 ()-]{8,}'
git commit -m "Step the tour through stacked project cards on mobile"
```
