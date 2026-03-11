import config from "@/content/site.json"

export interface SiteConfig {
  name: string
  brandName: string
  tagline: string
  email: string
  footerNote: string
  socialLinks: { platform: string; label: string; url: string }[]
  locales: { code: string; label: string; flag: string }[]
  defaultLocale: string
  cvFiles: Record<string, string>
}

export const siteConfig: SiteConfig = config
