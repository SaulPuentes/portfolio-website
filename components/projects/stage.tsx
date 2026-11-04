"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import Image from "next/image"
import { ArrowUpRight, Pause, Play } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { projectImages, splitProjectName } from "@/lib/showcase"
import type { Project } from "@/lib/types"

const pad = (n: number) => String(n).padStart(2, "0")
const CTA = "inline-flex items-center gap-1 border-b border-accent pb-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-accent md:max-lg:tracking-[0.1em]"
const ON_IMAGE = "absolute z-10 bg-black/55 text-white backdrop-blur-sm"
// Last item's delay + duration of the cascade-out rules in globals.css
const CASCADE_OUT_MS = 305
const IMAGE_FADE = "[transition-duration:800ms,6000ms] ease-linear"
const IMAGE_FADE_PROJECT = "[transition-delay:120ms,0ms] [transition-duration:700ms,6000ms] [transition-timing-function:ease-in-out,linear]"

export function Stage({
  ref,
  project,
  index,
  total,
  next,
  slide,
  paused,
  onTogglePaused,
  expanded,
  onToggleExpanded,
  fillRef,
}: {
  ref: RefObject<HTMLDivElement | null>
  project: Project
  index: number
  total: number
  next: Project
  slide: number
  paused: boolean
  onTogglePaused: () => void
  expanded: boolean
  onToggleExpanded: () => void
  fillRef: RefObject<HTMLDivElement | null>
}) {
  const { locale, t } = useI18n()
  const images = projectImages(project)
  const count = images.length
  const current = images[slide]
  const upcoming = images[slide + 1] ?? projectImages(next)[0]

  // Keep the outgoing shot mounted so a change of project crossfades too
  const [shown, setShown] = useState({ current, previous: undefined as string | undefined, project, projectChanged: false })
  if (shown.current !== current) {
    setShown({ current, previous: shown.current, project, projectChanged: shown.project !== project })
  }

  // The panel keeps showing the outgoing project until its text has finished leaving
  const [panel, setPanel] = useState({ project, index })
  const [hasChanged, setHasChanged] = useState(false)
  const leaving = panel.project !== project
  useEffect(() => {
    if (!leaving) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const id = setTimeout(() => {
      setPanel({ project, index })
      setHasChanged(true)
    }, reduced ? 0 : CASCADE_OUT_MS)
    return () => clearTimeout(id)
  }, [leaving, project, index])
  const cascade = leaving ? "leaving" : hasChanged ? "entering" : undefined

  const { title, kind } = splitProjectName(panel.project.name[locale])
  const imageTitle = splitProjectName(project.name[locale]).title

  // Sorted so keyed images never reorder: moving a node mid-change would cut its crossfade
  const mounted = [...new Set([shown.previous, current, upcoming])]
    .filter((src): src is string => Boolean(src))
    .sort()
  const liveUrl = panel.project.liveUrls?.[0]?.url ?? panel.project.liveUrl

  const paragraphs = panel.project.description[locale]
  const firstParagraph = useRef<HTMLParagraphElement | null>(null)
  const [clamped, setClamped] = useState(false)
  useEffect(() => {
    const el = firstParagraph.current
    if (!el || expanded) return
    const observer = new ResizeObserver(() => setClamped(el.scrollHeight > el.clientHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [expanded, paragraphs])

  return (
    <div ref={ref} className="grid scroll-mt-20 border border-border bg-card md:grid-cols-[1.6fr_1fr] md:gap-6">
      <div className={`relative aspect-[4/3] overflow-hidden bg-muted ${expanded ? "md:aspect-auto" : "md:aspect-[16/10]"}`}>
        {mounted.map((src) => (
          <Image
            key={src}
            src={src}
            alt={src === current ? `${imageTitle} ${slide + 1}` : ""}
            aria-hidden={src !== current || undefined}
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className={`object-cover object-top transition-[opacity,scale] ${shown.projectChanged ? IMAGE_FADE_PROJECT : IMAGE_FADE} motion-reduce:transition-none ${
              src === current ? "scale-[1.06] opacity-100 motion-reduce:scale-100" : "scale-100 opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-white/20">
          {/* Inline, not scale-x-0: that class sets the `scale` property, which multiplies with the transform the hook writes */}
          <div ref={fillRef} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
          {Array.from({ length: Math.max(count - 1, 0) }, (_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="absolute -top-[3px] h-2 w-px bg-white/60"
              style={{ left: `${((i + 1) / count) * 100}%` }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onTogglePaused}
          aria-pressed={paused}
          aria-label={paused ? t.nav.play : t.nav.pause}
          className={`${ON_IMAGE} bottom-3 right-3 grid size-8 place-items-center transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:hidden md:bottom-auto md:top-3`}
        >
          {paused ? <Play className="size-3 fill-current" /> : <Pause className="size-3 fill-current" />}
        </button>
      </div>

      <div data-cascade={cascade} className="flex min-w-0 flex-col justify-center p-4 md:py-3 md:pl-0 lg:py-6 md:pr-6 lg:pr-8">
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-accent md:block">
          {pad(panel.index + 1)} / {pad(total)}
          {kind && ` · ${kind}`}
        </div>
        <h3 className="flex items-baseline gap-2.5 font-medium text-xl tracking-[-0.02em] md:mt-2 md:block md:text-2xl lg:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
          <span className="shrink-0 md:block md:truncate">{title}</span>
          {kind && (
            <span className="min-w-0 truncate font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground md:hidden">
              {kind}
            </span>
          )}
        </h3>
        <div className="mt-2 md:mt-3">
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground xl:text-[15px]">
            {(expanded ? paragraphs : paragraphs.slice(0, 1)).map((paragraph, i) => (
              <p
                key={i}
                ref={i === 0 ? firstParagraph : undefined}
                className={expanded ? undefined : "line-clamp-4 min-h-[4lh] md:min-h-0 md:line-clamp-3 lg:line-clamp-5 xl:line-clamp-none"}
              >
                {paragraph}
              </p>
            ))}
          </div>
          {(paragraphs.length > 1 || clamped) && (
            <button
              type="button"
              onClick={onToggleExpanded}
              aria-expanded={expanded}
              className="mt-1 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:max-lg:tracking-[0.1em]"
            >
              {expanded ? t.projects.readLess : t.projects.readMore}
            </button>
          )}
        </div>
        <div className="mt-3 hidden flex-wrap gap-1.5 md:flex md:max-lg:h-6 md:max-lg:overflow-hidden">
          {panel.project.technologies.map((tech) => (
            <span key={tech} className="border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {tech}
            </span>
          ))}
        </div>
        {liveUrl && (
          <div className="mt-4">
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={CTA}>
              {t.projects.viewLive}
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
