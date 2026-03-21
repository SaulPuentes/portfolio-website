"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AlertTriangle, ChevronDown, Mail, RotateCcw } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

interface QuestionOption {
  label: Record<string, string>
  value: string
  price: number
}

interface Question {
  id: string
  question: Record<string, string>
  type: string
  options: QuestionOption[]
}

interface Section {
  id: string
  title: Record<string, string>
  questions: Question[]
}

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
  sections: Section[]
  answers: Record<string, string | string[]>
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

function getAnswerLabel(question: Question, answer: string | string[], t: (obj: Record<string, string>) => string): string {
  if (question.options.length === 0) return String(answer)
  if (Array.isArray(answer)) {
    return answer
      .map((v) => question.options.find((o) => o.value === v))
      .filter(Boolean)
      .map((o) => t(o!.label))
      .join(", ")
  }
  const opt = question.options.find((o) => o.value === answer)
  return opt ? t(opt.label) : String(answer)
}

export function QuoterResult({
  priceRange,
  currency,
  config,
  sections,
  answers,
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

      {/* Answers summary */}
      <Collapsible className="mx-auto max-w-md">
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted [&[data-state=open]>svg]:rotate-180">
            {t({ es: "Ver resumen de respuestas", en: "View answers summary", de: "Antwortübersicht anzeigen" })}
            <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {sections.map((section) =>
                  section.questions.map((question) => {
                    const answer = answers[question.id]
                    if (!answer || (Array.isArray(answer) && answer.length === 0)) return null
                    return (
                      <div key={question.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                        <p className="text-sm text-muted-foreground">{t(question.question)}</p>
                        <p className="mt-0.5 text-sm font-medium">{getAnswerLabel(question, answer, t)}</p>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

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
