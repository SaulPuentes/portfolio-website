# Task 09 — Quoter Result Layout Redesign

## Status: Done

## Context

The quoter result screen (`QuoterResult`) currently constrains all elements (price card, disclaimer, answers summary, and action buttons) to `max-w-md`. The questionnaire form uses the full `max-w-3xl` parent container width via a `Card` component. The result screen should feel visually consistent with the form by using the wider container for the summary, disclaimer, and buttons — while keeping the price/estimate card in its current narrower centered container.

---

## Plan

### Step 1 — Restructure QuoterResult layout

In `components/quoter/quoter-result.tsx`, split the result into two visual zones:

1. **Narrow zone** (keep `mx-auto max-w-md`): title, price card
2. **Wide zone** (full parent width, no `max-w-md`): answers summary, disclaimer, and action buttons

Replace the current flat `space-y-6` layout with:

```tsx
<div className="space-y-6">
  {/* Title + Price — narrow */}
  <div className="text-center">
    <h2>...</h2>
    <p>...</p>
  </div>
  <Card className="mx-auto max-w-md">...</Card>

  {/* Summary, disclaimer, buttons — wide (Card like questionnaire) */}
  <Card>
    <CardContent className="pt-6 space-y-6">
      {/* Answers summary (no longer collapsible, or keep collapsible) */}
      {/* Disclaimer */}
      {/* Action buttons */}
    </CardContent>
  </Card>
</div>
```

### Step 2 — Move disclaimer and buttons inside the wide Card

- Move the amber disclaimer block inside the new wide `Card`
- Move the CTA and restart buttons inside the same `Card`
- Keep the answers summary collapsible inside the card

### Step 3 — Verify

1. Run `npm run build`
2. Test at `http://localhost:3000/cotizador` — complete the questionnaire and check the result screen layout
3. Verify responsive behavior on mobile (the wide card should still look good on small screens)

---

## Files Involved

### Modified
- `components/quoter/quoter-result.tsx` — restructure layout: narrow price card + wide card for summary/disclaimer/buttons

---

## Acceptance Criteria

- [ ] Price card remains centered in a narrow container (`max-w-md`)
- [ ] Answers summary, disclaimer, and action buttons are inside a wider Card matching the questionnaire width
- [ ] Layout is responsive and looks good on mobile
- [ ] No functionality changes — all buttons and links work as before
