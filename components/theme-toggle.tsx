"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState, type MouseEvent } from "react"
import { flushSync } from "react-dom"

// Keyframes, not transitions: the provider's disableTransitionOnChange would cancel a transition.
const ICON_CLASS = "size-3.5 animate-in fade-in zoom-in-50 spin-in-90 duration-500 motion-reduce:animate-none"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="size-8 rounded-md border border-border bg-secondary" aria-hidden="true" />
    )
  }

  const isDark = resolvedTheme === "dark"

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark"
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(next)
      return
    }

    // The ripple in globals.css grows from the button out to the farthest screen corner
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const { style } = document.documentElement
    style.setProperty("--theme-x", `${x}px`)
    style.setProperty("--theme-y", `${y}px`)
    style.setProperty("--theme-radius", `${Math.ceil(radius)}px`)

    // flushSync: next-themes sets the class in an effect, and the new snapshot needs that class
    document.startViewTransition(() => flushSync(() => setTheme(next)))
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex size-8 items-center justify-center rounded-md border border-border bg-secondary text-secondary-foreground transition-colors hover:bg-muted"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className={ICON_CLASS} />
      ) : (
        <Moon className={ICON_CLASS} />
      )}
    </button>
  )
}
