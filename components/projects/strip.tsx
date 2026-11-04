"use client"

import { useEffect, useState, type PointerEvent } from "react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n/context"
import { SLIDE_MS, projectImages, splitProjectName, stripCards } from "@/lib/showcase"
import type { Project } from "@/lib/types"

const EDGE_MASK = "linear-gradient(to right, transparent, black 5%, black 95%, transparent)"

function StripCard({
  project,
  active,
  duplicate,
  onSelect,
}: {
  project: Project
  active: boolean
  duplicate: boolean
  onSelect: () => void
}) {
  const { locale } = useI18n()
  const { title, kind } = splitProjectName(project.name[locale])
  const images = projectImages(project)
  const [previewing, setPreviewing] = useState(false)
  const [shot, setShot] = useState(0)

  useEffect(() => {
    if (!previewing || images.length < 2) return
    const id = setInterval(() => setShot((s) => (s + 1) % images.length), SLIDE_MS)
    return () => clearInterval(id)
  }, [previewing, images.length])

  // Touch has no hover: a tap must not start a preview it can never leave
  const startPreview = (e: PointerEvent) => {
    if (e.pointerType === "mouse") setPreviewing(true)
  }
  const stopPreview = () => {
    setPreviewing(false)
    setShot(0)
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerEnter={startPreview}
      onPointerLeave={stopPreview}
      aria-hidden={duplicate || undefined}
      aria-current={active || undefined}
      tabIndex={duplicate ? -1 : undefined}
      data-duplicate={duplicate || undefined}
      className={`w-[200px] flex-none border bg-card text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent md:w-[260px] motion-reduce:data-[duplicate]:hidden ${
        active ? "border-accent" : "border-border hover:border-foreground/40"
      }`}
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-muted">
        {images[0] && <Image src={images[0]} alt="" fill sizes="260px" loading="lazy" className="object-cover object-top" />}
        {/* Mounted only while hovering, so unseen galleries never download */}
        {previewing &&
          images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="260px"
              className={`object-cover object-top transition-opacity duration-700 ${i === shot ? "opacity-100" : "opacity-0"}`}
            />
          ))}
      </span>
      <span className="block px-3 pb-3 pt-2.5">
        <span className="block truncate text-[13px] font-semibold text-foreground">{title}</span>
        {kind && (
          <span className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{kind}</span>
        )}
        <span className="mt-1.5 line-clamp-2 min-h-[2lh] text-xs leading-snug text-muted-foreground">
          {project.description[locale][0]}
        </span>
      </span>
    </button>
  )
}

export function Strip({
  projects,
  activeIndex,
  running,
  onSelect,
}: {
  projects: Project[]
  activeIndex: number
  running: boolean
  onSelect: (index: number) => void
}) {
  // One card can't fill a loop, and the stage already shows it
  if (projects.length < 2) return null

  return (
    <div
      className="group mt-6 overflow-hidden motion-reduce:overflow-x-auto"
      style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
      onBlur={(e) => {
        // The browser scrolls this box to reveal a focused card; left in place it would break the loop.
        // With reduced motion nothing loops, and the scroll position is the visitor's own.
        if (e.currentTarget.contains(e.relatedTarget) || matchMedia("(prefers-reduced-motion: reduce)").matches) return
        e.currentTarget.scrollLeft = 0
      }}
    >
      <div
        className="flex w-max gap-3 pr-3 animate-marquee-left [animation-duration:35s] group-hover:[animation-play-state:paused] group-has-focus-visible:animate-none md:[animation-duration:45s] motion-reduce:animate-none"
        style={running ? undefined : { animationPlayState: "paused" }}
      >
        {stripCards(projects.length).map(({ index, duplicate }) => (
          <StripCard
            key={`${projects[index].id}-${duplicate}`}
            project={projects[index]}
            active={index === activeIndex}
            duplicate={duplicate}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  )
}
