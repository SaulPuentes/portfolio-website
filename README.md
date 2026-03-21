# Portfolio Website

A multilingual, content-agnostic portfolio website template built with Next.js, React, Tailwind CSS, and shadcn/ui. All personal content is stored in JSON files — fork the repo and edit JSON to make it your own.

## Tech Stack

- **Framework:** Next.js 16 (static export)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **Icons:** Lucide React
- **Languages:** TypeScript
- **Deployment:** Static export (`out/` directory), works on any static host

## Quick Start

```bash
npm install
# Copy sample data files (required on first clone — originals are gitignored)
cp content/data/projects.sample.json content/data/projects.json
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

> **Note:** `projects.json` is gitignored to protect personal data. Use the `.sample.json` file as a template. `docs/curriculum.md` is also gitignored; use `docs/curriculum.sample.md` as a template when importing from LinkedIn.

## Customization

All content lives in the `content/` directory. Edit these JSON files to personalize the site:

### `content/site.json` — Personal Info & Site Config

Your identity, social links, locale settings, and CV file paths.

| Field | Description |
|-------|-------------|
| `name` | Your full name (used in hero section and footer) |
| `brandName` | Short name shown in the header navbar |
| `tagline` | Subtitle shown above your name in the hero |
| `email` | Contact email address |
| `footerNote` | Text shown on the right side of the footer |
| `socialLinks` | Array of `{ platform, label, url }` objects. Supported platforms: `linkedin`, `github` |
| `locales` | Available languages as `{ code, label, flag }` |
| `defaultLocale` | Default language code (e.g. `"en"`) |
| `cvFiles` | Map of locale code to CV PDF path (e.g. `{ "en": "/cv/CV_EN.pdf" }`) |

Place CV PDFs in `public/cv/`.

### `content/i18n/{en,es,de}.json` — UI Translations

Each file contains all translatable UI strings (nav labels, section titles, button text, descriptions). The structure must match the `Translations` interface in `lib/i18n/types.ts`.

### `content/data/projects.json` — Projects

Array of project entries with per-locale fields and a `detail` object:

```json
[
  {
    "id": "my-project",
    "image": "/projects/my-project.jpg",
    "name": { "en": "My Project", "es": "Mi Proyecto", "de": "Mein Projekt" },
    "description": { "en": "...", "es": "...", "de": "..." },
    "technologies": ["Next.js", "TypeScript"],
    "liveUrl": "https://example.com",
    "repoUrl": "https://github.com/user/repo",
    "featured": true,
    "detail": {
      "problem": { "en": "...", "es": "...", "de": "..." },
      "architecture": { "en": "...", "es": "...", "de": "..." },
      "decisions": { "en": "...", "es": "...", "de": "..." },
      "challenges": { "en": "...", "es": "...", "de": "..." },
      "results": { "en": "...", "es": "...", "de": "..." },
    }
  }
]
```

Place project images in `public/projects/`. The `liveUrl`, `repoUrl`, `image`, and `featured` fields are optional.

## Adding a New Language

1. Create a new translation file in `content/i18n/` (e.g. `fr.json`) following the same structure as `en.json`
2. Add the locale entry to `content/site.json` → `locales` array
3. Add the locale code to the `Locale` type union in `lib/i18n/types.ts`
4. Import and register the new JSON in `lib/i18n/index.ts`
5. Add the locale key to all `Record<Locale, string>` fields in `projects.json`
6. Add a CV file path in `content/site.json` → `cvFiles`

## Adding a Social Link Platform

The contact section maps `platform` values to Lucide icons. To add a new platform (e.g. Twitter):

1. Add the link to `content/site.json` → `socialLinks`
2. Add the icon mapping in `components/contact-section.tsx` → `platformIcons`

## Build & Deploy

```bash
npm run build
```

This generates a static export in the `out/` directory. Deploy it to any static hosting provider (Vercel, Netlify, GitHub Pages, etc.).

## Project Structure

```
content/                  # All editable content (JSON)
  site.json               # Personal info & config
  i18n/                   # UI translations per language
  data/                   # Projects data
components/               # React components
lib/                      # Utilities, types, i18n logic
  site-config.ts          # Typed accessor for site.json
  i18n/                   # i18n context, types, index
  data.ts                 # Data imports from JSON
  types.ts                # TypeScript interfaces
app/                      # Next.js app router
public/                   # Static assets (CV PDFs, project images)
```
