"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type Swiper from "swiper"
import { buildStops, createAutoplay, isStopKey, HERO_INTRO_EVENT, type AutoplayState } from "@/lib/autoplay"

const HEADER_PX = 64 // sections use scroll-mt-16
const MANUAL_SCROLL_PX = 3
const INITIAL: AutoplayState = { playing: false, speedIndex: 0, label: "play" }

export function useAutoplay() {
  const [state, setState] = useState<AutoplayState>(INITIAL)
  const engine = useRef<ReturnType<typeof createAutoplay> | null>(null)

  useEffect(() => {
    // Layout viewport, not innerHeight/innerWidth: those grow with pinch-zoom or horizontal overflow on phones
    const root = document.documentElement
    const getMaxScroll = () => root.scrollHeight - root.clientHeight
    const api = createAutoplay(
      {
        getScrollY: () => window.scrollY,
        getMaxScroll,
        getStops: () => {
          const top = (id: string) => (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY
          const services = document.getElementById("services")
          const { scrubStart, scrubEnd } = document.getElementById("projects-carousel")?.dataset ?? {}
          return buildStops({
            vh: root.clientHeight,
            maxScroll: getMaxScroll(),
            headerPx: HEADER_PX,
            servicesTop: top("services"),
            servicesHeight: services?.offsetHeight ?? 0,
            // Read what useScrollReveal rendered instead of repeating its breakpoint
            servicesSticky: services?.firstElementChild ? getComputedStyle(services.firstElementChild).position === "sticky" : false,
            projectsTop: top("projects"),
            projectCount: document.querySelectorAll("#projects .swiper-slide").length,
            scrub: scrubStart && scrubEnd ? { start: +scrubStart, end: +scrubEnd } : null,
            contactTop: top("contact"),
          })
        },
        scrollTo: (y, seconds, done) => {
          // `html` has scroll-smooth, so every step must be "instant" or the browser fights the tween
          // Touch slide stops share one y: arrive at once instead of tweening nowhere
          if (Math.abs(y - window.scrollY) < 1 || matchMedia("(prefers-reduced-motion: reduce)").matches) {
            window.scrollTo({ top: y, behavior: "instant" })
            done()
            return () => {}
          }
          const from = window.scrollY
          const start = performance.now()
          let written = from
          let id = requestAnimationFrame(function frame(now) {
            // Someone else moved the page (scrollbar drag, find-in-page): stop fighting them
            if (Math.abs(window.scrollY - written) > MANUAL_SCROLL_PX) return api.pause()
            const t = Math.min(Math.max((now - start) / (seconds * 1000), 0), 1)
            const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2
            window.scrollTo({ top: from + (y - from) * eased, behavior: "instant" })
            written = window.scrollY
            if (t < 1) id = requestAnimationFrame(frame)
            else done()
          })
          return () => cancelAnimationFrame(id)
        },
        wait: (ms, done) => {
          const id = setTimeout(done, ms)
          return () => clearTimeout(id)
        },
        setHash: (hash) => history.replaceState(null, "", hash),
        slideTo: (i) =>
          (document.querySelector("#projects .swiper-container") as (Element & { swiper?: Swiper }) | null)?.swiper?.slideTo(i),
        playIntro: () => window.dispatchEvent(new Event(HERO_INTRO_EVENT)),
      },
      (s) =>
        setState((prev) =>
          prev.playing === s.playing && prev.speedIndex === s.speedIndex && prev.label === s.label ? prev : s,
        ),
    )
    engine.current = api

    // Only the Play/speed controls are exempt: pausing on them would make the following click restart playback.
    // Everything else (nav, CTAs, links) is manual navigation and must win over autoplay.
    const inside = (e: Event) => (e.target as Element | null)?.closest?.("[data-autoplay-control]") != null
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
    window.addEventListener("click", pause, true)
    window.addEventListener("keydown", onKey)
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)
    api.refresh()

    return () => {
      window.removeEventListener("wheel", pause)
      window.removeEventListener("touchstart", pause)
      window.removeEventListener("click", pause, true)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVisibility)
      api.destroy()
      engine.current = null
    }
  }, [])

  const toggle = useCallback(() => engine.current?.toggle(), [])
  const cycleSpeed = useCallback(() => engine.current?.cycleSpeed(), [])

  return { state, toggle, cycleSpeed }
}
