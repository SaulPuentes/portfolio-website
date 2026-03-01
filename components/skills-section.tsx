"use client"

import { useI18n } from "@/lib/i18n/context"
import { skills } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Layers } from "lucide-react"
import type { Translations } from "@/lib/i18n/types"

function getCategoryLabel(
  key: string,
  t: Translations
): string {
  const map: Record<string, string> = {
    frontend: t.skills.frontend,
    backend: t.skills.backend,
    cloud: t.skills.cloud,
    databases: t.skills.databases,
    practices: t.skills.practices,
  }
  return map[key] || key
}

export function SkillsSection() {
  const { t } = useI18n()

  return (
    <section id="skills" className="scroll-mt-16 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <div className="mb-10 flex items-center gap-2">
          <Layers className="size-4 text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t.skills.sectionTitle}
          </h2>
        </div>

        {/* Masonry-style grid */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {skills.map((category) => (
            <div
              key={category.key}
              className="mb-6 break-inside-avoid rounded-lg border border-border bg-card p-5"
            >
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
                {getCategoryLabel(category.key, t)}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {category.items.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant="secondary"
                    className="font-normal"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
