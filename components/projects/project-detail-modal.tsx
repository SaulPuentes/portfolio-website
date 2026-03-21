"use client"

import { useI18n } from "@/lib/i18n/context"
import { Badge } from "@/components/ui/badge"
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

  const details = [
    { label: t.projects.problem, content: project.detail.problem[locale] },
    { label: t.projects.architecture, content: project.detail.architecture[locale] },
    { label: t.projects.decisions, content: project.detail.decisions[locale] },
    { label: t.projects.challenges, content: project.detail.challenges[locale] },
    { label: t.projects.results, content: project.detail.results[locale] },
    ...(project.detail.lessons ? [{ label: t.projects.lessons, content: project.detail.lessons[locale] }] : []),
  ]

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
        className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div className="flex items-center gap-2">
            {project.featured && (
              <Star className="size-4 fill-accent text-accent" />
            )}
            <DialogTitle className="text-lg">
              {project.name[locale]}
            </DialogTitle>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="size-4" />
            <span className="sr-only">{t.projects.close}</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <DialogDescription className="mb-4">
            {project.description[locale]}
          </DialogDescription>

          {images.length > 0 && (
            <ImageCarousel images={images} alt={project.name[locale]} />
          )}

          <div className="mt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
              {t.projects.links}
            </h4>
            <div className="flex flex-wrap gap-3 rounded-lg bg-muted/50 px-4 py-3">
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
          </div>

          <div className="mt-4 flex flex-col gap-5">
            {details.map((d) => (
              <div key={d.label}>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-foreground">
                  {d.label}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {d.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs font-normal">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
