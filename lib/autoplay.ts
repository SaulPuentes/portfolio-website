export const SPEEDS = [1, 2, 0.5] as const
export const VIEWPORTS_PER_SECOND = 0.4

const MAX_FRAME_MS = 100
const MANUAL_SCROLL_PX = 3
const END_TOLERANCE_PX = 2
const STOP_KEYS = new Set([
  "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "PageUp", "PageDown", "Home", "End", " ", "Spacebar",
])

export interface AutoplayEnv {
  getScrollY(): number
  getMaxScroll(): number
  getViewportHeight(): number
  scrollTo(y: number): void
  requestFrame(cb: (now: number) => void): number
  cancelFrame(id: number): void
  now(): number
}

export type AutoplayLabel = "play" | "pause" | "replay"
export interface AutoplayState {
  playing: boolean
  speedIndex: number
  label: AutoplayLabel
}

export function isStopKey(key: string, fromInsideControl: boolean): boolean {
  return !fromInsideControl && STOP_KEYS.has(key)
}

export function createAutoplay(env: AutoplayEnv, onChange: (s: AutoplayState) => void) {
  let playing = false
  let speedIndex = 0
  let tracked = 0
  let last = 0
  let frameId: number | null = null

  const atEnd = () => env.getScrollY() >= env.getMaxScroll() - END_TOLERANCE_PX

  function getState(): AutoplayState {
    const label: AutoplayLabel = playing ? "pause" : atEnd() ? "replay" : "play"
    return { playing, speedIndex, label }
  }
  const emit = () => onChange(getState())

  function stop() {
    if (frameId !== null) env.cancelFrame(frameId)
    frameId = null
    playing = false
  }

  function tick(now: number) {
    frameId = null
    // rAF timestamps are frame-start times and can precede the now() read taken in play().
    const dt = Math.max(0, Math.min(now - last, MAX_FRAME_MS)) / 1000
    last = now
    if (Math.abs(env.getScrollY() - tracked) > MANUAL_SCROLL_PX) {
      stop()
      emit()
      return
    }
    const max = env.getMaxScroll()
    tracked = Math.min(
      tracked + VIEWPORTS_PER_SECOND * SPEEDS[speedIndex] * env.getViewportHeight() * dt,
      max,
    )
    env.scrollTo(tracked)
    if (tracked >= max) {
      stop()
      emit()
      return
    }
    frameId = env.requestFrame(tick)
  }

  function play() {
    if (playing) return
    if (atEnd()) env.scrollTo(0)
    tracked = env.getScrollY()
    last = env.now()
    playing = true
    frameId = env.requestFrame(tick)
    emit()
  }

  function pause() {
    if (!playing) return
    stop()
    emit()
  }

  return {
    play,
    pause,
    toggle: () => (playing ? pause() : play()),
    cycleSpeed() {
      speedIndex = (speedIndex + 1) % SPEEDS.length
      emit()
    },
    refresh: emit,
    getState,
    destroy: stop,
  }
}
