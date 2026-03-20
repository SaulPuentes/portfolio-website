"use client"

import { useState, useEffect, useRef, useCallback } from "react"

/* ------------------------------------------------------------------ */
/*  useInView — one-shot intersection observer                         */
/* ------------------------------------------------------------------ */

export function useInView(
  ref: React.RefObject<HTMLDivElement | null>,
  threshold = 0.08,
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); io.disconnect() }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])

  return inView
}

/* ------------------------------------------------------------------ */
/*  useScrollCards — rAF-driven scroll progress for fluid animation    */
/* ------------------------------------------------------------------ */

const VH_PER_SLIDE = 150       // scroll distance each slide owns
const STICKY_VH = 100          // sticky viewport height

export function useScrollCards(
  sectionRef: React.RefObject<HTMLDivElement | null>,
  slideCount: number,
) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const rafId = useRef(0)

  const tick = useCallback(() => {
    const section = sectionRef.current
    if (!section) return

    const vh = window.innerHeight / 100
    const sectionPx = slideCount * VH_PER_SLIDE * vh
    const scrollable = sectionPx - STICKY_VH * vh
    const scrolled = -section.getBoundingClientRect().top

    if (scrollable <= 0) {
      setActiveIndex(slideCount - 1)
      setProgress(1)
      return
    }

    const p = Math.min(Math.max(scrolled / scrollable, 0), 1)
    setProgress(p)
    setActiveIndex(Math.min(Math.floor(p * slideCount), slideCount - 1))
  }, [sectionRef, slideCount])

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(tick)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    tick()
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId.current)
    }
  }, [tick])

  return { activeIndex, progress, vhPerSlide: VH_PER_SLIDE }
}
