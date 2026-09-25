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
docs/applications/  → Per-company job descriptions and interview prep (gitignored)
docs/cover-letters/ → Cover letter sources, input to `generate:cover-letter` (gitignored except _template.md)
docs/cv/            → CV source content (curriculum.md gitignored, sample committed), generated PDFs (gitignored), AI drafts in docs/cv/drafts/ (gitignored)
docs/job-search/    → Job search strategy, pitch, source lists (gitignored)
docs/site/          → Portfolio site content notes (portfolio.md gitignored, sample committed)
tasks/            → Development task specs
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (`localhost:3000`) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `pnpm generate:cv` | Render every CV variant to PDF in `docs/cv/` |
| `pnpm generate:cv:job <posting.md>` | Tailor the English CV to a job posting with OpenAI `gpt-6-sol` (needs `OPENAI_API_KEY` in `.env`). Writes an editable draft to `docs/cv/drafts/<posting>.json`, then the PDF. Re-run after editing the draft to re-render without an API call; add `--regenerate` for a fresh draft. |

## Conventions

- Components are one-per-file, named `{section}-section.tsx`
- Content is data-driven: edit JSON in `content/data/` and `content/i18n/`, not hardcoded in components
- Site-wide config lives in `content/site.json`
- Use shadcn/ui components from `components/ui/` — add new ones via `npx shadcn@latest add <component>`
- Translations go in `content/i18n/` with one file per language
- Keep components focused on rendering; logic goes in `hooks/` or `lib/`

## Personal data

This repository is public. Names, phone numbers, addresses, emails and job-search material
never get committed. Contact details for the generated CV and cover letters live in
`content/data/cv-contact.json`, which is gitignored; `content/data/cv-contact.sample.json`
is the committed template. `scripts/cv-templates/shared.ts` falls back to the sample when
the real file is absent, so the generators still run on a fresh clone.
