"use client"

import { useI18n } from "@/lib/i18n/context"
import { siteConfig } from "@/lib/site-config"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="text-xs text-muted-foreground">
          {`${new Date().getFullYear()} ${siteConfig.name}. `}{t.footer.rights}
        </p>
        <p className="text-xs text-muted-foreground">
          {siteConfig.footerNote}
        </p>
      </div>
    </footer>
  )
}
