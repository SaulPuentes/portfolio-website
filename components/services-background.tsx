"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { useTheme } from "next-themes"
import type { Layout, ServicesBg } from "@/lib/services-bg/modules"
import type { Rect } from "@/lib/services-bg/structures"

// Decorative objects in the Services cells, placed around each cell's measured copy and number.
// Desktop pins the canvas with the grid; phones scroll, so it spans the whole section there.
// Keyed on isMobile by the section: a canvas can't take a second WebGL context after dispose.
export function ServicesBackground({ sectionRef, revealed, isMobile }: {
  sectionRef: RefObject<HTMLDivElement | null>
  revealed: number
  isMobile: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgRef = useRef<ServicesBg | null>(null)
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== "light"
  const [hovered, setHovered] = useState<number | null>(null)
  const [centered, setCentered] = useState(0)
  const active = hovered ?? (isMobile ? centered : Math.max(0, revealed - 1))
  const floating = hovered ?? (isMobile ? centered : null) // phones have no hover: the mid-screen card floats
  const live = useRef({ dark, revealed, active, floating })
  live.current = { dark, revealed, active, floating }

  useEffect(() => {
    const section = sectionRef.current, wrap = wrapRef.current, canvas = canvasRef.current
    if (!section || !wrap || !canvas) return
    let cancelled = false, intersecting = false, loading = false
    let ro: ResizeObserver | undefined

    const measure = (): Layout => {
      const base = wrap.getBoundingClientRect()
      const cells = [...section.querySelectorAll<HTMLElement>("[data-service-cell]")].map((cell) => {
        // A cell waiting to be revealed sits shifted down; measure where it will rest.
        const dy = new DOMMatrix(getComputedStyle(cell).transform).m42
        const rel = (r: DOMRect): Rect => ({ x: r.left - base.left, y: r.top - base.top - dy, w: r.width, h: r.height })
        const range = document.createRange()
        const copy = [...cell.querySelectorAll("h3, p, .uppercase")].map((el) => {
          range.selectNodeContents(el) // the glyphs, not the full-width block
          return rel(range.getBoundingClientRect())
        })
        const number = cell.querySelector("[data-service-number]")!.getBoundingClientRect()
        return { rect: rel(cell.getBoundingClientRect()), blocked: [...copy, rel(number)] }
      })
      return { width: base.width, height: base.height, cells }
    }
    const update = () => {
      const l = measure()
      if (l.width && l.height) bgRef.current?.setLayout(l)
    }
    const onVisibility = () => {
      if (document.hidden) bgRef.current?.stop()
      else if (intersecting) bgRef.current?.start()
    }

    const init = async () => {
      // Same probe as HeroGlobe: no WebGL2, no three.js download.
      const probe = document.createElement("canvas").getContext("webgl2")
      if (!probe) return
      probe.getExtension("WEBGL_lose_context")?.loseContext()
      try {
        const { createModules } = await import("@/lib/services-bg/modules")
        if (cancelled) return
        const bg = createModules(canvas, {
          dark: live.current.dark,
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
          layout: measure(),
        })
        bgRef.current = bg
        bg.setRevealed(live.current.revealed)
        bg.setActive(live.current.active)
        bg.setHovered(live.current.floating)
        update()
        canvas.style.opacity = "1"
        ro = new ResizeObserver(update)
        ro.observe(wrap)
        document.addEventListener("visibilitychange", onVisibility)
        document.fonts?.ready.then(() => { if (!cancelled) update() })
        if (intersecting && !document.hidden) bg.start()
      } catch {
        // Chunk or context failed: the section is complete without a background.
      }
    }

    // Created on approach, so the page never pays for a second WebGL context during load.
    const io = new IntersectionObserver(([e]) => {
      intersecting = e.isIntersecting
      if (intersecting && !loading) { loading = true; init() }
      if (intersecting && !document.hidden) bgRef.current?.start()
      else bgRef.current?.stop()
    }, { rootMargin: "200px 0px" })
    io.observe(wrap)

    return () => {
      cancelled = true
      io.disconnect()
      ro?.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      bgRef.current?.dispose()
      bgRef.current = null
    }
  }, [sectionRef, isMobile])

  // Hover picks the service on desktop; on phones the cell at mid-screen does.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const cells = [...section.querySelectorAll("[data-service-cell]")]
    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const cell = (e.target as Element).closest?.("[data-service-cell]")
      setHovered(cell ? cells.indexOf(cell) : null)
    }
    const out = () => setHovered(null)
    section.addEventListener("pointerover", over)
    section.addEventListener("pointerleave", out)
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setCentered(cells.indexOf(e.target)) },
      { rootMargin: "-50% 0px -50% 0px" },
    )
    if (isMobile) cells.forEach((c) => io.observe(c))
    return () => {
      section.removeEventListener("pointerover", over)
      section.removeEventListener("pointerleave", out)
      io.disconnect()
    }
  }, [sectionRef, isMobile])

  useEffect(() => { bgRef.current?.setActive(active) }, [active])
  useEffect(() => { bgRef.current?.setHovered(floating) }, [floating])
  useEffect(() => { bgRef.current?.setRevealed(revealed) }, [revealed])
  // Next frame: next-themes swaps the class in its own effect, after this one, and the scene
  // reads its colours from the page.
  useEffect(() => {
    const id = requestAnimationFrame(() => bgRef.current?.setTheme(dark))
    return () => cancelAnimationFrame(id)
  }, [dark])

  return (
    // Sticky inside an absolute box, so the pin ends with the section. A negative margin would let
    // it hang a full screen past the bottom, over Projects.
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        ref={wrapRef}
        className={`overflow-hidden ${isMobile ? "relative h-full" : "sticky top-0 h-screen"}`}
      >
        <canvas ref={canvasRef} className="absolute inset-0 size-full opacity-0 transition-opacity duration-700" />
      </div>
    </div>
  )
}
