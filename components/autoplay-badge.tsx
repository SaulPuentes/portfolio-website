"use client"

import { useEffect, useState } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { AUTOPLAY_TOGGLE_EVENT, BADGE_INTRO_MS, BADGE_LABEL_MS, SPEEDS } from "@/lib/autoplay"
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
  const [stage, setStage] = useState<"hidden" | "label" | "compact">("hidden")
  const [inHero, setInHero] = useState(true)
  const [pressed, setPressed] = useState(false)
  const expanded = stage !== "compact" && !pressed
  const label = pressed ? t.nav[state.label] : t.hero.autoplay
  const Icon = state.label === "pause" ? Pause : state.label === "replay" ? RotateCcw : Play

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("label"), BADGE_INTRO_MS),
      setTimeout(() => setStage("compact"), BADGE_INTRO_MS + BADGE_LABEL_MS),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // Same midline as the header's active section, so the badge leaves as the nav moves on
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInHero(entry.isIntersecting), {
      rootMargin: "-50% 0px -50% 0px",
    })
    observer.observe(document.getElementById("about")!)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      data-autoplay-control
      className={cn(
        "fixed inset-x-0 bottom-8 z-40 mx-auto flex w-fit items-center gap-0.5 rounded-full border p-1 shadow-md backdrop-blur-md transition-all duration-700 ease-out motion-reduce:transition-none",
        expanded
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background/80 text-muted-foreground",
        (stage === "hidden" || (!inHero && !pressed)) && "invisible translate-y-4 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={() => {
          setPressed(true)
          window.dispatchEvent(new Event(AUTOPLAY_TOGGLE_EVENT))
        }}
        aria-pressed={state.playing}
        aria-label={label}
        className={cn(
          "group relative flex h-9 items-center rounded-full px-2.5 transition-colors",
          !expanded && "hover:text-foreground",
        )}
      >
        <Icon className="size-4" />
        {/* ponytail: max-w animates to auto width; raise it if a locale's label outgrows 10rem */}
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap text-xs font-medium transition-all duration-500 ease-out motion-reduce:transition-none",
            expanded ? "ml-1.5 max-w-40 opacity-100" : "ml-0 max-w-0 opacity-0",
          )}
        >
          {t.hero.autoplay}
        </span>
        {!expanded && <Tooltip>{label}</Tooltip>}
      </button>
      <button
        type="button"
        onClick={cycleSpeed}
        aria-label={`${t.nav.speed}: ${SPEEDS[state.speedIndex]}×`}
        className={cn(
          "group relative h-9 min-w-9 rounded-full px-2 font-mono text-xs transition-colors",
          !expanded && "hover:text-foreground",
        )}
      >
        {SPEEDS[state.speedIndex]}×
        <Tooltip>{t.nav.speed}</Tooltip>
      </button>
    </div>
  )
}
