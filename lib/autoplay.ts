export const SPEEDS = [1, 2, 0.5] as const
export const PAUSE_MS = 3000
export const SERVICE_PAUSE_MS = 400 // per card: each card is short
export const PROJECTS_PAUSE_MS = 9000 // long enough to watch the stage play
export const SCROLL_SECONDS = 1.2
export const AUTOPLAY_TOGGLE_EVENT = "autoplay:toggle" // hero CTA and badge toggle the engine; header closes its menu

const POS_TOLERANCE_PX = 2
const STOP_KEYS = new Set([
  "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "PageUp", "PageDown", "Home", "End", " ", "Spacebar",
])

export interface TourStop {
  y: number
  hash?: string
  /** Hold at 1×; defaults to PAUSE_MS. */
  pauseMs?: number
}

export interface AutoplayEnv {
  getScrollY(): number
  getMaxScroll(): number
  getStops(): TourStop[]
  /** Returns a cancel function. */
  scrollTo(y: number, seconds: number, done: () => void): () => void
  /** Returns a cancel function. */
  wait(ms: number, done: () => void): () => void
  setHash(hash: string): void
}

export interface PageMetrics {
  vh: number
  maxScroll: number
  headerPx: number
  servicesTop: number
  servicesHeight: number
  servicesSticky: boolean
  serviceCount: number
  /** Page y of each service card's bottom edge; drives the stacked (non-sticky) layout. */
  serviceBottoms: number[]
  projectsTop: number
  contactTop: number
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

export function buildStops(m: PageMetrics): TourStop[] {
  const clamp = (y: number) => Math.min(Math.max(y, 0), m.maxScroll)
  const stops: TourStop[] = [{ y: 0, hash: "#about" }]
  // Stacked cards (phones) outgrow one screen: step until each card's bottom edge is on screen
  const stepDown = (top: number, bottoms: number[], hash: string, pauseMs?: number) => {
    let y = clamp(top - m.headerPx)
    stops.push({ y, hash, pauseMs })
    for (const bottom of bottoms) {
      if (clamp(bottom - m.vh) <= y + POS_TOLERANCE_PX) continue
      y = clamp(bottom - m.vh)
      stops.push({ y, pauseMs })
    }
  }
  if (m.servicesSticky) {
    // useScrollReveal shows card k once progress passes (k-1)/(n+1): stop mid-band so each card has landed
    const n = m.serviceCount
    for (let k = 1; k <= n; k++) {
      const progress = (k - 0.5) / (n + 1)
      stops.push({
        y: clamp(m.servicesTop + (m.servicesHeight - m.vh) * progress),
        hash: k === 1 ? "#services" : undefined,
        pauseMs: SERVICE_PAUSE_MS,
      })
    }
  } else {
    stepDown(m.servicesTop, m.serviceBottoms, "#services", SERVICE_PAUSE_MS)
  }
  stops.push({ y: clamp(m.projectsTop - m.headerPx), hash: "#projects", pauseMs: PROJECTS_PAUSE_MS })
  stops.push({ y: clamp(m.contactTop - m.headerPx), hash: "#contact" })
  return stops
}

export function createAutoplay(env: AutoplayEnv, onChange: (s: AutoplayState) => void) {
  let playing = false
  let speedIndex = 0
  let nextIndex: number | null = null // null: no tour in progress
  let done = false
  let cancel: (() => void) | null = null

  const atEnd = () => env.getScrollY() >= env.getMaxScroll() - POS_TOLERANCE_PX
  const speed = () => SPEEDS[speedIndex]

  function getState(): AutoplayState {
    const label: AutoplayLabel = playing ? "pause" : done || atEnd() ? "replay" : "play"
    return { playing, speedIndex, label }
  }
  const emit = () => onChange(getState())

  function halt() {
    cancel?.()
    cancel = null
    playing = false
  }

  function finish() {
    halt()
    nextIndex = null
    done = true
    emit()
  }

  function leg(i: number) {
    // Re-read every leg: ScrollTrigger refreshes and late images move the stops
    const stop = env.getStops()[i]
    if (!stop) return finish()
    nextIndex = i
    cancel = null
    const stopScroll = env.scrollTo(stop.y, SCROLL_SECONDS / speed(), () => {
      if (stop.hash) env.setHash(stop.hash)
      nextIndex = i + 1
      const arrivedY = env.getScrollY()
      cancel = env.wait((stop.pauseMs ?? PAUSE_MS) / speed(), () => {
        // A scrollbar drag or find-in-page fires no wheel/touch/key event: treat any drift as manual navigation
        if (Math.abs(env.getScrollY() - arrivedY) > POS_TOLERANCE_PX) return pause()
        leg(i + 1)
      })
    })
    // An instant scroll (reduced motion) arrives before returning: keep the hold's cancel, not the spent one
    cancel ??= stopScroll
  }

  function resumeIndex(): number {
    const stops = env.getStops()
    const y = env.getScrollY()
    // Stops can share one y, so prefer the remembered stop when we are still sitting on it
    if (nextIndex !== null && Math.abs((stops[nextIndex]?.y ?? Infinity) - y) <= POS_TOLERANCE_PX) return nextIndex
    const ahead = stops.findIndex((s) => s.y > y + POS_TOLERANCE_PX)
    return ahead === -1 ? stops.length : ahead
  }

  function play() {
    if (playing) return
    // Only a replay returns to the hero; a first play is already looking at it, so it moves on
    const replay = done || atEnd()
    done = false
    playing = true
    leg(replay ? 0 : resumeIndex())
    if (playing) emit()
  }

  function pause() {
    if (!playing) return
    halt()
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
    destroy: halt,
  }
}
