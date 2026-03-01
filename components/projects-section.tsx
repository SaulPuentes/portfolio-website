"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n/context"
import { projects } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  FolderGit2,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowUpRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/types"

function ProjectDetailModal({
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
    { label: t.projects.lessons, content: project.detail.lessons[locale] },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {project.featured && (
              <Star className="size-4 fill-accent text-accent" />
            )}
            <DialogTitle className="text-lg">
              {project.name[locale]}
            </DialogTitle>
          </div>
          <DialogDescription>{project.description[locale]}</DialogDescription>
        </DialogHeader>

        {project.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border">
            <Image
              src={project.image}
              alt={project.name[locale]}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs font-normal">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-2 flex flex-col gap-5">
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

        <div className="mt-4 flex gap-3 border-t border-border pt-4">
          {project.liveUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
                {t.projects.viewLive}
              </a>
            </Button>
          )}
          {project.repoUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="size-3.5" />
                {t.projects.viewRepo}
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProjectCard({
  project,
  onOpenDetail,
}: {
  project: Project
  onOpenDetail: () => void
}) {
  const { locale, t } = useI18n()

  return (
    <article className="flex min-w-[320px] max-w-[380px] flex-none flex-col rounded-lg border border-border bg-card overflow-hidden snap-start">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name[locale]}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FolderGit2 className="size-10 text-muted-foreground/30" />
          </div>
        )}
        {project.featured && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5">
            <Star className="size-3 fill-accent-foreground text-accent-foreground" />
            <span className="text-xs font-medium text-accent-foreground">
              {t.projects.featured}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-foreground">
          {project.name[locale]}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description[locale]}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs font-normal">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{project.technologies.length - 4}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
          <button
            onClick={onOpenDetail}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:text-foreground transition-colors"
          >
            {t.projects.viewDetails}
            <ArrowUpRight className="size-3" />
          </button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="size-3" />
              {t.projects.viewLive}
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="size-3" />
              {t.projects.viewRepo}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function ProjectsSection() {
  const { t } = useI18n()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  const scroll = (dir: "left" | "right") => {
    const el = sliderRef.current
    if (!el) return
    el.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" })
  }

  return (
    <section id="projects" className="scroll-mt-16 py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Header row */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="size-4 text-accent" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t.projects.sectionTitle}
            </h2>
          </div>

          {/* Slider controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous projects"
              className={cn(
                "flex size-8 items-center justify-center rounded-full border border-border transition-colors",
                canScrollLeft
                  ? "text-foreground hover:bg-secondary"
                  : "cursor-not-allowed text-muted-foreground/40"
              )}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next projects"
              className={cn(
                "flex size-8 items-center justify-center rounded-full border border-border transition-colors",
                canScrollRight
                  ? "text-foreground hover:bg-secondary"
                  : "cursor-not-allowed text-muted-foreground/40"
              )}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-width slider (overflow beyond container) */}
      <div
        ref={sliderRef}
        onScroll={updateScrollState}
        className="flex gap-5 overflow-x-auto scroll-smooth px-4 pb-4 snap-x snap-mandatory lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingLeft: "2rem" }}
      >
        {/* Left padding sentinel to align with max-w-6xl */}
        <div className="hidden shrink-0 lg:block" style={{ width: "max(0px, calc((100vw - 72rem) / 2))" }} />

        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpenDetail={() => setSelectedProject(project)}
          />
        ))}

        {/* Right padding sentinel */}
        <div className="hidden shrink-0 lg:block" style={{ width: "max(0px, calc((100vw - 72rem) / 2))" }} />
      </div>

      {/* Dot indicators */}
      <div className="mt-5 flex justify-center gap-1.5">
        {projects.map((p) => (
          <div
            key={p.id}
            className={cn(
              "h-1.5 rounded-full bg-border transition-all",
              selectedProject?.id === p.id ? "w-4 bg-accent" : "w-1.5"
            )}
          />
        ))}
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
