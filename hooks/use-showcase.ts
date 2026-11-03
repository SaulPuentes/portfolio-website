"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import type { Project } from "@/lib/types"
import { advance, progress, projectImages, selectProject, type Timeline } from "@/lib/showcase"

export function useShowcase(projects: Project[]) {
  const imageCounts = useMemo(() => projects.map((p) => projectImages(p).length), [projects])
  const clock = useRef<Timeline>({ project: 0, slide: 0, elapsedMs: 0 })
  const sectionRef = useRef<HTMLElement | null>(null)
  const fillRef = useRef<HTMLDivElement | null>(null)

  const [timeline, setTimeline] = useState({ project: 0, slide: 0 })
  const [paused, setPaused] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false) // false until mounted: server and client markup must match

  const paint = useCallback(() => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress(clock.current, imageCounts)})`
  }, [imageCounts])

  // The frame loop is stopped while paused, but selecting a project must still redraw the line
  useLayoutEffect(paint, [paint, timeline])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    io.observe(section)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    const readMotion = () => setReducedMotion(motion.matches)
    const readTab = () => setTabVisible(!document.hidden)
    readMotion()
    readTab()
    motion.addEventListener("change", readMotion)
    document.addEventListener("visibilitychange", readTab)
    return () => {
      motion.removeEventListener("change", readMotion)
      document.removeEventListener("visibilitychange", readTab)
    }
  }, [])

  const running = !paused && onScreen && tabVisible && !reducedMotion && projects.length > 0

  useEffect(() => {
    if (!running) return
    let last = performance.now()
    let id = requestAnimationFrame(function frame(now) {
      const before = clock.current
      clock.current = advance(before, now - last, imageCounts)
      last = now
      if (clock.current.project !== before.project || clock.current.slide !== before.slide) {
        setTimeline({ project: clock.current.project, slide: clock.current.slide })
      }
      paint() // straight to the DOM: React only hears about slide changes
      id = requestAnimationFrame(frame)
    })
    return () => cancelAnimationFrame(id)
  }, [running, imageCounts, paint])

  const select = useCallback((project: number) => {
    clock.current = selectProject(clock.current, project)
    setTimeline({ project: clock.current.project, slide: clock.current.slide })
  }, [])

  const togglePaused = useCallback(() => setPaused((p) => !p), [])

  return { timeline, paused, togglePaused, select, onScreen, sectionRef, fillRef }
}
