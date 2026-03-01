"use client"

import { useI18n } from "@/lib/i18n/context"
import { experiences } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Briefcase } from "lucide-react"

function formatDate(date: string, locale: string): string {
  if (date === "Heute" || date === "Present" || date === "Presente") return date
  try {
    const d = new Date(date + "-01")
    return d.toLocaleDateString(locale === "de" ? "de-DE" : locale === "es" ? "es-ES" : "en-US", {
      month: "short",
      year: "numeric",
    })
  } catch {
    return date
  }
}

function getEndDateDisplay(endDate: string, locale: string): string {
  if (endDate === "Heute") {
    if (locale === "en") return "Present"
    if (locale === "es") return "Presente"
    return "Heute"
  }
  return formatDate(endDate, locale)
}

export function ExperienceSection() {
  const { locale, t } = useI18n()

  return (
    <section
      id="experience"
      className="scroll-mt-16 bg-secondary/30 px-4 py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center gap-2">
          <Briefcase className="size-4 text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t.experience.sectionTitle}
          </h2>
        </div>

        <div className="flex flex-col gap-0">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="group grid gap-4 border-t border-border py-8 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-5 lg:gap-8"
            >
              {/* Left: date & company */}
              <div className="lg:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {formatDate(exp.startDate, locale)}
                  {" — "}
                  {getEndDateDisplay(exp.endDate, locale)}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {exp.role[locale]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {exp.company[locale]}
                </p>
              </div>

              {/* Right: achievements & tech */}
              <div className="lg:col-span-3">
                <ul className="flex flex-col gap-2">
                  {exp.achievements[locale].map((achievement, aIdx) => (
                    <li
                      key={aIdx}
                      className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-2 block size-1 shrink-0 rounded-full bg-accent" />
                      {achievement}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="text-xs font-normal"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
