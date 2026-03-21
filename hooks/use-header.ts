"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useI18n } from "@/lib/i18n/context"
import { locales, defaultLocale } from "@/lib/i18n"
import { usePathname, useRouter } from "next/navigation"

export function useHeader() {
  const { locale, setLocale, t } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

  // Locale prefix derived from current path
  const segments = pathname.split("/").filter(Boolean)
  const validCodes = locales.map((l) => l.code)
  const pathHasLocale = segments.length > 0 && validCodes.includes(segments[0] as typeof locale)
  const localePrefix = pathHasLocale ? `/${segments[0]}` : ""

  const handleSetLocale = (code: typeof locale) => {
    setLocale(code)
    const basePath = pathHasLocale ? "/" + segments.slice(1).join("/") : pathname
    if (code === defaultLocale) {
      router.replace(basePath || "/")
    } else {
      router.replace(`/${code}${basePath === "/" ? "" : basePath}`)
    }
  }

  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [activeHref, setActiveHref] = useState<string | null>(null)
  const [sliderStyle, setSliderStyle] = useState<{ width: number; left: number } | null>(null)
  const [headerReady, setHeaderReady] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const navItems = [
    { href: "#about", label: t.nav.about },
    { href: "#services", label: t.nav.services },
    { href: "#projects", label: t.nav.projects },
    { href: "#contact", label: t.nav.contact },
  ]

  const currentLocale = locales.find((l) => l.code === locale)

  useEffect(() => {
    const timer = setTimeout(() => setHeaderReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const updateSlider = useCallback(() => {
    if (!activeHref || !headerRef.current) return
    const btn = buttonRefs.current.get(activeHref)
    if (!btn) return
    const headerRect = headerRef.current.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    setSliderStyle({ width: btnRect.width, left: btnRect.left - headerRect.left })
  }, [activeHref])

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace("#", ""))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`)
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    )
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateSlider()
    window.addEventListener("resize", updateSlider)
    return () => window.removeEventListener("resize", updateSlider)
  }, [updateSlider])

  function scrollTo(href: string) {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return {
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
  }
}
