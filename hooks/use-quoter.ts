"use client"

import { useState, useCallback, useMemo } from "react"
import quoterConfig from "@/content/data/quoter-config.json"
import type { Locale } from "@/lib/i18n/types"

type Answers = Record<string, string | string[]>

export function useQuoter(locale: Locale) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [showResult, setShowResult] = useState(false)

  const sections = quoterConfig.sections
  const totalSteps = sections.length

  const setAnswer = useCallback((questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }, [])

  const canGoNext = useCallback(() => {
    const section = sections[currentStep]
    return section.questions.every((q) => {
      if (q.type === "text" || q.type === "email") {
        const val = answers[q.id]
        if (q.id === "comments") return true // optional
        return typeof val === "string" && val.trim().length > 0
      }
      if (q.type === "textarea") return true // optional
      const val = answers[q.id]
      if (q.type === "multiple") return Array.isArray(val) && val.length > 0
      return typeof val === "string" && val.length > 0
    })
  }, [currentStep, answers, sections])

  const next = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setShowResult(true)
    }
  }, [currentStep, totalSteps])

  const prev = useCallback(() => {
    if (showResult) {
      setShowResult(false)
    } else if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }, [currentStep, showResult])

  const restart = useCallback(() => {
    setCurrentStep(0)
    setAnswers({})
    setShowResult(false)
  }, [])

  const totalPrice = useMemo(() => {
    let total = 0
    for (const section of sections) {
      for (const question of section.questions) {
        const answer = answers[question.id]
        if (!answer || question.options.length === 0) continue

        if (question.type === "multiple" && Array.isArray(answer)) {
          for (const val of answer) {
            const opt = question.options.find((o) => o.value === val)
            if (opt) total += opt.price
          }
        } else if (typeof answer === "string") {
          const opt = question.options.find((o) => o.value === answer)
          if (opt) total += opt.price
        }
      }
    }
    return total
  }, [answers, sections])

  const priceRange = useMemo(() => {
    const variance = quoterConfig.variancePercent / 100
    return {
      min: Math.round(totalPrice * (1 - variance)),
      max: Math.round(totalPrice * (1 + variance)),
    }
  }, [totalPrice])

  const t = useCallback(
    (obj: Record<string, string>) => obj[locale] || obj["es"] || "",
    [locale]
  )

  return {
    currentStep,
    totalSteps,
    sections,
    answers,
    showResult,
    canGoNext,
    setAnswer,
    next,
    prev,
    restart,
    totalPrice,
    priceRange,
    config: quoterConfig,
    t,
  }
}
