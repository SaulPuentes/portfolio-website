"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronDown } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { ThemeToggle } from "@/components/theme-toggle"
import { locales } from "@/lib/i18n"
import { useHeader } from "@/hooks/use-header"

export function Header() {
  const {
    locale,
    t,
    localePrefix,
    currentLocale,
    navItems,
    mobileOpen,
    setMobileOpen,
    langOpen,
    setLangOpen,
    activeHref,
    headerReady,
    headerRef,
    buttonRefs,
    sliderStyle,
    handleSetLocale,
    scrollTo,
  } = useHeader()

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="text-sm font-semibold tracking-tight text-foreground transition-all duration-700 ease-out"
          style={{
            opacity: headerReady ? 1 : 0,
            transform: headerReady ? "translateY(0)" : "translateY(-10px)",
            transitionDelay: "0ms",
          }}
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        >
          {siteConfig.brandName}
        </a>

        {/* Desktop nav */}
        <nav className="relative hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {navItems.map((item, i) => (
            <button
              key={item.href}
              ref={(el) => {
                if (el) buttonRefs.current.set(item.href, el)
                else buttonRefs.current.delete(item.href)
              }}
              onClick={() => scrollTo(item.href)}
              className={cn(
                "text-sm transition-all duration-700 ease-out hover:text-foreground",
                activeHref === item.href ? "text-foreground" : "text-muted-foreground"
              )}
              style={{
                opacity: headerReady ? 1 : 0,
                transform: headerReady ? "translateY(0)" : "translateY(-10px)",
                transitionDelay: `${(i + 1) * 80}ms`,
              }}
            >
              {item.label}
            </button>
          ))}

          <Link
            href={`${localePrefix}/cotizador`}
            className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all duration-700 ease-out hover:bg-primary/90"
            style={{
              opacity: headerReady ? 1 : 0,
              transform: headerReady ? "translateY(0)" : "translateY(-10px)",
              transitionDelay: `${(navItems.length + 1) * 80}ms`,
            }}
          >
            Cotizar
          </Link>

          {/* Language Switcher */}
          <div
            className="relative transition-all duration-700 ease-out"
            style={{
              opacity: headerReady ? 1 : 0,
              transform: headerReady ? "translateY(0)" : "translateY(-10px)",
              transitionDelay: `${(navItems.length + 2) * 80}ms`,
            }}
          >
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
                      handleSetLocale(l.code)
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

          {/* Theme Toggle */}
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: headerReady ? 1 : 0,
              transform: headerReady ? "translateY(0)" : "translateY(-10px)",
              transitionDelay: `${(navItems.length + 3) * 80}ms`,
            }}
          >
            <ThemeToggle />
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
            <Link
              href={`${localePrefix}/cotizador`}
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Cotizar
            </Link>
            <div className="mt-2 border-t border-border pt-2">
              <p className="px-3 pb-1 text-xs text-muted-foreground">Theme</p>
              <div className="px-3 pb-2">
                <ThemeToggle />
              </div>
              <p className="px-3 pb-1 text-xs text-muted-foreground">Language</p>
              <div className="flex gap-1">
                {locales.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      handleSetLocale(l.code)
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
      {sliderStyle && (
        <span
          className="absolute bottom-0 hidden h-[2px] bg-primary transition-all duration-300 ease-in-out md:block"
          style={{ width: sliderStyle.width, left: sliderStyle.left }}
        />
      )}
    </header>
  )
}
