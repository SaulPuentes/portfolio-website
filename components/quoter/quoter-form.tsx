"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"
import { useQuoter } from "@/hooks/use-quoter"
import { QuoterProgress } from "./quoter-progress"
import { QuoterStep } from "./quoter-step"
import { QuoterResult } from "./quoter-result"
import { ArrowLeft, ArrowRight } from "lucide-react"

export function QuoterForm() {
  const { locale } = useI18n()
  const quoter = useQuoter(locale)

  if (quoter.showResult) {
    return (
      <QuoterResult
        priceRange={quoter.priceRange}
        currency={quoter.config.currency}
        config={quoter.config}
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
        <Button onClick={quoter.next} disabled={!quoter.canGoNext()}>
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
