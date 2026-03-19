"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

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

interface QuoterStepProps {
  questions: Question[]
  answers: Record<string, string | string[]>
  onAnswer: (questionId: string, value: string | string[]) => void
  t: (obj: Record<string, string>) => string
}

export function QuoterStep({ questions, answers, onAnswer, t }: QuoterStepProps) {
  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <div key={question.id} className="space-y-3">
          <Label className="text-base font-medium">{t(question.question)}</Label>

          {question.type === "text" || question.type === "email" ? (
            <Input
              type={question.type}
              value={(answers[question.id] as string) || ""}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="max-w-md"
            />
          ) : question.type === "textarea" ? (
            <Textarea
              value={(answers[question.id] as string) || ""}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="max-w-md"
              rows={3}
            />
          ) : question.type === "multiple" ? (
            <MultipleSelect
              options={question.options}
              selected={(answers[question.id] as string[]) || []}
              onChange={(val) => onAnswer(question.id, val)}
              t={t}
            />
          ) : (
            <SingleSelect
              options={question.options}
              selected={(answers[question.id] as string) || ""}
              onChange={(val) => onAnswer(question.id, val)}
              t={t}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function SingleSelect({
  options,
  selected,
  onChange,
  t,
}: {
  options: QuestionOption[]
  selected: string
  onChange: (val: string) => void
  t: (obj: Record<string, string>) => string
}) {
  return (
    <div className="grid gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
            selected === opt.value
              ? "border-primary bg-primary/5 text-foreground"
              : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted"
          )}
        >
          <div
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              selected === opt.value
                ? "border-primary bg-primary"
                : "border-muted-foreground/30"
            )}
          >
            {selected === opt.value && <Check className="size-3 text-primary-foreground" />}
          </div>
          {t(opt.label)}
        </button>
      ))}
    </div>
  )
}

function MultipleSelect({
  options,
  selected,
  onChange,
  t,
}: {
  options: QuestionOption[]
  selected: string[]
  onChange: (val: string[]) => void
  t: (obj: Record<string, string>) => string
}) {
  const toggle = (value: string) => {
    // "none" and "unsure" are exclusive options
    if (value === "none" || value === "unsure") {
      onChange([value])
      return
    }
    const filtered = selected.filter((v) => v !== "none" && v !== "unsure")
    if (filtered.includes(value)) {
      onChange(filtered.filter((v) => v !== value))
    } else {
      onChange([...filtered, value])
    }
  }

  return (
    <div className="grid gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
              isSelected
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted"
            )}
          >
            <div
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30"
              )}
            >
              {isSelected && <Check className="size-3 text-primary-foreground" />}
            </div>
            {t(opt.label)}
          </button>
        )
      })}
    </div>
  )
}
