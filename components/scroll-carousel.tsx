"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { useScrollCarousel } from "@/hooks/use-scroll-carousel"
import type { ScrollCarouselOptions } from "@/hooks/use-scroll-carousel"
import "swiper/css"
import "@/styles/scroll-carousel.css"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselItem {
  image?: { src: string; alt: string; width: number; height: number }
  gallery?: { src: string; alt: string; width: number; height: number }[]
  title: string
  description: string
  cta?: { label: string; href: string }
  badges?: string[]
}

interface ScrollCarouselProps {
  items: CarouselItem[]
  heading?: string
  id?: string
  scrub?: boolean
  className?: string
}

/* ------------------------------------------------------------------ */
/*  SlideCard — handles gallery hover cycling                          */
/* ------------------------------------------------------------------ */

function SlideCard({ item }: { item: CarouselItem }) {
  const images = item.gallery && item.gallery.length > 1 ? item.gallery : null
  const [imgIndex, setImgIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCycling = useCallback(() => {
    if (!images) return
    intervalRef.current = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length)
    }, 3000)
  }, [images])

  const stopCycling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setImgIndex(0)
  }, [])

  const currentImage = images ? images[imgIndex] : item.image

  return (
    <div className="swiper-slide no-interaction">
      <div
        className="card"
        onMouseEnter={startCycling}
        onMouseLeave={stopCycling}
      >
        {currentImage ? (
          <div className="media-container">
            <Image
              key={currentImage.src}
              src={currentImage.src}
              alt={currentImage.alt}
              width={currentImage.width}
              height={currentImage.height}
              className="object-cover w-full h-full animate-fade-in"
              sizes="(max-width: 51.29875em) 100vw, 500px"
            />
            {images && (
              <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 pointer-events-none">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`size-1.5 rounded-full transition-colors ${
                      i === imgIndex
                        ? "bg-white"
                        : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="media-container bg-muted flex items-center justify-center">
            <span className="text-muted-foreground/30 text-4xl">
              &#9744;
            </span>
          </div>
        )}
        <div className="card-text">
          <h3 className="text-lg font-semibold text-card-foreground">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
          {item.badges && item.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
          {item.cta && (
            <a
              href={item.cta.href}
              className="cta-button text-accent hover:text-accent/80 gap-1"
            >
              <span>{item.cta.label}</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ScrollCarousel({
  items,
  heading,
  id,
  scrub = true,
  className = "",
}: ScrollCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const options: ScrollCarouselOptions = {
    centeredSlides: true,
    slideOpacity: true,
    isScrubActive: scrub,
    isScrubOnTouchActive: scrub,
    scrubDir: 1,
  }

  useScrollCarousel(containerRef, options)

  return (
    <div id={id} className={`carousel ${className}`} ref={containerRef}>
      <div className="wrapper">
        {heading && (
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
            <h2 className="text-3xl font-bold md:text-4xl text-foreground">
              {heading}
            </h2>
          </div>
        )}

        <div className="swiper-container">
          <div className="swiper-column-gap" />
          <div className="swiper-wrapper">
            {items.map((item, i) => (
              <SlideCard key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
