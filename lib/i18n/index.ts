import { de } from "./de"
import { en } from "./en"
import { es } from "./es"
import type { Locale, Translations } from "./types"

export type { Locale, Translations }

const translations: Record<Locale, Translations> = { de, en, es }

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}

export const locales: { code: Locale; label: string; flag: string }[] = [
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "en", label: "English", flag: "EN" },
  { code: "es", label: "Espanol", flag: "ES" },
]

export const defaultLocale: Locale = "en"

export const cvFiles: Record<Locale, string> = {
  de: "/cv/CV_DE.pdf",
  en: "/cv/CV_EN.pdf",
  es: "/cv/CV_ES.pdf",
}
