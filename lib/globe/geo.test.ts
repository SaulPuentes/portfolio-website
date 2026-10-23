import { test } from "node:test"
import assert from "node:assert/strict"
import { CAPITALS, MAX_ARC_ANGLE, isLand, latLonToUnit, pickArcPair } from "./geo"

type Vec = { x: number; y: number; z: number }

function close(a: Vec, b: Vec) {
  for (const k of ["x", "y", "z"] as const) assert.ok(Math.abs(a[k] - b[k]) <= 1e-9, `${k}: ${a[k]} vs ${b[k]}`)
}

// Tiny LCG so the arc test is reproducible.
function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

// Great-circle angle in radians between two [lat, lon] pairs.
function angle(a: readonly [number, number], b: readonly [number, number]) {
  const p = latLonToUnit(a[0], a[1]), q = latLonToUnit(b[0], b[1])
  const dot = Math.min(1, Math.max(-1, p.x * q.x + p.y * q.y + p.z * q.z))
  return Math.acos(dot)
}

test("latLonToUnit axes", () => {
  close(latLonToUnit(0, 0), { x: 0, y: 0, z: 1 }); close(latLonToUnit(90, 0), { x: 0, y: 1, z: 0 }); close(latLonToUnit(0, 90), { x: 1, y: 0, z: 0 })
})
test("land mask knows continents from oceans", () => {
  for (const [lat, lon] of [[19.43, -99.13], [23, 13], [-15.79, -47.88], [55.76, 37.62]]) assert.ok(isLand(lat, lon))
  for (const [lat, lon] of [[0, -150], [30, -40], [-30, 80]]) assert.ok(!isLand(lat, lon))
})
test("22 capitals", () => assert.equal(CAPITALS.length, 22))
test("arc pairs are distinct and never wrap behind the globe", () => {
  const rnd = seeded(42) // test-file helpers: seeded (tiny LCG), close (±1e-9 per axis), angle (great-circle radians)
  for (let k = 0; k < 2000; k++) { const [i, j] = pickArcPair(rnd); assert.notEqual(i, j); assert.ok(angle(CAPITALS[i], CAPITALS[j]) <= MAX_ARC_ANGLE) }
})
