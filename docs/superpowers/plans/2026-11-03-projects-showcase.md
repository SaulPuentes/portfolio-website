# Projects Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the pinned projects carousel with an autoplaying stage above an endlessly drifting strip of project cards.

**Architecture:** Timing rules live in a pure, tested module (`lib/showcase.ts`). A hook (`hooks/use-showcase.ts`) drives that timeline with `requestAnimationFrame`, writing progress straight to the DOM so React re-renders only on slide changes. `components/projects/` holds the stage and strip. The old carousel, its Swiper and GSAP dependencies, and the tour's per-project stops go away.

**Tech Stack:** Next.js 16 static export, React, Tailwind 4, `next/image` (unoptimized), `node:test` through `tsx`.

**Spec:** `docs/superpowers/specs/2026-11-03-projects-showcase-design.md`. Visual reference, not committed: `.superpowers/brainstorm/5415-1793739215/content/pause-demo-v7.html`.

## Global Constraints

- Screenshot time `3000` ms. Single-image project `6000` ms.
- Only the pause button stops the stage. Hover and keyboard focus do not. Pause never stops the strip.
- Automatic changes never scroll the page.
- Strip drift about 45s per loop at `md` and up, 35s below.
- With `prefers-reduced-motion`: no autoplay, no drift, no pause button, strip scrolls by hand.
- No new dependencies. Light and dark themes both work, using existing theme tokens.
- Text comes from project data and i18n in `en`, `es` and `de`.
- This repo is public. Never stage `content/data/*.json`. Run the `CLAUDE.md` personal data scan before every commit:
  `git diff --cached -U0 | grep -inE '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\+[0-9][0-9 ()-]{8,}'`

**Working tree:** do not use a worktree. The tree holds uncommitted work this plan builds on, and a worktree would not contain it. Create branch `projects-showcase` from the current tree. Unrelated dirty files stay unstaged: `lib/globe/*`, `.claude/skills/`, `docs/superpowers/plans/2026-10-24-services-copy.md`, `docs/superpowers/specs/assets/`.

## Review Focus

1. **Tab hidden for minutes, or laptop asleep:** on return the stage moves at most one step, it does not race through projects. Test in Task 1.
2. **One project, as in a fresh clone's sample data:** no crash, no self-advance flicker, and no strip with a blank gap. Tests in Tasks 1 and 3.
3. **Project with no image and no gallery (both are optional fields):** stage shows an empty muted image area and still advances. Test in Task 1.
4. **Keyboard user tabbing through the strip:** each project is reached once, never its hidden duplicate. Test in Task 1.
5. **Clicking the strip card already on stage:** nothing restarts. Test in Task 1.

---

### Task 1: Timeline and data helpers

**Files:**
- Create: `lib/showcase.ts`
- Test: `lib/showcase.test.ts`

**Interfaces:**
- Consumes: `Project` from `@/lib/types`
- Produces:
  - `SLIDE_MS = 3000`, `SINGLE_IMAGE_MS = 6000`
  - `interface Timeline { project: number; slide: number; elapsedMs: number }`
  - `projectImages(p: Project): string[]`: `gallery` if non-empty, else `[image]`, else `[]`. Same rule as the modal.
  - `slideMs(imageCount: number): number`
  - `advance(t: Timeline, dtMs: number, imageCounts: number[]): Timeline`
  - `progress(t: Timeline, imageCounts: number[]): number`: 0 to 1 across the whole project
  - `selectProject(t: Timeline, project: number): Timeline`
  - `splitProjectName(name: string): { title: string; kind?: string }`
  - `stripCards(count: number): { index: number; duplicate: boolean }[]`

- [ ] **Step 1: Write the failing tests in `lib/showcase.test.ts`**

```ts
const counts = [3, 1, 0]
const t0 = { project: 0, slide: 0, elapsedMs: 0 }

test("slide time is 3s, or 6s for one image or none", () => {
  assert.equal(slideMs(3), 3000)
  assert.equal(slideMs(1), 6000)
  assert.equal(slideMs(0), 6000)
})

test("advance moves through slides, then to the next project, then wraps", () => {
  assert.deepEqual(advance(t0, 1000, counts), { project: 0, slide: 0, elapsedMs: 1000 })
  assert.deepEqual(advance({ ...t0, elapsedMs: 2999 }, 1, counts), { project: 0, slide: 1, elapsedMs: 0 })
  assert.deepEqual(advance({ project: 0, slide: 2, elapsedMs: 2999 }, 1, counts), { project: 1, slide: 0, elapsedMs: 0 })
  assert.deepEqual(advance({ project: 2, slide: 0, elapsedMs: 5999 }, 1, counts), { project: 0, slide: 0, elapsedMs: 0 })
})

test("a huge time jump moves one step at most", () => {
  assert.deepEqual(advance(t0, 600_000, counts), { project: 0, slide: 1, elapsedMs: 0 })
})

test("one project restarts instead of changing", () => {
  assert.deepEqual(advance({ project: 0, slide: 0, elapsedMs: 5999 }, 1, [1]), { project: 0, slide: 0, elapsedMs: 0 })
})

test("a project with no images still advances", () => {
  assert.equal(advance({ project: 2, slide: 0, elapsedMs: 5999 }, 1, counts).project, 0)
})

test("progress spans the whole project", () => {
  assert.equal(progress({ project: 0, slide: 1, elapsedMs: 1500 }, counts), 0.5)
  assert.equal(progress({ project: 1, slide: 0, elapsedMs: 3000 }, counts), 0.5)
})

test("selectProject starts a new project, and leaves the current one alone", () => {
  assert.deepEqual(selectProject({ project: 0, slide: 2, elapsedMs: 500 }, 1), { project: 1, slide: 0, elapsedMs: 0 })
  const same = { project: 1, slide: 0, elapsedMs: 500 }
  assert.equal(selectProject(same, 1), same)
})

test("splitProjectName", () => {
  assert.deepEqual(splitProjectName("Evalor — Corporate Website"), { title: "Evalor", kind: "Corporate Website" })
  assert.deepEqual(splitProjectName("No Dash"), { title: "No Dash" })
})

test("stripCards doubles the list and marks the copies", () => {
  assert.deepEqual(stripCards(2), [
    { index: 0, duplicate: false },
    { index: 1, duplicate: false },
    { index: 0, duplicate: true },
    { index: 1, duplicate: true },
  ])
})

test("projectImages prefers gallery, then image, then nothing", () => {
  const base = { id: "x", name: {}, description: {}, technologies: [] } as unknown as Project
  assert.deepEqual(projectImages({ ...base, gallery: ["/a"], image: "/b" }), ["/a"])
  assert.deepEqual(projectImages({ ...base, gallery: [], image: "/b" }), ["/b"])
  assert.deepEqual(projectImages(base), [])
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx tsx --test lib/showcase.test.ts`
Expected: FAIL, cannot find `./showcase`.

- [ ] **Step 3: Implement `lib/showcase.ts`**

Pure functions, no DOM. `advance` crosses at most one boundary per call and resets `elapsedMs` to 0 on crossing. A project with `0` images counts as one slide.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx tsx --test lib/showcase.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/showcase.ts lib/showcase.test.ts .gitignore docs/superpowers/specs/2026-11-03-projects-showcase-design.md docs/superpowers/plans/2026-11-03-projects-showcase.md
git commit -m "Add showcase timeline and project helpers"
```

### Task 2: Tour stops at the section once

**Files:**
- Modify: `lib/autoplay.ts`, `hooks/use-autoplay.ts`
- Test: `lib/autoplay.test.ts`

**Interfaces:**
- Produces: `PROJECTS_PAUSE_MS = 9000` in `lib/autoplay.ts`. `PageMetrics` loses `projectCount`, `projectBottoms` and `scrub`. `TourStop` loses `slide`. `AutoplayEnv` loses `slideTo`.

- [ ] **Step 1: Update tests**

In `lib/autoplay.test.ts`: remove `projectCount`, `projectBottoms` and `scrub` from `M`, and `slides` and `slideTo` from `fakeEnv`. Delete "buildStops without scrub uses slide stops" and both stacked-project tests. Rename "buildStops with scrub" to "buildStops stops once at projects" and assert:

```ts
assert.deepEqual(stops.map((x) => x.y), [0, 1200, 1600, 2000, 2400, 4036, 7336])
assert.deepEqual(stops.map((x) => x.hash), ["#about", "#services", undefined, undefined, undefined, "#projects", "#contact"])
assert.deepEqual(stops.map((x) => x.pauseMs), [undefined, 400, 400, 400, 400, PROJECTS_PAUSE_MS, undefined])
```

Rewrite "resume on same-y slide stops keeps slide order" to tell the stops apart by `hash` instead of `slide`, keeping the same-y resume behaviour covered.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx tsx --test lib/autoplay.test.ts`
Expected: FAIL on the new stop list or `PROJECTS_PAUSE_MS` import.

- [ ] **Step 3: Implement**

`buildStops` pushes one `{ y: clamp(m.projectsTop - m.headerPx), hash: "#projects", pauseMs: PROJECTS_PAUSE_MS }`. Keep `stepDown`, services use it. In `leg`, drop the `slide` line. In `hooks/use-autoplay.ts`, remove the `Swiper` type import, `projectsWrapper`, the `dataset` read, the removed metrics and `slideTo`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test && npx tsc --noEmit`
Expected: tests PASS. `tsc` clean.

- [ ] **Step 5: Commit**

```bash
git add lib/autoplay.ts lib/autoplay.test.ts hooks/use-autoplay.ts
git commit -m "Make the tour stop once at the projects section"
```

### Task 3: Stage, strip and section swap

Build these together: the section can't ship half replaced.

**Files:**
- Create: `hooks/use-showcase.ts`, `components/projects/stage.tsx`, `components/projects/strip.tsx`
- Modify: `components/projects/index.tsx`, `content/i18n/{en,es,de}.json`, `lib/i18n/types.ts`, `app/styles/globals.css` only if a utility is needed
- Commit alongside: `components/projects/project-detail-modal.tsx`. Its uncommitted edits and the i18n key removals belong together.
- Test: `lib/data.test.ts`

**Interfaces:**
- Consumes: everything from Task 1
- Produces:

```ts
useShowcase(projects: Project[]): {
  timeline: Pick<Timeline, "project" | "slide">
  paused: boolean
  togglePaused(): void
  select(project: number): void          // no page scroll here
  onScreen: boolean
  sectionRef: RefObject<HTMLElement | null>
  fillRef: RefObject<HTMLElement | null> // edge line fill
  reducedMotion: boolean
}
```

- [ ] **Step 1: Write the failing test in `lib/data.test.ts`**

```ts
test("showcase copy exists in every locale", () => {
  for (const json of [en, es, de]) assert.ok(json.projects.upNext)
})
```

Run: `npm test`
Expected: FAIL on `upNext`.

- [ ] **Step 2: Add `upNext`**

`en` "Up next", `es` "A continuación", `de` "Als Nächstes". Add to `lib/i18n/types.ts`. The pause button reuses `t.nav.pause` and `t.nav.play`.

- [ ] **Step 3: Implement `hooks/use-showcase.ts`**

- One `requestAnimationFrame` loop runs only while `!paused && onScreen && !document.hidden && !reducedMotion`. Hold the timeline in a ref. Call `advance` each frame with the frame delta.
- Each frame writes `transform: scaleX(progress)` to `fillRef`. Call `setState` only when `project` or `slide` changes.
- `onScreen` comes from an `IntersectionObserver` on `sectionRef`. `reducedMotion` reads `matchMedia("(prefers-reduced-motion: reduce)")`, starting `false` so server and client markup match.
- `paused` stays set across `select`.

- [ ] **Step 4: Implement `components/projects/stage.tsx`**

Props: the project, `index`, `total`, `next: Project`, `slide`, `paused`, `onTogglePaused`, `onDetails`, `fillRef`, `reducedMotion`, and a forwarded ref for the scroll target. Follow the spec's Stage, Progress, Pause button, Tags and Mobile sections, with these decisions:

- Layout `grid md:grid-cols-[1.6fr_1fr]`. Add `scroll-mt-16` for the header.
- Render only the current, previous and next screenshots through `next/image` with `fill`, `object-cover object-top` and stable `key={src}`. Crossfade with opacity, and zoom with a slow scale transition on the current one, off under `motion-reduce`.
- Title is `splitProjectName(...).title`. Desktop eyebrow `NN / NN · kind`, hidden below `md`. Mobile label beside the title, hidden at `md`. Omit the kind when absent.
- Description: `min-h-[4lh] line-clamp-4 md:min-h-0 md:line-clamp-6 lg:line-clamp-none`. The `md` clamp keeps tablet widths from growing the card.
- Tags and "Up next" are `hidden md:flex` or similar.
- Edge line: the track has `absolute inset-x-0 top-0 h-0.5`, the fill uses `origin-left bg-accent`, with ticks for `n > 1`.
- Counter and pause button sit `bottom-3` on mobile and `md:top-3` on desktop, on a dark translucent background with white text in both themes. Hide the counter for `n <= 1`. Hide the button with `motion-reduce:hidden`.
- Pause button: `<button type="button" aria-pressed={paused} aria-label={paused ? t.nav.play : t.nav.pause}>` with lucide `Pause` and `Play`.
- No images: render the same `bg-muted` box.
- View details calls `onDetails`. View live is an external link using `liveUrls?.[0]?.url ?? liveUrl`, labelled `t.projects.viewLive`, with `target="_blank" rel="noopener noreferrer"`.

- [ ] **Step 5: Implement `components/projects/strip.tsx`**

Props: `projects`, `activeIndex`, `running: boolean`, `onSelect(index)`. Follow the spec's Strip section, with these decisions:

- Skip rendering when `projects.length < 2`. The stage already shows the only project, and a short list would leave a blank gap in the loop.
- Use `stripCards(projects.length)`. Row: `flex w-max gap-3 animate-marquee-left motion-reduce:animate-none [animation-duration:35s] md:[animation-duration:45s]`, reusing `animate-marquee-left`. Pause with `group-hover:` and `group-focus-within:[animation-play-state:paused]`, and when `running` is false. Tailwind 4 limits `hover` to hover devices, so a tap doesn't stick.
- Container: `group overflow-hidden` with the same side mask as `components/skills-marquee.tsx`, and `motion-reduce:overflow-x-auto`. On focus leaving the container, set `scrollLeft = 0`, because the browser scrolls it to reveal a focused card and that offset would break the loop.
- Card is a `<button type="button">`, `w-[200px] md:w-[260px]`, active card `border-accent`. Duplicates get `aria-hidden`, `tabIndex={-1}` and `data-duplicate`, plus `motion-reduce:data-[duplicate]:hidden`.
- Card text: title, kind in mono, `description[locale][0]` with `line-clamp-2`. No tags.
- Hover preview: start on `onPointerEnter` only when `e.pointerType === "mouse"`. Cycle `projectImages` every `SLIDE_MS` and reset on leave. Mount gallery images only during hover, so the rest never load. Cover uses `loading="lazy"`.

- [ ] **Step 6: Replace `components/projects/index.tsx`**

Keep `selectedProject` and `ProjectDetailModal`. Render `<section id="projects" ref={sectionRef} className="relative scroll-mt-16">` with the existing `h2` classes from `scroll-carousel.tsx` and `max-w-7xl px-4 sm:px-6 lg:px-8`. Drop the `.cta-button` and `.swiper-slide` click handling.

Strip `onSelect` calls `select(i)`, then, only below `md`, scrolls the stage into view if its top is above `64px` or its bottom is below the viewport. This is the one scroll in the feature, and it lives in the click handler, not in the hook.

- [ ] **Step 7: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add hooks/use-showcase.ts components/projects lib/data.test.ts lib/i18n/types.ts content/i18n app/styles/globals.css
git diff --cached --stat
git commit -m "Replace the projects carousel with a stage and strip"
```

### Task 4: Remove the old carousel

**Files:**
- Delete: `components/scroll-carousel.tsx`, `hooks/use-scroll-carousel.ts`, `app/styles/scroll-carousel.css`
- Modify: `package.json`, the lockfile

- [ ] **Step 1: Confirm nothing else uses them**

Run: `grep -rnE "scroll-carousel|swiper|gsap" app components hooks lib`
Expected: only the files being deleted, which also hold the CSS import.

- [ ] **Step 2: Delete the files, then uninstall**

Run: `npm uninstall swiper gsap`, then `pnpm install --lockfile-only`. The repo has both lockfiles, so keep both in step.

- [ ] **Step 3: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add -A app/styles components/scroll-carousel.tsx hooks/use-scroll-carousel.ts package.json package-lock.json pnpm-lock.yaml
git commit -m "Remove the scroll carousel and its dependencies"
```

### Task 5: Local data and browser check

Nothing in this task is committed.

**Files:**
- Modify, gitignored: `content/data/projects.json`

- [ ] **Step 1: Update the data**

Move `evalor` to the top. Rewrite the Galerías names as `Galerías — Web Platform`, `Galerías — Plataforma Web` and `Galerías — Web-Plattform`, so the title reads right. That name also shows in the modal. Confirm the file is ignored: `git check-ignore content/data/projects.json`.

- [ ] **Step 2: Check in a browser at 1280px, 800px and 375px, in both themes**

Run `npm run dev` and confirm:

- Evalor opens. The line fills across 18s with 5 ticks. Then Uncommon Man takes the stage.
- Hovering the stage doesn't stop it. Pause does, and it stays paused after clicking a strip card.
- Strip hover pauses drift and previews the gallery. Pause leaves the strip drifting.
- Stage height doesn't change across all 9 projects, at any of the three widths.
- Grupo DAGS and Xcaret: 6s hold, no ticks, no counter.
- View details opens the modal. View live opens a new tab.
- At 375px, tapping a strip card with the stage off screen brings it back, clear of the header. Auto-advance never scrolls.
- Tab order reaches each card once. Shift-tab back out and the strip resumes cleanly.
- With reduced motion emulated: nothing moves, no pause button, strip scrolls by hand with no duplicates.
- The Play tour stops once at projects, then goes on to contact.
- Switching locale changes the text without restarting the stage.

- [ ] **Step 3: One-project check**

Back up `content/data/projects.json`, copy `content/data/projects.sample.json` over it, and confirm in `npm run dev` that the section shows one stage with no strip and no flicker. The sample's image file doesn't exist in `public/`, so expect a broken image and judge layout only. Restore the backup and confirm with `git check-ignore`.
