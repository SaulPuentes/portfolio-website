"use client"

import { useState, useCallback } from "react"
import { I18nProvider } from "@/lib/i18n/context"
import { ThemeToggle } from "@/components/theme-toggle"
import { QuoterForm } from "@/components/quoter/quoter-form"
import { useI18n } from "@/lib/i18n/context"
import { siteConfig } from "@/lib/site-config"
import { ArrowLeft } from "lucide-react"
import quoterConfig from "@/content/data/quoter-config.json"
import Link from "next/link"

function CotizadorContent() {
  const { locale } = useI18n()
  const [showingResult, setShowingResult] = useState(false)

  const t = (obj: Record<string, string>) => obj[locale] || obj["es"] || ""

  const handleShowResult = useCallback((showing: boolean) => {
    setShowingResult(showing)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {siteConfig.brandName}
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        {!showingResult && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">{t(quoterConfig.title)}</h1>
            <p className="mt-2 text-muted-foreground">{t(quoterConfig.subtitle)}</p>
          </div>
        )}

        <QuoterForm onShowResult={handleShowResult} />
      </main>
    </div>
  )
}

export function CotizadorClient() {
  return (
    <I18nProvider>
      <CotizadorContent />
    </I18nProvider>
  )
}
