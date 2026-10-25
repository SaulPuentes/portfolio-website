"use client"

import { useEffect, useRef, useCallback, useSyncExternalStore } from "react"
import type Swiper from "swiper"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ScrollCarouselOptions {
  centeredSlides?: boolean
  slideOpacity?: boolean
  isScrubActive?: boolean
  isScrubOnTouchActive?: boolean
  scrubDir?: 1 | -1
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const OPACITY_MIN_PROGRESS = 0.25
const OPACITY_MAX_PROGRESS = 0.85
const OPACITY_MIN_VALUE = 0.25
const OPACITY_MAX_VALUE = 1
const OPACITY_THRESHOLD = 0.6
const OPACITY_DIFF_THRESHOLD = 0.01
const SLOW_DOWN_FACTOR = 0.5
// Must match the mobile @media block in scroll-carousel.css: below it the slides stack and Swiper stays off
const STACK_QUERY = "(max-width: 51.29875em)"

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max)

const interpolateRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)

const subscribeStacked = (onChange: () => void) => {
  const mq = matchMedia(STACK_QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

const isTouch = () =>
  typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches

const cssVarNumeric = (el: Element, name: string): number => {
  const raw = getComputedStyle(el).getPropertyValue(name).trim()
  // handle rem values
  if (raw.endsWith("rem")) {
    return parseFloat(raw) * parseFloat(getComputedStyle(document.documentElement).fontSize)
  }
  return parseFloat(raw) || 0
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useScrollCarousel(
  containerRef: React.RefObject<HTMLDivElement | null>,
  opts: ScrollCarouselOptions = {},
) {
  const swiperRef = useRef<Swiper | null>(null)
  const scrollTriggerRef = useRef<globalThis.ScrollTrigger | null>(null)
  const gsapAnimRef = useRef<gsap.core.Tween | null>(null)
  const initializedRef = useRef(false)
  const centeredRef = useRef(opts.centeredSlides ?? true)
  const slideOpacity = opts.slideOpacity ?? true
  const isTouchingRef = useRef(false)
  const stacked = useSyncExternalStore(subscribeStacked, () => matchMedia(STACK_QUERY).matches, () => false)

  const update = useCallback(() => {
    const sw = swiperRef.current
    if (!sw || !initializedRef.current) return
    _updateSwiper(sw)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (stacked) {
      // Swiper's init is what normally clears this; without it the CTAs would stay unclickable
      el.querySelectorAll(".swiper-slide").forEach((s) => s.classList.remove("no-interaction"))
      return
    }

    let destroyed = false

    const init = async () => {
      const [{ default: SwiperCore }, { default: gsapLib }, { ScrollTrigger }] =
        await Promise.all([
          import("swiper"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ])

      if (destroyed) return
      gsapLib.registerPlugin(ScrollTrigger)

      const outerWrapperEl = el.querySelector<HTMLElement>(".wrapper")
      const swiperEl = el.querySelector<HTMLElement>(".swiper-container")
      const wrapperEl = swiperEl?.querySelector<HTMLElement>(".swiper-wrapper")
      const spacingEl = swiperEl?.querySelector<HTMLElement>(".swiper-column-gap")
      const mediaRef = el.querySelector<HTMLElement>(".media-container")

      if (!outerWrapperEl || !swiperEl || !wrapperEl) return

      const maxWrapperSize = cssVarNumeric(el, "--max-wrapper-size")

      let cachedSpacing: number | null = null

      const getSlideSpacing = () => cachedSpacing ?? 0

      const getMaxWrapper = () =>
        Number.isFinite(maxWrapperSize) && maxWrapperSize > 0
          ? maxWrapperSize
          : document.body.clientWidth

      const getSlidesOffset = () => {
        const spacing = getSlideSpacing()
        const bodyW = document.body.clientWidth
        const mw = getMaxWrapper()
        const vw = window.innerWidth
        const centered = centeredRef.current

        if (vw < mw + 0.5) {
          return centered ? 0 : spacing
        }
        if (centered) return 0
        const ww = mw - spacing
        return Math.max((bodyW - ww) * 0.5, spacing)
      }

      const getSlidesOffsetAfter = () => {
        const before = getSlidesOffset()
        const sw = swiperRef.current
        if (centeredRef.current || !initializedRef.current || !sw) return before

        const slides = sw.slides || []
        const spacing = getSlideSpacing()
        let totalW = 0
        for (let i = 0; i < slides.length; i++) {
          totalW += (slides[i] as HTMLElement)?.offsetWidth || 0
        }
        const remaining = sw.width - before - totalW
        if (remaining > 0) {
          return -(Math.round(remaining + spacing * (slides.length - 1)) + 1)
        }
        return before
      }

      const onSwiperProgress = () => {
        const sw = swiperRef.current
        if (!initializedRef.current || !sw || !slideOpacity) return

        const slides = sw.slides
        for (let i = 0; i < slides.length; i++) {
          const slide = slides[i] as HTMLElement
          if (!slide) continue

          const sp = clamp((slide as any).progress ?? -1, -1, 1)
          const abs = clamp(Math.abs(sp), OPACITY_MIN_PROGRESS, OPACITY_MAX_PROGRESS)
          let opacity = interpolateRange(
            abs,
            OPACITY_MIN_PROGRESS,
            OPACITY_MAX_PROGRESS,
            OPACITY_MAX_VALUE,
            OPACITY_MIN_VALUE,
          )
          opacity = ((opacity * 1000) | 0) / 1000

          const cur = parseFloat(slide.style.opacity || "1")
          if (Math.abs(cur - opacity) > OPACITY_DIFF_THRESHOLD) {
            slide.style.opacity = String(opacity)
          }

          if (!isTouchingRef.current) {
            const has = slide.classList.contains("no-interaction")
            if (opacity < OPACITY_THRESHOLD && !has) {
              slide.classList.add("no-interaction")
            } else if (opacity >= OPACITY_THRESHOLD && has) {
              slide.classList.remove("no-interaction")
            }
          }
        }
      }

      const onSetTransition = (_sw: Swiper, speed: number) => {
        const sw = swiperRef.current
        if (!initializedRef.current || !sw) return
        for (let i = 0; i < sw.slides.length; i++) {
          const s = sw.slides[i] as HTMLElement
          if (s?.style) s.style.transition = `${speed}ms`
        }
      }

      const onTouchStart = () => {
        const sw = swiperRef.current
        if (!initializedRef.current || !sw || scrubActive) return
        isTouchingRef.current = true
        for (let i = 0; i < sw.slides.length; i++) {
          const s = sw.slides[i] as HTMLElement
          if (s?.style) s.style.transition = ""
        }
      }

      const onTouchEnd = () => {
        isTouchingRef.current = false
      }

      function _updateSwiper(sw: Swiper) {
        if (!initializedRef.current || !sw) return
        sw.transitionEnd?.()

        centeredRef.current = opts.centeredSlides ?? true

        cachedSpacing = spacingEl ? Math.ceil(spacingEl.offsetWidth) : 0

        sw.params.slidesOffsetBefore = getSlidesOffset()
        sw.params.slidesOffsetAfter = getSlidesOffsetAfter()
        sw.params.spaceBetween = getSlideSpacing()
        sw.params.centeredSlides = centeredRef.current

        sw.update()
        onSwiperProgress()
      }

      const updateSwiperByProgress = (progress: number) => {
        const sw = swiperRef.current
        if (!sw || !initializedRef.current) return

        const p = clamp(isNaN(progress) ? 0 : progress, 0, 1)
        const dir = (opts.scrubDir ?? 1) === -1 ? 1 - p : p
        const min = sw.minTranslate()
        const max = sw.maxTranslate()
        sw.setTranslate((max - min) * dir + min)
        sw.updateActiveIndex()
        sw.updateSlidesClasses()
      }

      // Determine scrub
      const touch = isTouch()
      let scrubActive = !touch && (opts.isScrubActive ?? false)
      if (touch && opts.isScrubOnTouchActive) scrubActive = true

      el.dataset.scrub = "true"

      // Only disable touch swiping when scrub is active
      if (scrubActive) {
        swiperEl.classList.add("swiper-no-swiping")
      }

      const sw = new SwiperCore(swiperEl, {
        init: false,
        direction: "horizontal",
        slidesPerView: "auto",
        centeredSlides: centeredRef.current,
        centeredSlidesBounds: false,
        slidesOffsetBefore: getSlidesOffset(),
        slidesOffsetAfter: 0,
        spaceBetween: 0,
        initialSlide: 0,
        loop: false,
        speed: 700,
        roundLengths: false,
        touchMoveStopPropagation: false,
        threshold: touch ? 10 : 6,
        passiveListeners: true,
        preventClicks: true,
        watchSlidesProgress: slideOpacity,
        grabCursor: false,
        slideToClickedSlide: false,
        resistanceRatio: 0.85,
        updateOnWindowResize: false,
        on: {
          init: () => {
            initializedRef.current = true
            // Enable interaction on all slides
            const slides = sw.slides
            for (let i = 0; i < slides.length; i++) {
              (slides[i] as HTMLElement).classList.remove("no-interaction")
            }
          },
          setTransition: onSetTransition,
          progress: onSwiperProgress,
          touchStart: onTouchStart,
          touchEnd: onTouchEnd,
        },
      })

      swiperRef.current = sw

      // Init after a tick
      requestAnimationFrame(() => {
        if (destroyed) return
        sw.init()
        updateSwiperByProgress(0)
        _updateSwiper(sw)

        // Setup ScrollTrigger scrubbing
        if (scrubActive) {
          const proxy = { progress: 0 }

          let cachedWrapperW = wrapperEl.offsetWidth
          let cachedSlideH = (sw.slides.length || 0) * window.innerHeight * SLOW_DOWN_FACTOR

          gsapAnimRef.current = gsapLib.to(proxy, {
            progress: 1,
            duration: 1,
            ease: "none",
            onUpdate: () => updateSwiperByProgress(proxy.progress),
            scrollTrigger: {
              trigger: wrapperEl,
              pin: outerWrapperEl,
              pinSpacing: true,
              scrub: true,
              invalidateOnRefresh: true,
              start: () => `${wrapperEl.offsetHeight * 0.5}px ${window.innerHeight * 0.5}px`,
              end: () => `+=${Math.max(cachedWrapperW, cachedSlideH)}px`,
              onRefreshInit: () => {
                if (sw && initializedRef.current) {
                  sw.updateSize()
                  _updateSwiper(sw)
                }
                cachedWrapperW = wrapperEl.offsetWidth
                cachedSlideH = (sw.slides.length || 0) * window.innerHeight * SLOW_DOWN_FACTOR
              },
              onRefresh: (self) => {
                if (sw && initializedRef.current) {
                  _updateSwiper(sw)
                }
                // Autoplay reads the pinned range here to stop on each slide without loading GSAP itself
                el.dataset.scrubStart = String(self.start)
                el.dataset.scrubEnd = String(self.end)
              },
            },
          })

          scrollTriggerRef.current = gsapAnimRef.current.scrollTrigger as globalThis.ScrollTrigger
        }

        // Resize handling
        const onResize = () => {
          if (sw && initializedRef.current) {
            _updateSwiper(sw)
          }
          ScrollTrigger.refresh()
        }

        if (touch) {
          window.addEventListener("orientationchange", onResize)
        } else {
          window.addEventListener("resize", onResize)
        }

        // Store cleanup for resize
        ;(el as any).__carouselCleanupResize = () => {
          window.removeEventListener("resize", onResize)
          window.removeEventListener("orientationchange", onResize)
        }
      })
    }

    init()

    return () => {
      destroyed = true
      ;(containerRef.current as any)?.__carouselCleanupResize?.()

      if (gsapAnimRef.current) {
        gsapAnimRef.current.scrollTrigger?.kill()
        gsapAnimRef.current.kill()
        gsapAnimRef.current = null
      }
      scrollTriggerRef.current = null

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
      initializedRef.current = false
      // A stacked pass next must not inherit the scrub range or the no-swiping flag
      delete el.dataset.scrubStart
      delete el.dataset.scrubEnd
      el.querySelector(".swiper-container")?.classList.remove("swiper-no-swiping")
    }
  }, [stacked]) // eslint-disable-line react-hooks/exhaustive-deps

  return { update }
}
