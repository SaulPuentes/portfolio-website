"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import type { GlobeHandle } from "@/lib/globe/scene"
import { HERO_INTRO_EVENT } from "@/lib/autoplay"

// Decorative dotted Earth behind the hero. three.js is imported only after first paint and
// an idle slot, so the hero text never waits on it; if WebGL is missing the canvas stays hidden.
export function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const globeRef = useRef<GlobeHandle | null>(null)
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== "light"
  const darkRef = useRef(dark)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    let raf = 0, idle = 0, timer = 0
    let io: IntersectionObserver | null = null
    let intersecting = false

    const onVisibility = () => {
      const globe = globeRef.current
      if (!globe) return
      if (document.hidden) globe.stop()
      else if (intersecting) globe.start()
    }

    const init = async () => {
      // three r170 needs WebGL2; probe a throwaway canvas so a missing GPU skips the download
      // and three.js never logs its context-creation error.
      const probe = document.createElement("canvas").getContext("webgl2")
      if (!probe) return
      probe.getExtension("WEBGL_lose_context")?.loseContext()
      try {
        const { createGlobeScene } = await import("@/lib/globe/scene")
        if (cancelled) return
        const globe = createGlobeScene(canvas, {
          dark: darkRef.current,
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        })
        globeRef.current = globe
        canvas.style.opacity = "1"
        io = new IntersectionObserver((entries) => {
          intersecting = entries[entries.length - 1].isIntersecting
          if (intersecting && !document.hidden) globe.start()
          else globe.stop()
        })
        io.observe(canvas)
        document.addEventListener("visibilitychange", onVisibility)
      } catch {
        // No WebGL (or the chunk failed to load): keep the plain hero.
      }
    }

    // Autoplay replays the hero intro with the globe first: hide it at once, then reuse the 1 s fade-in
    const replay = () => {
      if (!globeRef.current) return // never shown: no WebGL, or not loaded yet
      canvas.style.transition = "none"
      canvas.style.opacity = "0"
      void canvas.offsetHeight
      canvas.style.transition = ""
      canvas.style.opacity = "1"
    }
    window.addEventListener(HERO_INTRO_EVENT, replay)

    raf = requestAnimationFrame(() => {
      if (typeof requestIdleCallback === "function") idle = requestIdleCallback(init)
      else timer = window.setTimeout(init, 200)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      if (idle) cancelIdleCallback(idle)
      clearTimeout(timer)
      io?.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener(HERO_INTRO_EVENT, replay)
      globeRef.current?.dispose()
      globeRef.current = null
    }
  }, [])

  useEffect(() => {
    darkRef.current = dark
    globeRef.current?.setTheme(dark)
  }, [dark])

  return (
    <canvas
      ref={canvasRef}
      data-globe
      aria-hidden="true"
      className="absolute inset-0 size-full touch-pan-y touch-pinch-zoom opacity-0 transition-opacity duration-1000"
    />
  )
}
