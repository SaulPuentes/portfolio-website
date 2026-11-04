import { test } from "node:test"
import assert from "node:assert/strict"
import { pickLinks } from "./sky"

test("pickLinks keeps only short links between lit stars, at most two per star, shortest first", () => {
  // A tight cluster of 6 lit stars (every pair in range) plus one unlit star in the middle
  const pts = [[0, 0], [0.3, 0], [0.6, 0], [0, 0.3], [0.3, 0.3], [0.6, 0.3], [0.15, 0.15]].map(([x, y]) => ({ x, y }))
  const w = [1, 1, 1, 1, 1, 1, 0]
  const links = pickLinks(pts, w, 1.3, 2)
  const deg = new Map<number, number>()
  for (const [i, j, d] of links) {
    assert.ok(i !== 6 && j !== 6, "unlit star linked")
    assert.ok(d < 1.3)
    for (const k of [i, j]) deg.set(k, (deg.get(k) ?? 0) + 1)
  }
  for (const [k, n] of deg) assert.ok(n <= 2, `star ${k} has ${n} links`)
  assert.ok(links.every((l, i) => i === 0 || links[i - 1][2] <= l[2]), "not shortest first")
  assert.ok(links.length > 0 && links.length < 15, `${links.length} links`) // 15 = full mesh of 6
})
