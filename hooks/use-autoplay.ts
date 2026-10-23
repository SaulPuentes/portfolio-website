"use client"

import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import { createAutoplay, isStopKey, type AutoplayState } from "@/lib/autoplay"

const INITIAL: AutoplayState = { playing: false, speedIndex: 0, label: "play" }

export function useAutoplay(controlRef: RefObject<HTMLElement | null>) {
  const [state, setState] = useState<AutoplayState>(INITIAL)
  const engine = useRef<ReturnType<typeof createAutoplay> | null>(null)

  useEffect(() => {
    const api = createAutoplay(
      {
        getScrollY: () => window.scrollY,
        getMaxScroll: () => document.documentElement.scrollHeight - window.innerHeight,
        getViewportHeight: () => window.innerHeight,
        scrollTo: (top) => window.scrollTo({ top, behavior: "instant" }),
        requestFrame: (cb) => requestAnimationFrame(cb),
        cancelFrame: (id) => cancelAnimationFrame(id),
        now: () => performance.now(),
      },
      (s) =>
        setState((prev) =>
          prev.playing === s.playing && prev.speedIndex === s.speedIndex && prev.label === s.label ? prev : s,
        ),
    )
    engine.current = api

    const inside = (e: Event) => controlRef.current?.contains(e.target as Node) ?? false
    // A touch on the play controls themselves must not pause, or the following click would restart it.
    const pause = (e: Event) => {
      if (!inside(e)) api.pause()
    }
    const onKey = (e: KeyboardEvent) => {
      if (isStopKey(e.key, inside(e))) api.pause()
    }
    const onVisibility = () => {
      if (document.visibilityState === "hidden") api.pause()
    }
    const onScroll = () => api.refresh()

    window.addEventListener("wheel", pause, { passive: true })
    window.addEventListener("touchstart", pause, { passive: true })
    window.addEventListener("keydown", onKey)
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)
    api.refresh()

    return () => {
      window.removeEventListener("wheel", pause)
      window.removeEventListener("touchstart", pause)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVisibility)
      api.destroy()
      engine.current = null
    }
  }, [controlRef])

  const toggle = useCallback(() => engine.current?.toggle(), [])
  const cycleSpeed = useCallback(() => engine.current?.cycleSpeed(), [])

  return { state, toggle, cycleSpeed }
}
