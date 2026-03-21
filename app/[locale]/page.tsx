import { notFound } from "next/navigation"
import Home from "../page"
import type { Locale } from "@/lib/i18n/types"

const validLocales: Locale[] = ["en", "es", "de"]

export function generateStaticParams() {
  return validLocales.map((locale) => ({ locale }))
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!validLocales.includes(locale as Locale)) {
    notFound()
  }
  return <Home />
}
