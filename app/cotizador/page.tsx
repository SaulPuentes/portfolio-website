import { CotizadorClient } from "./client"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `Cotizador | ${siteConfig.name}`,
  description: "Obtén un estimado del costo de tu proyecto web o aplicación.",
}

export default function CotizadorPage() {
  return <CotizadorClient />
}
