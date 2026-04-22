"use client"

import { useI18n } from "@/lib/i18n/context"
import { services } from "@/lib/data"
import type { Translations } from "@/lib/i18n/types"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const QUADRANT_ORDER = [0, 1, 2, 3]

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
      <div className={isMobile ? "" : "sticky top-0 h-screen flex items-center"}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-0">

          {/* Section header */}
          <div className="flex items-end justify-between mb-10 md:mb-14 gap-4">
            <h2
              className="mt-3 font-medium text-3xl md:text-5xl tracking-[-0.03em] leading-[1]"
              style={{ fontFamily: "var(--font-display)" }}
            >
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
                  className={`group relative overflow-hidden border-b border-border p-8 md:p-10 transition-all duration-700 ease-out ${
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
                    className="pointer-events-none absolute right-6 top-6 select-none font-mono font-medium leading-none text-foreground/[0.05] transition-all duration-500 group-hover:text-accent/30"
                    style={{
                      fontSize: "clamp(4rem, 9vw, 7rem)",
                    }}
                    aria-hidden="true"
                  >
                    {service.number}
                  </span>

                  {/* Accent top line reveal */}
                  <span
                    className="absolute left-0 top-0 h-[2px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full"
                    aria-hidden="true"
                  />

                  <div className="relative flex flex-col h-full min-h-[220px]">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="text-accent">{service.number}</span>
                        <span className="h-px w-4 bg-border" aria-hidden="true" />
                        <span>{service.key}</span>
                      </div>

                      <h3
                        className="mt-5 font-medium text-2xl md:text-[28px] leading-[1.15] tracking-[-0.02em] transition-colors duration-300"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {serviceData.title}
                      </h3>
                      <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-muted-foreground max-w-md">
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
