"use client"

import { useRef } from "react"
import Image from "next/image"
import { useScrollCarousel } from "@/hooks/use-scroll-carousel"
import type { ScrollCarouselOptions } from "@/hooks/use-scroll-carousel"
import "swiper/css"
import "@/styles/scroll-carousel.css"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselItem {
  image?: { src: string; alt: string; width: number; height: number }
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
              <div key={i} className="swiper-slide no-interaction">
                <div className="card">
                  {item.image ? (
                    <div className="media-container">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        className="object-cover w-full h-full"
                        sizes="(max-width: 51.29875em) 100vw, 500px"
                      />
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
                        className="cta-button text-accent hover:text-accent/80"
                      >
                        <span>{item.cta.label}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
