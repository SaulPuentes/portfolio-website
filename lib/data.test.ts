import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { clients, projects } from "@/lib/data"

test("randia sits right after evalor", () => {
  const ids = projects.map((p) => p.id)
  assert.equal(ids[ids.indexOf("evalor") + 1], "randia")
})

test("randia content", () => {
  const r = projects.find((p) => p.id === "randia")!
  assert.equal(r.liveUrl, "https://randia.mx")
  assert.deepEqual(r.technologies, ["WordPress", "PHP", "Tailwind CSS", "Leaflet"])
  assert.equal(r.image, "/projects/randia/shot-1.webp")
  assert.deepEqual(r.gallery, [1, 2, 3].map((n) => `/projects/randia/shot-${n}.webp`))
  for (const loc of ["es", "en", "de"] as const) {
    assert.equal(r.description[loc].length, 4)
    assert.ok(r.name[loc])
    // spec: never mention the number of lots, never credit Trust
    for (const p of r.description[loc]) assert.doesNotMatch(p, /\b45\b|lotes|\blots\b|grundstück|trust/i)
  }
})

test("every project image exists", () => {
  for (const p of projects)
    for (const src of [p.image, ...(p.gallery ?? [])].filter(Boolean))
      assert.ok(existsSync(`public${src}`), src)
})

test("client logos in the agreed order", () => {
  assert.deepEqual(clients.map((c) => c.name), [
    "Grupo Xcaret", "Galerías", "NordicTrack", "Simonett", "Uncommon Man", "Trust",
    "Salsa World", "Nouparc", "Evalor", "Twelve Thirty Four", "Grupo DAGS", "Randia",
  ])
  for (const c of clients)
    for (const src of [c.logo, c.logoDark].filter(Boolean)) assert.ok(existsSync(`public${src}`), src)
})
