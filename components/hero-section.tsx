"use client"

import { useEffect, useRef } from "react"
import { useI18n } from "@/lib/i18n/context"
import { cvFiles } from "@/lib/i18n"
import { Download, ArrowDown } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { SkillsMarquee } from "@/components/skills-marquee"

export function HeroSection() {
  const { locale, t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const items = el.querySelectorAll<HTMLElement>("[data-hero]")
    const delays = [300, 600, 900, 1200]
    items.forEach((item, i) => {
      setTimeout(() => {
        item.style.transition = "opacity 0.9s ease-out, transform 0.9s ease-out"
        item.style.opacity = "1"
        item.style.transform = "translateY(0)"
      }, delays[i] ?? 300 * i)
    })

  }, [])

  return (
    <section id="about" className="scroll-mt-16 flex h-dvh min-h-[600px] flex-col pt-16">
      <div ref={sectionRef} className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left — Identity */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 data-hero className="text-5xl font-bold tracking-tight text-foreground lg:text-6xl text-balance opacity-0 translate-y-6">
                {siteConfig.name}
              </h1>
              <p data-hero className="mt-4 text-lg font-medium text-foreground/70 text-balance opacity-0 translate-y-6">
                {t.hero.title}
              </p>
            </div>

            <div data-hero className="mt-10 flex flex-wrap gap-3 opacity-0 translate-y-6">
              <Button asChild size="lg">
                <a href={cvFiles[locale]} download>
                  <Download className="size-4" />
                  {t.hero.downloadCv}
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document
                    .querySelector("#projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <ArrowDown className="size-4" />
                {t.hero.viewProjects}
              </Button>
            </div>
          </div>

          {/* Right — Short intro */}
          <div data-hero className="flex flex-col justify-center opacity-0 translate-y-6">
            <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
              {t.hero.description}
            </p>
          </div>

        </div>
      </div>

      <SkillsMarquee />
    </section>
  )
}
