import { notFound } from "next/navigation"
import type { Locale } from "@/lib/i18n/types"
import { CotizadorClient } from "../../cotizador/client"

const validLocales: Locale[] = ["en", "es", "de"]

export function generateStaticParams() {
  return validLocales.map((locale) => ({ locale }))
}

export default async function LocaleCotizadorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!validLocales.includes(locale as Locale)) {
    notFound()
  }
  return <CotizadorClient />
}
