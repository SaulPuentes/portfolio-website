"use client"

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { SLIDE_MS, projectImages, splitProjectName, stepTarget, stripCards, wrap } from "@/lib/showcase"
import type { Project } from "@/lib/types"

const EDGE_MASK = "linear-gradient(to right, transparent, black 5%, black 95%, transparent)"
const LOOP_S = { desktop: 45, mobile: 35 }
const DRAG_START_PX = 5
const MAX_FLING_PX_S = 4000
const RESUME_AFTER_DRAG_MS = 1500
const RESUME_AFTER_STEP_MS = 3000
// Centred on the screenshots (card width x 10/16, halved, minus half the button); shown on hover or keyboard focus only,
// so touch screens never see them and swipe instead
const NAV_BUTTON = "absolute z-10 grid size-8 place-items-center border border-border bg-card text-foreground opacity-0 pointer-events-none transition-[opacity,translate,border-color] duration-200 top-[calc(200px*10/32-16px)] md:top-[calc(260px*10/32-16px)] hover:border-foreground/40 focus-visible:outline-2 focus-visible:outline-accent group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-has-focus-visible:pointer-events-auto group-has-focus-visible:translate-x-0 group-has-focus-visible:opacity-100"

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
      className={`w-[200px] flex-none border bg-card text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent md:w-[260px] ${
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

type Props = {
  projects: Project[]
  activeIndex: number
  running: boolean
  onSelect: (index: number) => void
}

// x is the strip offset in px: unbounded while moving, wrapped only when drawn
type Motion = {
  x: number
  v: number
  target: number | null
  auto: number
  hover: boolean
  focused: boolean
  dragging: boolean
  holdUntil: number
}

type Drag = { id: number; startX: number; startOffset: number; lastX: number; lastT: number; v: number; moved: boolean }

export function Strip(props: Props) {
  // One card can't fill a loop, and the stage already shows it
  if (props.projects.length < 2) return null
  return <Marquee {...props} />
}

function Marquee({ projects, activeIndex, running, onSelect }: Props) {
  const { t } = useI18n()
  const count = projects.length
  const viewport = useRef<HTMLDivElement | null>(null)
  const track = useRef<HTMLDivElement | null>(null)
  const motion = useRef<Motion>({ x: 0, v: 0, target: null, auto: 1, hover: false, focused: false, dragging: false, holdUntil: 0 })
  const size = useRef({ loop: 0, stride: 0, speed: 0, reduced: false })
  const drag = useRef<Drag | null>(null)
  const swallowClick = useRef(false)

  // Straight to the DOM every frame: React never re-renders for motion
  const paint = useCallback(() => {
    const { loop } = size.current
    const m = motion.current
    if (!track.current || !loop) return
    track.current.style.transform = `translate3d(${-wrap(m.x, loop)}px, 0, 0)`
  }, [])

  useEffect(() => {
    const vp = viewport.current
    const tr = track.current
    if (!vp || !tr) return
    const reduce = matchMedia("(prefers-reduced-motion: reduce)")
    const desktop = matchMedia("(min-width: 768px)")
    const measure = () => {
      const cards = tr.children as HTMLCollectionOf<HTMLElement>
      const loop = cards[count].offsetLeft - cards[0].offsetLeft
      size.current = {
        loop,
        stride: loop / count,
        speed: reduce.matches ? 0 : loop / (desktop.matches ? LOOP_S.desktop : LOOP_S.mobile),
        reduced: reduce.matches,
      }
      paint()
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(vp)
    reduce.addEventListener("change", measure)

    // Horizontal trackpad swipes and Shift + wheel only: a vertical wheel still scrolls the page
    const onWheel = (e: WheelEvent) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0
      if (!dx) return
      e.preventDefault()
      Object.assign(motion.current, { target: null, v: 0, holdUntil: performance.now() + RESUME_AFTER_DRAG_MS })
      motion.current.x += dx
      paint()
    }
    vp.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      resize.disconnect()
      reduce.removeEventListener("change", measure)
      vp.removeEventListener("wheel", onWheel)
    }
  }, [count, paint])

  useEffect(() => {
    if (!running) return
    let last = performance.now()
    let id = requestAnimationFrame(function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000) // a waking tab moves one frame, not seconds
      last = now
      const m = motion.current
      const drifting = !m.hover && !m.focused && !m.dragging && m.target === null && now > m.holdUntil
      m.auto += ((drifting ? 1 : 0) - m.auto) * Math.min(1, dt * 2.5) // eases back in rather than jumping
      if (m.target !== null) {
        const d = m.target - m.x
        if (Math.abs(d) < 0.5 || size.current.reduced) {
          m.x = m.target
          m.target = null
        } else m.x += d * Math.min(1, dt * 9)
      } else if (!m.dragging) {
        m.v = Math.abs(m.v) < 2 ? 0 : m.v * Math.exp(-dt * 3.2) // fling friction
        m.x += (m.auto * size.current.speed + m.v) * dt
      }
      paint()
      id = requestAnimationFrame(frame)
    })
    return () => cancelAnimationFrame(id)
  }, [running, paint])

  const step = (dir: number) => {
    const m = motion.current
    m.target = stepTarget(m.target ?? m.x, size.current.stride, dir)
    m.v = 0
    m.holdUntil = performance.now() + RESUME_AFTER_STEP_MS
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    drag.current = { id: e.pointerId, startX: e.clientX, startOffset: motion.current.x, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.startX
    if (!d.moved) {
      if (Math.abs(dx) <= DRAG_START_PX) return
      // Captured only once it is a drag: capturing on press would retarget a plain click away from the card
      d.moved = true
      Object.assign(motion.current, { dragging: true, target: null, v: 0 })
      e.currentTarget.setPointerCapture(e.pointerId)
      e.currentTarget.dataset.dragging = ""
    }
    motion.current.x = d.startOffset - dx
    const now = performance.now()
    if (now > d.lastT) d.v = d.v * 0.6 + (-(e.clientX - d.lastX) / ((now - d.lastT) / 1000)) * 0.4
    d.lastX = e.clientX
    d.lastT = now
    paint()
  }
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    if (!d.moved) return
    delete e.currentTarget.dataset.dragging
    const m = motion.current
    m.dragging = false
    // A pointer held still before release is a placement, not a throw
    const still = performance.now() - d.lastT > 80
    m.v = size.current.reduced || still ? 0 : Math.max(-MAX_FLING_PX_S, Math.min(MAX_FLING_PX_S, d.v))
    m.holdUntil = performance.now() + RESUME_AFTER_DRAG_MS
    swallowClick.current = true
    setTimeout(() => {
      swallowClick.current = false
    }, 0)
  }

  return (
    // Hover is tracked on the whole block: reaching for an arrow must not restart the drift
    <div
      className="group relative mt-6"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") motion.current.hover = true
      }}
      onPointerLeave={() => {
        motion.current.hover = false
      }}
    >
      <div
        ref={viewport}
        className="cursor-grab touch-pan-y select-none overflow-hidden data-[dragging]:cursor-grabbing"
        style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onDragStart={(e) => e.preventDefault()} // native image drag would steal the gesture
        onClickCapture={(e) => {
          if (!swallowClick.current) return
          e.preventDefault()
          e.stopPropagation()
          swallowClick.current = false
        }}
        onFocus={(e) => {
          if (e.target.matches(":focus-visible")) motion.current.focused = true
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) motion.current.focused = false
        }}
        onScroll={(e) => {
          // The browser scrolls this box to reveal a focused card: fold that into the offset so the loop stays seamless
          const vp = e.currentTarget
          if (!vp.scrollLeft) return
          motion.current.x += vp.scrollLeft
          vp.scrollLeft = 0
          paint()
        }}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
          e.preventDefault()
          step(e.key === "ArrowRight" ? 1 : -1)
        }}
      >
        <div ref={track} className="flex w-max gap-3 pr-3 will-change-transform">
          {stripCards(count).map(({ index, duplicate }) => (
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
      <button type="button" onClick={() => step(-1)} aria-label={t.projects.previous} className={`${NAV_BUTTON} left-3 -translate-x-1.5`}>
        <ChevronLeft className="size-4" />
      </button>
      <button type="button" onClick={() => step(1)} aria-label={t.projects.next} className={`${NAV_BUTTON} right-3 translate-x-1.5`}>
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
