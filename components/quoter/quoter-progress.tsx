"use client"

import { Progress } from "@/components/ui/progress"

interface QuoterProgressProps {
  current: number
  total: number
}

export function QuoterProgress({ current, total }: QuoterProgressProps) {
  const percent = Math.round(((current + 1) / total) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {current + 1} / {total}
        </span>
        <span>{percent}%</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  )
}
