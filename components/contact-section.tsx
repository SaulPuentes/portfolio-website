"use client"

import { useI18n } from "@/lib/i18n/context"
import { Mail, Linkedin, Github } from "lucide-react"

export function ContactSection() {
  const { t } = useI18n()

  const links = [
    {
      icon: Mail,
      label: "hola@saulpuentes.com",
      href: "mailto:hola@saulpuentes.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/saul-puentes",
    },
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/saulpuentes",
    },
  ]

  return (
    <section
      id="contact"
      className="scroll-mt-16 bg-secondary/30 px-4 py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Label */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-accent" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t.contact.sectionTitle}
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.contact.description}
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={
                    link.href.startsWith("mailto")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/40"
                >
                  <link.icon className="size-4 text-muted-foreground transition-colors group-hover:text-accent" />
                  <span className="text-sm font-medium text-foreground">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
