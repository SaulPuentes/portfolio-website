"use client"

import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ExternalLink, Github, Star, X } from "lucide-react"
import type { Project } from "@/lib/types"
import { ImageCarousel } from "./image-carousel"

export function ProjectDetailModal({
  project,
  open,
  onClose,
}: {
  project: Project
  open: boolean
  onClose: () => void
}) {
  const { locale, t } = useI18n()

  const images =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : project.image
        ? [project.image]
        : []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {project.featured && (
                <>
                  <Star className="size-3 fill-accent text-accent" />
                  <span className="text-accent">{t.projects.featured}</span>
                  <span className="h-px w-3 bg-border" aria-hidden="true" />
                </>
              )}
              <span>// project</span>
            </div>
            <DialogTitle
              className="mt-1.5 font-medium text-xl md:text-2xl tracking-[-0.02em] leading-tight truncate"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.name[locale]}
            </DialogTitle>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 rounded-sm p-1 text-muted-foreground opacity-80 transition-all hover:text-accent hover:opacity-100 flex-shrink-0"
            aria-label={t.projects.close}
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* 1. Image carousel */}
          {images.length > 0 && (
            <ImageCarousel images={images} alt={project.name[locale]} />
          )}

          {/* 2. Tech stack */}
          <section className="mt-8">
            <SectionLabel>{t.projects.techStack}</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-foreground/80 transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* 3. Description */}
          <section className="mt-8">
            <SectionLabel>{t.projects.description}</SectionLabel>
            <DialogDescription asChild>
              <div className="mt-3 flex flex-col gap-3">
                {project.description[locale].map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm md:text-[15px] leading-relaxed text-foreground/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </DialogDescription>
          </section>

          {/* 4. Links */}
          {(project.liveUrl || (project.liveUrls && project.liveUrls.length > 0) || project.repoUrl) && (
            <section className="mt-8 pt-6 border-t border-border">
              <SectionLabel>{t.projects.links}</SectionLabel>
              <div className="mt-3 flex flex-wrap gap-3">
                {project.liveUrls && project.liveUrls.length > 0 ? (
                  project.liveUrls.map((link) => (
                    <Button key={link.url} asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-4" />
                        {link.label}
                      </a>
                    </Button>
                  ))
                ) : project.liveUrl ? (
                  <Button asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-4" />
                      {t.projects.viewLive}
                    </a>
                  </Button>
                ) : null}
                {project.repoUrl && (
                  <Button variant="outline" asChild>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="size-4" />
                      {t.projects.viewRepo}
                    </a>
                  </Button>
                )}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      <span className="text-accent">//</span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  )
}
