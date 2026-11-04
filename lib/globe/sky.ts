// Constellation backdrop behind the globe: a still star field whose stars link up near the cursor.
// With no cursor (touch, idle) a slow invisible wanderer draws the links instead, so phones get it too.
import { BufferAttribute, BufferGeometry, Color, Group, LineBasicMaterial, LineSegments, MathUtils, Points, ShaderMaterial } from "three"

export type SkyFrame = {
  t: number // seconds, already slowed for reduced motion
  dt: number
  hw: number // half width / height of the visible sky plane, world units
  hh: number
  fg: Color
  cursor: { x: number; y: number } | null // pointer on the sky plane; null when away or touch
}

type Pt = { x: number; y: number }
type Star = Pt & { s: number; ph: number }

const { clamp, damp } = MathUtils
const LINK = 1.3 // longest link, world units
const MAX_LINKS = 2 // per star, so the cursor draws a sparse chart rather than a mesh
const GAP = 0.22 // links stop short of their stars, like a sky chart
const MAX_STARS = 200

// Star sprite: hot core, soft halo, and four diffraction spikes once aSize passes 1.1.
const starVertex = /* glsl */ `
  uniform float uSize; uniform float uPR;
  attribute float aSize; attribute vec3 aColor; attribute float aAlpha;
  varying vec3 vColor; varying float vAlpha; varying float vSpike;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * uPR * (10.0 / -mv.z);
    vColor = aColor; vAlpha = aAlpha; vSpike = smoothstep(1.1, 1.6, aSize);
  }`
const starFragment = /* glsl */ `
  varying vec3 vColor; varying float vAlpha; varying float vSpike;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float r = length(p);
    float core = smoothstep(0.07, 0.0, r);
    float halo = exp(-r * r * 90.0) * 0.55;
    float spikes = vSpike * (exp(-abs(p.x) * 90.0) + exp(-abs(p.y) * 90.0)) * pow(max(0.0, 1.0 - r * 2.0), 2.0) * 0.8;
    float a = min(1.0, core + halo + spikes) * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }`
// Star colour temperatures, multiplied into the theme colour: blue-white, white, warm, orange.
const TINTS = [[1, 1, 1], [0.78, 0.86, 1], [1, 0.88, 0.72], [1, 1, 1], [0.86, 0.92, 1], [1, 0.78, 0.6]].map(([r, g, b]) => new Color(r, g, b))

// Links among stars lit by the cursor (w > 0): shortest first, at most `max` per star.
export function pickLinks(pts: Pt[], w: ArrayLike<number>, link = LINK, max = MAX_LINKS) {
  const lit = pts.map((_, i) => i).filter((i) => w[i] > 0)
  const pairs: [number, number, number][] = []
  for (let a = 0; a < lit.length; a++)
    for (let b = a + 1; b < lit.length; b++) {
      const i = lit[a], j = lit[b], d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
      if (d < link) pairs.push([i, j, d])
    }
  const deg = new Uint8Array(pts.length)
  return pairs
    .sort((p, q) => p[2] - q[2])
    .filter(([i, j]) => deg[i] < max && deg[j] < max && ++deg[i] > 0 && ++deg[j] > 0)
}

export function makeSky(pixelRatio: number) {
  const sPos = new Float32Array(MAX_STARS * 3), sSize = new Float32Array(MAX_STARS), sCol = new Float32Array(MAX_STARS * 3), sAlpha = new Float32Array(MAX_STARS)
  const sGeo = new BufferGeometry()
  sGeo.setAttribute("position", new BufferAttribute(sPos, 3))
  sGeo.setAttribute("aSize", new BufferAttribute(sSize, 1))
  sGeo.setAttribute("aColor", new BufferAttribute(sCol, 3))
  sGeo.setAttribute("aAlpha", new BufferAttribute(sAlpha, 1))
  const points = new Points(sGeo, new ShaderMaterial({
    vertexShader: starVertex,
    fragmentShader: starFragment,
    transparent: true,
    depthWrite: false,
    uniforms: { uSize: { value: 20 }, uPR: { value: pixelRatio } },
  }))
  points.frustumCulled = false

  const maxSegs = (MAX_STARS * MAX_LINKS) / 2
  const pos = new Float32Array(maxSegs * 6), col = new Float32Array(maxSegs * 8)
  const lGeo = new BufferGeometry()
  lGeo.setAttribute("position", new BufferAttribute(pos, 3))
  lGeo.setAttribute("color", new BufferAttribute(col, 4)) // RGBA: three turns on vertex alpha for itemSize 4
  const lines = new LineSegments(lGeo, new LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }))
  lines.frustumCulled = false

  const group = new Group()
  group.add(lines, points)
  const tint = new Color()
  let st: Star[] = [], w = new Float32Array(0), cx = 0, cy = 0, w0 = 0, h0 = 0

  return {
    group,
    update(f: SkyFrame) {
      // Scatter the field again when the viewport changes shape (rotation, window resize).
      // Sizes skew small: many faint stars, a few bright ones big enough to get spikes.
      if (Math.abs(f.hw - w0) > w0 * 0.1 || Math.abs(f.hh - h0) > h0 * 0.1) {
        w0 = f.hw
        h0 = f.hh
        st = Array.from({ length: clamp(Math.round(4 * f.hw * f.hh * 0.9), 60, MAX_STARS) }, () => ({
          x: (Math.random() * 2.1 - 1.05) * f.hw,
          y: (Math.random() * 2.1 - 1.05) * f.hh,
          s: 0.5 + 1.3 * Math.random() ** 3,
          ph: Math.random() * Math.PI * 2,
        }))
        w = new Float32Array(st.length)
      }

      const tx = f.cursor ? f.cursor.x : Math.sin(f.t * 0.06) * f.hw * 0.7
      const ty = f.cursor ? f.cursor.y : Math.sin(f.t * 0.09 + 1) * f.hh * 0.6
      cx = damp(cx, tx, f.cursor ? 3 : 1, f.dt)
      cy = damp(cy, ty, f.cursor ? 3 : 1, f.dt)
      const R = Math.min(f.hw, f.hh) * 0.55

      st.forEach((s, i) => {
        w[i] = Math.max(0, 1 - Math.hypot(s.x - cx, s.y - cy) / R) ** 2
        tint.copy(f.fg).multiply(TINTS[i % TINTS.length])
        sPos[i * 3] = s.x; sPos[i * 3 + 1] = s.y
        sCol[i * 3] = tint.r; sCol[i * 3 + 1] = tint.g; sCol[i * 3 + 2] = tint.b
        sSize[i] = s.s * (1 + 0.4 * w[i])
        sAlpha[i] = (0.3 + 0.65 * w[i]) * (0.88 + 0.12 * Math.sin(f.t * 1.3 + s.ph))
      })

      const links = pickLinks(st, w)
      links.forEach(([i, j], n) => {
        const A = st[i], B = st[j], dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy)
        const a = 0.8 * Math.sqrt(Math.min(w[i], w[j])) * (1 - (d / LINK) ** 2), p = n * 6, k = n * 8
        const g = d > GAP * 2 ? GAP / d : 0.5 // too short for both gaps: collapses to nothing
        pos[p] = A.x + dx * g; pos[p + 1] = A.y + dy * g
        pos[p + 3] = B.x - dx * g; pos[p + 4] = B.y - dy * g
        col[k] = col[k + 4] = f.fg.r; col[k + 1] = col[k + 5] = f.fg.g; col[k + 2] = col[k + 6] = f.fg.b
        col[k + 3] = col[k + 7] = a
      })

      for (const key of ["position", "aSize", "aColor", "aAlpha"]) sGeo.attributes[key].needsUpdate = true
      sGeo.setDrawRange(0, st.length)
      lGeo.attributes.position.needsUpdate = lGeo.attributes.color.needsUpdate = true
      lGeo.setDrawRange(0, links.length * 2)
    },
  }
}
