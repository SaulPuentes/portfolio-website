# Task 08 — Quoter UX Improvements

## Status: Done

## Context

The project quoter (`/cotizador`) currently has a final "contact info" section asking for name, email, and comments. This adds friction — the user just wants a quick estimate. Additionally, when a user finishes answering all questions on a step, there's no visual cue that they can proceed, and they can't press Enter to advance.

---

## Plan

### Step 1 — Remove the contact-info section from config

In `content/data/quoter-config.json`, delete the entire `"contact-info"` section object (lines 271–306) from the `sections` array.

### Step 2 — Highlight the Next button when step is complete

In `components/quoter/quoter-form.tsx`, add a visual highlight to the Next/Finish button when `canGoNext()` returns true. Apply a pulsing or scale animation class (e.g. `animate-pulse` or a ring effect) to draw attention.

```tsx
<Button
  onClick={quoter.next}
  disabled={!quoter.canGoNext()}
  className={cn(
    quoter.canGoNext() && "ring-2 ring-primary ring-offset-2"
  )}
>
```

Import `cn` from `@/lib/utils` if not already imported.

### Step 3 — Add Enter key to advance

In `components/quoter/quoter-form.tsx`, add a `useEffect` that listens for the Enter key and calls `quoter.next()` when `canGoNext()` is true and the result is not showing.

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && quoter.canGoNext()) {
      e.preventDefault()
      quoter.next()
    }
  }
  window.addEventListener("keydown", handleKeyDown)
  return () => window.removeEventListener("keydown", handleKeyDown)
}, [quoter.canGoNext, quoter.next])
```

Ensure the listener doesn't fire when the user is typing in a textarea (check `e.target` is not a textarea element).

### Step 4 — Verify

1. Run `npm run build`
2. Test at `http://localhost:3000/cotizador`:
   - Confirm there are now 6 sections instead of 7 (no contact-info step)
   - After answering all questions on a step, verify the Next button gets a visual highlight
   - Press Enter after completing a step — should advance to the next step
   - On the last step, Enter should show the estimate result

---

## Files Involved

### Modified
- `content/data/quoter-config.json` — remove `contact-info` section
- `components/quoter/quoter-form.tsx` — add button highlight + Enter key handler

---

## Acceptance Criteria

- [ ] The contact-info section (name, email, comments) is removed from the quoter
- [ ] The Next/Finish button visually highlights when all questions on the current step are answered
- [ ] Pressing Enter advances to the next step when all questions are answered
- [ ] Enter does not trigger advance when the user is typing in a textarea
- [ ] Build passes with no errors
