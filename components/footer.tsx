"use client"

import { useI18n } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border px-4 py-8 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {"2026 Saul Puentes. "}{t.footer.rights}
        </p>
        <p className="text-xs text-muted-foreground">
          {"Built with Next.js"}
        </p>
      </div>
    </footer>
  )
}
