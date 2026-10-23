"use client"

import { useEffect, useState } from "react"
import { clients } from "@/lib/data"

const doubled = [...clients, ...clients]

export function ClientLogos() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="mt-auto shrink-0 w-full min-h-[48px] pb-6 sm:pb-10 md:pb-12">
      <div
        className="overflow-hidden transition-all duration-900 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max items-center gap-10 sm:gap-14 animate-marquee-left hover:[animation-play-state:paused]">
          {doubled.map((c, i) => {
            const copy = i >= clients.length
            return (
              <img
                key={`${c.name}-${i}`}
                src={c.logo}
                alt={copy ? "" : c.name}
                aria-hidden={copy || undefined}
                loading="lazy"
                decoding="async"
                className="h-6 sm:h-7 w-auto max-w-none brightness-0 opacity-45 dark:invert transition hover:filter-none hover:opacity-100 dark:hover:brightness-0 dark:hover:invert"
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
