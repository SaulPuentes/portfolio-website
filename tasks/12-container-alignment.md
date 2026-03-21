# Task 12 — Container and Title Alignment

## Status: Pending

## Context

The page sections use inconsistent `max-w` and `px` values, causing titles and containers to misalign across sections. Specifically:

- **Header, Hero, Contact, Footer** use `max-w-6xl px-4 lg:px-8`
- **Services** uses `max-w-7xl px-4 sm:px-6 lg:px-8`
- **Projects carousel heading** uses `max-w-7xl px-4 sm:px-6 lg:px-8`

All section titles should be left-aligned at the same screen margin. Standardize on `max-w-7xl px-4 sm:px-6 lg:px-8`.

---

## Plan

### Step 1 — Unify Services container to `max-w-6xl`

In `components/services-section.tsx` line 54, change:

```tsx
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

to:

```tsx
<div className="w-full max-w-6xl mx-auto px-4 lg:px-8">
```

### Step 2 — Unify Projects carousel heading container

In `components/scroll-carousel.tsx` line 159, change:

```tsx
<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
```

to:

```tsx
<div className="mx-auto w-full max-w-6xl px-4 lg:px-8 pb-6">
```

### Step 3 — Verify

1. Run `npm run build`
2. Test at `http://localhost:3000` — scroll through all sections and confirm:
   - Header brand name, section titles (Services, Projects, Contact), and footer all start at the same left edge
   - No horizontal jumps between sections
3. Test at mobile, tablet, and desktop breakpoints

---

## Files Involved

### Modified
- `components/services-section.tsx` — change `max-w-7xl` → `max-w-6xl`, remove `sm:px-6`
- `components/scroll-carousel.tsx` — change heading container `max-w-7xl` → `max-w-6xl`, remove `sm:px-6`

---

## Acceptance Criteria

- [ ] All section titles align to the same left margin as the header
- [ ] Services, Projects, Contact, and Footer containers use the same `max-w-6xl px-4 lg:px-8`
- [ ] No visual regression at mobile / tablet / desktop breakpoints
