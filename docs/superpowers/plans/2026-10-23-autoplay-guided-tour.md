# Autoplay Guided Tour Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the header Play button from a constant-speed scroll into a guided tour. It replays the hero entrance, then smooth-scrolls from anchor to anchor and holds at each stop, with one stop for every project.

**Architecture:** `lib/autoplay.ts` keeps its pure, injected-env design. The frame-by-frame scroller becomes a stop sequencer: scroll to a stop, run its side effects (hash, intro, slide), hold, then move to the next stop. A pure `buildStops(metrics)` turns page measurements into stops. `hooks/use-autoplay.ts` measures the DOM and supplies a small rAF scroll tween. The hero and skills marquee replay their entrance when they receive a window event.

**Tech Stack:** Next.js 16 / React 19 client components, TypeScript, `node:test` via `tsx` (`pnpm test`), GSAP ScrollTrigger (already used by the projects carousel).

**Spec:** No separate spec doc. Requirements are the user's request of 2026-10-23 plus their answers, copied below.

## Global Constraints

- Play starts at the hero: scroll to the top, replay the hero text and skills-marquee entrance, then hold. The globe is not replayed.
- Stops, in order: hero `#about` → services `#services` → one stop for each project `#projects` → contact `#contact`. Then the tour ends and the label shows "Watch again".
- Services gets **one** stop, placed where all 4 cards are visible (the end of the 300vh sticky section on desktop).
- Moving between stops: animated smooth scroll. At each section stop the URL hash updates with `history.replaceState` (no history spam) and the nav pill follows (the existing IntersectionObserver handles that).
- Hold time: `PAUSE_MS = 3000` at every section and every project. The hero holds `HERO_INTRO_MS + PAUSE_MS`.
- The speed button stays (`SPEEDS = [1, 2, 0.5]`) and divides both the hold and the scroll time. 2× gives a 1.5 s hold, 0.5× gives 6 s.
- Keep the existing interruption rules in `hooks/use-autoplay.ts`: wheel, touchstart, a click outside `[data-autoplay-control]`, a stop key, and tab hidden all pause.
- No new dependencies. No i18n changes (`nav.play/pause/replay/speed` already exist).
- `html` has `scroll-smooth` (`app/layout.tsx:58`), so every programmatic scroll must use `behavior: "instant"`.

## Review Focus

1. **Page geometry changes mid-tour.** ScrollTrigger refreshes, images loading and resizes move stop positions, so stops are re-read before every leg. Test: `re-reads stops before each leg` (Task 1).
2. **User interrupts during a scroll or a hold.** The tween and the timer are both cancelled, and nothing jumps afterwards. Test: `pause cancels the pending scroll` (Task 1).
3. **Play after an interruption mid-tour** resumes from the next stop ahead, not from the hero. Test: `resume goes to the next stop below the current position` (Task 1).
4. **Touch devices.** The carousel is not scrubbed on touch, so all project stops share one scroll position and the engine calls `slideTo(i)` at each one. Tests: `buildStops without scrub uses slide stops` and `resume on same-y slide stops keeps slide order` (Task 1).
5. **Pressing Play while the hero intro is already running** (or twice quickly). The hero clears its pending timers before replaying, so elements never end up stuck invisible. This is a manual check (Task 2, Step 3).

---

**Before starting:** the working tree has uncommitted edits in `components/hero-section.tsx`, `lib/globe/scene.ts` and other files from earlier work. Ask the user to commit or stash them first, so each task commits only its own changes.

### Task 1: Tour engine and stop builder

**Files:**
- Modify (rewrite): `lib/autoplay.ts`
- Modify (rewrite): `lib/autoplay.test.ts`

**Interfaces:**
- Produces, in `lib/autoplay.ts`:

```ts
export const SPEEDS = [1, 2, 0.5] as const
export const PAUSE_MS = 3000
export const SCROLL_SECONDS = 1.2
export const HERO_INTRO_MS = 2900 // marquee: 1800 delay + 200 row stagger + 900 transition
export const HERO_INTRO_EVENT = "autoplay:hero-intro"

export interface TourStop { y: number; hash?: string; slide?: number; intro?: boolean }

export interface AutoplayEnv {
  getScrollY(): number
  getMaxScroll(): number
  getStops(): TourStop[]
  scrollTo(y: number, seconds: number, done: () => void): () => void // returns cancel
  wait(ms: number, done: () => void): () => void                      // returns cancel
  setHash(hash: string): void
  slideTo(index: number): void
  playIntro(): void
}

export interface PageMetrics {
  vh: number; maxScroll: number; headerPx: number
  servicesTop: number; servicesHeight: number; servicesSticky: boolean
  projectsTop: number; projectCount: number; scrub: { start: number; end: number } | null
  contactTop: number
}

export function buildStops(m: PageMetrics): TourStop[]
export function isStopKey(key: string, fromInsideControl: boolean): boolean // unchanged
export type AutoplayLabel = "play" | "pause" | "replay"                     // unchanged
export interface AutoplayState { playing: boolean; speedIndex: number; label: AutoplayLabel } // unchanged
export function createAutoplay(env: AutoplayEnv, onChange: (s: AutoplayState) => void):
  { play(): void; pause(): void; toggle(): void; cycleSpeed(): void; refresh(): void; getState(): AutoplayState; destroy(): void } // same shape as today
```

Delete `VIEWPORTS_PER_SECOND`, `MAX_FRAME_MS`, `MANUAL_SCROLL_PX` and the rAF members of the env. Nothing outside the autoplay files uses them (check with `grep -rn VIEWPORTS_PER_SECOND .` excluding node_modules).

**`buildStops` rules.** Clamp every `y` to `[0, maxScroll]`.
- Hero: `{ y: 0, hash: "#about", intro: true }`
- Services: if `servicesSticky`, `y = servicesTop + servicesHeight - vh` (all cards revealed); otherwise `y = servicesTop - headerPx`. Hash `"#services"`.
- Projects, with `scrub`: for i in `0..n-1`, `y = start + (end - start) * i / (n - 1)` (when n = 1, `y = start`). Without scrub: `y = projectsTop - headerPx` and `slide: i`. Only i = 0 carries `hash: "#projects"`.
- Contact: `y = contactTop - headerPx`, hash `"#contact"`.

**Engine rules:**
- A *leg* means: read `env.getStops()`, then `scrollTo(stop.y, SCROLL_SECONDS / speed, arrive)`. On arrive: `setHash` if there is a hash, `slideTo` if there is a slide, `playIntro` if `intro` is set. Then `wait((intro ? HERO_INTRO_MS : 0) + PAUSE_MS / speed)`, then the next leg. After the last hold the tour finishes: `playing = false`, the tour is marked done, and the engine emits.
- `play()` starts **fresh** (index 0) when no tour is in progress, when the last tour finished, or when at the end of the page (`scrollY >= max - 2`). Otherwise it **resumes**. It uses the remembered next index if that stop's `y` is within 2 px of `scrollY`. Otherwise it uses the first stop with `y > scrollY + 2`. If there is none, it finishes.
- `pause()` cancels the pending scroll or wait, keeps the tour in progress, and emits.
- `label`: `"pause"` while playing, `"replay"` when not playing and (the tour finished or at the end of the page), `"play"` otherwise.
- `cycleSpeed()` applies from the next scroll or wait. `destroy()` cancels any pending scroll or wait.

- [ ] **Step 1: Write failing tests** in `lib/autoplay.test.ts`. Use a fake env whose `scrollTo` and `wait` record their arguments and store one pending callback. A `step()` helper runs the pending callback, and finishing a scroll sets `scrollY = y`. Use the metrics from the first test (`M`) for the `buildStops` tests.

```ts
const M = { vh: 1000, maxScroll: 7600, headerPx: 64, servicesTop: 1000, servicesHeight: 3000, servicesSticky: true,
  projectsTop: 4100, projectCount: 3, scrub: { start: 4500, end: 6500 }, contactTop: 7400 }
test("buildStops with scrub")                 // ys [0,3000,4500,5500,6500,7336]; hashes #about,#services,#projects,—,—,#contact; stops[0].intro true
test("buildStops without scrub uses slide stops") // servicesSticky false, scrub null → services y 936; projects y 4036 ×3 with slide 0,1,2
test("buildStops clamps to maxScroll")         // contactTop 9000 → last y 7600
// engine, stops = [{y:0,hash:"#about",intro:true},{y:1000,hash:"#services"},{y:2000,hash:"#contact"}], max 2000
test("play from top runs the intro and holds")        // scrollTo(0, 1.2); after step: playIntro ×1, hash "#about", wait(HERO_INTRO_MS + 3000)
test("walks every stop then labels replay")           // step to completion → hashes ["#about","#services","#contact"], playing false, label "replay"
test("2× halves scroll time and holds")               // cycleSpeed, play, reach services → scrollTo seconds 0.6, wait 1500
test("pause cancels the pending scroll")              // play, pause mid-scroll → cancel called once, step() makes no new call, label "play"
test("resume goes to the next stop below the current position") // pause during hero hold, scrollY = 1500, play → next scrollTo y 2000
test("resume on same-y slide stops keeps slide order") // stops at y 500 with slide 0,1,2; pause during slide 1 hold, play → next leg ends in slideTo(2)
test("fresh play mid-page starts from the hero")      // scrollY 1500, no tour yet, play → first scrollTo y 0
test("play after finishing restarts from the hero")   // finish, play → first scrollTo y 0, playIntro called again
test("re-reads stops before each leg")                // change stops[1].y to 1200 during hero hold → services scrollTo y 1200
// keep both existing isStopKey tests unchanged
```

- [ ] **Step 2: Run tests and confirm they fail**

Run: `pnpm test`
Expected: FAIL. `buildStops` is not exported, and the old env shape does not match.

- [ ] **Step 3: Implement `buildStops` and `createAutoplay` in `lib/autoplay.ts`** following the rules above.

- [ ] **Step 4: Run tests and confirm they pass**

Run: `pnpm test`
Expected: all autoplay, data and globe tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/autoplay.ts lib/autoplay.test.ts
git commit -m "Turn the autoplay engine into a stop-by-stop guided tour"
```

(`hooks/use-autoplay.ts` does not type-check after this commit until Task 3. That is fine, because the tasks land together on one branch.)

### Task 2: Replayable hero entrance

**Files:**
- Modify: `components/hero-section.tsx:19-35` (the entrance `useEffect`)
- Modify: `components/skills-marquee.tsx` (the `SkillsMarquee` effect)

**Interfaces:**
- Consumes: `HERO_INTRO_EVENT` from `lib/autoplay.ts`.
- Produces: dispatching `window.dispatchEvent(new Event(HERO_INTRO_EVENT))` replays the hero text stagger and the marquee fade-in.

- [ ] **Step 1: Hero.** Inside the effect, wrap the current stagger in `runIntro()`. Each run first clears its pending timeouts and resets every `[data-hero]` element: `transition = "none"`, `opacity = ""` and `translate = ""`, so the Tailwind classes take over again. It then forces a reflow (`void el.offsetHeight`) and schedules the same delays (`[100, 300, 500, 700, 900]`, sorted by visual order). Call it on mount and on `HERO_INTRO_EVENT`. On cleanup, clear the timeouts and remove the listener.

- [ ] **Step 2: Marquee.** Use the same pattern. `show()` clears the timer, calls `setVisible(false)`, then `setTimeout(() => setVisible(true), 1800)`. Call it on mount and on `HERO_INTRO_EVENT`. On cleanup, clear the timer and remove the listener.

- [ ] **Step 3: Manual check.** Run `pnpm dev`, open `/en`, wait for the intro to finish, then run `window.dispatchEvent(new Event("autoplay:hero-intro"))` in the console. Expected: the text and the marquee fade out and replay in the same order as on load. Dispatch it twice within 300 ms. Expected: it still ends with everything visible and nothing stuck at opacity 0.

- [ ] **Step 4: Lint and commit**

Run: `pnpm lint`. Expected: no new errors in either file.

```bash
git add components/hero-section.tsx components/skills-marquee.tsx
git commit -m "Let the hero entrance replay on an autoplay event"
```

### Task 3: Wire the tour to the page

**Files:**
- Modify: `hooks/use-autoplay.ts` (replace the env object; keep the interruption listeners and `onScroll → refresh` unchanged)
- Modify: `hooks/use-scroll-carousel.ts` (ScrollTrigger `onRefresh`)

**Interfaces:**
- Consumes: `createAutoplay`, `buildStops`, `PageMetrics`, `HERO_INTRO_EVENT` (Task 1). The event replays the intro (Task 2).
- Produces: the same hook return value, `{ state, toggle, cycleSpeed }`. `Header` and `AutoplayButton` are unchanged.

- [ ] **Step 1: Publish scrub bounds.** In `use-scroll-carousel.ts`, the existing ScrollTrigger `onRefresh` receives `self`. Have it also set `el.dataset.scrubStart = String(self.start)` and `el.dataset.scrubEnd = String(self.end)`. This lets the tour read the pinned range without importing GSAP into the header bundle. On touch the scrub never runs, so the attributes stay absent and `buildStops` takes the slide path.

- [ ] **Step 2: Real env in `use-autoplay.ts`:**
  - `getStops`: measure into `PageMetrics` and return `buildStops(m)`. Use `headerPx = 64` (`scroll-mt-16`). For `servicesSticky`, use `innerWidth >= 768`, the same breakpoint as `useScrollReveal`. Read `scrub` from `#projects-carousel` dataset (or `null` when it is missing). Get `projectCount` from `#projects .swiper-slide` and section tops from `getBoundingClientRect().top + scrollY`.
  - `scrollTo(y, seconds, done)`: a rAF tween from the current `scrollY` with easeInOutCubic, calling `window.scrollTo({ top, behavior: "instant" })` on each frame. Cancel calls `cancelAnimationFrame`. When `prefers-reduced-motion: reduce` matches, jump instantly and call `done()`.
  - `wait`: `setTimeout`, with cancel via `clearTimeout`.
  - `setHash`: `history.replaceState(null, "", hash)`.
  - `slideTo(i)`: `document.querySelector("#projects .swiper-container")?.swiper?.slideTo(i)`. Swiper stores its instance on the element; cast it locally.
  - `playIntro`: `window.dispatchEvent(new Event(HERO_INTRO_EVENT))`.

- [ ] **Step 3: Type-check, test, lint**

Run: `pnpm test && pnpm lint && pnpm exec tsc --noEmit`
Expected: all pass, with no errors in `hooks/` or `lib/`.

- [ ] **Step 4: Manual verification** with `pnpm dev` on `/en`, desktop width:
  - From the top, press Play. Expected: the intro replays, the page holds about 6 s on the hero, scrolls to services with all 4 cards visible, and the URL shows `#services`. It then stops at each project for 3 s with the carousel centred on it, then reaches contact, and the button shows "Watch again".
  - Mid-tour, use the mouse wheel. Expected: the tour stops dead with no later jump, and the button shows "Play". Press Play. Expected: it continues to the next stop below.
  - Press 2×, then Play. Expected: holds of about 1.5 s.
  - Phone emulation (touch): project stops change slides in place.
  - Reduced motion enabled in DevTools: legs jump instead of scrolling.

- [ ] **Step 5: Commit**

```bash
git add hooks/use-autoplay.ts hooks/use-scroll-carousel.ts
git commit -m "Drive the Play button through the page as a guided tour"
```
