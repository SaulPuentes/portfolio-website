import config from "@/content/site.json"
import type { Locale } from "@/lib/i18n/types"

export interface SiteConfig {
  name: string
  brandName: string
  tagline: string
  email: string
  footerNote: string
  socialLinks: { platform: string; label: string; url: string }[]
  locales: { code: Locale; label: string; flag: string }[]
  defaultLocale: Locale
  cvFiles: Record<Locale, string>
}

/** JSON `code` fields are inferred as `string`; assert at load so consumers get `Locale`. */
export const siteConfig = config as SiteConfig
