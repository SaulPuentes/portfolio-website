"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"
import { useQuoter } from "@/hooks/use-quoter"
import { QuoterProgress } from "./quoter-progress"
import { QuoterStep } from "./quoter-step"
import { QuoterResult } from "./quoter-result"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface QuoterFormProps {
  onShowResult?: (showing: boolean) => void
}

export function QuoterForm({ onShowResult }: QuoterFormProps) {
  const { locale } = useI18n()
  const quoter = useQuoter(locale)
  const stepComplete = quoter.canGoNext()

  useEffect(() => {
    onShowResult?.(quoter.showResult)
  }, [quoter.showResult, onShowResult])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "TEXTAREA" || tag === "INPUT") return
      if (e.key === "Enter" && stepComplete) {
        e.preventDefault()
        quoter.next()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [stepComplete, quoter.next])

  if (quoter.showResult) {
    return (
      <QuoterResult
        priceRange={quoter.priceRange}
        currency={quoter.config.currency}
        config={quoter.config}
        sections={quoter.sections}
        answers={quoter.answers}
        t={quoter.t}
        onRestart={quoter.restart}
      />
    )
  }

  const section = quoter.sections[quoter.currentStep]

  return (
    <div className="space-y-6">
      <QuoterProgress current={quoter.currentStep} total={quoter.totalSteps} />

      <Card>
        <CardHeader>
          <CardTitle>{quoter.t(section.title)}</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoterStep
            questions={section.questions}
            answers={quoter.answers}
            onAnswer={quoter.setAnswer}
            t={quoter.t}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={quoter.prev}
          disabled={quoter.currentStep === 0}
        >
          <ArrowLeft className="mr-2 size-4" />
          {quoter.t(quoter.config.buttons.prev)}
        </Button>
        <Button
          onClick={quoter.next}
          disabled={!stepComplete}
          className={cn(
            stepComplete &&
              "ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}
        >
          {quoter.currentStep === quoter.totalSteps - 1
            ? quoter.t(quoter.config.buttons.finish)
            : quoter.t(quoter.config.buttons.next)}
          {quoter.currentStep < quoter.totalSteps - 1 && (
            <ArrowRight className="ml-2 size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
