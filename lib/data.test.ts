import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { projects, services } from "@/lib/data"
import en from "@/content/i18n/en.json"
import es from "@/content/i18n/es.json"
import de from "@/content/i18n/de.json"

test("every project image exists", () => {
  for (const p of projects)
    for (const src of [p.image, ...(p.gallery ?? [])].filter(Boolean))
      assert.ok(existsSync(`public${src}`), src)
})

test("every service key has copy in every locale", () => {
  for (const json of [en, es, de])
    for (const s of services) {
      const copy = (json.services as Record<string, { title?: string; description?: string }>)[s.key]
      assert.ok(copy?.title && copy?.description, s.key)
    }
})
