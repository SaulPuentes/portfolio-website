import { test } from "node:test"
import assert from "node:assert/strict"
import {
  buildStops,
  createAutoplay,
  isStopKey,
  PROJECTS_PAUSE_MS,
  type AutoplayEnv,
  type PageMetrics,
  type TourStop,
} from "./autoplay"

const M: PageMetrics = {
  vh: 1000, maxScroll: 7600, headerPx: 64, servicesTop: 1000, servicesHeight: 3000, servicesSticky: true, serviceCount: 4,
  serviceBottoms: [],
  projectsTop: 4100, contactTop: 7400,
}

const STOPS: TourStop[] = [
  { y: 0, hash: "#about" },
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

test("buildStops stops once at projects", () => {
  const stops = buildStops(M)
  assert.deepEqual(stops.map((x) => x.y), [0, 1200, 1600, 2000, 2400, 4036, 7336])
  assert.deepEqual(stops.map((x) => x.hash), ["#about", "#services", undefined, undefined, undefined, "#projects", "#contact"])
  assert.deepEqual(stops.map((x) => x.pauseMs), [undefined, 400, 400, 400, 400, PROJECTS_PAUSE_MS, undefined])
})

test("buildStops steps stacked services until every card is on screen", () => {
  const stops = buildStops({ ...M, servicesSticky: false, serviceBottoms: [1400, 1800, 2200, 2600] })
  // First stop already shows cards 1-2; then one stop per card whose bottom is still below the fold
  assert.deepEqual(stops.slice(1, 4).map((x) => x.y), [936, 1200, 1600])
  assert.deepEqual(stops.slice(1, 4).map((x) => x.hash), ["#services", undefined, undefined])
  assert.equal(stops[4].hash, "#projects")
})

test("buildStops clamps to maxScroll", () => {
  const stops = buildStops({ ...M, contactTop: 9000 })
  assert.equal(stops[stops.length - 1].y, 7600)
})

test("play from the hero goes straight to the next section", () => {
  const { s, env, step } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.play()
  assert.deepEqual(s.scrolls, [{ y: 1000, seconds: 1.2 }])
  step()
  assert.deepEqual(s.hashes, ["#services"])
  assert.deepEqual(s.waits, [3000])
})

test("walks every stop then labels replay", () => {
  const { s, env, finish } = fakeEnv(STOPS, 5000)
  const a = createAutoplay(env, () => {})
  a.play()
  finish()
  assert.deepEqual(s.hashes, ["#services", "#contact"])
  assert.deepEqual(s.scrolls.map((x) => x.y), [1000, 2000])
  assert.equal(a.getState().playing, false)
  assert.equal(a.getState().label, "replay")
})

test("2× halves scroll time and holds", () => {
  const { s, env, step } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.cycleSpeed()
  a.play()
  assert.deepEqual(s.scrolls[0], { y: 1000, seconds: 0.6 })
  step() // arrive services
  assert.equal(s.waits[0], 1500)
})

test("a stop's own pauseMs replaces the default hold and still scales with speed", () => {
  const stops: TourStop[] = [{ y: 500, hash: "#services", pauseMs: 1500 }, { y: 1000, hash: "#contact" }]
  const { s, env, step } = fakeEnv(stops)
  const a = createAutoplay(env, () => {})
  a.play()
  step() // arrive first stop
  assert.equal(s.waits[0], 1500)
  a.pause()
  a.cycleSpeed() // 2×
  s.stops = [{ y: 500, hash: "#services", pauseMs: 1500 }, { y: 1000, hash: "#contact", pauseMs: 1500 }]
  a.play() // resumes at contact
  step()
  assert.equal(s.waits[1], 750)
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
  step() // arrive services, holding
  a.pause()
  s.scrollY = 1500
  a.play()
  assert.equal(s.scrolls[s.scrolls.length - 1].y, 2000)
})

test("resume on same-y stops keeps stop order", () => {
  const stops: TourStop[] = [
    { y: 500, hash: "#a" },
    { y: 500, hash: "#b" },
    { y: 500, hash: "#c" },
  ]
  const { s, env, step } = fakeEnv(stops, 5000)
  const a = createAutoplay(env, () => {})
  a.play()
  step() // arrive first
  step() // hold done → leg to second
  step() // arrive second, holding
  a.pause()
  a.play()
  step() // arrive third
  assert.deepEqual(s.hashes, ["#a", "#b", "#c"])
})

test("fresh play mid-page continues with the next stop", () => {
  const { s, env } = fakeEnv()
  s.scrollY = 1500
  const a = createAutoplay(env, () => {})
  a.play()
  assert.equal(s.scrolls[0].y, 2000)
})

test("play after finishing restarts from the hero", () => {
  const { s, env, finish } = fakeEnv(STOPS, 5000)
  const a = createAutoplay(env, () => {})
  a.play()
  finish()
  a.play()
  assert.equal(s.scrolls[s.scrolls.length - 1].y, 0)
  finish()
  assert.deepEqual(s.hashes, ["#services", "#contact", "#about", "#services", "#contact"])
})

test("re-reads stops before each leg", () => {
  const { s, env, step } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.play()
  step() // arrive services, holding
  s.stops = [STOPS[0], STOPS[1], { y: 2400, hash: "#contact" }]
  step() // hold done → contact leg
  assert.equal(s.scrolls[1].y, 2400)
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

test("manual scroll during a hold pauses instead of jumping", () => {
  const { s, env, step } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.play()
  step() // arrive services, holding
  s.scrollY = 1600 // scrollbar drag: no wheel/touch/key event
  step() // hold ends
  assert.equal(s.scrolls.length, 1)
  assert.equal(a.getState().playing, false)
  assert.equal(a.getState().label, "play")
  a.play()
  assert.equal(s.scrolls[s.scrolls.length - 1].y, 2000)
})

test("isStopKey ignores keys from inside the control", () => {
  assert.equal(isStopKey(" ", true), false)
  assert.equal(isStopKey(" ", false), true)
})

test("isStopKey covers navigation keys", () => {
  for (const k of ["Escape", "ArrowDown", "PageUp", "Home", "End"]) assert.equal(isStopKey(k, false), true, k)
  assert.equal(isStopKey("a", false), false)
})
