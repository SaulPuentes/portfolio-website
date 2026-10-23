# Portfolio Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Randia project, swap the hero skills marquee for client logos, replace "Get a Quote" with a film-style Play button, and put a dotted-Earth Three.js globe behind the hero.

**Architecture:** Pure logic (autoplay controller, land mask, capital arcs, data checks) lives in `lib/` with `node:test` tests run through `tsx`. React wiring lives in `hooks/` and `components/`. The globe scene is a plain TS module loaded with a dynamic import after first paint, so `three` never sits in the initial bundle.

**Tech Stack:** Next.js 16 (static export), React 19, Tailwind 4, `three@0.170.0`, `node:test` + `tsx`, Puppeteer (screenshots only).

**Spec:** `docs/superpowers/specs/2026-10-22-portfolio-improvements-design.md`. The globe port source is `docs/superpowers/specs/assets/2026-10-22-hero-globe-demo.html`: option C2 only (`makeEarth`, `makeEarthScene` and the helpers they call). Ignore everything F2·*.

## Global Constraints

- Public repo: before **every** commit run `git diff --cached -U0 | grep -inE '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\+[0-9][0-9 ()-]{8,}'`. It must print nothing except placeholders.
- Never stage `.gitignore`, `CLAUDE.md`, `README.md`, `docs/development-guide.md`, `scripts/cv-templates/shared.ts`, `scripts/generate-cv.ts` or `.claude/skills/tailoring-cv-to-job-posting/`. They hold unrelated uncommitted work. Stage files by explicit path only, never `git add -A` or `git add .`.
- `content/data/*.json` is gitignored; only `*.sample.json` twins are committed. Images under `public/` are committed.
- Every new UI string exists in `content/i18n/es.json`, `en.json`, `de.json` and in `lib/i18n/types.ts`.
- Grayscale UI with one accent, `--accent: oklch(0.6231 0.188 259.81)` (three.js colour `0x3f80f2`). Fonts: Geist display, Inter, JetBrains Mono.
- Type check: `pnpm exec tsc --noEmit 2>&1 | grep "error TS" | grep -v use-scroll-carousel` must print nothing. Those 3 errors predate this work; `next build` ignores TS errors, so this is the real gate.
- Tests: `pnpm test` (added in Task 1). `pnpm lint` does not work (ESLint is not installed), so don't use it as a gate.
- Build: `pnpm build` produces `out/`. Serve it with `python3 -m http.server 3001 -d out` for browser checks at 1440×900 and 390×844, light and dark.

## Review Focus

1. **Page height changes while playing:** the pinned projects carousel and ScrollTrigger refreshes change `scrollHeight` mid-play. The controller must re-read the max scroll every frame and keep going to the new bottom. Test: `keeps going when the page grows` (Task 3).
2. **Keyboard on the Play button itself:** Space or Enter on the focused Play or speed button must toggle, not count as "manual scroll → stop". Test: `isStopKey ignores keys from inside the control` (Task 3).
3. **Play pressed at the very bottom:** it restarts from the top instead of doing nothing. Test: `play at end restarts from top` (Task 3).
4. **Language switch or route change while the globe runs:** the old scene is disposed, so you get one canvas, one render loop and no leaked listeners. Browser check in Task 4 (switch locale twice, one `canvas[data-globe]`, clean console).
5. **No WebGL, or reduced motion:** hero text and buttons still render and work, nothing throws, and reduced-motion users get near-still idle motion. Unit test `createGlobeScene` failure path is not practical, so cover it with a `try/catch` in `hero-globe.tsx` plus a browser check with `--disable-webgl` (Task 4).

---

### Task 1: Randia project + test runner

**Files:**
- Modify: `package.json`: add `"test": "tsx --test lib/*.test.ts"`. Task 4 extends it. Node 20's `--test` has no glob support, so the shell expands the pattern.
- Create: `lib/data.test.ts`
- Create: `public/projects/randia/shot-1.webp`, `shot-2.webp`, `shot-3.webp`
- Modify (gitignored, not committed): `content/data/projects.json`

**Interfaces:**
- Produces: project `id: "randia"` that Task 2's logo list follows.

- [ ] **Step 1: Write the failing test** in `lib/data.test.ts` (imports `projects` from `@/lib/data`, uses `node:test` + `node:assert/strict`, `fs.existsSync` against `public/`):

```ts
test("randia sits right after evalor", () => {
  const ids = projects.map((p) => p.id)
  assert.equal(ids[ids.indexOf("evalor") + 1], "randia")
})
test("randia content", () => {
  const r = projects.find((p) => p.id === "randia")!
  assert.equal(r.liveUrl, "https://randia.mx")
  assert.deepEqual(r.technologies, ["WordPress", "PHP", "Tailwind CSS", "Leaflet"])
  assert.equal(r.image, "/projects/randia/shot-1.webp")
  assert.deepEqual(r.gallery, [1, 2, 3].map((n) => `/projects/randia/shot-${n}.webp`))
  for (const loc of ["es", "en", "de"] as const) {
    assert.equal(r.description[loc].length, 4)
    assert.ok(r.name[loc])
    // spec: never mention the number of lots, never credit Trust
    for (const p of r.description[loc]) assert.doesNotMatch(p, /\d+\s*(lotes|lots|grundstück)|lotes|\blots\b|grundstück|trust/i)
  }
})
test("every project image exists", () => {
  for (const p of projects) for (const src of [p.image, ...(p.gallery ?? [])].filter(Boolean))
    assert.ok(existsSync(`public${src}`), src)
})
```

- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL on the randia tests (id not found).
- [ ] **Step 3: Capture screenshots.** Write a throwaway Puppeteer script **in the session scratchpad, not the repo**. Viewport 1024×640, `deviceScaleFactor: 1`, `type: "webp"`, `quality: 82`. Capture three frames of https://randia.mx: the hero at the top, the models section, and the location/amenities section (scroll each into view; wait for images and fonts). Save them to `public/projects/randia/shot-{1,2,3}.webp`. Verify with `sips -g pixelWidth -g pixelHeight public/projects/randia/*.webp`, which should report 1024 × 640 for each.
- [ ] **Step 4: Add the entry** to `content/data/projects.json` at index after `evalor`, with the same shape as its neighbours. `name`: "Randia — Residential Sales Site" (es "Randia — Sitio de Ventas Residencial", de "Randia — Verkaufswebsite für Wohnprojekt"). Write four paragraphs per locale following the spec §4 outline. Don't set `featured`.
- [ ] **Step 5:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 6:** Run `pnpm dev`, open `/`, scroll to Projects. Randia is the 6th card, its hover cycles 3 shots, and "View details" opens the modal with the live link.
- [ ] **Step 7: Commit** `package.json lib/data.test.ts public/projects/randia/` with message `Add Randia to the projects carousel`.

### Task 2: Client logo strip replaces the skills marquee

**Files:**
- Create: `public/logos/{grupo-xcaret,galerias,nordictrack,simonett,uncommon-man,trust,salsa-world,nourpac,evalor,twelve-thirty-four,grupo-dags,randia}.svg` (`.png`/`.webp` only where the brand has no vector)
- Create: `content/data/clients.sample.json` (committed: two entries pointing at `/placeholder-logo.svg`)
- Create (gitignored): `content/data/clients.json`
- Create: `components/client-logos.tsx`
- Modify: `lib/types.ts`, `lib/data.ts`, `lib/data.test.ts`, `components/hero-section.tsx`
- Delete: `components/skills-marquee.tsx` (only the hero imports it)

**Interfaces:**
- Produces: `interface Client { name: string; logo: string; url?: string }` in `lib/types.ts`; `export const clients: Client[]` in `lib/data.ts` (imports `@/content/data/clients.json`, same pattern as `projects`); `export function ClientLogos(): JSX.Element` in `components/client-logos.tsx`.

- [ ] **Step 1: Failing test** appended to `lib/data.test.ts`:

```ts
test("client logos in the agreed order", () => {
  assert.deepEqual(clients.map((c) => c.name), [
    "Grupo Xcaret", "Galerías", "NordicTrack", "Simonett", "Uncommon Man", "Trust",
    "Salsa World", "Nourpac", "Evalor", "Twelve Thirty Four", "Grupo DAGS", "Randia",
  ])
  for (const c of clients) assert.ok(existsSync(`public${c.logo}`), c.logo)
})
```

- [ ] **Step 2:** `pnpm test`, expect FAIL (`clients` not exported).
- [ ] **Step 3: Source logos.** Download each brand's logo from its own site: grupoxcaret.com, galerias.com, nordictrack.com, simonett.us, shopuncommonman.com, adtrust.com.mx, salsaworld.mx, nourpac.com, evalor.mx, twelvethirtyfourflowers.com, grupodags.com, randia.mx. Put each download in its own empty scratchpad folder first. Open every SVG and remove any `<script>`, `on*=` attributes, `<foreignObject>` and external `href`s before copying it to `public/logos/`. They are rendered with `<img>`, so scripts can't run anyway, but nothing executable gets committed. Crop the viewBox to the mark, and leave no huge embedded rasters (>150 KB means you should find another source).
- [ ] **Step 4: Data + types.** Add `Client` and `clients` as in Interfaces. `clients.json` holds the 12 entries in test order, with `logo: "/logos/<slug>.svg"`.
- [ ] **Step 5: `ClientLogos`.** Base it on `skills-marquee.tsx`: one row, the list doubled for a seamless loop, `animate-marquee-left`, the same edge mask, the same 1800 ms delayed entrance, and the same outer wrapper classes (`mt-auto shrink-0 w-full ... pb-6 sm:pb-10 md:pb-12`). Each logo is `<img alt={name} loading="lazy" decoding="async">` at `h-6 sm:h-7 w-auto`, with gaps of `gap-10 sm:gap-14`. For the single gray tone use `brightness-0 opacity-45 dark:invert transition` and on hover `hover:filter-none hover:opacity-100`. Duplicated copies get `aria-hidden="true"` and `alt=""`. The animation pauses on hover (`hover:[animation-play-state:paused]` on the track).
- [ ] **Step 6:** In `hero-section.tsx` replace `SkillsMarquee` with `ClientLogos`, then delete `components/skills-marquee.tsx`.
- [ ] **Step 7:** Run `pnpm test`, expect PASS. Run the type-check gate, expect no output.
- [ ] **Step 8: Browser check** (`pnpm dev`, 1440×900 and 390×844, both themes). Every logo is legible as a gray silhouette and in colour on hover. If a colour logo vanishes on the dark background, replace that file with the brand's light/reversed variant.
- [ ] **Step 9: Commit** `public/logos/ content/data/clients.sample.json components/client-logos.tsx lib/types.ts lib/data.ts lib/data.test.ts components/hero-section.tsx` plus the deletion (`git rm components/skills-marquee.tsx`), with message `Replace the skills marquee with client logos`.

### Task 3: Play button (autoplay scroll)

**Files:**
- Create: `lib/autoplay.ts`, `lib/autoplay.test.ts`, `hooks/use-autoplay.ts`, `components/autoplay-button.tsx`
- Modify: `components/header.tsx`, `lib/i18n/types.ts`, `content/i18n/{es,en,de}.json`

**Interfaces:**
- Produces, in `lib/autoplay.ts`:

```ts
export const SPEEDS = [1, 2, 0.5] as const
export const VIEWPORTS_PER_SECOND = 0.4
export interface AutoplayEnv {
  getScrollY(): number; getMaxScroll(): number; getViewportHeight(): number
  scrollTo(y: number): void; requestFrame(cb: (now: number) => void): number; cancelFrame(id: number): void; now(): number
}
export type AutoplayLabel = "play" | "pause" | "replay"
export interface AutoplayState { playing: boolean; speedIndex: number; label: AutoplayLabel }
export function createAutoplay(env: AutoplayEnv, onChange: (s: AutoplayState) => void): {
  play(): void; pause(): void; toggle(): void; cycleSpeed(): void; refresh(): void; getState(): AutoplayState; destroy(): void
}
export function isStopKey(key: string, fromInsideControl: boolean): boolean
```

- Produces, in `hooks/use-autoplay.ts`: `useAutoplay(controlRef: RefObject<HTMLElement | null>): { state: AutoplayState; toggle(): void; cycleSpeed(): void }`
- Produces, in `components/autoplay-button.tsx`: `AutoplayButton({ state, onToggle, onSpeed, compact }: { state: AutoplayState; onToggle(): void; onSpeed(): void; compact?: boolean })`

Behaviour copied from the reference script (spec §3). Each frame, advance `VIEWPORTS_PER_SECOND × SPEEDS[i] × viewportHeight × dt`, with dt capped at 100 ms. Track the target position yourself. If `|getScrollY() − tracked| > 3` px, the user scrolled, so pause. Stop at `getMaxScroll()`, re-read every frame. "At end" means `scrollY >= max − 2`. `label` is `"pause"` while playing, `"replay"` when stopped at the end, and `"play"` otherwise. `refresh()` recomputes the label (called on scroll so "Watch again" appears when the user reaches the bottom by hand).

- [ ] **Step 1: Failing tests** in `lib/autoplay.test.ts`, using a fake env with a manual clock and a frame queue:

```ts
test("scrolls 0.4 viewport per second at 1×")       // vh 1000, 1 s of 16 ms frames → scrollY ≈ 400 (±20)
test("speed cycles 1 → 2 → 0.5 → 1")                 // SPEEDS[speedIndex] after 0..3 cycleSpeed() calls
test("2× doubles the distance")                      // ≈ 800 after 1 s
test("caps a long frame at 100 ms")                  // one 2000 ms gap moves ≤ 40 px
test("stops at the bottom and labels replay")        // max 500 → playing false, label "replay", scrollY 500
test("play at end restarts from top")                // at max, play() → scrollTo(0) first, then advances
test("keeps going when the page grows")              // max 500→900 mid-run → ends at 900
test("manual scroll pauses")                         // env scrollY jumps +200 between frames → playing false, label "play"
test("isStopKey ignores keys from inside the control") // isStopKey(" ", true) false; isStopKey(" ", false) true
test("isStopKey covers navigation keys")             // Escape, ArrowDown, PageUp, Home, End true; "a" false
```

- [ ] **Step 2:** `pnpm test`, expect FAIL (module missing).
- [ ] **Step 3:** Implement `lib/autoplay.ts` per Interfaces.
- [ ] **Step 4:** `pnpm test`, expect PASS.
- [ ] **Step 5: `useAutoplay`.** Build the real env (`window.scrollY`, `document.documentElement.scrollHeight - innerHeight`, `requestAnimationFrame`, `scrollTo({ top, behavior: "instant" })`). Pause on `wheel` and `touchstart` (passive). On `keydown`, pause when `isStopKey(e.key, controlRef.current?.contains(e.target as Node) ?? false)`. Pause on `visibilitychange` to hidden. On `scroll`, call `refresh()`. Remove every listener and call `destroy()` on unmount.
- [ ] **Step 6: i18n.** Remove `nav.quote` and add `nav.play`, `nav.pause`, `nav.replay`, `nav.speed` (type + 3 JSONs):
  - en: "Play" / "Pause" / "Watch again" / "Playback speed"
  - es: "Reproducir" / "Pausa" / "Ver de nuevo" / "Velocidad"
  - de: "Abspielen" / "Pause" / "Nochmal ansehen" / "Geschwindigkeit"
- [ ] **Step 7: `AutoplayButton`.**
  - Main button: same classes as the old quote link (`rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90`), `aria-pressed={state.playing}`. It shows lucide `Play`, `Pause` or `RotateCcw` (`size-3`) plus the label text. With `compact`, it shows the icon only and the label moves to `aria-label`.
  - Speed button: a separate mono button (`font-mono text-[11px] text-muted-foreground`) showing `1×`/`2×`/`0.5×`, `aria-label={t.nav.speed}`.
  - Both buttons sit inside one wrapper; the hook receives that wrapper's ref.
- [ ] **Step 8: Header.** Call `useAutoplay` once in `Header`. The desktop `<Link …cotizador>` becomes `<AutoplayButton>` with the same staggered-entrance style. On phones, render `<AutoplayButton compact>` plus `<ThemeToggle>` in the top bar before the menu button (`md:hidden`, `gap-2`). Delete the mobile-menu quote link. `onToggle` also calls `setMobileOpen(false)`. Drop the `Link` import if it's unused.
- [ ] **Step 9:** Run the type-check gate and `pnpm test`.
- [ ] **Step 10: Browser check** (`pnpm build`, serve `out/`):
  - Play scrolls smoothly through services and the pinned projects carousel to the footer.
  - The label then reads "Watch again", and pressing it restarts from the top.
  - Wheel, touch-drag and arrow keys each stop it.
  - Space on the focused button toggles it without stopping.
  - On a 390 px wide screen the button is visible in the top bar.
  - `/es/` and `/de/` labels are translated.
  - `/cotizador/` still loads.
- [ ] **Step 11: Commit** `lib/autoplay.ts lib/autoplay.test.ts hooks/use-autoplay.ts components/autoplay-button.tsx components/header.tsx lib/i18n/types.ts content/i18n/es.json content/i18n/en.json content/i18n/de.json` with message `Replace Get a Quote with a Play button that auto-scrolls the page`.

### Task 4: Dotted-Earth hero globe

**Files:**
- Modify: `package.json` / `pnpm-lock.yaml` (`pnpm add three@0.170.0 && pnpm add -D @types/three@0.170.0`; also update `package-lock.json` only if `npm` is how it's maintained. Check `git log -1 -- package-lock.json` and leave it alone if it's stale). Extend the test script to `tsx --test lib/*.test.ts lib/globe/*.test.ts`.
- Create: `lib/globe/geo.ts`, `lib/globe/geo.test.ts`, `lib/globe/scene.ts`, `components/hero-globe.tsx`
- Modify: `components/hero-section.tsx`

**Interfaces:**
- Produces, in `lib/globe/geo.ts` (no `three` import, pure):

```ts
export const LAND_MASK_B64: string            // copy MASK string verbatim from the demo
export function isLand(lat: number, lon: number): boolean
export function latLonToUnit(lat: number, lon: number): { x: number; y: number; z: number } // lon 0 → +z, east → +x
export const CAPITALS: readonly (readonly [number, number])[] // the 22 [lat, lon] pairs from the demo's CITIES
export const MAX_ARC_ANGLE = 1.9              // radians
export function pickArcPair(random: () => number): [number, number] // indices into CAPITALS, i ≠ j, angle ≤ MAX_ARC_ANGLE
```

- Produces, in `lib/globe/scene.ts`: `createGlobeScene(canvas: HTMLCanvasElement, opts: { dark: boolean; reducedMotion: boolean }): GlobeHandle` with `interface GlobeHandle { setTheme(dark: boolean): void; start(): void; stop(): void; dispose(): void }`. `start`/`stop` set `canvas.dataset.running = "true" | "false"`. The scene owns its window pointer listeners (ignoring targets inside `a, button, header`) and a `ResizeObserver` on the canvas. `dispose` removes all of them and frees geometries, materials, textures and the renderer.

- [ ] **Step 1: Failing tests** in `lib/globe/geo.test.ts`:

```ts
test("latLonToUnit axes", () => {
  close(latLonToUnit(0, 0), { x: 0, y: 0, z: 1 }); close(latLonToUnit(90, 0), { x: 0, y: 1, z: 0 }); close(latLonToUnit(0, 90), { x: 1, y: 0, z: 0 })
})
test("land mask knows continents from oceans", () => {
  for (const [lat, lon] of [[19.43, -99.13], [23, 13], [-15.79, -47.88], [55.76, 37.62]]) assert.ok(isLand(lat, lon))
  for (const [lat, lon] of [[0, -150], [30, -40], [-30, 80]]) assert.ok(!isLand(lat, lon))
})
test("22 capitals", () => assert.equal(CAPITALS.length, 22))
test("arc pairs are distinct and never wrap behind the globe", () => {
  const rnd = seeded(42) // test-file helpers: seeded (tiny LCG), close (±1e-9 per axis), angle (great-circle radians)
  for (let k = 0; k < 2000; k++) { const [i, j] = pickArcPair(rnd); assert.notEqual(i, j); assert.ok(angle(CAPITALS[i], CAPITALS[j]) <= MAX_ARC_ANGLE) }
})
```

- [ ] **Step 2:** `pnpm test`, expect FAIL.
- [ ] **Step 3:** Implement `lib/globe/geo.ts` from the demo's `MASK`, `isLand`, `fromLatLon`, `CITIES` and `resetArc` pair loop.
- [ ] **Step 4:** `pnpm test`, expect PASS.
- [ ] **Step 5: `scene.ts`.** Port `makeEarth` + `makeEarthScene` + helpers (`dotCloud`, `fib`, `glowSprite`, dot shaders with `#include <colorspace_fragment>`) and the demo's pointer/drag/raycast/damp logic, using `geo.ts` for the mask, capitals and pair picking. Keep the demo's values:
  - R 1.95, 22k Fibonacci samples (14k when `innerWidth < 768`), `oceanEvery` 7, dot size 2.4.
  - Tilt −23.4°, initial spin 72°, idle 0.05 rad/s × motion (0.15 when reduced).
  - 8 arcs, 72 segments, 2.6 s each.
  - Placement: desktop `x = halfW × 0.42`, phone (aspect < 0.9) `y = halfH × 0.4` at scale 0.62.
  - Starfield of 600 points.
  - Pixel ratio `min(devicePixelRatio, 2)`, `alpha: true`, no tone mapping.
  - Theme palette: dark bg `0x0d0d0d` / fg `0xe9e9e9` / muted `0x6e6e6e`, light `0xfafafa` / `0x1c1c1c` / `0x9c9c9c`.
- [ ] **Step 6: `HeroGlobe`** (`"use client"`).
  - Renders `<canvas data-globe aria-hidden="true" className="absolute inset-0 size-full opacity-0 transition-opacity duration-1000">`.
  - After mount, wait one `requestAnimationFrame` plus `requestIdleCallback` (fall back to `setTimeout(…, 200)`), then `await import("@/lib/globe/scene")` and create the scene inside `try/catch`. On failure, render nothing further.
  - Once created, set opacity to 1.
  - An `IntersectionObserver` on the canvas calls `start()`/`stop()`; `visibilitychange` stops the loop and resumes it if the canvas is intersecting.
  - `useTheme().resolvedTheme` drives `setTheme` (treat `undefined` as dark).
  - `matchMedia("(prefers-reduced-motion: reduce)")` sets `reducedMotion`.
  - `dispose()` on unmount.
- [ ] **Step 7: Hero layout** in `hero-section.tsx`:
  - Insert `<HeroGlobe />` and then a veil `div` (`pointer-events-none absolute inset-0`) as the first children of the `<section>`. The veil gradient on desktop is `linear-gradient(90deg, var(--background) 0%, color-mix(in oklch, var(--background) 70%, transparent) 30%, transparent 62%)`. Below `md` it is `linear-gradient(0deg, var(--background) 8%, color-mix(in oklch, var(--background) 80%, transparent) 45%, transparent 75%)`.
  - The content wrapper gets `relative z-[1] pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto` and `justify-end md:justify-center`.
  - Replace the 12-col bottom grid with one column (`lg:max-w-[55%]`) where the CTAs follow the description, left-aligned (`justify-start`).
  - Give the logo strip `relative z-[1]`.
- [ ] **Step 8:** Run the type-check gate and `pnpm test`.
- [ ] **Step 9: Bundle gate.** Run `pnpm build`, then `for f in $(grep -l "WebGLRenderer" out/_next/static/chunks/*.js); do grep -q "$(basename $f)" out/index.html && echo "LEAK $f"; done`. Expected: no `LEAK` lines (three.js only in a lazily loaded chunk).
- [ ] **Step 10: Browser check** on served `out/` at 1440×900 and 390×844, both themes:
  - Hero text paints before the globe fades in.
  - Continents are right, with the Americas facing first. Arcs fly between capitals.
  - Hover lights dots and drag spins with inertia.
  - Text and both CTAs are clickable over the canvas.
  - Scrolling past the hero sets `canvas[data-globe]` `data-running="false"`, and it flips back to true when you return.
  - Theme toggle re-themes live.
  - Switching locale twice leaves exactly one `canvas[data-globe]` and a clean console.
  - Chrome launched with `--disable-webgl` shows the normal hero with no errors.
  - Emulating `prefers-reduced-motion: reduce` makes idle spin near-still while hover and drag still work.
- [ ] **Step 11: Commit** `package.json pnpm-lock.yaml lib/globe/ components/hero-globe.tsx components/hero-section.tsx` with message `Add the dotted-Earth globe behind the hero`.
