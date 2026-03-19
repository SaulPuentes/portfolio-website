# Task 05 — Scroll-Driven Projects Section Redesign

## Status: Done

## Context

The current projects section uses a horizontal carousel with snap scrolling, navigation arrows, and dot indicators. While functional, it doesn't create a strong visual impact or storytelling feel.

The goal is to replace it with a vertical scroll-driven stacking effect: project cards become sticky as they reach the viewport, and each new card fades in from below and overlaps the previous one. This creates a layered, case-study-style transition that feels modern and immersive.

The existing `ProjectDetailModal` (using Shadcn Dialog) must be preserved and reused. The `Project` data structure (`lib/types.ts`) and i18n keys remain unchanged. The data source (`content/data/projects.json`) also stays the same but may need a `gallery` field added for the collage.

---

## Plan

### Step 1 — Extend Project Data with Gallery Images

Add an optional `gallery` field to the `Project` interface in `lib/types.ts`:

```ts
gallery?: string[] // paths to collage images
```

Update `content/data/projects.json` to include `gallery` arrays for each project (placeholder paths for now).

### Step 2 — Build the New ProjectCard Component

Create a new `ProjectCard` within `components/projects-section.tsx` (replace the existing one). Each card should render:

1. **Project name** — large, prominent heading (`text-3xl md:text-5xl font-bold`)
2. **Gallery collage** — CSS grid of 2–4 images with slight overlap/rotation for dynamism. On mobile, simplify to a 2-column grid with no overlap.
3. **Short description** — 1–3 lines from `project.description[locale]`
4. **Actions row**:
   - "View Details" button → opens the existing `ProjectDetailModal`
   - `liveUrl` displayed as a subtle link if present
5. **Styling**: white/neutral background, subtle shadow (`shadow-lg`), rounded corners, generous padding

### Step 3 — Implement Scroll-Driven Stacking Layout

Replace the carousel in `ProjectsSection` with a vertical stack:

- Wrap all cards in a container with enough height to allow scroll space (e.g., each card gets `100vh` of scroll distance).
- Each card uses `position: sticky; top: 0` so it sticks at the top of the viewport.
- Cards are rendered in order; each subsequent card naturally scrolls over the previous sticky card.
- Use CSS `z-index` incrementally so later cards stack on top.

### Step 4 — Add Fade-In Animation

Use Intersection Observer (or `framer-motion`'s `useInView` / `whileInView`) to animate each card's entrance:

- Initial state: `opacity: 0; translateY: 40px`
- Animated state: `opacity: 1; translateY: 0`
- Transition: `duration: 0.6s, ease-out`

Keep it CSS-driven or use `framer-motion` if already in the project. Avoid heavy JS scroll listeners.

### Step 5 — Preserve the ProjectDetailModal

Keep the existing `ProjectDetailModal` component as-is. Wire each card's "View Details" button to open it with the selected project, exactly as before.

### Step 6 — Responsive Behavior

- **Desktop**: Full stacking effect with collage grid (3–4 images, overlapping layout)
- **Tablet**: Reduce collage to 2 images side-by-side, maintain stacking
- **Mobile**: Cards stack normally (no sticky overlap — disable `position: sticky` below `md` breakpoint to avoid overlap issues). Collage becomes a simple 2-column grid. Fade-in animation still applies.

### Step 7 — Clean Up Old Carousel Code

Remove all carousel-related code:
- Scroll snap CSS
- Navigation arrows and dot indicators
- `useRef` scroll tracking logic
- Any carousel-specific state

### Step 8 — Verify

1. Run `npm run build` — ensure no type errors or build failures
2. Test at `http://localhost:3000`:
   - Scroll through projects section — cards stack smoothly
   - Each card fades in as it enters
   - "View Details" opens modal with correct project data
   - Test all 3 breakpoints (mobile, tablet, desktop)
   - Verify i18n works for all 3 locales (en, de, es)
3. Check performance — no jank or excessive re-renders during scroll

---

## Files Involved

### Modified
- `components/projects-section.tsx` — full rewrite of layout (carousel → sticky stack), new ProjectCard design with collage, keep ProjectDetailModal
- `lib/types.ts` — add optional `gallery?: string[]` to `Project`
- `content/data/projects.json` — add `gallery` arrays to each project

### Potentially Modified
- `app/globals.css` — add any custom CSS for the stacking effect if Tailwind alone isn't sufficient

---

## Acceptance Criteria

- [ ] Projects display as vertical sticky-stacking cards on desktop/tablet
- [ ] Each card fades in smoothly (opacity + translateY) as it enters the viewport
- [ ] Cards layer on top of each other during scroll (no abrupt jumps)
- [ ] Each card shows: project name (large), gallery collage, short description, "View Details" button, optional URL link
- [ ] "View Details" button opens the existing ProjectDetailModal with correct project data
- [ ] Responsive: mobile disables sticky overlap; collage simplifies to 2-col grid
- [ ] All 3 locales (en, de, es) render correctly
- [ ] No build errors (`npm run build` passes)
- [ ] Smooth scroll performance (no jank)
- [ ] Old carousel code fully removed
