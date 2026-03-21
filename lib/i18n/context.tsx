"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { getTranslations, defaultLocale, locales } from "./index"
import { getLocaleFromUrl } from "./url-locale"
import type { Locale, Translations } from "./types"

interface I18nContextValue {
  locale: Locale
  t: Translations
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const urlLocale = getLocaleFromUrl()
    if (urlLocale) {
      setLocaleState(urlLocale)
      localStorage.setItem("portfolio-locale", urlLocale)
      document.documentElement.lang = urlLocale
      return
    }
    const stored = localStorage.getItem("portfolio-locale") as Locale | null
    const validCodes = locales.map(l => l.code)
    if (stored && validCodes.includes(stored)) {
      setLocaleState(stored)
      document.documentElement.lang = stored
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("portfolio-locale", newLocale)
    document.documentElement.lang = newLocale
  }, [])

  const t = getTranslations(locale)

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
