// Dotted-Earth hero globe. Ported from option C2 of
// docs/superpowers/specs/assets/2026-10-22-hero-globe-demo.html (removed; see commit e96c07c).
// Loaded lazily by components/hero-globe.tsx so three.js stays out of the first-paint bundle.
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Clock,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  Quaternion,
  Raycaster,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
} from "three"
import { CAPITALS, isLand, latLonToUnit, pickArcPair } from "./geo"

export interface GlobeHandle {
  setTheme(dark: boolean): void
  start(): void
  stop(): void
  dispose(): void
}

// core: sphere fill under the dots. Light mode makes it a step darker than the page (#f5f5f5)
// so the globe reads as a disc instead of melting into the background.
// ocean: ocean-dot alpha; rim: alpha floor for dots turned away from the camera (the limb).
// Dark dots on a light page read fainter than light dots on a dark one, so light raises both.
type Palette = { core: Color; fg: Color; muted: Color; ocean: number; rim: number }

const ACCENT = new Color(0x3f80f2)
const { degToRad: rad, radToDeg: deg, damp, smoothstep } = MathUtils

const palette = (dark: boolean): Palette =>
  dark
    ? { core: new Color(0x0d0d0d), fg: new Color(0xe9e9e9), muted: new Color(0x6e6e6e), ocean: 0.34, rim: 0.25 }
    : { core: new Color(0xebebeb), fg: new Color(0x1c1c1c), muted: new Color(0x6a6a6a), ocean: 0.6, rim: 0.5 }

const fromLatLon = (lat: number, lon: number) => {
  const { x, y, z } = latLonToUnit(lat, lon)
  return new Vector3(x, y, z)
}

const dotVertex = /* glsl */ `
  uniform float uSize; uniform float uPR;
  attribute float aSize; attribute vec3 aColor; attribute float aAlpha;
  varying vec3 vColor; varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * uPR * (10.0 / -mv.z);
    vColor = aColor; vAlpha = aAlpha;
  }`
const dotFragment = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.15, r));
    #include <colorspace_fragment>
  }`

function dotCloud(n: number, size: number, pixelRatio: number) {
  const pos = new Float32Array(n * 3), sz = new Float32Array(n), cl = new Float32Array(n * 3), al = new Float32Array(n)
  const geo = new BufferGeometry()
  geo.setAttribute("position", new BufferAttribute(pos, 3))
  geo.setAttribute("aSize", new BufferAttribute(sz, 1))
  geo.setAttribute("aColor", new BufferAttribute(cl, 3))
  geo.setAttribute("aAlpha", new BufferAttribute(al, 1))
  const mat = new ShaderMaterial({
    vertexShader: dotVertex,
    fragmentShader: dotFragment,
    transparent: true,
    depthWrite: false,
    uniforms: { uSize: { value: size }, uPR: { value: pixelRatio } },
  })
  const points = new Points(geo, mat)
  points.frustumCulled = false
  return {
    points,
    set(i: number, x: number, y: number, z: number, s: number, c: Color, a: number) {
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z
      sz[i] = s
      cl[i * 3] = c.r; cl[i * 3 + 1] = c.g; cl[i * 3 + 2] = c.b
      al[i] = a
    },
    flush() {
      for (const k of ["position", "aSize", "aColor", "aAlpha"]) geo.attributes[k].needsUpdate = true
    },
  }
}

// Evenly spread unit vectors (Fibonacci sphere).
const fib = (n: number) =>
  Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5))
    return new Vector3(Math.cos(th) * r, y, Math.sin(th) * r)
  })

function glowSprite(size: number) {
  const c = document.createElement("canvas")
  c.width = c.height = 128
  const g = c.getContext("2d")!
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, "rgba(255,255,255,1)")
  grd.addColorStop(0.45, "rgba(255,255,255,.35)")
  grd.addColorStop(1, "rgba(255,255,255,0)")
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  const sp = new Sprite(new SpriteMaterial({ map: new CanvasTexture(c), color: ACCENT, transparent: true, depthWrite: false }))
  sp.scale.setScalar(size)
  return sp
}

function makeEarth({ R, n, oceanEvery, size, pixelRatio }: { R: number; n: number; oceanEvery: number; size: number; pixelRatio: number }) {
  const group = new Group() // axial tilt
  group.rotation.z = rad(-23.4)
  const spin = new Group()
  group.add(spin)
  spin.rotation.y = rad(72) // Americas face the viewer first
  const dirs: Vector3[] = [], land: boolean[] = []
  fib(n).forEach((v, i) => {
    const l = isLand(deg(Math.asin(v.y)), deg(Math.atan2(v.x, v.z)))
    if (l || i % oceanEvery === 0) { dirs.push(v); land.push(l) }
  })
  const D = dirs.length, cloud = dotCloud(D, size, pixelRatio)
  spin.add(cloud.points)
  const coreMat = new MeshBasicMaterial()
  spin.add(new Mesh(new SphereGeometry(R * 0.985, 64, 32), coreMat))
  const halo = glowSprite(R * 3.1)
  halo.renderOrder = -1
  group.add(halo)
  const hitSphere = new Mesh(new SphereGeometry(R, 32, 16), new MeshBasicMaterial({ visible: false }))
  spin.add(hitSphere)
  const q = new Quaternion(), tmp = new Vector3(), c = new Color()
  return {
    group, spin, R, hitSphere,
    theme(p: Palette, dark: boolean) {
      coreMat.color.copy(p.core)
      halo.material.opacity = dark ? 0.22 : 0.12
    },
    update(t: number, pal: Palette, hit: Vector3, hitAmt: number) {
      spin.getWorldQuaternion(q)
      for (let i = 0; i < D; i++) {
        const d = dirs[i]
        const f = smoothstep(tmp.copy(d).applyQuaternion(q).z, -0.15, 0.55) // facing the camera
        const dist = hitAmt > 0.01 ? Math.hypot(d.x * R - hit.x, d.y * R - hit.y, d.z * R - hit.z) : 9
        const g = hitAmt * Math.max(0, 1 - dist / (R * 0.5)) ** 2 // hover lift
        const rr = R * (1 + g * 0.1)
        const tw = land[i] ? 0.85 + 0.15 * Math.sin(t * 1.4 + i) : 1 // twinkle
        cloud.set(i, d.x * rr, d.y * rr, d.z * rr,
          (land[i] ? 1 : 0.7) * tw * (1 + g * 1.6),
          c.copy(land[i] ? pal.fg : pal.muted).lerp(ACCENT, Math.min(1, g * 1.5)),
          ((land[i] ? 0.95 : pal.ocean) + g) * (pal.rim + f * (1 - pal.rim)))
      }
      cloud.flush()
    },
  }
}

const halfSize = (camera: PerspectiveCamera, dist: number) => {
  const h = Math.tan(rad(camera.fov / 2)) * dist
  return { w: h * camera.aspect, h }
}

const isUi = (target: EventTarget | null) => target instanceof Element && target.closest("a, button, header") !== null

export function createGlobeScene(canvas: HTMLCanvasElement, opts: { dark: boolean; reducedMotion: boolean }): GlobeHandle {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "default" })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  const pixelRatio = renderer.getPixelRatio()
  const motion = opts.reducedMotion ? 0.15 : 1

  const scene = new Scene()
  const camera = new PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(0, 0, 10)
  const root = new Group()
  scene.add(root)
  const earth = makeEarth({ R: 1.95, n: innerWidth < 768 ? 14000 : 22000, oceanEvery: 7, size: 2.4, pixelRatio })
  root.add(earth.group)

  // City markers + arcs between them
  const cityDirs = CAPITALS.map(([lat, lon]) => fromLatLon(lat, lon))
  const markers = dotCloud(cityDirs.length, 7, pixelRatio)
  earth.spin.add(markers.points)
  const arcMat = new LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9 })
  const SEG = 72
  const arcs = Array.from({ length: 8 }, (_, k) => {
    const line = new Line(new BufferGeometry(), arcMat)
    earth.spin.add(line)
    return { line, t0: k * 0.7, dur: 2.6 }
  })
  const resetArc = (a: (typeof arcs)[number], t: number) => {
    const [i, j] = pickArcPair(Math.random)
    const p = cityDirs[i].clone().multiplyScalar(earth.R), q = cityDirs[j].clone().multiplyScalar(earth.R)
    const mid = p.clone().add(q).normalize().multiplyScalar(earth.R * (1.08 + p.distanceTo(q) * 0.12))
    a.line.geometry.setFromPoints(new QuadraticBezierCurve3(p, mid, q).getPoints(SEG))
    a.t0 = t
  }

  const starMat = new PointsMaterial({ size: 0.04, transparent: true, opacity: 0.6 })
  const stars = new Points(
    new BufferGeometry().setFromPoints(
      Array.from({ length: 600 }, () => new Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 24, -8 - Math.random() * 12)),
    ),
    starMat,
  )
  scene.add(stars)

  // Pointer state, fed by window listeners so the hero text can sit above the canvas.
  const pointer = new Vector2(9, 9)
  let pointerInside = false, pointerDown = false, dragDx = 0
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = -((e.clientY - r.top) / r.height) * 2 + 1
    if (pointerDown) dragDx += nx - pointer.x
    pointer.set(nx, ny)
    pointerInside = e.clientY >= r.top && e.clientY <= r.bottom && !isUi(e.target)
  }
  const onDown = (e: PointerEvent) => { if (!isUi(e.target)) pointerDown = true }
  const onUp = (e: PointerEvent) => {
    pointerDown = false
    if (e.pointerType !== "mouse") pointerInside = false // a finger has no hover; don't leave the glow behind
  }
  const onLeave = () => { pointerInside = false }
  addEventListener("pointermove", onMove)
  addEventListener("pointerdown", onDown)
  addEventListener("pointerup", onUp)
  addEventListener("pointercancel", onUp)
  document.documentElement.addEventListener("pointerleave", onLeave)

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    const aspect = w / h
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    const half = halfSize(camera, 10), phone = aspect < 0.9
    root.position.set(phone ? 0 : half.w * 0.42, phone ? half.h * 0.4 : -0.05, 0)
    root.scale.setScalar(phone ? 0.62 : Math.min(1, aspect / 1.5))
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  let pal = palette(opts.dark)
  const setTheme = (dark: boolean) => {
    pal = palette(dark)
    earth.theme(pal, dark)
    starMat.color.copy(pal.muted)
  }
  setTheme(opts.dark)

  const raycaster = new Raycaster()
  const hit = new Vector3(99, 0, 0), local = new Vector3()
  let hitAmt = 0, vel = 0.05, t = 0, grabbing = false
  const setCursor = (on: boolean) => {
    if (on === grabbing) return
    grabbing = on
    document.body.style.cursor = on ? "grab" : ""
  }

  const frame = (dt: number) => {
    raycaster.setFromCamera(pointer, camera)
    const hits = pointerInside ? raycaster.intersectObject(earth.hitSphere, false) : []
    if (hits.length) {
      hit.copy(earth.spin.worldToLocal(local.copy(hits[0].point)))
      hitAmt = damp(hitAmt, 1, 8, dt)
    } else hitAmt = damp(hitAmt, 0, 4, dt)
    setCursor(hits.length > 0)
    if (pointerDown && hits.length) vel = dragDx * 60
    dragDx = 0
    vel = damp(vel, 0.05 * motion, 1.5, dt)
    earth.spin.rotation.y += vel * dt
    root.rotation.x = damp(root.rotation.x, pointerInside ? -pointer.y * 0.1 : 0, 2, dt)
    root.rotation.y = damp(root.rotation.y, pointerInside ? pointer.x * 0.1 : 0, 2, dt)
    earth.update(t, pal, hit, hitAmt)

    cityDirs.forEach((d, i) => {
      const pulse = 0.8 + 0.4 * Math.sin(t * 3 + i), r = earth.R * 1.005
      markers.set(i, d.x * r, d.y * r, d.z * r, pulse, ACCENT, 0.95)
    })
    markers.flush()
    for (const a of arcs) {
      if (!a.line.geometry.attributes.position) { if (t >= a.t0) resetArc(a, t); continue }
      const age = (t - a.t0) / a.dur
      if (age > 1) { resetArc(a, t); continue }
      const head = Math.min(1, age * 2), tail = Math.max(0, age * 2 - 1)
      a.line.geometry.setDrawRange(Math.floor(tail * SEG), Math.max(0, Math.floor((head - tail) * SEG) + 1))
    }
    stars.position.x = damp(stars.position.x, pointerInside ? -pointer.x * 0.4 : 0, 2, dt)
    stars.position.y = damp(stars.position.y, pointerInside ? -pointer.y * 0.25 : 0, 2, dt)
  }

  const clock = new Clock(false)
  let running = false
  canvas.dataset.running = "false"

  const start = () => {
    if (running) return
    running = true
    canvas.dataset.running = "true"
    clock.start()
    renderer.setAnimationLoop(() => {
      const dt = Math.min(clock.getDelta(), 0.05)
      t += dt * motion
      frame(dt)
      renderer.render(scene, camera)
    })
  }
  const stop = () => {
    if (!running) return
    running = false
    canvas.dataset.running = "false"
    renderer.setAnimationLoop(null)
    clock.stop()
    setCursor(false)
  }

  const dispose = () => {
    stop()
    removeEventListener("pointermove", onMove)
    removeEventListener("pointerdown", onDown)
    removeEventListener("pointerup", onUp)
    removeEventListener("pointercancel", onUp)
    document.documentElement.removeEventListener("pointerleave", onLeave)
    ro.disconnect()
    scene.traverse((o: Object3D) => {
      const mesh = o as Object3D & { geometry?: BufferGeometry; material?: Material | Material[] }
      mesh.geometry?.dispose()
      for (const m of ([] as Material[]).concat(mesh.material ?? [])) {
        ;(m as Material & { map?: { dispose(): void } | null }).map?.dispose()
        m.dispose()
      }
    })
    renderer.dispose()
    renderer.forceContextLoss()
  }

  return { setTheme, start, stop, dispose }
}
