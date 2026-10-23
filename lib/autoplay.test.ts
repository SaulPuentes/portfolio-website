import { test } from "node:test"
import assert from "node:assert/strict"
import {
  buildStops,
  createAutoplay,
  isStopKey,
  HERO_INTRO_MS,
  type AutoplayEnv,
  type PageMetrics,
  type TourStop,
} from "./autoplay"

const M: PageMetrics = {
  vh: 1000, maxScroll: 7600, headerPx: 64, servicesTop: 1000, servicesHeight: 3000, servicesSticky: true,
  projectsTop: 4100, projectCount: 3, scrub: { start: 4500, end: 6500 }, contactTop: 7400,
}

const STOPS: TourStop[] = [
  { y: 0, hash: "#about", intro: true },
  { y: 1000, hash: "#services" },
  { y: 2000, hash: "#contact" },
]

function fakeEnv(stops: TourStop[] = STOPS, max = 2000) {
  const s = {
    scrollY: 0,
    max,
    stops,
    scrolls: [] as { y: number; seconds: number }[],
    waits: [] as number[],
    hashes: [] as string[],
    slides: [] as number[],
    intros: 0,
    cancels: 0,
    pending: null as (() => void) | null,
  }
  const later = (run: () => void) => {
    s.pending = run
    return () => {
      s.cancels++
      s.pending = null
    }
  }
  const env: AutoplayEnv = {
    getScrollY: () => s.scrollY,
    getMaxScroll: () => s.max,
    getStops: () => s.stops,
    scrollTo: (y, seconds, done) => {
      s.scrolls.push({ y, seconds })
      return later(() => {
        s.scrollY = y
        done()
      })
    },
    wait: (ms, done) => {
      s.waits.push(ms)
      return later(done)
    },
    setHash: (h) => s.hashes.push(h),
    slideTo: (i) => s.slides.push(i),
    playIntro: () => {
      s.intros++
    },
  }
  const step = () => {
    const p = s.pending
    s.pending = null
    p?.()
  }
  const finish = () => {
    for (let i = 0; i < 100 && s.pending; i++) step()
  }
  return { s, env, step, finish }
}

test("buildStops with scrub", () => {
  const stops = buildStops(M)
  assert.deepEqual(stops.map((x) => x.y), [0, 3000, 4500, 5500, 6500, 7336])
  assert.deepEqual(stops.map((x) => x.hash), ["#about", "#services", "#projects", undefined, undefined, "#contact"])
  assert.equal(stops[0].intro, true)
  assert.ok(stops.every((x) => x.slide === undefined))
})

test("buildStops without scrub uses slide stops", () => {
  const stops = buildStops({ ...M, servicesSticky: false, scrub: null })
  assert.equal(stops[1].y, 936)
  const projects = stops.slice(2, 5)
  assert.deepEqual(projects.map((x) => x.y), [4036, 4036, 4036])
  assert.deepEqual(projects.map((x) => x.slide), [0, 1, 2])
  assert.deepEqual(projects.map((x) => x.hash), ["#projects", undefined, undefined])
})

test("buildStops clamps to maxScroll", () => {
  const stops = buildStops({ ...M, contactTop: 9000 })
  assert.equal(stops[stops.length - 1].y, 7600)
})

test("play from top runs the intro and holds", () => {
  const { s, env, step } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.play()
  assert.deepEqual(s.scrolls, [{ y: 0, seconds: 1.2 }])
  step()
  assert.equal(s.intros, 1)
  assert.deepEqual(s.hashes, ["#about"])
  assert.deepEqual(s.waits, [HERO_INTRO_MS + 3000])
})

test("walks every stop then labels replay", () => {
  const { s, env, finish } = fakeEnv(STOPS, 5000)
  const a = createAutoplay(env, () => {})
  a.play()
  finish()
  assert.deepEqual(s.hashes, ["#about", "#services", "#contact"])
  assert.deepEqual(s.scrolls.map((x) => x.y), [0, 1000, 2000])
  assert.equal(a.getState().playing, false)
  assert.equal(a.getState().label, "replay")
})

test("2× halves scroll time and holds", () => {
  const { s, env, step } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.cycleSpeed()
  a.play()
  step() // arrive hero
  assert.equal(s.waits[0], HERO_INTRO_MS + 1500)
  step() // hold done → scroll to services
  assert.deepEqual(s.scrolls[1], { y: 1000, seconds: 0.6 })
  step() // arrive services
  assert.equal(s.waits[1], 1500)
})

test("pause cancels the pending scroll", () => {
  const { s, env, step } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.play()
  a.pause()
  assert.equal(s.cancels, 1)
  step()
  assert.equal(s.scrolls.length, 1)
  assert.equal(s.waits.length, 0)
  assert.equal(a.getState().playing, false)
  assert.equal(a.getState().label, "play")
})

test("resume goes to the next stop below the current position", () => {
  const { s, env, step } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.play()
  step() // arrive hero, holding
  a.pause()
  s.scrollY = 1500
  a.play()
  assert.equal(s.scrolls[s.scrolls.length - 1].y, 2000)
  assert.equal(s.intros, 1)
})

test("resume on same-y slide stops keeps slide order", () => {
  const stops: TourStop[] = [
    { y: 500, hash: "#projects", slide: 0 },
    { y: 500, slide: 1 },
    { y: 500, slide: 2 },
  ]
  const { s, env, step } = fakeEnv(stops, 5000)
  const a = createAutoplay(env, () => {})
  a.play()
  step() // arrive slide 0
  step() // hold done → leg to slide 1
  step() // arrive slide 1, holding
  a.pause()
  a.play()
  step() // arrive slide 2
  assert.deepEqual(s.slides, [0, 1, 2])
})

test("fresh play mid-page starts from the hero", () => {
  const { s, env } = fakeEnv()
  s.scrollY = 1500
  const a = createAutoplay(env, () => {})
  a.play()
  assert.equal(s.scrolls[0].y, 0)
})

test("play after finishing restarts from the hero", () => {
  const { s, env, finish } = fakeEnv(STOPS, 5000)
  const a = createAutoplay(env, () => {})
  a.play()
  finish()
  a.play()
  assert.equal(s.scrolls[s.scrolls.length - 1].y, 0)
  finish()
  assert.equal(s.intros, 2)
})

test("re-reads stops before each leg", () => {
  const { s, env, step } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.play()
  step() // arrive hero, holding
  s.stops = [STOPS[0], { y: 1200, hash: "#services" }, STOPS[2]]
  step() // hold done → services leg
  assert.equal(s.scrolls[1].y, 1200)
})

test("pause cancels the hold when the scroll finished synchronously", () => {
  const { s, env, step } = fakeEnv()
  // Reduced motion jumps instantly, so done() runs before scrollTo returns
  env.scrollTo = (y, _seconds, done) => {
    s.scrollY = y
    done()
    return () => {}
  }
  const a = createAutoplay(env, () => {})
  a.play()
  a.pause()
  step()
  assert.equal(s.waits.length, 1)
  assert.equal(s.hashes.length, 1)
})

test("isStopKey ignores keys from inside the control", () => {
  assert.equal(isStopKey(" ", true), false)
  assert.equal(isStopKey(" ", false), true)
})

test("isStopKey covers navigation keys", () => {
  for (const k of ["Escape", "ArrowDown", "PageUp", "Home", "End"]) assert.equal(isStopKey(k, false), true, k)
  assert.equal(isStopKey("a", false), false)
})
