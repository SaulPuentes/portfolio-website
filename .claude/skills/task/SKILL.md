# Skill: Create Task

Create a development task file in `tasks/` that documents the problem and plans the implementation for this Next.js portfolio website.

## When to use

When the user asks to create a task, plan, or spec for upcoming work.

## Steps

1. **Determine the next task number**
   - List `tasks/` and find the highest numeric prefix (e.g. `03-...` → next is `04`)
   - If `tasks/` doesn't exist, create it and start at `01`

2. **Gather context**
   - If the user hasn't specified a title or description, ask: "What should this task cover?"
   - Check `docs/development-guide.md` for conventions

3. **Create the task file**
   - Path: `tasks/{NN}-{kebab-case-title}.md`
   - Use the structure below — fill every section with real, specific content

4. **Confirm** — tell the user the file path and a one-line summary

---

## Task file structure

```markdown
# Task {NN} — {Title}

## Status: Pending

## Context

[1–3 paragraphs: current state, why this change is needed, constraints.]

---

## Plan

### Step 1 — {Action}

[Specific instructions with file paths and code snippets where useful.]

### Step N — Verify

1. Run `npm run build`
2. Test at `http://localhost:3000` — list pages/flows to check
3. Remove obsolete files if any

---

## Files Involved

### Modified
- `path/to/file` — what changes

### Added / Removed
- `path/to/file` — why

---

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
```

---

## Rules

- **Be specific** — exact file paths, component names, data keys
- **Be sequential** — steps executable in order
- **No filler** — every section has real content or is omitted
- **Status** starts as `Pending`
- Follow `{NN}-{kebab-case}` naming convention
