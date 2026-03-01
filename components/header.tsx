"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { locales } from "@/lib/i18n"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const { locale, setLocale, t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const navItems = [
    { href: "#about", label: t.nav.about },
    { href: "#skills", label: t.nav.skills },
    { href: "#experience", label: t.nav.experience },
    { href: "#projects", label: t.nav.projects },
    { href: "#contact", label: t.nav.contact },
  ]

  const currentLocale = locales.find((l) => l.code === locale)

  function scrollTo(href: string) {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-8">
        <a
          href="#"
          className="text-sm font-semibold tracking-tight text-foreground"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        >
          {"S. Puentes"}
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </button>
          ))}

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              onBlur={() => setTimeout(() => setLangOpen(false), 150)}
              className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
              aria-label="Select language"
            >
              {currentLocale?.flag}
              <ChevronDown className="size-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 rounded-md border border-border bg-card shadow-md">
                {locales.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLocale(l.code)
                      setLangOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-muted",
                      l.code === locale
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="flex items-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="size-5 text-foreground" />
          ) : (
            <Menu className="size-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              <p className="px-3 pb-1 text-xs text-muted-foreground">Language</p>
              <div className="flex gap-1">
                {locales.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLocale(l.code)
                      setMobileOpen(false)
                    }}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs transition-colors",
                      l.code === locale
                        ? "bg-foreground text-background font-medium"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    )}
                  >
                    {l.flag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
