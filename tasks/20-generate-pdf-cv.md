# Task 20 — Generate PDF CV from Curriculum Data

## Status: Done

## Context

The file `docs/curriculum.md` contains the full CV/resume content. The script must generate **two CV variants** from the same data:

1. **Tech/ATS variant** (`public/cv-tech.pdf`) — single-column, ATS-friendly, optimized for Full Stack Developer / Solutions Engineer roles in US/international markets. **1 page target**.
2. **German Lebenslauf variant** (`public/cv-de.pdf`) — structured/traditional, two-column with sidebar for personal info, optimized for the German market. **Up to 2 pages allowed**.

The script runs via pnpm and outputs both PDFs.

---

## Variant 1 — Tech / ATS Layout (single column, 1 page)

ATS-safe: single column, no tables, no graphics. Clean, scannable by recruiters and tracking systems.

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  SAÚL PUENTES                                   │
│  Senior Full Stack Developer | Solutions Eng.   │
│  saul.puentess@gmail.com · +52 812 401 8274     │
│  LinkedIn · GitHub · Portfolio                  │
│                                                 │
│  ═══════════════════════════════════════════     │
│  PROFESSIONAL SUMMARY                           │
│  3-4 lines focused on impact & results.         │
│  Emphasize business-to-tech bridge, not just    │
│  ticket-taking. Mention scale & platforms.      │
│                                                 │
│  ═══════════════════════════════════════════     │
│  SKILLS                                         │
│  Frontend: React, Next.js, Tailwind CSS,        │
│            React Native                         │
│  Backend & CMS: Node.js, NestJS, Payload CMS,  │
│                 Shopify (Liquid/APIs), WordPress │
│  Tools/Arch: AWS (Lambda, Cognito, S3, DynamoDB)│
│              Docker, REST/GraphQL, MongoDB       │
│                                                 │
│  ═══════════════════════════════════════════     │
│  EXPERIENCE                                     │
│  ────────────                                   │
│  Freelance Software Developer                   │
│  Apr 2025 – Present                             │
│  • STAR-format bullets (result-oriented)        │
│  • Connect business needs → technical solution  │
│                                                 │
│  Orium — Full Stack Developer                   │
│  Oct 2025 – Feb 2026                            │
│                                                 │
│  Gluo — Full Stack Developer                    │
│  Jul 2024 – Apr 2025                            │
│  • Built nationwide mall platform (galerias.com)│
│  • NordicTrack e-commerce redesign              │
│                                                 │
│  Blue People — Full Stack Developer             │
│  Apr 2023 – Jun 2024                            │
│  • Led serverless SaaS logistics platform       │
│  • React Native apps published to stores        │
│                                                 │
│  Enroute — Full Stack Developer                 │
│  Jan 2021 – Mar 2023                            │
│  • VMware global validation system redesign     │
│                                                 │
│  (Helicon + Grupo 4S condensed to 1-2 lines)    │
│                                                 │
│  ═══════════════════════════════════════════     │
│  EDUCATION                                      │
│  UANL — Ing. en Tecnologías de Software        │
│  2015 – 2020                                    │
│                                                 │
│  CERTIFICATIONS                                 │
│  MongoDB Developer 2022 · EF SET C2 · Rails     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tech variant rules

- **Single column** — no sidebar, no tables (ATS-safe)
- **Font**: Inter, Roboto, or system sans-serif. 9–10pt body, 14pt name, 11pt headings
- **Colors**: minimal — dark gray text (`#333`), subtle accent for lines (`#2563eb`)
- **Margins**: 20mm top/bottom, 18mm sides
- **Skills grouped** by category (Frontend / Backend & CMS / Tools & Architecture)
- **Experience bullets**: STAR method — emphasize results and business impact, not just tasks
- **Solutions Engineer angle**: highlight connecting business needs with technical solutions
- **Lots of whitespace** — minimalism = logical order
- **1 page strict** — condense older roles (Helicon, Grupo 4S) to 1 line each

---

## Variant 2 — German Lebenslauf Layout (two-column, up to 2 pages)

Traditional German format. Structured, rigorous, with detailed personal info.

```
┌─────────────────────────────────────────────────┐
│  PAGE 1                                         │
│                                                 │
│  ┌──────────────┬──────────────────────────────┐│
│  │  SIDEBAR     │  MAIN COLUMN                 ││
│  │  (30%)       │  (70%)                       ││
│  │              │                              ││
│  │  [Photo]     │  SAÚL PUENTES                ││
│  │  (optional)  │  Full Stack Developer        ││
│  │              │  ════════════════════        ││
│  │  Personal    │                              ││
│  │  ─────────   │  BERUFSERFAHRUNG             ││
│  │  Birth date  │  (Professional Experience)   ││
│  │  Nationality │  ────────────                ││
│  │  Phone       │  Freelance Developer         ││
│  │  Email       │  Apr 2025 – Present          ││
│  │  LinkedIn    │  • bullet 1                  ││
│  │  GitHub      │  • bullet 2                  ││
│  │              │                              ││
│  │  Sprachen    │  Orium                       ││
│  │  (Languages) │  Full Stack Developer        ││
│  │  ─────────   │  Oct 2025 – Feb 2026        ││
│  │  Español:    │                              ││
│  │   Mutterspr. │  Gluo                        ││
│  │  English:    │  Full Stack Developer        ││
│  │   C2 (EF SET)│  Jul 2024 – Apr 2025        ││
│  │  Deutsch:    │  • bullet 1 ...             ││
│  │   A1/A2      │                              ││
│  │              │  Blue People                 ││
│  │  Skills      │  Full Stack Developer        ││
│  │  ─────────   │  Apr 2023 – Jun 2024        ││
│  │  React       │  • bullet 1 ...             ││
│  │  Next.js     │                              ││
│  │  Node.js     │  Enroute                     ││
│  │  AWS         │  Full Stack Developer        ││
│  │  Docker      │  Jan 2021 – Mar 2023        ││
│  │  Shopify     │  • bullet 1 ...             ││
│  │  ...         │                              ││
│  │              │  Helicon                     ││
│  │  Zertifikate │  May 2019 – Nov 2020        ││
│  │  ─────────   │  • bullet 1 ...             ││
│  │  MongoDB     │                              ││
│  │  EF SET C2   │  Grupo 4S                    ││
│  │  AWS (*)     │  Feb 2018 – Apr 2019        ││
│  │  Shopify (*) │  • bullet 1 ...             ││
│  │              │                              ││
│  │  Ausbildung  │                              ││
│  │  (Education) │                              ││
│  │  ─────────   │                              ││
│  │  UANL        │                              ││
│  │  Ing. TecSw  │                              ││
│  │  2015-2020   │                              ││
│  └──────────────┴──────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

### Lebenslauf rules

- **Two-column**: sidebar (30%) + main content (70%)
- **Sidebar** holds: optional photo placeholder, personal info (birth date, nationality), languages (with CEFR levels), skills, certifications, education
- **Main column** holds: name/title header, all experience in strict reverse chronological order — **no gaps**
- **Languages section is crucial**: Español (Muttersprache), English C2 (EF SET), Deutsch A1/A2 (Grundkenntnisse)
- **Certifications prominent**: MongoDB, EF SET, any AWS/Shopify certs get highlighted
- **Font**: system sans-serif, 9–10pt body, 14pt name, 11pt section headings
- **Colors**: dark gray text (`#333`), accent (`#2563eb`), light sidebar bg (`#f8f9fa`)
- **Margins**: 15mm all sides
- **All roles included** with full bullets (no condensing) — 2 pages allowed
- **Photo**: include an `<img>` placeholder with configurable path (e.g. `scripts/photo.jpg`)

---

## Comparison

| Feature | Tech/ATS | Lebenslauf |
|---|---|---|
| Columns | Single | Two (sidebar) |
| Pages | 1 strict | Up to 2 |
| Photo | No | Optional placeholder |
| Skills | Grouped by category | List in sidebar |
| Languages | Not emphasized | CEFR levels, prominent |
| Experience | Result-focused (STAR) | Complete, no gaps |
| Certifications | Footer | Sidebar, prominent |

---

## Plan

### Step 1 — Install dependencies

```bash
pnpm add -D puppeteer
```

### Step 2 — Define template configuration

Create `scripts/cv-templates/config.ts` — a typed config object that controls visual and structural options per variant. Each template reads from this config instead of hardcoding values.

```ts
// scripts/cv-templates/config.ts

export interface TemplateConfig {
  font: string;           // e.g. 'Inter, Roboto, sans-serif'
  bodySize: string;       // e.g. '9.5pt'
  nameSize: string;       // e.g. '14pt'
  headingSize: string;    // e.g. '11pt'
  colorText: string;      // e.g. '#333333'
  colorAccent: string;    // e.g. '#2563eb'
  colorSidebarBg: string; // e.g. '#f8f9fa' (Lebenslauf only)
  marginTop: string;
  marginSide: string;
  photoPath: string | null; // null = omit photo block
}

export const techConfig: TemplateConfig = {
  font: 'Inter, Roboto, sans-serif',
  bodySize: '9.5pt',
  nameSize: '14pt',
  headingSize: '11pt',
  colorText: '#333333',
  colorAccent: '#2563eb',
  colorSidebarBg: 'transparent',
  marginTop: '20mm',
  marginSide: '18mm',
  photoPath: null,
};

export const lebenslaufConfig: TemplateConfig = {
  font: 'Inter, Roboto, sans-serif',
  bodySize: '9.5pt',
  nameSize: '14pt',
  headingSize: '11pt',
  colorText: '#333333',
  colorAccent: '#2563eb',
  colorSidebarBg: '#f8f9fa',
  marginTop: '15mm',
  marginSide: '15mm',
  photoPath: 'scripts/photo.jpg', // set to null to skip photo
};
```

Both templates accept a `config` parameter so callers can override defaults without touching template logic.

### Step 3 — Create the CV HTML templates

Create `scripts/cv-templates/tech.ts` — single-column ATS layout with:
- No tables/grids (pure block flow for ATS)
- Skills grouped by category
- STAR-method experience bullets
- Condensed older roles
- Accepts `Partial<TemplateConfig>` to override `techConfig` defaults

Create `scripts/cv-templates/lebenslauf.ts` — two-column German layout with:
- CSS Grid for sidebar + main
- Languages section with CEFR levels
- Photo placeholder (controlled by `config.photoPath`)
- Personal info section (birth date, nationality)
- All roles with full detail
- Accepts `Partial<TemplateConfig>` to override `lebenslaufConfig` defaults

Create `scripts/cv-templates/shared.ts` — shared CV data object extracted from `docs/curriculum.md` content (contact, experience entries, skills, certs, education).

### Step 4 — Create the PDF generation script

Create `scripts/generate-cv.ts` that:

1. Accepts an optional `--variant` flag: `tech`, `de`, or `all` (default: `all`)
2. Imports the appropriate template(s)
3. Launches Puppeteer headless
4. For each variant: sets HTML, generates PDF with `page.pdf({ format: 'A4', printBackground: true })`
5. Saves to `public/cv-tech.pdf` and/or `public/cv-de.pdf`

### Step 5 — Add pnpm scripts

In `package.json`:

```json
"generate:cv": "pnpm tsx scripts/generate-cv.ts",
"generate:cv:tech": "pnpm tsx scripts/generate-cv.ts --variant tech",
"generate:cv:de": "pnpm tsx scripts/generate-cv.ts --variant de"
```

### Step 6 — Verify

1. Run `pnpm generate:cv`
2. Open `public/cv-tech.pdf` — confirm single column, 1 page, ATS-friendly
3. Open `public/cv-de.pdf` — confirm two-column, languages, all roles, max 2 pages
4. Verify both have correct content from `docs/curriculum.md`

---

## Files Involved

### Added
- `scripts/generate-cv.ts` — main script with `--variant` flag
- `scripts/cv-templates/config.ts` — typed `TemplateConfig` interface and per-variant defaults (`techConfig`, `lebenslaufConfig`)
- `scripts/cv-templates/tech.ts` — ATS single-column template (accepts `Partial<TemplateConfig>`)
- `scripts/cv-templates/lebenslauf.ts` — German two-column template (accepts `Partial<TemplateConfig>`)
- `scripts/cv-templates/shared.ts` — shared CV data

### Modified
- `package.json` — add `generate:cv`, `generate:cv:tech`, `generate:cv:de` scripts and `puppeteer` dev dependency

---

## Acceptance Criteria

- [ ] `pnpm generate:cv` produces both `public/cv-tech.pdf` and `public/cv-de.pdf`
- [ ] Tech variant: single column, ATS-safe, 1 page, skills grouped by category, STAR bullets
- [ ] Lebenslauf variant: two-column sidebar, languages with CEFR, all roles listed, max 2 pages
- [ ] Both variants include all data from `docs/curriculum.md`
- [ ] Both PDFs are A4, cleanly styled, print-friendly
- [ ] `--variant tech` and `--variant de` flags generate only the specified variant
- [ ] Script re-runnable to regenerate when data changes
- [ ] Template visual options (font, colors, margins, photo path) are controlled via `config.ts` — no hardcoded values in templates
- [ ] Overriding a single config value (e.g. `colorAccent`) does not require touching template logic
