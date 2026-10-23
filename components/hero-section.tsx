"use client"

import { useEffect, useRef } from "react"
import { useI18n } from "@/lib/i18n/context"
import { cvFiles } from "@/lib/i18n"
import { Download, Play } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { SkillsMarquee } from "@/components/skills-marquee"
import { HeroGlobe } from "@/components/hero-globe"
import { AUTOPLAY_TOGGLE_EVENT, HERO_INTRO_EVENT, HERO_INTRO_TEXT_MS } from "@/lib/autoplay"

const [firstName, ...rest] = siteConfig.name.split(" ")
const lastName = rest.join(" ")

export function HeroSection() {
  const { locale, t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    // Stagger in visual order: the phone layout moves the name above the eyebrow with `order`
    const items = [...el.querySelectorAll<HTMLElement>("[data-hero]")].sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    )
    const delays = [100, 300, 500, 700, 900]
    let timers: ReturnType<typeof setTimeout>[] = []

    const runIntro = (offset: number) => {
      timers.forEach(clearTimeout)
      // Drop inline styles so the Tailwind start state (opacity-0, translate-y-*) applies again
      for (const item of items) {
        item.style.transition = "none"
        item.style.opacity = ""
        item.style.translate = ""
      }
      void el.offsetHeight
      timers = items.map((item, i) =>
        setTimeout(() => {
          // Tailwind 4's translate-y-* sets the `translate` property, so reset that (not transform)
          item.style.transition = "opacity 0.8s ease-out, translate 0.8s ease-out"
          item.style.opacity = "1"
          item.style.translate = "0 0"
        }, offset + (delays[i] ?? 200 * i)),
      )
    }

    // On replay the globe fades in first (HeroGlobe), so the text waits for it
    const replay = () => runIntro(HERO_INTRO_TEXT_MS)
    runIntro(0)
    window.addEventListener(HERO_INTRO_EVENT, replay)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener(HERO_INTRO_EVENT, replay)
    }
  }, [])

  return (
    <section
      id="about"
      className="scroll-mt-16 relative flex h-dvh min-h-[640px] flex-col overflow-hidden pt-14 sm:pt-16"
    >
      <HeroGlobe />
      {/* Veil — fades the globe out behind the text. Same switch as scene.ts: aspect < 0.9 is the
          phone layout (globe on top, veil from the bottom), wider is desktop (veil from the left). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,var(--background)_8%,color-mix(in_oklch,var(--background)_80%,transparent)_45%,transparent_75%)] [@media(min-aspect-ratio:9/10)]:bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklch,var(--background)_70%,transparent)_30%,transparent_62%)]"
      />
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
        className="relative z-[1] pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto mx-auto flex w-full max-w-7xl flex-1 min-h-0 flex-col justify-end [@media(min-aspect-ratio:9/10)]:justify-center px-6 sm:px-10 lg:px-14 pt-4 pb-8 [@media(min-aspect-ratio:9/10)]:pb-4"
        style={{ rowGap: "clamp(0.75rem, 3vh, 2.25rem)" }}
      >
        {/* Eyebrow — coordinate/status line. Phone: sits under the name and wraps instead of truncating */}
        <div
          data-hero
          className="opacity-0 translate-y-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-muted-foreground [@media(min-aspect-ratio:9/10)]:flex-nowrap"
        >
          <span className="flex items-center gap-2">
            <span
              className="relative flex h-1.5 w-1.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="text-accent">{t.hero.available}</span>
          </span>
          <span className="hidden [@media(min-aspect-ratio:9/10)]:block h-px w-6 bg-border" aria-hidden="true" />
          <span className="basis-full [@media(min-aspect-ratio:9/10)]:basis-auto [@media(min-aspect-ratio:9/10)]:truncate">
            {t.hero.title}
          </span>
        </div>

        {/* Name — scales with viewport height to avoid collision */}
        <h1
          data-hero
          className="-order-1 [@media(min-aspect-ratio:9/10)]:order-none opacity-0 translate-y-8 leading-[0.95] font-medium tracking-[-0.04em] text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, min(9vw, 11vh), 6rem)",
          }}
        >
          <span className="block">{firstName}</span>
          <span className="block text-foreground/50">{lastName}</span>
        </h1>

        {/* Thin accent rule — desktop only; on a phone the globe above already separates */}
        <div
          data-hero
          className="opacity-0 translate-y-4 hidden [@media(min-aspect-ratio:9/10)]:flex items-center gap-4 lg:[@media(min-aspect-ratio:9/10)]:max-w-[55%]"
        >
          <span
            className="h-px flex-1 bg-gradient-to-r from-border via-border to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Description + CTAs — one column so the globe keeps the right side */}
        <div className="flex flex-col gap-6 lg:[@media(min-aspect-ratio:9/10)]:max-w-[55%]">
          <div data-hero className="opacity-0 translate-y-6 min-w-0">
            <p
              className="leading-relaxed text-foreground/80 max-w-xl"
              style={{ fontSize: "clamp(0.9rem, 1.6vh, 1.125rem)" }}
            >
              {t.hero.description}
            </p>
          </div>

          <div
            data-hero
            className="opacity-0 translate-y-6 flex flex-wrap justify-start gap-3 [&>*]:flex-1 [@media(min-aspect-ratio:9/10)]:[&>*]:flex-none"
          >
            <Button
              size="lg"
              data-autoplay-control
              onClick={() => window.dispatchEvent(new Event(AUTOPLAY_TOGGLE_EVENT))}
            >
              <Play className="size-4" />
              {t.hero.autoplay}
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={cvFiles[locale]} download>
                <Download className="size-4" />
                {t.hero.downloadCv}
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-[1] mt-auto shrink-0">
        <SkillsMarquee />
      </div>
    </section>
  )
}
