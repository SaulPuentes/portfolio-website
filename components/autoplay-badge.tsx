"use client"

import { useEffect, useState } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { AUTOPLAY_TOGGLE_EVENT, SPEEDS } from "@/lib/autoplay"
import { useAutoplay } from "@/hooks/use-autoplay"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 font-sans text-xs font-medium text-card-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
      {children}
    </span>
  )
}

export function AutoplayBadge() {
  const { t } = useI18n()
  const { state, cycleSpeed } = useAutoplay()
  const [started, setStarted] = useState(false)
  const [inHero, setInHero] = useState(true)
  const label = t.nav[state.label]
  const Icon = state.label === "pause" ? Pause : state.label === "replay" ? RotateCcw : Play

  useEffect(() => {
    if (state.playing) setStarted(true)
  }, [state.playing])

  // Same midline as the header's active section
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInHero(entry.isIntersecting), {
      rootMargin: "-50% 0px -50% 0px",
    })
    observer.observe(document.getElementById("about")!)
    return () => observer.disconnect()
  }, [])

  // Past the hero it stays through a pause or finish; in the hero the CTA resumes, so only playing shows it
  const visible = state.playing || (started && !inHero)

  return (
    <div
      data-autoplay-control
      className={cn(
        "fixed inset-x-0 bottom-8 z-40 mx-auto flex w-fit items-center gap-0.5 rounded-full border border-border bg-background/80 p-1 text-muted-foreground shadow-md backdrop-blur-md transition-all duration-700 ease-out motion-reduce:transition-none",
        !visible && "invisible translate-y-4 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(AUTOPLAY_TOGGLE_EVENT))}
        aria-pressed={state.playing}
        aria-label={label}
        className="group relative flex h-9 items-center rounded-full px-2.5 transition-colors hover:text-foreground"
      >
        <Icon className="size-4" />
        <Tooltip>{label}</Tooltip>
      </button>
      <button
        type="button"
        onClick={cycleSpeed}
        aria-label={`${t.nav.speed}: ${SPEEDS[state.speedIndex]}×`}
        className="group relative h-9 min-w-9 rounded-full px-2 font-mono text-xs transition-colors hover:text-foreground"
      >
        {SPEEDS[state.speedIndex]}×
        <Tooltip>{t.nav.speed}</Tooltip>
      </button>
    </div>
  )
}
