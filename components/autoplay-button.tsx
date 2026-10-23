"use client"

import { Play, Pause, RotateCcw } from "lucide-react"
import { SPEEDS, type AutoplayState } from "@/lib/autoplay"
import { useI18n } from "@/lib/i18n/context"

interface AutoplayButtonProps {
  state: AutoplayState
  onToggle(): void
  onSpeed(): void
  compact?: boolean
}

export function AutoplayButton({ state, onToggle, onSpeed, compact }: AutoplayButtonProps) {
  const { t } = useI18n()
  const label = t.nav[state.label]
  const Icon = state.label === "pause" ? Pause : state.label === "replay" ? RotateCcw : Play

  return (
    <div data-autoplay-control className="flex items-center gap-1">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={state.playing}
        aria-label={compact ? label : undefined}
        className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Icon className="size-3" />
        {!compact && label}
      </button>
      <button
        type="button"
        onClick={onSpeed}
        aria-label={`${t.nav.speed}: ${SPEEDS[state.speedIndex]}×`}
        className="min-h-7 min-w-7 rounded-md px-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
      >
        {SPEEDS[state.speedIndex]}×
      </button>
    </div>
  )
}
