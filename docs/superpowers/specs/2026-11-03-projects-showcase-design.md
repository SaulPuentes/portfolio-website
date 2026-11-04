# Projects showcase redesign

## Intent

Today the projects section is a pinned horizontal carousel: visitors scroll past one card at a
time to see the work. The owner wants the section to feel alive and to show more at a glance:
a large featured area, a gallery that plays by itself, and something always moving.

Replace the carousel with a **stage** (one project, large, playing its screenshots) above an
endlessly drifting **strip** of all the project cards.

## Goals

- Every project is reachable without scrolling through the whole section.
- One project is large on the stage at all times.
- Something is always moving while the section is on screen.
- Each screenshot's timing is visible through a thin progress line.

## Non-goals

- No change to project data shape or the detail modal's content. i18n changes only for the new
  pause/play labels and anything else the new layout needs.
- No video. Galleries are the existing screenshots.
- No new animation or carousel dependency.

## Anti-goals

- Stage motion that makes the text unreadable or can't be stopped.
- The page scrolling or jumping because of the showcase. Auto-advance must never move the page.
- A section that looks broken for projects with a single image.

## Approved design

Chosen from live mockups (proposal B). Reference mockup, not committed:
`.superpowers/brainstorm/5415-1793739215/content/pause-demo-v7.html`.

### Stage

- Desktop: two columns, image about 1.6fr, text about 1fr, in one bordered card.
- Image area is 16:10, `object-cover` from the top, crossfading between screenshots with a slow zoom.
- Text column: `NN / NN · project type` label in accent mono, name, first description paragraph,
  outline tags, "Up next — name", View details, View live when a live URL exists.
- Each screenshot shows for 3 seconds. A single-image project holds for 6 seconds.
- When the last screenshot ends, the next project takes the stage, looping through all of them.

### Progress: edge line

- One 2px accent line across the top edge of the image, spanning the whole project, not one slide.
- A small tick marks each screenshot boundary. No ticks for a single-image project.
- `NN / NN` screenshot counter at top left of the image on desktop, bottom left on mobile. Hidden for a single-image project.
- No segment bars.

### Pause button

- Small square pause/play button on the stage image, top right on desktop and bottom right on
  mobile, for every project. Always visible, not only on hover.
- It stops the stage only. The strip keeps drifting.
- The stage stays paused until pressed again. Clicking a strip card while paused changes the stage
  and stays paused.
- It is a real `button` with a translated pause/play label in `en`, `es` and `de`, and exposes its state.
- Hidden with `prefers-reduced-motion`, since nothing autoplays then.

### Strip: Detail cards

- Endless sideways drift at about 45 seconds per loop on desktop and 35 on mobile, built on the
  site's existing marquee approach: a doubled list, with the duplicates hidden from assistive tech.
- Card on desktop and mobile: 16:10 cover image, name, project type in mono, then the first
  description paragraph clamped to 2 lines with an ellipsis. No tags.
- The card matching the stage project has an accent border.
- Desktop hover: pauses the drift and plays that card's gallery. Leaving resets it to the cover.
- Hover previews show no progress line.
- Click or tap: that project moves to the stage. It does not open the modal.
- Keyboard focus on a strip card pauses the drift, like hover, so tabbing does not jump the strip.

### Tags: outline

Small bordered mono uppercase boxes. All tags, on the desktop stage only. Strip cards and mobile have
none.

### Mobile: M1 at the site's `md` breakpoint

- Single column: stage image, then text under it, then the strip with narrower cards.
- Same edge line and strip cards. No tags anywhere on mobile.
- Stage text is minimal: the name with the project type label beside it, the first description
  paragraph clamped to 4 lines with an ellipsis, then View details and View live. No `NN / NN` eyebrow.
- "Up next" may be dropped for space. View details and View live stay.
- The screenshot counter and pause button sit at the bottom of the stage image, left and right.
  The edge line stays on the top edge.
- Cards stay on their cover image. Tapping moves the project to the stage and scrolls the stage
  into view if it is off screen, below the sticky header. Automatic changes never scroll the page.

### Decisions on order and pausing

- Evalor opens the stage. Do this by moving it to the top of `content/data/projects.json`, no code.
  That file is gitignored, so this is a local data change. `content/data/projects.sample.json`
  has one project and needs no change.
- Only the pause button stops the stage. Hover and keyboard focus do not.
- Stage and strip both stop running while the section is off screen or the tab is hidden.
- With `prefers-reduced-motion`, nothing autoplays or drifts. The stage stays on one screenshot, and
  the strip must then be usable by hand, for example horizontal scroll, since it no longer moves.

## Builder's calls already made

These were not decided by the owner and can be challenged while reading the doc:

- The pause button leaves the strip drifting, read from "keep the marquee as it is". Touch visitors
  therefore can't stop the strip; reduced motion still does. Strip hover and focus pausing stay.
- Tapping a strip card on mobile may scroll the stage into view, because the visitor asked for it.
- Keyboard focus on a strip card pauses the drift.
- No image resize step. The site already ships original files.
- The stage also waits while the detail modal is open, so readers keep their place. The strip does not.
- Tabbing into the strip resets its drift to the start, so every focused card can be seen. It jumps
  once on entering and once on leaving.

## What must keep working

- **Detail modal:** `ProjectDetailModal` opens from View details, with its existing gallery.
- **Links added in uncommitted work:** the working tree has uncommitted edits in
  `components/projects/index.tsx`, `components/projects/project-detail-modal.tsx`,
  `components/scroll-carousel.tsx` and `app/styles/scroll-carousel.css`. The View live link and the
  modal edits must carry over. The card fade-in from `scroll-carousel.tsx` is optional.
- **Site Play tour:** `hooks/use-autoplay.ts` and `lib/autoplay.ts` read Swiper elements and carousel
  scroll data. Replace all of that with a single stop at `#projects`. Remove `projectCount`,
  `projectBottoms`, `scrub`, `TourStop.slide` and `slideTo`, and update `lib/autoplay.test.ts`.
  Keep `stepDown`, since services still use it.
- **Header nav** link to `#projects`.
- **All three locales:** text comes from project data and i18n, not mockup copy.

## What goes away

Only the projects section uses these, so remove them once replaced:

- `components/scroll-carousel.tsx`
- `hooks/use-scroll-carousel.ts`
- `app/styles/scroll-carousel.css`, and its import
- the `swiper` dependency, if nothing else needs it
- `gsap` stays only if something else still uses it: check before removing

## Constraints

- Next.js 16 App Router, Tailwind, existing theme tokens, light and dark themes. The mockup is dark
  only; both themes must work, including text over the image counter.
- Reuse existing project data: `name`, `description[locale][0]`, `technologies`, `image`, `gallery`.
- `technologies` is the tag source. There is no "project type" field; the mockup's type label comes
  from the text after the `—` in `name[locale]`, or the builder may add an optional field.
- Descriptions run to about 275 characters. Stage height must not jump as projects change.
- Screenshots are several aspect ratios and up to 3024px wide, some very tall.
- The site is a static export with `images.unoptimized: true`, so `next/image` serves originals. No
  resize step in this work: lazy-load instead, and load strip galleries only on hover.
- The repo is public: `content/data/*.json` stays uncommitted, per `CLAUDE.md`.

## Left to the builder

Component and file structure, how timing is driven (CSS animation or `requestAnimationFrame`), exact
spacing and type sizes, how long the tour holds at the projects stop, and preloading.
