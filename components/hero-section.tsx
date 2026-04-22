"use client"

import { useEffect, useRef } from "react"
import { useI18n } from "@/lib/i18n/context"
import { cvFiles } from "@/lib/i18n"
import { Download, ArrowDown } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { SkillsMarquee } from "@/components/skills-marquee"

const [firstName, ...rest] = siteConfig.name.split(" ")
const lastName = rest.join(" ")

export function HeroSection() {
  const { locale, t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const items = el.querySelectorAll<HTMLElement>("[data-hero]")
    const delays = [100, 300, 500, 700, 900]
    items.forEach((item, i) => {
      setTimeout(() => {
        item.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"
        item.style.opacity = "1"
        item.style.transform = "translateY(0)"
      }, delays[i] ?? 200 * i)
    })
  }, [])

  return (
    <section
      id="about"
      className="scroll-mt-16 relative flex h-dvh min-h-[640px] flex-col overflow-hidden pt-14 sm:pt-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background/80 to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background/80 to-transparent z-10"
      />

      {/* Content — flex-1 with min-h-0 allows shrinking on short viewports */}
      <div
        ref={sectionRef}
        className="mx-auto flex w-full max-w-7xl flex-1 min-h-0 flex-col justify-center px-6 sm:px-10 lg:px-14 py-4"
        style={{ rowGap: "clamp(0.75rem, 3vh, 2.25rem)" }}
      >
        {/* Eyebrow — coordinate/status line */}
        <div
          data-hero
          className="opacity-0 translate-y-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span
              className="relative flex h-1.5 w-1.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="text-accent">available</span>
          </span>
          <span className="h-px w-6 bg-border" aria-hidden="true" />
          <span className="truncate">{t.hero.title}</span>
        </div>

        {/* Name — scales with viewport height to avoid collision */}
        <h1
          data-hero
          className="opacity-0 translate-y-8 leading-[0.95] font-medium tracking-[-0.04em] text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, min(9vw, 11vh), 6rem)",
          }}
        >
          <span className="block">{firstName}</span>
          <span className="block text-foreground/50">{lastName}</span>
        </h1>

        {/* Thin accent rule */}
        <div
          data-hero
          className="opacity-0 translate-y-4 flex items-center gap-4"
        >
          <span
            className="h-px flex-1 bg-gradient-to-r from-border via-border to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Bottom row — description + CTAs */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Description */}
          <div
            data-hero
            className="opacity-0 translate-y-6 lg:col-span-7 min-w-0"
          >
            <div className="flex gap-4">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground pt-1.5 flex-shrink-0 hidden sm:block"
                aria-hidden="true"
              >
                // bio
              </span>
              <p
                className="leading-relaxed text-foreground/80 max-w-xl"
                style={{ fontSize: "clamp(0.9rem, 1.6vh, 1.125rem)" }}
              >
                {t.hero.description}
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div
            data-hero
            className="opacity-0 translate-y-6 flex flex-wrap gap-3 lg:col-span-5 lg:justify-end"
          >
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
      </div>

      <SkillsMarquee />
    </section>
  )
}
