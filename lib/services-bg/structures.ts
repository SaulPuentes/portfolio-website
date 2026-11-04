// What each service's cell shows, and where it fits. Pure geometry: no three.js, no DOM.
export type Rect = { x: number; y: number; w: number; h: number }
// drift: how far a loose upper piece bobs on hover, idle: how far at rest. Pieces of one group share a phase.
export type Block = { x: number; y: number; z: number; h: number; drift?: number; phase?: number; idle?: number }
// A cube in motion: s is its size from 0 to 1, ink how far it has turned blue.
export type Mover = { x: number; y: number; z: number; s: number; ink: number }
export type Cell = { rect: Rect; blocked: Rect[] } // blocked: the cell's copy and ghost number

export const HALF = 0.46 // half a cube's edge
const LAYER = 0.96 // cube spacing, a hair over its edge so the seams show
const PLATE = 0.45 // Full-Stack plate thickness. Under 0.3 the shader starts fading the edge lines.

const cube = (x: number, layer: number, z: number, drift = 0, phase = 0): Block =>
  ({ x, y: layer * LAYER, z, h: HALF * 2, drift, phase })

const box = (x0: number, z0: number, w: number, d: number, layer: number, drift = 0, phase = 0): Block[] =>
  Array.from({ length: w * d }, (_, i) => cube(x0 + (i % w), layer, z0 + Math.floor(i / w), drift, phase))

const slab = (x0: number, z0: number, size: number, layer: number, drift = 0, phase = 0) =>
  box(x0, z0, size, size, layer, drift, phase)

// Top-down drawing of one layer: # is a cube.
const plan = (rows: string[], layer: number): Block[] =>
  rows.flatMap((row, z) => [...row].flatMap((c, x) => (c === "#" ? [cube(x, layer, z)] : [])))

// Pixel drawing that stands upright: # is a cube.
const upright = (rows: string[], depth: number): Block[] =>
  rows.flatMap((row, r) => [...row].flatMap((c, x) =>
    c === "#" ? Array.from({ length: depth }, (_, z) => cube(x, rows.length - 1 - r, z)) : []))

const PRESS_X = 4

export const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x))
  return c * c * (3 - 2 * c)
}

// Drawn to similar on-screen bounds, since fit() gives all four one cube size.
export const STRUCTURES: Block[][] = [
  // Strategy & Architecture: a solid stepped pyramid, its capstone floating above it.
  [
    ...slab(0, 0, 6, 0),
    ...slab(1, 1, 4, 1),
    // High enough that the top tier's back corner stays clear of it on screen, even mid-bob.
    ...slab(2, 2, 2, 5.4, 0.15, 0).map((b) => ({ ...b, idle: 0.35 })),
  ],
  // Full-Stack Development: the stack itself, three thin plates.
  [0, 1, 2].flatMap((l) => slab(0, 0, 6, l * 1.35).map((b) => ({ ...b, h: PLATE }))),
  // AI & Automation: a production line, a belt running under a press.
  [
    ...box(0, 0, 9, 3, 0),
    ...[1, 2, 3].flatMap((l) => [cube(PRESS_X, l, 0), cube(PRESS_X, l, 2)]),
    cube(PRESS_X, 4, 0), cube(PRESS_X, 4, 1), cube(PRESS_X, 4, 2),
  ],
  // Technical Consulting & Audit: a magnifying glass.
  upright([
    ".###...",
    "#...#..",
    "#...#..",
    "#...#..",
    ".####..",
    "....##.",
    ".....##",
  ], 2),
]

// Small cubes ride the belt, the press comes down as each passes under, and they leave full size
// and blue. tau is distance along the loop, not time, so the speed can ease without a jump.
const line = (tau: number): Mover[] => {
  const parts = [0, 1, 2].map((i) => {
    const u = (i / 3 + tau * 0.1) % 1, x = -0.4 + u * 9.2, done = smooth((x - PRESS_X + 0.1) / 0.25)
    return { x, y: LAYER, z: 1, s: Math.min(0.62 + done * 0.38, u / 0.06, (1 - u) / 0.06), ink: done }
  })
  const nearest = Math.min(...parts.map((p) => Math.abs(p.x - PRESS_X)))
  return [...parts, { x: PRESS_X, y: (3 - smooth(1 - nearest / 0.9)) * LAYER, z: 1, s: 1, ink: 0 }]
}

// Moving parts per structure, by tau.
export const MOVERS: ((tau: number) => Mover[])[] = [() => [], () => [], line, () => []]

const span = (values: number[]) => (Math.min(...values) + Math.max(...values)) / 2

// The point each structure sways around.
export const CENTERS = STRUCTURES.map((s) => ({
  x: span(s.map((b) => b.x)),
  y: (Math.min(...s.map((b) => b.y)) + Math.max(...s.map((b) => b.y + b.h))) / 2,
  z: span(s.map((b) => b.z)),
}))

// Hover motion. a eases 0 to 1 and back, and everything scales with it, so a hover that starts or
// ends at any moment never jumps.
const LIFT = 0.55, SWELL = 0.2, SWAY = 0.16, IDLE = 0.06

export const float = (t: number, a: number) => ({
  lift: a * (LIFT + Math.sin(t * 1.3) * SWELL),
  yaw: Math.sin(t * 0.6) * SWAY * a,
})

// Upper pieces bob a little at rest and more on hover. The rest of the object stays solid.
export const bob = ({ drift = 0, phase = 0, idle = IDLE }: Block, t: number, a: number) =>
  drift ? Math.sin(t * 1.1 + phase) * (idle + a * drift) : 0

// Axonometric camera direction, shared with the three.js scene so the fit matches the render.
export const CAM = { x: 1, y: 0.95, z: 1 }
const SIN = CAM.y / Math.hypot(CAM.x, CAM.y, CAM.z), COS = Math.sqrt(1 - SIN * SIN), H = Math.SQRT1_2

const toScreen = (x: number, y: number, z: number) => ({ x: (x - z) * H, y: (x + z) * H * SIN - y * COS })

// A block's on-screen bounds at pitch 1, over the whole hover motion.
const bounds = (b: Block, c: { x: number; z: number }): Rect => {
  const reach = b.drift ? (b.idle ?? IDLE) + b.drift : 0
  let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity
  for (const yaw of [-SWAY, 0, SWAY]) {
    const cos = Math.cos(yaw), sin = Math.sin(yaw)
    for (const ox of [-HALF, HALF]) for (const oz of [-HALF, HALF]) for (const y of [b.y - reach, b.y + b.h + LIFT + SWELL + reach]) {
      const dx = b.x + ox - c.x, dz = b.z + oz - c.z
      const p = toScreen(c.x + dx * cos + dz * sin, y, c.z - dx * sin + dz * cos)
      left = Math.min(left, p.x); right = Math.max(right, p.x); top = Math.min(top, p.y); bottom = Math.max(bottom, p.y)
    }
  }
  return { x: left, y: top, w: right - left, h: bottom - top }
}

// Everywhere a structure's moving parts go, sampled along their loop.
const sweep = (i: number): Block[] =>
  Array.from({ length: 40 }, (_, k) => (MOVERS[i] ?? (() => []))(k * 0.5))
    .flat()
    .map(({ x, y, z }) => ({ x, y, z, h: HALF * 2 }))

const hits = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

const MARGIN = 10 // px clear of the copy and number
const INSET = 12 // px clear of the cell's rules
const STEP = 8

// Bottom-right-most spot in the cell, as the screen point of the structure's origin.
function place(cell: Cell, boxes: Rect[], pitch: number) {
  const left = Math.min(...boxes.map((b) => b.x)) * pitch, right = Math.max(...boxes.map((b) => b.x + b.w)) * pitch
  const top = Math.min(...boxes.map((b) => b.y)) * pitch, bottom = Math.max(...boxes.map((b) => b.y + b.h)) * pitch
  const { rect } = cell
  const blocked = cell.blocked.map((r) => ({ x: r.x - MARGIN, y: r.y - MARGIN, w: r.w + MARGIN * 2, h: r.h + MARGIN * 2 }))
  for (let oy = rect.y + rect.h - INSET - bottom; oy + top >= rect.y + INSET; oy -= STEP)
    for (let ox = rect.x + rect.w - INSET - right; ox + left >= rect.x + INSET; ox -= STEP) {
      const clear = boxes.every((b) => {
        const s = { x: ox + b.x * pitch, y: oy + b.y * pitch, w: b.w * pitch, h: b.h * pitch }
        return blocked.every((r) => !hits(s, r))
      })
      if (clear) return { x: ox, y: oy }
    }
  return null
}

const MAX_PITCH = 20, MIN_PITCH = 9

// Largest cube size at which all four structures fit, one size so they read as a set.
// Null when a cell has no room: then nothing is drawn rather than something overlapping.
export function fit(cells: Cell[], structures = STRUCTURES) {
  const boxes = structures.map((s, i) => [...s, ...sweep(i)].map((b) => bounds(b, CENTERS[i])))
  for (let pitch = MAX_PITCH; pitch >= MIN_PITCH; pitch--) {
    const origins = cells.map((c, i) => place(c, boxes[i], pitch))
    if (origins.every(Boolean)) return { pitch, origins: origins as { x: number; y: number }[], boxes }
  }
  return null
}
