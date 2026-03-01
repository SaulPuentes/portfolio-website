"use client"

import { useI18n } from "@/lib/i18n/context"
import { cvFiles } from "@/lib/i18n"
import { Download, ArrowDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const { locale, t } = useI18n()

  return (
    <section className="flex min-h-[85vh] flex-col justify-center px-4 pt-14 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Left - Name and title */}
          <div className="lg:col-span-2">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {"Full-Stack Engineer"}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl text-balance">
              {"Saul Puentes"}
            </h1>
            <p className="mt-4 text-lg font-medium text-foreground/80">
              {t.hero.title}
            </p>
          </div>

          {/* Right - Description and CTAs */}
          <div className="flex flex-col justify-center lg:col-span-3">
            <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
              {t.hero.subtitle}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a href={cvFiles[locale]} download>
                  <Download className="size-4" />
                  {t.hero.downloadCv}
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document
                    .querySelector("#projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <ArrowDown className="size-4" />
                {t.hero.viewProjects}
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://salsa-world.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="size-4" />
                  {t.hero.salsaWorld}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
