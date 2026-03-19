"use client"

import { useEffect, useRef, useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { services } from "@/lib/data"
import type { Translations } from "@/lib/i18n/types"

const QUADRANT_ORDER = [0, 1, 2, 3] // TL, TR, BL, BR

export function ServicesSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const sectionHeight = section.offsetHeight
      const scrolled = -rect.top
      const scrollableDistance = sectionHeight - window.innerHeight

      if (scrolled < 0) {
        setVisibleCount(0)
        return
      }

      if (scrollableDistance <= 0) {
        setVisibleCount(4)
        return
      }

      const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1)
      // Show 1 at 0%, 2 at 25%, 3 at 50%, 4 at 75%
      const count = Math.min(Math.floor(progress * 5) + 1, 4)
      setVisibleCount(count)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">{t.services.sectionTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {QUADRANT_ORDER.map((index) => {
              const service = services[index]
              const serviceData = t.services[
                service.key as keyof Translations["services"]
              ] as { title: string; description: string }
              const isVisible = index < visibleCount

              return (
                <div
                  key={service.key}
                  className="p-8 md:p-12 transition-all duration-700 ease-out"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translateY(0)"
                      : "translateY(1.5rem)",
                  }}
                >
                  <span className="font-mono text-sm text-muted-foreground">
                    {service.number}
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold mt-2">
                    {serviceData.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">
                    {serviceData.description}
                  </p>
                  <hr className="mt-6 border-border" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
