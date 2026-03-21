"use client"

import { useI18n } from "@/lib/i18n/context"
import { services } from "@/lib/data"
import type { Translations } from "@/lib/i18n/types"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const QUADRANT_ORDER = [0, 1, 2, 3] // TL, TR, BL, BR

export function ServicesSection() {
  const { t } = useI18n()
  const { sectionRef, visibleCount, isMobile } = useScrollReveal(QUADRANT_ORDER.length)

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative scroll-mt-16"
      style={{ height: isMobile ? "auto" : "300vh" }}
    >
      <div
        className={isMobile ? "" : "sticky top-0 h-screen flex items-center"}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-0">
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
                  className="flex flex-col justify-between p-8 md:p-12 transition-all duration-700 ease-out"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translateY(0)"
                      : "translateY(1.5rem)",
                  }}
                >
                  <div>
                    <span className="font-mono text-sm text-muted-foreground">
                      {service.number}
                    </span>
                    <h3 className="text-xl md:text-2xl font-semibold mt-2">
                      {serviceData.title}
                    </h3>
                    <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">
                      {serviceData.description}
                    </p>
                  </div>
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
