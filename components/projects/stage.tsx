"use client"

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react"
import Image from "next/image"
import { ArrowUpRight, Pause, Play } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { projectImages, splitProjectName } from "@/lib/showcase"
import type { Project } from "@/lib/types"

const CTA = "inline-flex items-center gap-1 border-b border-accent pb-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-accent md:max-lg:tracking-[0.1em]"
const ON_IMAGE = "absolute z-10 bg-black/55 text-white backdrop-blur-sm"
// Last item's delay + duration of the cascade-out rules in globals.css
const CASCADE_OUT_MS = 305
const TEXT_RESIZE_MS = 420
const IMAGE_FADE = "[transition-duration:800ms,6000ms] ease-linear"
const IMAGE_FADE_PROJECT = "[transition-delay:120ms,0ms] [transition-duration:700ms,6000ms] [transition-timing-function:ease-in-out,linear]"

export function Stage({
  ref,
  project,
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
  const [panel, setPanel] = useState(project)
  const [hasChanged, setHasChanged] = useState(false)
  const leaving = panel !== project
  useEffect(() => {
    if (!leaving) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const id = setTimeout(() => {
      setPanel(project)
      setHasChanged(true)
    }, reduced ? 0 : CASCADE_OUT_MS)
    return () => clearTimeout(id)
  }, [leaving, project])
  const cascade = leaving ? "leaving" : hasChanged ? "entering" : undefined

  const { title, kind } = splitProjectName(panel.name[locale])
  const imageTitle = splitProjectName(project.name[locale]).title

  // Sorted so keyed images never reorder: moving a node mid-change would cut its crossfade
  const mounted = [...new Set([shown.previous, current, upcoming])]
    .filter((src): src is string => Boolean(src))
    .sort()
  const liveUrl = panel.liveUrls?.[0]?.url ?? panel.liveUrl

  const paragraphs = panel.description[locale]
  const firstParagraph = useRef<HTMLParagraphElement | null>(null)
  const [clamped, setClamped] = useState(false)
  useEffect(() => {
    const el = firstParagraph.current
    if (!el || expanded) return
    const observer = new ResizeObserver(() => setClamped(el.scrollHeight > el.clientHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [expanded, paragraphs])

  // Height can't transition to auto: measure both ends around the toggle and animate between them
  const text = useRef<HTMLDivElement | null>(null)
  const heightBeforeToggle = useRef<number | null>(null)
  const toggleExpanded = () => {
    heightBeforeToggle.current = text.current?.offsetHeight ?? null
    onToggleExpanded()
  }
  useLayoutEffect(() => {
    const el = text.current
    const from = heightBeforeToggle.current
    heightBeforeToggle.current = null
    if (!el || from === null || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    el.animate({ height: [`${from}px`, `${el.offsetHeight}px`] }, { duration: TEXT_RESIZE_MS, easing: "cubic-bezier(0.16, 1, 0.3, 1)" })
  }, [expanded])

  return (
    <div ref={ref} className="grid scroll-mt-20 border border-border bg-card md:grid-cols-[1.6fr_1fr] md:gap-6">
      {/* Aspect on a spacer, not the cell: it sets the minimum height and the cell still stretches beside taller text */}
      <div className="group relative overflow-hidden bg-muted before:block before:aspect-[4/3] md:before:aspect-[16/10]">
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

        {/* Hover only; stays shown while paused so the stopped state is explained, and on touch screens, which can't hover */}
        <button
          type="button"
          onClick={onTogglePaused}
          aria-pressed={paused}
          aria-label={paused ? t.nav.play : t.nav.pause}
          className={`${ON_IMAGE} bottom-3 right-3 grid size-8 place-items-center opacity-0 transition-[opacity,background-color] duration-200 group-hover:opacity-100 focus-visible:opacity-100 aria-pressed:opacity-100 pointer-coarse:opacity-100 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:hidden md:bottom-auto md:top-3`}
        >
          {paused ? <Play className="size-3 fill-current" /> : <Pause className="size-3 fill-current" />}
        </button>
      </div>

      {/* min-h fits the tallest content (expanded, two rows of tags): the card never resizes while the content stays centered */}
      <div data-cascade={cascade} className="flex min-h-[315px] min-w-0 flex-col justify-center p-4 md:min-h-[381px] md:py-8 md:pl-0 lg:min-h-[505px] lg:py-10 md:pr-6 lg:pr-8">
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-accent md:block">
          {kind}
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
          <div
            ref={text}
            tabIndex={expanded ? 0 : undefined}
            className={`flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent xl:text-[15px] ${
              expanded ? "max-h-44 overflow-y-auto pr-3 md:max-h-36 lg:max-h-56" : "overflow-hidden"
            }`}
          >
            {(expanded ? paragraphs : paragraphs.slice(0, 1)).map((paragraph, i) => (
              <p
                key={i}
                ref={i === 0 ? firstParagraph : undefined}
                className={
                  expanded
                    ? i > 0 ? "motion-safe:animate-[cascade-in_520ms_cubic-bezier(0.16,1,0.3,1)_backwards]" : undefined
                    : "line-clamp-7 md:line-clamp-6 lg:line-clamp-9"
                }
                style={expanded && i > 0 ? { animationDelay: `${i * 60}ms` } : undefined}
              >
                {paragraph}
              </p>
            ))}
          </div>
          {(paragraphs.length > 1 || clamped) && (
            <button
              type="button"
              onClick={toggleExpanded}
              aria-expanded={expanded}
              className="mt-1 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:max-lg:tracking-[0.1em]"
            >
              {expanded ? t.projects.readLess : t.projects.readMore}
            </button>
          )}
        </div>
        <div className="mt-3 hidden flex-wrap gap-1.5 md:flex md:max-lg:h-6 md:max-lg:overflow-hidden">
          {panel.technologies.map((tech) => (
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
