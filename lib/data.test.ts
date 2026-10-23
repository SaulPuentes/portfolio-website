import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { projects } from "@/lib/data"

test("every project image exists", () => {
  for (const p of projects)
    for (const src of [p.image, ...(p.gallery ?? [])].filter(Boolean))
      assert.ok(existsSync(`public${src}`), src)
})
