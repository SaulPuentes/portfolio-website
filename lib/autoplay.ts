export const SPEEDS = [1, 2, 0.5] as const
export const PAUSE_MS = 3000
export const SCROLL_SECONDS = 1.2
// Replay order once Play reaches the hero: globe backdrop → text stagger → skills marquee
export const HERO_INTRO_TEXT_MS = 600 // globe is half faded in
export const HERO_INTRO_MARQUEE_MS = 2400 // last text item (900 stagger + 800 transition) has settled
export const HERO_INTRO_MS = HERO_INTRO_MARQUEE_MS + 200 + 900 // second marquee row finishes
export const HERO_INTRO_EVENT = "autoplay:hero-intro"

const POS_TOLERANCE_PX = 2
const STOP_KEYS = new Set([
  "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "PageUp", "PageDown", "Home", "End", " ", "Spacebar",
])

export interface TourStop {
  y: number
  hash?: string
  slide?: number
  intro?: boolean
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
  slideTo(index: number): void
  playIntro(): void
}

export interface PageMetrics {
  vh: number
  maxScroll: number
  headerPx: number
  servicesTop: number
  servicesHeight: number
  servicesSticky: boolean
  serviceCount: number
  projectsTop: number
  projectCount: number
  scrub: { start: number; end: number } | null
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
  const stops: TourStop[] = [{ y: 0, hash: "#about", intro: true }]
  if (m.servicesSticky) {
    // useScrollReveal shows card k once progress passes (k-1)/(n+1): stop mid-band so each card has landed
    const n = m.serviceCount
    for (let k = 1; k <= n; k++) {
      const progress = (k - 0.5) / (n + 1)
      stops.push({
        y: clamp(m.servicesTop + (m.servicesHeight - m.vh) * progress),
        hash: k === 1 ? "#services" : undefined,
      })
    }
  } else {
    stops.push({ y: clamp(m.servicesTop - m.headerPx), hash: "#services" })
  }
  for (let i = 0; i < m.projectCount; i++) {
    const hash = i === 0 ? "#projects" : undefined
    if (m.scrub) {
      // The pinned carousel maps scroll progress to slides, so each project has its own scroll position
      const t = m.projectCount > 1 ? i / (m.projectCount - 1) : 0
      stops.push({ y: clamp(m.scrub.start + (m.scrub.end - m.scrub.start) * t), hash })
    } else {
      stops.push({ y: clamp(m.projectsTop - m.headerPx), hash, slide: i })
    }
  }
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
      if (stop.slide !== undefined) env.slideTo(stop.slide)
      if (stop.intro) env.playIntro()
      nextIndex = i + 1
      const arrivedY = env.getScrollY()
      cancel = env.wait((stop.intro ? HERO_INTRO_MS : 0) + PAUSE_MS / speed(), () => {
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
    // Slide stops share one y, so prefer the remembered stop when we are still sitting on it
    if (nextIndex !== null && Math.abs((stops[nextIndex]?.y ?? Infinity) - y) <= POS_TOLERANCE_PX) return nextIndex
    const ahead = stops.findIndex((s) => s.y > y + POS_TOLERANCE_PX)
    return ahead === -1 ? stops.length : ahead
  }

  function play() {
    if (playing) return
    const fresh = nextIndex === null || done || atEnd()
    done = false
    playing = true
    leg(fresh ? 0 : resumeIndex())
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
