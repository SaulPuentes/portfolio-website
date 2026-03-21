"use client"

import { useEffect, useRef, useState } from "react"

export function useScrollReveal(totalItems: number) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setVisibleCount(totalItems)
      return
    }

    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const sectionHeight = section.offsetHeight
      const scrolled = -rect.top
      const scrollableDistance = sectionHeight - window.innerHeight

      if (scrolled < 0) {
        setVisibleCount(1)
        return
      }

      if (scrollableDistance <= 0) {
        setVisibleCount(totalItems)
        return
      }

      const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1)
      const count = Math.min(Math.floor(progress * (totalItems + 1)) + 1, totalItems)
      setVisibleCount(count)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMobile, totalItems])

  return { sectionRef, visibleCount, isMobile }
}
