# Restore Skills Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the two-row tech-stack word marquee back at the bottom of the hero, replacing the client-logo marquee.

**Architecture:** Restore `components/skills-marquee.tsx` exactly as it was before commit `a485856` ("Replace the skills marquee with client logos") and swap it into `components/hero-section.tsx` where `<ClientLogos />` sits now. Then delete the now-unused client-logo code, data wiring and assets. The marquee keyframes and `animate-marquee-left/right` utilities still live in `app/styles/globals.css`, so the CSS needs no change.

**Tech Stack:** Next.js (App Router, static export), React, Tailwind v4, `tsx --test` for tests, pnpm.

**Spec:** User request (2026-10-23): "bring back the tech stack words marquee and replace the current logos. Look into previous version using git and bring back this section." Source of truth is `git show a485856^:components/skills-marquee.tsx`.

## Global Constraints

- Restore the old component verbatim from `a485856^`. Don't redesign it: two rows, row 2 reversed, 1800 ms fade-in delay, 200 ms stagger between rows, edge mask at 10% / 90%.
- Data comes from `skills` in `lib/data.ts` (`content/data/skills.json`, which is gitignored, with `skills.sample.json` as its committed twin). Don't add a new data file.
- Public repo: run the CLAUDE.md staged-diff personal-data grep before every commit.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Globe overlap:** the hero now has `HeroGlobe` behind it. The marquee has to stay inside the existing `<div className="relative z-[1] mt-auto shrink-0">` wrapper, or the globe covers it.
2. **Dark mode:** the words use `text-foreground/70` and `text-muted-foreground/50`. Check that both are readable on the dark background with the globe behind them.
3. **Phone width (375px):** the page must not scroll sideways. Each row's `overflow-hidden` and mask must clip the `w-max` track.
4. **Fresh clone:** `pnpm build` must pass with only `skills.sample.json` present, which is what CI sees. `lib/data.ts` must no longer import the gitignored `clients.json`.
5. **Reduced motion:** the old marquee ignored `prefers-reduced-motion`, so this restore keeps that behavior. Flag it in review rather than fixing it, because the request was to bring the old version back.

---

### Task 1: Restore the marquee and swap it into the hero

**Files:**
- Create: `components/skills-marquee.tsx`, restored from git
- Modify: `components/hero-section.tsx:9` (import) and `:147` (usage)

**Interfaces:**
- Consumes: `skills: SkillCategory[]` from `@/lib/data`, where each item has `.name: string`
- Produces: `export function SkillsMarquee(): JSX.Element`, which takes no props

- [ ] **Step 1: Restore the file**

```bash
git restore --source=a485856^ -- components/skills-marquee.tsx
```

Expected: the file exists and `git diff a485856^ -- components/skills-marquee.tsx` prints nothing.

- [ ] **Step 2: Swap it into the hero**

In `components/hero-section.tsx`, replace `import { ClientLogos } from "@/components/client-logos"` with `import { SkillsMarquee } from "@/components/skills-marquee"`. Replace `<ClientLogos />` with `<SkillsMarquee />`, and keep the surrounding `relative z-[1] mt-auto shrink-0` wrapper div.

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm test && pnpm build`
Expected: all three exit 0.

Then run `pnpm dev` and open `/`. Expected: two rows of skill names scroll in opposite directions under the hero buttons and fade in about 1.8 s after load. Check Review Focus items 1–3 in light mode, in dark mode and at 375px width.

- [ ] **Step 4: Commit**

```bash
git add components/skills-marquee.tsx components/hero-section.tsx
git diff --cached -U0 | grep -inE '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\+[0-9][0-9 ()-]{8,}'   # expect no output
git commit -m "Bring back the tech-stack marquee in place of client logos"
```

### Task 2: Delete the unused client-logo code

A reviewer can reject this task and still approve Task 1 if the user wants to keep the logos for later. Git history keeps them either way.

**Files:**
- Delete: `components/client-logos.tsx`, `content/data/clients.sample.json`, `public/logos/` (all 24 files)
- Modify: `lib/data.ts` (remove the `clientsJson` import, the `clients` export and `Client` from the type import)
- Modify: `lib/types.ts:30-` (remove `interface Client`)
- Modify: `lib/data.test.ts` (remove the `"client logos in the agreed order"` test and `clients` from the import)

**Interfaces:**
- Consumes: nothing
- Produces: nothing. After this task, `clients` and `Client` must not exist anywhere.

- [ ] **Step 1: Confirm nothing else uses them**

Run: `grep -rn "ClientLogos\|client-logos\|\bclients\b\|\bClient\b\|/logos/" app components lib scripts content/data/*.sample.json`
Expected: hits only in the files listed above.

- [ ] **Step 2: Delete and edit**

```bash
git rm -r components/client-logos.tsx content/data/clients.sample.json public/logos
```

Then make the edits to `lib/data.ts`, `lib/types.ts` and `lib/data.test.ts` listed above. Leave the local gitignored `content/data/clients.json` alone, because it is not tracked.

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm test && pnpm build`
Expected: all three exit 0. The test output no longer lists "client logos in the agreed order".

Re-run the grep from Step 1. Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add -A components lib content/data/clients.sample.json public/logos
git diff --cached -U0 | grep -inE '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\+[0-9][0-9 ()-]{8,}'   # expect no output
git commit -m "Remove unused client-logo marquee, data and assets"
```
