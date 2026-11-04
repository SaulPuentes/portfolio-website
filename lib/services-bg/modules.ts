// Services background: one axonometric object per service, drawn in hairlines with hidden lines
// removed. The section measures its own DOM and passes the cells, and structures.ts finds each
// object a spot clear of the copy. Loaded lazily by components/services-background.tsx.
import {
  BoxGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from "three"
import { CAM, CENTERS, HALF, MOVERS, STRUCTURES, bob, fit, float, smooth, type Block, type Cell } from "./structures"

export type Layout = { width: number; height: number; cells: Cell[] }

export interface ServicesBg {
  setActive(index: number): void
  setHovered(index: number | null): void
  setRevealed(count: number): void
  setTheme(dark: boolean): void
  setLayout(layout: Layout): void
  start(): void
  stop(): void
  dispose(): void
}

type Rgb = [number, number, number]
const ACCENT: Rgb = [0x3f / 255, 0x80 / 255, 0xf2 / 255] // same blue as the hero globe

// Resolves any CSS colour (the theme uses oklch) to sRGB 0..1.
const cssRgb = (css: string): Rgb => {
  const g = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!
  g.fillStyle = css
  g.fillRect(0, 0, 1, 1)
  const [r, gn, b] = g.getImageData(0, 0, 1, 1).data
  return [r / 255, gn / 255, b / 255]
}

const vertex = /* glsl */ `
  attribute vec2 aOffset; attribute float aBase; attribute float aHeight; attribute float aTint; attribute float aOwner; attribute float aWidth;
  uniform float uYaw[4]; uniform vec3 uCenter[4]; uniform vec3 uTone;
  varying vec2 vUv; varying float vSide; varying float vShade; varying float vLift; varying float vTint;
  void main() {
    int o = int(aOwner + 0.5);
    float c = cos(uYaw[o]), s = sin(uYaw[o]);
    mat2 turn = mat2(c, -s, s, c);
    vec3 p = position;
    p.y = p.y * aHeight + aBase;
    p.xz = uCenter[o].xz + turn * (p.xz * aWidth + aOffset - uCenter[o].xz);
    vec3 n = normal;
    n.xz = turn * n.xz;
    vUv = uv;
    vSide = 1.0 - abs(n.y);
    vShade = mix(uTone.x, mix(uTone.y, uTone.z, max(n.x, 0.0)), vSide);
    vLift = smoothstep(0.0, 0.3, aHeight);
    vTint = aTint;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`
const fragment = /* glsl */ `
  uniform vec3 uBg, uInk, uAccent; uniform float uEdge, uPR;
  varying vec2 vUv; varying float vSide; varying float vShade; varying float vLift; varying float vTint;
  void main() {
    vec2 e = min(vUv, 1.0 - vUv) / (fwidth(vUv) * uPR * 0.8);
    float line = 1.0 - clamp(min(e.x, e.y), 0.0, 1.0);
    vec3 face = mix(uBg, uInk, vShade);
    face = mix(face, uAccent, clamp(vTint * mix(0.22, 0.1, vSide), 0.0, 1.0));
    vec3 edge = mix(uInk, uAccent, min(vTint, 1.0));
    gl_FragColor = vec4(mix(face, edge, line * uEdge * vLift), 1.0);
  }`

const CAM_DIR = new Vector3(CAM.x, CAM.y, CAM.z).normalize()

export function createModules(canvas: HTMLCanvasElement, opts: { dark: boolean; reducedMotion: boolean; layout: Layout }): ServicesBg {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "default" })
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.5 : 2))
  const motion = opts.reducedMotion ? 0 : 1

  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 1, 800)
  camera.position.copy(CAM_DIR).multiplyScalar(300)
  camera.lookAt(0, 0, 0)

  const box = new BoxGeometry(HALF * 2, 1, HALF * 2).translate(0, 0.5, 0)
  const geo = new InstancedBufferGeometry()
  geo.index = box.index
  geo.setAttribute("position", box.attributes.position)
  geo.setAttribute("normal", box.attributes.normal)
  geo.setAttribute("uv", box.attributes.uv)
  const mat = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uBg: { value: new Vector3() }, uInk: { value: new Vector3() }, uAccent: { value: new Vector3(...ACCENT) },
      uEdge: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uTone: { value: new Vector3() },
      uYaw: { value: [0, 0, 0, 0] }, uCenter: { value: [0, 1, 2, 3].map(() => new Vector3()) },
    },
  })
  const mesh = new Mesh(geo, mat)
  mesh.frustumCulled = false
  scene.add(mesh)

  let count = 0, offsets = new Float32Array(), widths = new Float32Array()
  let bases = new Float32Array(), heights = new Float32Array(), tints = new Float32Array()
  let blocks: (Block | number)[] = [], owners = new Int8Array(), peaks = new Float32Array(), delays = new Float32Array()
  let active = 0, hovered: number | null = null, revealed = 1, t = 0, layout = opts.layout
  const rise = [0, 0, 0, 0], glow = [0, 0, 0, 0], hover = [0, 0, 0, 0]
  const hubs = [0, 1, 2, 3].map(() => ({ x: 0, z: 0 }))
  const belt = [0, 0, 0, 0], beltSpeed = [0, 0, 0, 0] // distance along each loop, so speed can ease

  const setLayout = (l: Layout) => {
    const { width: w, height: h } = l
    if (!w || !h) return
    layout = l
    renderer.setSize(w, h, false)
    const placed = fit(l.cells)
    if (!placed) { geo.instanceCount = 0; count = 0; return }
    const size = placed.pitch
    camera.left = -w / 2 / size; camera.right = w / 2 / size
    camera.top = h / 2 / size; camera.bottom = -h / 2 / size
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()

    const off: number[] = [], own: number[] = [], peak: number[] = [], delay: number[] = []
    const all: (Block | number)[] = [] // a number is an index into that structure's movers
    placed.origins.forEach(({ x, y }, i) => {
      // Screen point to the y=0 plane, sliding along the camera ray.
      const p = new Vector3((x / w) * 2 - 1, 1 - (y / h) * 2, 0).unproject(camera)
      p.addScaledVector(CAM_DIR, -p.y / CAM_DIR.y)
      mat.uniforms.uCenter.value[i].set(p.x + CENTERS[i].x, CENTERS[i].y, p.z + CENTERS[i].z)
      hubs[i] = { x: p.x, z: p.z }
      for (const b of STRUCTURES[i]) {
        off.push(p.x + b.x, p.z + b.z); own.push(i); peak.push(b.h); all.push(b)
        delay.push((b.x + b.y + b.z) * 0.05)
      }
      MOVERS[i](0).forEach((_, k) => {
        off.push(0, 0); own.push(i); peak.push(HALF * 2); all.push(k); delay.push(0.5)
      })
    })
    count = own.length
    blocks = all
    owners = Int8Array.from(own)
    peaks = Float32Array.from(peak)
    delays = Float32Array.from(delay)
    offsets = Float32Array.from(off)
    widths = new Float32Array(count).fill(1)
    bases = new Float32Array(count)
    heights = new Float32Array(count)
    tints = new Float32Array(count)
    geo.dispose()
    geo.setAttribute("aOffset", new InstancedBufferAttribute(offsets, 2))
    geo.setAttribute("aWidth", new InstancedBufferAttribute(widths, 1))
    geo.setAttribute("aBase", new InstancedBufferAttribute(bases, 1))
    geo.setAttribute("aOwner", new InstancedBufferAttribute(Float32Array.from(own), 1))
    geo.setAttribute("aHeight", new InstancedBufferAttribute(heights, 1))
    geo.setAttribute("aTint", new InstancedBufferAttribute(tints, 1))
    geo.instanceCount = count
  }

  const setTheme = (dark: boolean) => {
    const s = getComputedStyle(document.body)
    mat.uniforms.uBg.value.set(...cssRgb(s.backgroundColor))
    mat.uniforms.uInk.value.set(...cssRgb(s.color))
    mat.uniforms.uEdge.value = dark ? 0.34 : 0.32
    // Top, left and right face tones. Ink is light on dark and dark on light, so these flip to
    // keep the light falling on the top face either way.
    mat.uniforms.uTone.value.set(...(dark ? [0.16, 0.05, 0.1] : [0.015, 0.16, 0.08]) as [number, number, number])
  }

  const frame = (dt: number) => {
    t += dt * motion
    for (let i = 0; i < 4; i++) {
      rise[i] += (Number(i < revealed) * 1.6 - rise[i]) * (1 - Math.exp(-1.8 * dt))
      glow[i] += (Number(i === active) - glow[i]) * (1 - Math.exp(-5 * dt))
      hover[i] += (Number(i === hovered) - hover[i]) * (1 - Math.exp(-3.2 * dt))
      beltSpeed[i] += ((i === hovered ? 1 : 0.35) - beltSpeed[i]) * (1 - Math.exp(-3 * dt))
      belt[i] += beltSpeed[i] * dt * motion * 2.4
    }
    const lifts = hover.map((a, i) => {
      const { lift, yaw } = float(t, a)
      mat.uniforms.uYaw.value[i] = yaw
      return lift
    })
    const moved = MOVERS.map((m, i) => m(belt[i]))
    for (let i = 0; i < count; i++) {
      const o = owners[i], k = smooth((rise[o] - delays[i]) / 0.7), b = blocks[i]
      if (typeof b === "number") {
        const m = moved[o][b]
        offsets[i * 2] = hubs[o].x + m.x
        offsets[i * 2 + 1] = hubs[o].z + m.z
        widths[i] = m.s * k
        bases[i] = (m.y + lifts[o]) * k
        heights[i] = peaks[i] * m.s * k
        tints[i] = Math.max(glow[o], m.ink * 3) * k
        continue
      }
      bases[i] = (b.y + bob(b, t, hover[o]) + lifts[o]) * k
      heights[i] = peaks[i] * k
      tints[i] = glow[o] * k
    }
    if (!count) return
    geo.attributes.aOffset.needsUpdate = true
    geo.attributes.aWidth.needsUpdate = true
    geo.attributes.aBase.needsUpdate = true
    geo.attributes.aHeight.needsUpdate = true
    geo.attributes.aTint.needsUpdate = true
    renderer.render(scene, camera)
  }

  // rAF loop with a capped dt. If the device averages under ~30 fps, shed resolution once rather
  // than jank the page scroll.
  let id = 0, last = 0, sum = 0, n = 0, slow = false
  const tick = (now: number) => {
    id = requestAnimationFrame(tick)
    const raw = (now - last) / 1000
    last = now
    frame(Math.min(raw, 0.05))
    sum += raw
    if (++n === 90) {
      if (!slow && sum / n > 0.033) {
        slow = true
        renderer.setPixelRatio(1)
        mat.uniforms.uPR.value = 1
        setLayout(layout)
      }
      sum = n = 0
    }
  }
  const start = () => { if (!id) { last = performance.now(); id = requestAnimationFrame(tick) } }
  const stop = () => { cancelAnimationFrame(id); id = 0 }

  setLayout(opts.layout)
  setTheme(opts.dark)
  return {
    setActive: (i) => { active = i },
    setHovered: (i) => { hovered = i },
    setRevealed: (c) => { revealed = c },
    setTheme, setLayout, start, stop,
    dispose() {
      stop()
      geo.dispose(); box.dispose(); mat.dispose()
      renderer.dispose(); renderer.forceContextLoss()
    },
  }
}
