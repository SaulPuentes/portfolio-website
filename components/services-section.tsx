"use client"

import { useEffect, useState } from "react"
import { SERVICE_EVENT } from "@/lib/autoplay"
import { useI18n } from "@/lib/i18n/context"
import { services } from "@/lib/data"
import type { Translations } from "@/lib/i18n/types"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { ServicesBackground } from "@/components/services-background"

const QUADRANT_ORDER = [0, 1, 2, 3]

export function ServicesSection() {
  const { t } = useI18n()
  const { sectionRef, visibleCount, isMobile } = useScrollReveal(QUADRANT_ORDER.length)
  const [tourCard, setTourCard] = useState<number | null>(null)
  // The tour plays its card as if hovered, only while that card is the newest one revealed: scrolling away releases it
  const activeCard = tourCard !== null && tourCard === visibleCount - 1 ? tourCard : null

  useEffect(() => {
    const onTour = (e: Event) => setTourCard((e as CustomEvent<number | null>).detail)
    window.addEventListener(SERVICE_EVENT, onTour)
    return () => window.removeEventListener(SERVICE_EVENT, onTour)
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative -scroll-mt-10 md:scroll-mt-0"
      style={{ height: isMobile ? "auto" : "300vh" }}
    >
      <ServicesBackground key={isMobile ? "phone" : "desktop"} sectionRef={sectionRef} revealed={visibleCount} active={activeCard} isMobile={isMobile} />
      <div className={isMobile ? "relative" : "sticky top-0 h-screen flex items-center"}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-0">

          {/* Section header */}
          <div className="flex items-end justify-between mb-10 md:mb-14 gap-4">
            <h2 className="section-title mt-3">
              {t.services.sectionTitle}
            </h2>
            <span className="font-mono text-[11px] text-muted-foreground hidden sm:block pb-1">
              [{String(services.length).padStart(2, "0")}]
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border">
            {QUADRANT_ORDER.map((index) => {
              const service = services[index]
              const serviceData = t.services[
                service.key as keyof Translations["services"]
              ] as { title: string; description: string }
              const isVisible = index < visibleCount
              const isRight = index % 2 === 1

              return (
                <div
                  key={service.key}
                  data-service-cell
                  data-active={index === activeCard || undefined}
                  className={`group relative overflow-hidden border-b border-border p-8 pb-44 md:p-8 transition-all duration-700 ease-out ${
                    isRight ? "md:border-l" : ""
                  }`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
                    transitionDelay: `${index * 80}ms`,
                  }}
                >
                  {/* Ghost number — mono, subtle depth */}
                  <span
                    data-service-number
                    className="pointer-events-none absolute right-6 top-6 select-none font-mono font-medium leading-none text-foreground/[0.05] transition-all duration-500 group-hover:text-accent/30 group-data-active:text-accent/30"
                    style={{
                      fontSize: "clamp(3rem, 5vw, 4rem)",
                    }}
                    aria-hidden="true"
                  >
                    {service.number}
                  </span>

                  {/* Accent top line reveal */}
                  <span
                    className="absolute left-0 top-0 h-[2px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full group-data-active:w-full"
                    aria-hidden="true"
                  />

                  <div className="relative flex flex-col h-full min-h-[237px]">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="text-accent">{service.number}</span>
                        <span className="h-px w-4 bg-border" aria-hidden="true" />
                        <span>{service.key}</span>
                      </div>

                      <h3
                        className="mt-4 font-medium text-xl md:text-2xl leading-[1.15] tracking-[-0.02em] transition-colors duration-300"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {serviceData.title}
                      </h3>
                      <p className="mt-3 text-[13px] md:text-sm leading-relaxed text-muted-foreground max-w-[23rem]">
                        {serviceData.description}
                      </p>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
