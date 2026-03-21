# Task 16 — Cleanup Unused Code, Styles and Files

## Status: Complete

## Context

The project scaffolded a large shadcn/ui component library but only uses a fraction of it. There are also unused hooks, unused npm dependencies, and orphaned files that add bloat without contributing to the site. Cleaning these up reduces bundle size, simplifies maintenance, and makes the codebase easier to navigate.

---

## Plan

### Step 1 — Remove unused UI components

Delete the following files from `components/ui/`:

- `accordion.tsx`
- `alert.tsx`
- `alert-dialog.tsx`
- `aspect-ratio.tsx`
- `avatar.tsx`
- `breadcrumb.tsx`
- `button-group.tsx`
- `calendar.tsx`
- `carousel.tsx`
- `chart.tsx`
- `checkbox.tsx`
- `collapsible.tsx`
- `command.tsx`
- `context-menu.tsx`
- `drawer.tsx`
- `dropdown-menu.tsx`
- `empty.tsx`
- `field.tsx`
- `form.tsx`
- `hover-card.tsx`
- `input-group.tsx`
- `input-otp.tsx`
- `item.tsx`
- `kbd.tsx`
- `menubar.tsx`
- `navigation-menu.tsx`
- `pagination.tsx`
- `popover.tsx`
- `radio-group.tsx`
- `resizable.tsx`
- `scroll-area.tsx`
- `select.tsx`
- `separator.tsx`
- `sheet.tsx`
- `sidebar.tsx`
- `skeleton.tsx`
- `slider.tsx`
- `sonner.tsx`
- `spinner.tsx`
- `switch.tsx`
- `table.tsx`
- `tabs.tsx`
- `toggle.tsx`
- `toggle-group.tsx`
- `tooltip.tsx`
- `use-mobile.tsx` (if exists as duplicate)

**Keep only:** `badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `progress.tsx`, `textarea.tsx`

### Step 2 — Remove unused toast system

Delete:
- `components/ui/toast.tsx`
- `components/ui/toaster.tsx`
- `hooks/use-toast.ts`

None of these are consumed by any page or layout.

### Step 3 — Remove unused hooks

Delete:
- `hooks/use-scroll-cards.ts` — neither `useInView` nor `useScrollCards` are imported anywhere
- `hooks/use-mobile.ts` — only imported by `sidebar.tsx` which is itself unused

### Step 4 — Remove unused npm dependencies

```bash
pnpm remove @hookform/resolvers date-fns zod
```

These packages are never imported in application code. Also audit whether the following can be removed (they may only be consumed by now-deleted UI components):
- `cmdk` (used by `command.tsx` — deleted in Step 1)
- `embla-carousel-react` (used by `carousel.tsx` — deleted in Step 1)
- `react-day-picker` (used by `calendar.tsx` — deleted in Step 1)
- `recharts` (used by `chart.tsx` — deleted in Step 1)
- `vaul` (used by `drawer.tsx` — deleted in Step 1)
- `sonner` (used by `sonner.tsx` — deleted in Step 1)
- `react-resizable-panels` (used by `resizable.tsx` — deleted in Step 1)
- `input-otp` (used by `input-otp.tsx` — deleted in Step 1)
- `@radix-ui/*` packages only consumed by deleted components

### Step 5 — Verify

1. Run `pnpm build` — must complete without errors
2. Run `pnpm dev` and test at `http://localhost:3000`:
   - Home page loads, all sections render
   - Project modal opens and closes
   - Quoter form works end-to-end
   - Scroll carousel functions correctly
3. Confirm no console errors or missing module warnings

---

## Files Involved

### Removed
- ~43 files in `components/ui/` (listed above)
- `hooks/use-scroll-cards.ts`
- `hooks/use-mobile.ts`
- `hooks/use-toast.ts`

### Modified
- `package.json` — remove unused dependencies

### Kept (UI)
- `components/ui/badge.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/dialog.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- `components/ui/progress.tsx`
- `components/ui/textarea.tsx`

---

## Acceptance Criteria

- [x] No unused UI component files remain in `components/ui/`
- [x] No unused hooks remain in `hooks/`
- [x] Unused npm dependencies removed from `package.json`
- [x] `pnpm build` passes without errors
- [x] All site functionality works as before (home page, projects modal, quoter, carousel)
