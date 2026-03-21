"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasMultiple = images.length > 1

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-md border border-border">
      <Image
        src={images[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        fill
        className="object-cover"
      />
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((i) => (i - 1 + images.length) % images.length)
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/50 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 max-md:translate-x-0 max-md:opacity-100"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((i) => (i + 1) % images.length)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/50 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 max-md:translate-x-0 max-md:opacity-100"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`size-2 rounded-full transition-colors ${
                  i === currentIndex
                    ? "bg-foreground"
                    : "bg-foreground/40 hover:bg-foreground/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
