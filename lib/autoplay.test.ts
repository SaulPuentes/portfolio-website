import { test } from "node:test"
import assert from "node:assert/strict"
import { createAutoplay, isStopKey, SPEEDS, type AutoplayEnv } from "./autoplay"

function fakeEnv(opts: { max?: number; vh?: number } = {}) {
  const s = {
    scrollY: 0,
    max: opts.max ?? 100000,
    vh: opts.vh ?? 1000,
    clock: 0,
    queue: null as ((n: number) => void) | null,
    calls: [] as number[],
  }
  const env: AutoplayEnv = {
    getScrollY: () => s.scrollY,
    getMaxScroll: () => s.max,
    getViewportHeight: () => s.vh,
    scrollTo: (y) => {
      s.calls.push(y)
      s.scrollY = Math.min(y, s.max)
    },
    requestFrame: (cb) => {
      s.queue = cb
      return 1
    },
    cancelFrame: () => {
      s.queue = null
    },
    now: () => s.clock,
  }
  const frame = (ms: number) => {
    s.clock += ms
    const cb = s.queue
    s.queue = null
    cb?.(s.clock)
  }
  const run = (totalMs: number, step = 16) => {
    for (let t = 0; t < totalMs; t += step) frame(step)
  }
  return { s, env, frame, run }
}

test("scrolls 0.4 viewport per second at 1×", () => {
  const { s, env, run } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.play()
  run(1000)
  assert.ok(Math.abs(s.scrollY - 400) <= 20, `scrollY ${s.scrollY}`)
})

test("speed cycles 1 → 2 → 0.5 → 1", () => {
  const { env } = fakeEnv()
  const a = createAutoplay(env, () => {})
  const seen: number[] = []
  for (let i = 0; i < 4; i++) {
    seen.push(SPEEDS[a.getState().speedIndex])
    a.cycleSpeed()
  }
  assert.deepEqual(seen, [1, 2, 0.5, 1])
})

test("2× doubles the distance", () => {
  const { s, env, run } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.cycleSpeed()
  a.play()
  run(1000)
  assert.ok(Math.abs(s.scrollY - 800) <= 40, `scrollY ${s.scrollY}`)
})

test("caps a long frame at 100 ms", () => {
  const { s, env, frame } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.play()
  frame(2000)
  assert.ok(s.scrollY <= 40, `scrollY ${s.scrollY}`)
})

test("stops at the bottom and labels replay", () => {
  const { s, env, run } = fakeEnv({ max: 500 })
  const a = createAutoplay(env, () => {})
  a.play()
  run(3000)
  assert.equal(a.getState().playing, false)
  assert.equal(a.getState().label, "replay")
  assert.equal(s.scrollY, 500)
})

test("play at end restarts from top", () => {
  const { s, env, run } = fakeEnv({ max: 500 })
  const a = createAutoplay(env, () => {})
  a.play()
  run(3000)
  s.calls.length = 0
  a.play()
  assert.equal(s.calls[0], 0)
  assert.equal(a.getState().playing, true)
  run(160)
  assert.ok(s.scrollY > 0 && s.scrollY < 500)
})

test("keeps going when the page grows", () => {
  const { s, env, run } = fakeEnv({ max: 500 })
  const a = createAutoplay(env, () => {})
  a.play()
  run(800)
  assert.ok(s.scrollY < 500)
  s.max = 900
  run(4000)
  assert.equal(s.scrollY, 900)
  assert.equal(a.getState().label, "replay")
})

test("manual scroll pauses", () => {
  const { s, env, run } = fakeEnv()
  const a = createAutoplay(env, () => {})
  a.play()
  run(160)
  s.scrollY += 200
  run(32)
  assert.equal(a.getState().playing, false)
  assert.equal(a.getState().label, "play")
})

test("isStopKey ignores keys from inside the control", () => {
  assert.equal(isStopKey(" ", true), false)
  assert.equal(isStopKey(" ", false), true)
})

test("isStopKey covers navigation keys", () => {
  for (const k of ["Escape", "ArrowDown", "PageUp", "Home", "End"]) assert.equal(isStopKey(k, false), true, k)
  assert.equal(isStopKey("a", false), false)
})

test("a frame timestamp earlier than play() never moves backwards", () => {
  const { s, env, frame } = fakeEnv()
  const a = createAutoplay(env, () => {})
  s.clock = 100
  a.play()
  frame(-50)
  assert.equal(a.getState().playing, true)
  assert.ok(s.scrollY >= 0)
})
