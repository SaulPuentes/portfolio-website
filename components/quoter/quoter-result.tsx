"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Mail, RotateCcw } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

interface QuoterResultProps {
  priceRange: { min: number; max: number }
  currency: string
  config: {
    resultTitle: Record<string, string>
    resultDescription: Record<string, string>
    disclaimer: Record<string, string>
    contactCta: Record<string, string>
    buttons: { restart: Record<string, string> }
  }
  t: (obj: Record<string, string>) => string
  onRestart: () => void
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function QuoterResult({
  priceRange,
  currency,
  config,
  t,
  onRestart,
}: QuoterResultProps) {
  const mailSubject = encodeURIComponent("Solicitud de cotización")
  const mailBody = encodeURIComponent(
    `Hola, completé el cotizador en tu sitio web y obtuve un estimado de ${formatPrice(priceRange.min, currency)} - ${formatPrice(priceRange.max, currency)}. Me gustaría obtener una cotización formal.`
  )

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t(config.resultTitle)}</h2>
        <p className="mt-2 text-muted-foreground">{t(config.resultDescription)}</p>
      </div>

      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <p className="text-4xl font-bold text-primary">
            {formatPrice(priceRange.min, currency)} – {formatPrice(priceRange.max, currency)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{currency}</p>
        </CardContent>
      </Card>

      <div className="mx-auto max-w-md rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
          <p className="text-sm text-muted-foreground">{t(config.disclaimer)}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button asChild size="lg">
          <a href={`mailto:${siteConfig.email}?subject=${mailSubject}&body=${mailBody}`}>
            <Mail className="mr-2 size-4" />
            {t(config.contactCta)}
          </a>
        </Button>
        <Button variant="ghost" size="sm" onClick={onRestart}>
          <RotateCcw className="mr-2 size-4" />
          {t(config.buttons.restart)}
        </Button>
      </div>
    </div>
  )
}
