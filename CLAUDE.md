# CLAUDE.md

## This repository is public

`github.com/SaulPuentes/portfolio-website` is a public repo. Anything committed is public
forever, including in history after a later deletion.

**Never commit personal or third-party personal information.** Before staging anything:

- No phone numbers, home or street addresses, private email addresses, national IDs,
  dates of birth, salary figures or salary expectations.
- No job-search material: interview prep, per-company notes, recruiter lists, pitch scripts,
  cover letters with real content, gap or weakness analyses.
- No third-party documents (recruiter spreadsheets, job-board exports, client files) — they
  carry other people's names and are usually not ours to publish.
- No client or employer detail that is not already on the public portfolio site.

**Where personal data belongs instead:** a gitignored file with a committed `*.sample.*`
twin. Code reads the real file and falls back to the sample so a fresh clone still builds.

Current gitignored personal sources:

| File / directory | Committed template |
|---|---|
| `content/site.json` | `content/site.sample.json` |
| `content/data/cv-contact.json` | `content/data/cv-contact.sample.json` |
| `content/data/projects.json`, `skills.json`, `services.json`, `experiences.json` | matching `*.sample.json` |
| `docs/cv/curriculum.md` | `docs/cv/curriculum.sample.md` |
| `docs/site/portfolio.md` | `docs/site/portfolio.sample.md` |
| `docs/cover-letters/*.md` | `docs/cover-letters/_template.md` |
| `docs/applications/`, `docs/job-search/` | none — never committed |
| `public/*-CV-*.pdf`, `out/` | none — generated |

**Before every commit,** scan the staged diff for personal data:

```bash
git diff --cached -U0 | grep -inE '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\+[0-9][0-9 ()-]{8,}'
```

Placeholders (`example.com`, `+00 000 000 0000`) are fine. Real values are not — move them
to a gitignored file instead.
