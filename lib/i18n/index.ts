import enJson from "@/content/i18n/en.json"
import esJson from "@/content/i18n/es.json"
import deJson from "@/content/i18n/de.json"
import { siteConfig } from "@/lib/site-config"
import type { Locale, Translations } from "./types"

export type { Locale, Translations }

const translations: Record<string, Translations> = {
  de: deJson as Translations,
  en: enJson as Translations,
  es: esJson as Translations,
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}

export const locales = siteConfig.locales
export const defaultLocale = siteConfig.defaultLocale as Locale
export const cvFiles = siteConfig.cvFiles as Record<Locale, string>
