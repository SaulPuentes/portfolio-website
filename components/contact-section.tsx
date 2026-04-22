"use client"

import { useI18n } from "@/lib/i18n/context"
import { siteConfig } from "@/lib/site-config"
import { Mail, Linkedin, Github, ArrowUpRight, type LucideIcon } from "lucide-react"

const platformIcons: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
}

export function ContactSection() {
  const { t } = useI18n()

  const links = [
    {
      icon: Mail,
      label: siteConfig.email,
      meta: "email",
      href: `mailto:${siteConfig.email}`,
    },
    ...siteConfig.socialLinks.map((link) => ({
      icon: platformIcons[link.platform] || Mail,
      label: link.label,
      meta: link.platform,
      href: link.url,
    })),
  ]

  return (
    <section
      id="contact"
      className="scroll-mt-16 bg-secondary/30 pt-36 pb-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Left — identity */}
          <div className="lg:col-span-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              // contact
            </span>
            <h2
              className="mt-3 font-medium text-4xl md:text-6xl tracking-[-0.03em] leading-[0.95]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.contact.sectionTitle}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground max-w-sm">
              {t.contact.description}
            </p>

            {/* Status line */}
            <div className="mt-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="text-accent">open to work</span>
            </div>
          </div>

          {/* Right — links as rows */}
          <div className="lg:col-span-7">
            <ul className="border-t border-border">
              {links.map((link, i) => {
                const isExternal = !link.href.startsWith("mailto")
                const Icon = link.icon
                return (
                  <li key={link.href} className="border-b border-border">
                    <a
                      href={link.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="group relative flex items-center gap-6 py-6 md:py-7 transition-colors hover:text-accent"
                    >
                      {/* Number */}
                      <span className="font-mono text-[11px] text-muted-foreground w-6 flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Icon */}
                      <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-accent flex-shrink-0" />

                      {/* Label + meta */}
                      <div className="flex-1 flex items-baseline gap-3 min-w-0">
                        <span
                          className="font-medium text-lg md:text-xl tracking-[-0.01em] truncate"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {link.label}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:inline">
                          {link.meta}
                        </span>
                      </div>

                      {/* Arrow */}
                      <ArrowUpRight
                        className="size-5 text-muted-foreground transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                        strokeWidth={1.75}
                      />

                      {/* Accent hover bar */}
                      <span
                        className="absolute left-0 bottom-[-1px] h-[2px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
