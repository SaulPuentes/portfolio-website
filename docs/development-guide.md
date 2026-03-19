# Development Guide

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **i18n:** Custom implementation (`content/i18n/`)

## Project Structure

```
app/              → Pages and layouts (App Router)
components/       → Section components (hero, about, projects, etc.)
components/ui/    → shadcn/ui primitives
content/data/     → JSON data files for sections
content/i18n/     → Translation files
content/site.json → Global site configuration
lib/              → Utilities and helpers
hooks/            → Custom React hooks
styles/           → Global styles
public/           → Static assets
docs/             → Documentation
tasks/            → Development task specs
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (`localhost:3000`) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

## Conventions

- Components are one-per-file, named `{section}-section.tsx`
- Content is data-driven: edit JSON in `content/data/` and `content/i18n/`, not hardcoded in components
- Site-wide config lives in `content/site.json`
- Use shadcn/ui components from `components/ui/` — add new ones via `npx shadcn@latest add <component>`
- Translations go in `content/i18n/` with one file per language
- Keep components focused on rendering; logic goes in `hooks/` or `lib/`
