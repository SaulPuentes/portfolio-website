"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasMultiple = images.length > 1

  return (
    <div className="group relative aspect-video w-full overflow-hidden border border-border bg-muted/30">
      <Image
        src={images[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        fill
        className="object-cover"
      />

      {/* Mono counter — top-right */}
      {hasMultiple && (
        <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/90 bg-black/40 backdrop-blur-sm px-2 py-1">
          <span className="text-white">{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="text-white/50"> / {String(images.length).padStart(2, "0")}</span>
        </div>
      )}

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((i) => (i - 1 + images.length) % images.length)
            }
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-accent -translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 max-md:translate-x-0 max-md:opacity-100"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((i) => (i + 1) % images.length)
            }
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-accent translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 max-md:translate-x-0 max-md:opacity-100"
          >
            <ChevronRight className="size-4" strokeWidth={2} />
          </button>

          {/* Segment indicators — bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-[2px] flex-1 transition-colors ${
                  i === currentIndex
                    ? "bg-accent"
                    : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
