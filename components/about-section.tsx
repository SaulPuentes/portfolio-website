"use client"

import { useI18n } from "@/lib/i18n/context"
import { User } from "lucide-react"

export function AboutSection() {
  const { t } = useI18n()

  return (
    <section id="about" className="scroll-mt-16 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Label */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <User className="size-4 text-accent" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t.about.sectionTitle}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4">
              {t.about.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
