"use client"

import { useI18n } from "@/lib/i18n/context"
import { cvFiles } from "@/lib/i18n"
import { Download, ArrowDown } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { SkillsMarquee } from "@/components/skills-marquee"

export function HeroSection() {
  const { locale, t } = useI18n()

  return (
    <section id="about" className="scroll-mt-16 flex h-dvh min-h-[600px] flex-col px-4 pt-16 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">

          {/* Left — Identity */}
          <div className="flex flex-col justify-between lg:col-span-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
                {siteConfig.tagline}
              </p>
              <h1 className="text-5xl font-bold tracking-tight text-foreground lg:text-6xl text-balance">
                {siteConfig.name}
              </h1>
              <p className="mt-4 text-lg font-medium text-foreground/70 text-balance">
                {t.hero.title}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
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

          {/* Right — Summary + About combined */}
          <div className="flex flex-col justify-center gap-6 lg:col-span-3">
            <p className="text-base leading-relaxed text-foreground/80 lg:text-lg font-medium">
              {t.hero.subtitle}
            </p>

            <div className="h-px w-12 bg-accent/40" />

            <div className="flex flex-col gap-4">
              {t.hero.description.split(/\n\n+/).map((paragraph, idx) => (
                <p key={`desc-${idx}`} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

        </div>
      </div>

      <SkillsMarquee />
    </section>
  )
}
