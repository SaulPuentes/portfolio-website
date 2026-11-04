# Services Copy Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the four service descriptions (and the 03 title) on the portfolio with the user's new Spanish copy, plus matching English and German translations.

**Architecture:** Service copy lives only in `content/i18n/{es,en,de}.json` under `services.<key>.{title,description}`. `content/data/services.json` holds only `number` + `key` and does not change. Keys stay `planning`, `development`, `analysis`, `consulting` — renaming `analysis` would touch types and data for no visible gain.

**Tech Stack:** Next.js, JSON i18n dictionaries, `tsx --test`.

**Spec:** The user's request in this session (Spanish copy, verbatim below).

## Global Constraints

- Spanish copy is verbatim from the user — no rewording, keep accents and punctuation.
- Titles 01, 02, 04 keep their current text in all languages. Only 03's title changes.
- EN/DE are translations of the new Spanish copy, same tone (first person, addressed to the client: "you" / "Sie").
- Public repo: i18n files contain no personal data; no other files are touched.
- `content/i18n/*.json` already have unrelated unstaged edits on this branch — stage only the `services` hunks.

## Review Focus

- Invalid JSON after edit (stray quote/comma) → site fails to build. Covered by `pnpm build` in Step 3.
- Accented characters / `·` mangled by editor encoding → check with `git diff` in Step 2.
- Unrelated i18n edits swept into the commit → `git add -p` in Step 4.
- Description length change breaking the stacked mobile services layout → visual check in Step 3.

---

### Task 1: Replace services copy in all three dictionaries

**Files:**
- Modify: `content/i18n/es.json` (`services` block)
- Modify: `content/i18n/en.json` (`services` block)
- Modify: `content/i18n/de.json` (`services` block)

**Interfaces:**
- Consumes: none. `components/services-section.tsx` reads `services.<key>.title` / `.description`; shape unchanged.
- Produces: none.

- [ ] **Step 1: Set the copy**

`es.json`:

| key | title | description |
|---|---|---|
| planning | Estrategia y Arquitectura (unchanged) | Convierto tus objetivos de negocio en soluciones digitales bien definidas. Te ayudo a planificar funcionalidades, elegir tecnologías y diseñar la estructura de tu producto antes de desarrollarlo. |
| development | Desarrollo Full Stack (unchanged) | Desarrollo aplicaciones web, plataformas internas y sitios web a medida. Creo soluciones rápidas, escalables y adaptadas a las necesidades de tu negocio, desde la idea inicial hasta su lanzamiento. |
| analysis | Inteligencia Artificial y Automatización | Implemento soluciones de IA que ahorran tiempo y simplifican procesos. Desde chatbots que responden preguntas y atienden clientes hasta automatizaciones que conectan tus herramientas y reducen tareas manuales. |
| consulting | Consultoría Técnica y Auditoría (unchanged) | Evalúo tus sistemas y sitios web para detectar problemas de rendimiento, seguridad y mantenimiento. Te propongo mejoras concretas para optimizar tus recursos y preparar tu tecnología para crecer. |

`en.json`:

| key | title | description |
|---|---|---|
| planning | (unchanged) | I turn your business goals into well-defined digital solutions. I help you plan features, choose technologies, and design your product's structure before it gets built. |
| development | (unchanged) | I build custom web applications, internal platforms, and websites. I create fast, scalable solutions tailored to your business needs, from the initial idea to launch. |
| analysis | AI & Automation | I implement AI solutions that save time and simplify processes. From chatbots that answer questions and serve customers to automations that connect your tools and cut manual work. |
| consulting | (unchanged) | I evaluate your systems and websites to detect performance, security, and maintenance issues. I propose concrete improvements to optimize your resources and get your technology ready to grow. |

`de.json`:

| key | title | description |
|---|---|---|
| planning | (unchanged) | Ich verwandle Ihre Geschäftsziele in klar definierte digitale Lösungen. Ich helfe Ihnen, Funktionen zu planen, Technologien auszuwählen und die Struktur Ihres Produkts zu entwerfen, bevor es entwickelt wird. |
| development | (unchanged) | Ich entwickle maßgeschneiderte Webanwendungen, interne Plattformen und Websites. Ich schaffe schnelle, skalierbare Lösungen, die auf die Bedürfnisse Ihres Unternehmens zugeschnitten sind, von der ersten Idee bis zum Launch. |
| analysis | KI & Automatisierung | Ich setze KI-Lösungen um, die Zeit sparen und Prozesse vereinfachen. Von Chatbots, die Fragen beantworten und Kunden betreuen, bis zu Automatisierungen, die Ihre Tools verbinden und manuelle Aufgaben reduzieren. |
| consulting | (unchanged) | Ich bewerte Ihre Systeme und Websites, um Probleme bei Performance, Sicherheit und Wartung zu erkennen. Ich schlage konkrete Verbesserungen vor, um Ihre Ressourcen zu optimieren und Ihre Technologie auf Wachstum vorzubereiten. |

- [ ] **Step 2: Validate JSON and diff**

Run: `for l in es en de; do node -e "JSON.parse(require('fs').readFileSync('content/i18n/$l.json','utf8'))" && echo ok $l; done; git diff content/i18n`
Expected: `ok es`, `ok en`, `ok de`; diff shows only the 4 descriptions + 1 title per file changed in `services` (plus the pre-existing unrelated hunks), accents intact.

- [ ] **Step 3: Build and eyeball**

Run: `pnpm test && pnpm build`
Expected: tests pass, build succeeds. Then `pnpm dev`, check Services section in `/es`, `/en`, `/de` at desktop and ~375px width: 03 shows the new title, no text overflow.

- [ ] **Step 4: Commit only the services hunks**

```bash
git add -p content/i18n/es.json content/i18n/en.json content/i18n/de.json   # accept services hunks only
git diff --cached -U0 | grep -inE '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\+[0-9][0-9 ()-]{8,}'   # expect no output
git commit -m "Refresh services copy and refocus 03 on AI and automation"
```
