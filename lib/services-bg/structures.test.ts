import assert from "node:assert/strict"
import { test } from "node:test"
import { MOVERS, STRUCTURES, bob, fit, float, type Cell } from "./structures"

const cell = (x: number, y: number, blocked: Cell["blocked"]): Cell => ({ rect: { x, y, w: 608, h: 300 }, blocked })
const copy = (x: number, y: number) => [
  { x: x + 40, y: y + 40, w: 450, h: 160 },
  { x: x + 450, y: y + 24, w: 130, h: 112 },
]

test("every structure lands inside its cell and clear of the copy and number", () => {
  const cells = [[0, 0], [608, 0], [0, 300], [608, 300]].map(([x, y]) => cell(x, y, copy(x, y)))
  const r = fit(cells)!
  assert.ok(r.pitch >= 9)
  r.boxes.forEach((boxes, i) => {
    const o = r.origins[i], { rect, blocked } = cells[i]
    for (const b of boxes) {
      const x = o.x + b.x * r.pitch, y = o.y + b.y * r.pitch, w = b.w * r.pitch, h = b.h * r.pitch
      assert.ok(x >= rect.x && y >= rect.y && x + w <= rect.x + rect.w && y + h <= rect.y + rect.h)
      for (const q of blocked)
        assert.ok(x + w <= q.x || x >= q.x + q.w || y + h <= q.y || y >= q.y + q.h, `structure ${i} overlaps`)
    }
  })
})

test("the four structures read at a similar size", () => {
  const { boxes } = fit([0, 1, 2, 3].map(() => cell(0, 0, [])))!
  const extent = (pick: (b: Cell["rect"]) => [number, number]) =>
    boxes.map((bs) => Math.max(...bs.map((b) => pick(b)[1])) - Math.min(...bs.map((b) => pick(b)[0])))
  for (const sizes of [extent((b) => [b.x, b.x + b.w]), extent((b) => [b.y, b.y + b.h])])
    assert.ok(Math.max(...sizes) / Math.min(...sizes) < 1.35, sizes.join(" "))
})

test("a cell with no free room draws nothing rather than overlapping", () => {
  const full = { x: 0, y: 0, w: 608, h: 300 }
  assert.equal(fit([cell(0, 0, [full])], [STRUCTURES[0]]), null)
})

test("hover motion is zero at rest, so it can start and end at any moment", () => {
  for (const t of [0, 1.3, 7.9]) {
    const { lift, yaw } = float(t, 0)
    assert.equal(Math.abs(lift) + Math.abs(yaw), 0)
  }
})

test("card 01's capstone never touches the pyramid at the bottom of its bob", () => {
  const solid = STRUCTURES[0].filter((b) => !b.drift)
  const cap = STRUCTURES[0].filter((b) => b.drift)
  assert.equal(cap.length, 4)
  const top = Math.max(...solid.map((b) => b.y + b.h))
  assert.ok(cap[0].y - cap[0].idle! - cap[0].drift! > top)
})

test("card 01 keeps all its cubes, scaled as one, and its cap clears the top tier on screen", () => {
  const [pyramid] = STRUCTURES
  assert.equal(pyramid.length, 7 * 7 + 5 * 5 + 3 * 3 + 2 * 2)
  const k = pyramid[0].w!
  assert.ok(k < 1 && pyramid.every((b) => b.w === k && Math.abs(b.h - 0.92 * k) < 1e-9))
  // Screen y grows downward: the cap's nearest low corner must stay above the tier's far top corner.
  const screenY = (x: number, y: number, z: number) => (x + z) * 0.3939 - y * 0.8304
  const half = 0.46 * k
  const solid = pyramid.filter((b) => !b.drift), cap = pyramid.filter((b) => b.drift)
  const tier = Math.min(...solid.filter((b) => b.y === Math.max(...solid.map((s) => s.y))).map((b) => b.x))
  const top = Math.max(...solid.map((b) => b.y + b.h))
  const far = screenY(tier - half, top, tier - half)
  const near = Math.max(...cap.map((b) => screenY(b.x + half, b.y - b.idle! - b.drift!, b.z + half)))
  assert.ok(near < far, `${near} ${far}`)
})

test("only the loose upper pieces of card 01 bob", () => {
  const loose = STRUCTURES.map((s) => s.filter((b) => b.drift).length)
  assert.ok(loose[0] > 0)
  assert.equal(loose[1] + loose[2] + loose[3], 0)
  assert.equal(bob(STRUCTURES[1][0], 2, 1), 0)
})

test("the production line turns cubes blue at the press, and the press comes down for them", () => {
  const line = MOVERS[2]
  let lowest = Infinity, highest = -Infinity
  for (let tau = 0; tau < 30; tau += 0.05) {
    const parts = line(tau), press = parts[parts.length - 1]
    assert.equal(parts.length, 4)
    lowest = Math.min(lowest, press.y)
    highest = Math.max(highest, press.y)
    for (const p of parts.slice(0, -1)) {
      if (p.x < 3.5) assert.equal(p.ink, 0)
      if (p.x > 4.3) assert.equal(p.ink, 1)
      assert.ok(p.s >= 0 && p.s <= 1)
    }
  }
  assert.ok(highest - lowest > 0.8)
})

test("card 04's samples fill the block's holes and only the last one shows blue", () => {
  const home = (tau: number) => MOVERS[3](tau).map((p) => `${p.x},${p.z},${Math.round(p.y / 0.96)}`)
  const solid = STRUCTURES[3].map((b) => `${b.x},${b.z},${Math.round(b.y / 0.96)}`)
  const cells = [...home(0), ...solid]
  assert.equal(new Set(cells).size, 6 * 6 * 3) // closed, the block has no gap and no doubled cube

  const blue = new Set<number>(), raised = new Set<number>()
  for (let tau = 0; tau < 15; tau += 0.05) {
    const parts = MOVERS[3](tau)
    parts.forEach((p, i) => {
      if (p.ink > 0) blue.add(Math.floor(i / 12))
      if (p.y > 3) raised.add(Math.floor(i / 12))
    })
  }
  assert.deepEqual([...blue], [2])
  assert.deepEqual([...raised].sort(), [0, 1, 2])
  assert.deepEqual(home(15), home(0)) // the loop closes without a jump
})
