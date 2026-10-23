# Portfolio improvements: globe hero, client logos, Play button, Randia

Date: 2026-10-22
Status: draft for approval

## Why

The site's main audience is **potential clients**. In the first seconds they should be impressed by
the craft of the site itself. Four changes serve that:

1. A Three.js hero animation that shows engineering polish at first glance.
2. Social proof: logos of brands Saúl has built for, replacing the skills marquee.
3. A "watch it like a film" Play button that auto-scrolls the whole page, so a visitor can sit back
   and see every section animate.
4. A new project, Randia, added to the projects carousel.

**Success:** a visitor lands, sees a living globe next to the name, recognises client logos, and can
press Play to tour the site, on desktop and phone, with no visible jank and no slower first paint.

**Anti-goals** (a failure even if it technically works):

- The hero text or buttons appear later than today because of the animation.
- The animation drains battery while off-screen or in a background tab.
- Anything that breaks the existing grayscale + single blue accent identity.
- Personal data committed to this public repo (see `CLAUDE.md`).

## Constraints

- Next.js 16 static export (`output: 'export'`), React 19, Tailwind 4, GSAP + Swiper already used.
- Design tokens live in `app/styles/globals.css` (`--accent: oklch(0.6231 0.188 259.81)`, grayscale
  everything else, light and dark themes via `next-themes`). Fonts: Geist (display), Inter, JetBrains Mono.
- Three locales: `es`, `en`, `de` (`content/i18n/*.json`). Every new string needs all three.
- Personal data stays in gitignored files with committed `*.sample.*` twins (see `CLAUDE.md`).
  Images under `public/projects/` are committed today; data files under `content/data/` are not.
- No test framework in the repo. Verification is `pnpm lint`, `pnpm build`, and driving the built
  site in a browser at desktop and phone widths, in both themes.

## 1. Hero animation: dotted Earth ("C2")

Chosen after comparing ten directions in a throwaway demo. The reference implementation is
`docs/superpowers/specs/assets/2026-10-22-hero-globe-demo.html`: open it, the default option **C2 · Earth**
is the one to port (functions `makeEarth`, `makeEarthScene`, plus the shared helpers they use:
`dotCloud`, `fib`, `glowSprite`, `fromLatLon`, `isLand`, the dot shaders and the `MASK` string).
Ignore the F2·* options in that file; they were rejected. The demo's switcher, FPS readout and
placeholder logo names are demo-only and do not ship.

### What the visitor sees (decided)

- A dotted globe with **real continents** (dots on land, sparse faint dots on oceans), tilted 23.4°
  on its axis, spinning slowly west→east, opening on the Americas.
- A soft blue atmosphere halo behind the globe, and a faint starfield with slight cursor parallax.
- **Data arcs between world capitals**: blue arcs grow from one capital to another and retract,
  about 8 at a time, with pulsing blue markers on the 22 capitals listed in the demo (`CITIES`).
  Pairs are limited to under ~110° apart so arcs never wrap behind the globe.
- **Hover:** dots under the cursor lift slightly and turn blue. **Drag:** spins the globe with inertia,
  then it eases back to its idle speed. The globe tilts slightly toward the cursor.
- The existing hero content stays (eyebrow, name, rule, description, CTAs, same copy, fonts and sizes),
  but the layout shifts to match the demo so the globe has room *(Claude's call, matching the demo
  Saúl approved)*:
  - **Desktop:** CTAs move under the description, left-aligned (today they sit right-aligned in
    `lg:col-span-5 lg:justify-end`, exactly where the globe goes). The text column keeps to the left
    ~55% of the width.
  - **Phone:** hero content is bottom-aligned instead of vertically centred, so the globe sits in the
    top ~40% of the screen.
  The canvas sits behind the content; text and buttons remain clickable, and hover reaches the canvas
  everywhere else.
- **Desktop:** globe to the right of the text. **Phone (aspect < 0.9):** globe above the text, smaller.
  A background gradient keeps the text readable over the canvas (left-to-right on desktop,
  bottom-to-top on phone), as in the demo.
- **Light theme:** dots turn dark on the light background and the halo is fainter. The globe re-themes
  live when the theme toggle is used.

### Performance and accessibility (decided as builder's-call defaults, stated to Saúl)

- Add `three` as a dependency, loaded with a **dynamic import after first paint**. The hero text must
  render exactly as fast as today; the globe fades in once ready.
- Render loop pauses when the hero is off-screen (IntersectionObserver) and when the tab is hidden.
- Device pixel ratio capped at 2. Phones use fewer dots (the demo uses 14k vs 22k Fibonacci samples).
- `prefers-reduced-motion`: idle motion slowed to near-still; hover and drag still work.
- The canvas is decorative: `aria-hidden`, no focusable elements.
- The land mask is the demo's built-in 360×180 one-bit map (~11 KB base64). It was baked from
  `three-globe@2.31.0/example/img/earth-water.png` (MIT). No image request at runtime.
- Dispose all Three.js resources on unmount (route change, locale change).

### Left to the builder

- Component structure (e.g. a `HeroGlobe` client component plus a plain module for the scene), and
  whether the scene code is TypeScript-typed strictly or loosely.
- Exact fade-in, timing constants and dot counts, as long as it matches the demo's look and holds a
  smooth frame rate on a mid-range phone.
- Whether WebGL-unavailable browsers get nothing (acceptable) or a static fallback.

## 2. Client logos replace the skills marquee

`components/skills-marquee.tsx` (two rows of skill names at the bottom of the hero) is replaced by a
**single-row scrolling strip of client logos**, in this order:

1. Grupo Xcaret
2. Galerías (galerias.com)
3. NordicTrack (nordictrack.com)
4. Simonett (simonett.us)
5. Uncommon Man (shopuncommonman.com)
6. Trust (adtrust.com.mx)
7. Then the remaining projects in the Projects section: Salsa World, Nourpac, Evalor,
   Twelve Thirty Four, Grupo DAGS, Randia.

These are **brands Saúl built for**, not employers. Orium, Gluo, Blue People, Enroute, Helicon and
Grupo 4S (from the CV) are deliberately **not** in the strip.

Decided:

- Logos are sourced as SVG from each company's own site (PNG/WebP only where no vector exists) and
  stored under `public/logos/`.
- Logos display in a **single gray tone** matching the grayscale site, and go to **full colour on
  hover**. They must read well in both light and dark themes.
- Same marquee motion as today (CSS animation, edge fade mask, delayed entrance), same position at
  the bottom of the hero.

Left to the builder: how to get one gray tone (CSS `filter`, `currentColor` SVGs, or pre-processed
files), logo height and spacing, and where the ordered list lives (follow the existing
`content/data/*.json` + `*.sample.json` + `lib/data.ts` pattern). Whether to delete
`skills-marquee.tsx` or keep it unused: delete it if nothing else imports it.

## 3. Play button: watch the page like a film

Inspired by the "Ver como película" control on margarethamilton.dev (its script was read during
brainstorming). It **replaces the "Get a Quote" button** in the header, in the same filled style.
On desktop it sits where "Get a Quote" was. On phones it sits **in the top bar next to the theme
toggle**, always visible, as in the demo. The "Get a Quote" entry in the mobile menu is removed.
*(Claude's call: a menu-only button would leave phone visitors no visible Pause, speed or
"Watch again" once playback starts.)*

Behaviour (decided):

- Press Play → the page scrolls smoothly and continuously from the current position to the bottom,
  at about **40% of the viewport height per second**. Existing scroll-driven sections (the services
  reveal, the pinned projects carousel) play out by themselves.
- A small speed button next to it cycles **1× → 2× → 0.5×**.
- Any wheel, touch, arrow/Page/Home/End/Space or Esc **stops** it, so manual navigation always wins.
  Switching tabs also stops it.
- At the bottom the label changes to **"Watch again"**, and pressing it restarts from the top.
- Labels: Play / Pause / Watch again, translated for ES, EN, DE. On narrow phones the label may
  collapse to the icon only (keeping an `aria-label`), with the speed button beside it.
- If the mobile menu is open when Play is pressed, it closes.
- `aria-pressed` reflects the playing state.

Side effect accepted: the header button was the only link to `/cotizador`. The route stays and keeps
working, but is no longer linked from the header.

Left to the builder: implementation (a `requestAnimationFrame` loop calling
`window.scrollTo({ behavior: 'instant' })` is what the reference uses and works with GSAP
ScrollTrigger scrubbing), exact translations, icon choice (lucide `Play`/`Pause`/`RotateCcw` fit).

## 4. Randia project

Saúl designed, built and deployed **randia.mx** end to end: design proposal, development, deployment.

Content (decided):

- Placement: in the projects carousel **right after Evalor** (middle of the list), not first.
- Description follows the four-paragraph pattern of the other projects, in ES, EN and DE:
  1. One line on what was built: the sales site for Randia Residencial, a pre-sale residential
     development in Cumbres, Nuevo León, with four house models (Nara, Alba, Bruma, Aria).
  2. The client's need: present a development in pre-sale and turn visitors into scheduled visits.
  3. What was built: a custom WordPress theme styled with Tailwind, model showcase, amenities,
     an interactive Leaflet location map, and a lead form with budget ranges that leads to a sales visit.
  4. The result: a fast, editable sales site the developer's team runs themselves.
- **Do not mention the number of lots.** Do not credit Trust in the copy.
- Badges: WordPress, PHP, Tailwind CSS, Leaflet.
- Visuals: three screenshots of the live site at 1024×640 WebP, the same as other projects: hero,
  models, location/amenities. Stored in `public/projects/randia/`. The card cycles them on hover like
  the others.
- Link: `liveUrl: "https://randia.mx"`.
- The entry goes in the gitignored `content/data/projects.json`. Screenshots are committed.

Left to the builder: exact wording within that outline, and how the screenshots are captured
(Puppeteer is already a dev dependency).

## Order of work (suggested)

Quick pieces first, the hero last: Randia → client logos → Play button → hero globe.
Each piece is independently shippable.

## Out of scope

- Any other section redesign; the quoter; the CV tooling.
- Changes to the uncommitted CV-script edits already in the working tree. Leave them untouched and
  never stage them with this work.
