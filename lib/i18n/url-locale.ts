import { locales } from "./index"
import type { Locale } from "./types"

const validCodes = locales.map((l) => l.code)

export function getLocaleFromUrl(): Locale | null {
  if (typeof window === "undefined") return null

  // 1. Check pathname for leading /{locale} segment
  const segments = window.location.pathname.split("/").filter(Boolean)
  if (segments.length > 0 && validCodes.includes(segments[0] as Locale)) {
    return segments[0] as Locale
  }

  // 2. Fall back to ?lang= query parameter
  const params = new URLSearchParams(window.location.search)
  const lang = params.get("lang")
  if (lang && validCodes.includes(lang as Locale)) {
    return lang as Locale
  }

  return null
}
