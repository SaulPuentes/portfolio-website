# Task 18 — URL-based Locale Preselection & Styles Reorganization

## Status: Pending

## Context

Currently the portfolio determines the active language exclusively from `localStorage` (key `"portfolio-locale"`). There is no way to share a link that opens the site in a specific language — useful for sending a Spanish version to a client or a German version to a recruiter.

The goal is to support two mechanisms, in priority order:

1. **Query parameter** — `?lang=es` (simplest, no routing changes).
2. **Dynamic slug** — `/es`, `/de`, `/en` (cleaner URLs, better SEO).

Because the app currently uses a flat route structure (`/` and `/cotizador`) with client-side i18n via React Context, the least invasive approach is to read the locale from the URL on first load and feed it into the existing `I18nProvider`. Both mechanisms can coexist: the slug takes priority, then the query param, then localStorage, then `defaultLocale`.

---

## Plan

### Step 0 — Move `/styles` folder into `app/` and consolidate CSS

1. Move `styles/scroll-carousel.css` → `app/styles/scroll-carousel.css`.
2. Move `app/globals.css` → `app/styles/globals.css`.
3. Update the import in `app/layout.tsx`: change `'./globals.css'` → `'./styles/globals.css'`.
4. Update the import in `components/scroll-carousel.tsx`: change `"@/styles/scroll-carousel.css"` → `"@/app/styles/scroll-carousel.css"`.
5. Delete the now-empty `styles/` folder at the project root.

### Step 1 — Add locale extraction utility

Create `lib/i18n/url-locale.ts` with a function `getLocaleFromUrl()` that:

- Checks `window.location.pathname` for a leading `/{locale}` segment matching a valid locale code.
- Falls back to checking `URLSearchParams` for a `lang` param.
- Returns the matched `Locale` or `null`.

### Step 2 — Update `I18nProvider` to consume URL locale

In `lib/i18n/context.tsx`:

- Import and call `getLocaleFromUrl()` inside the existing `useEffect`.
- Priority chain: URL slug → `?lang` param → localStorage → `defaultLocale`.
- When a URL locale is detected, also persist it to localStorage so subsequent navigation keeps the language.

### Step 3 — Add Next.js dynamic route for locale slug

Create `app/[locale]/page.tsx`:

- Accept `params.locale`, validate it against the known locale list.
- If invalid, redirect to `/` (use `notFound()` or `redirect`).
- Render the same `<Home />` content (extract shared layout into a component or re-export).

Do the same for the quoter: create `app/[locale]/cotizador/page.tsx` mirroring `app/cotizador/page.tsx`.

### Step 4 — Update internal links

In `components/header.tsx` and any other navigation components, ensure links respect the current locale prefix when one is active. For example, the quoter link should point to `/${locale}/cotizador` when navigating from `/${locale}`.

### Step 5 — Update `<html lang>` attribute

In `app/layout.tsx`, the `lang="en"` is hardcoded. Since the locale is determined client-side, keep the existing `document.documentElement.lang = newLocale` logic in the provider — no server-side change needed, but verify it fires on first load with the URL locale.

### Step 6 — Verify

1. Run `npm run build` — no errors.
2. Test `http://localhost:3000/?lang=es` → site loads in Spanish.
3. Test `http://localhost:3000/de` → site loads in German.
4. Test `http://localhost:3000/de/cotizador` → quoter loads in German.
5. Test invalid slug `http://localhost:3000/fr` → redirects to `/` or 404.
6. Verify language switcher still works and updates the URL/localStorage.
7. Verify that refreshing the page preserves the language.

---

## Files Involved

### Modified
- `app/layout.tsx` — update globals.css import path
- `components/scroll-carousel.tsx` — update scroll-carousel.css import path
- `lib/i18n/context.tsx` — read locale from URL before falling back to localStorage
- `components/header.tsx` — prefix links with locale slug when active
- `app/page.tsx` — extract shared home content for reuse

### Moved
- `styles/scroll-carousel.css` → `app/styles/scroll-carousel.css`
- `app/globals.css` → `app/styles/globals.css`

### Removed
- `styles/` (root-level folder, now empty)

### Added
- `lib/i18n/url-locale.ts` — URL locale extraction utility
- `app/[locale]/page.tsx` — dynamic locale route for homepage
- `app/[locale]/cotizador/page.tsx` — dynamic locale route for quoter

---

## Acceptance Criteria

- [ ] Visiting `/?lang=es` loads the site in Spanish
- [ ] Visiting `/de` loads the site in German
- [ ] Visiting `/en/cotizador` loads the quoter in English
- [ ] Invalid locale slugs redirect or 404 gracefully
- [ ] Language switcher updates the URL to reflect the new locale
- [ ] Selected language persists across page refreshes
- [ ] `styles/` folder no longer exists at project root; all CSS lives under `app/styles/`
- [ ] `npm run build` passes without errors
