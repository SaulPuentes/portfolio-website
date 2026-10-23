"use client"

import { Play, Pause, RotateCcw } from "lucide-react"
import { SPEEDS, type AutoplayState } from "@/lib/autoplay"
import { useI18n } from "@/lib/i18n/context"

interface AutoplayButtonProps {
  state: AutoplayState
  onToggle(): void
  onSpeed(): void
}

export function AutoplayButton({ state, onToggle, onSpeed }: AutoplayButtonProps) {
  const { t } = useI18n()
  const label = t.nav[state.label]
  const Icon = state.label === "pause" ? Pause : state.label === "replay" ? RotateCcw : Play

  return (
    <div data-autoplay-control className="flex items-center gap-1">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={state.playing}
        aria-label={label}
        title={label}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon className="size-3.5" />
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
