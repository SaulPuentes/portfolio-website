import { test } from "node:test"
import assert from "node:assert/strict"
import type { Project } from "./types"
import {
  advance,
  progress,
  projectImages,
  selectProject,
  slideMs,
  splitProjectName,
  stripCards,
  wrap,
  stepTarget,
} from "./showcase"

const counts = [3, 1, 0]
const t0 = { project: 0, slide: 0, elapsedMs: 0 }

test("slide time is 3s, or 6s for one image or none", () => {
  assert.equal(slideMs(3), 3000)
  assert.equal(slideMs(1), 6000)
  assert.equal(slideMs(0), 6000)
})

test("advance moves through slides, then to the next project, then wraps", () => {
  assert.deepEqual(advance(t0, 1000, counts), { project: 0, slide: 0, elapsedMs: 1000 })
  assert.deepEqual(advance({ ...t0, elapsedMs: 2999 }, 1, counts), { project: 0, slide: 1, elapsedMs: 0 })
  assert.deepEqual(advance({ project: 0, slide: 2, elapsedMs: 2999 }, 1, counts), { project: 1, slide: 0, elapsedMs: 0 })
  assert.deepEqual(advance({ project: 2, slide: 0, elapsedMs: 5999 }, 1, counts), { project: 0, slide: 0, elapsedMs: 0 })
})

test("a huge time jump moves one step at most", () => {
  assert.deepEqual(advance(t0, 600_000, counts), { project: 0, slide: 1, elapsedMs: 0 })
})

test("one project restarts instead of changing", () => {
  assert.deepEqual(advance({ project: 0, slide: 0, elapsedMs: 5999 }, 1, [1]), { project: 0, slide: 0, elapsedMs: 0 })
})

test("a project with no images still advances", () => {
  assert.equal(advance({ project: 2, slide: 0, elapsedMs: 5999 }, 1, counts).project, 0)
})

test("progress spans the whole project", () => {
  assert.equal(progress({ project: 0, slide: 1, elapsedMs: 1500 }, counts), 0.5)
  assert.equal(progress({ project: 1, slide: 0, elapsedMs: 3000 }, counts), 0.5)
})

test("selectProject starts a new project, and leaves the current one alone", () => {
  assert.deepEqual(selectProject({ project: 0, slide: 2, elapsedMs: 500 }, 1), { project: 1, slide: 0, elapsedMs: 0 })
  const same = { project: 1, slide: 0, elapsedMs: 500 }
  assert.equal(selectProject(same, 1), same)
})

test("splitProjectName", () => {
  assert.deepEqual(splitProjectName("Evalor — Corporate Website"), { title: "Evalor", kind: "Corporate Website" })
  assert.deepEqual(splitProjectName("No Dash"), { title: "No Dash" })
})

test("stripCards doubles the list and marks the copies", () => {
  assert.deepEqual(stripCards(2), [
    { index: 0, duplicate: false },
    { index: 1, duplicate: false },
    { index: 0, duplicate: true },
    { index: 1, duplicate: true },
  ])
})

test("projectImages prefers gallery, then image, then nothing", () => {
  const base = { id: "x", name: {}, description: {}, technologies: [] } as unknown as Project
  assert.deepEqual(projectImages({ ...base, gallery: ["/a"], image: "/b" }), ["/a"])
  assert.deepEqual(projectImages({ ...base, gallery: [], image: "/b" }), ["/b"])
  assert.deepEqual(projectImages(base), [])
})

test("wrap folds any strip offset into one loop", () => {
  assert.equal(wrap(250, 100), 50)
  assert.equal(wrap(-10, 100), 90)
  assert.equal(wrap(0, 100), 0)
})

test("stepTarget moves one card from the nearest card edge", () => {
  assert.equal(stepTarget(130, 100, 1), 200)
  assert.equal(stepTarget(149, 100, -1), 0)
  assert.equal(stepTarget(-100, 100, -1), -200)
})
