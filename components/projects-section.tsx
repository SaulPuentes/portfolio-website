"use client"

import { useState, useRef } from "react"
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
  Star,
  ArrowUpRight,
} from "lucide-react"
import type { Project } from "@/lib/types"
import { useInView, useScrollCards } from "@/hooks/use-scroll-cards"

/* ------------------------------------------------------------------ */
/*  ProjectDetailModal — preserved from original                       */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Gallery Collage                                                    */
/* ------------------------------------------------------------------ */

function GalleryCollage({
  gallery,
  image,
  alt,
}: {
  gallery?: string[]
  image?: string
  alt: string
}) {
  const images = gallery?.length ? gallery : image ? [image] : []

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-muted">
        <FolderGit2 className="size-16 text-muted-foreground/20" />
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {images.slice(0, 4).map((src, i) => (
        <div
          key={i}
          className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
        >
          <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" />
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  ProjectCard — rendered inside sticky viewport                      */
/* ------------------------------------------------------------------ */

function ProjectCard({
  project,
  isVisible,
  index,
  total,
  onOpenDetail,
}: {
  project: Project
  isVisible: boolean
  index: number
  total: number
  onOpenDetail: () => void
}) {
  const { locale, t } = useI18n()

  return (
    <article
      className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        zIndex: isVisible ? index + 1 : 0,
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(60px) scale(0.97)",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div className="w-full max-w-5xl rounded-2xl border border-border bg-card p-6 shadow-lg md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Left: Info */}
          <div className="flex flex-1 flex-col gap-5">
            {project.featured && (
              <div className="flex items-center gap-1.5">
                <Star className="size-3.5 fill-accent text-accent" />
                <span className="text-xs font-medium uppercase tracking-wider text-accent">
                  {t.projects.featured}
                </span>
              </div>
            )}

            <h3 className="text-3xl font-bold text-foreground md:text-5xl">
              {project.name[locale]}
            </h3>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              {project.description[locale]}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs font-normal">
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={onOpenDetail}
                className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/80"
              >
                {t.projects.viewDetails}
                <ArrowUpRight className="size-4" />
              </button>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                  {t.projects.viewLive}
                </a>
              )}

              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="size-3.5" />
                  {t.projects.viewRepo}
                </a>
              )}
            </div>
          </div>

          {/* Right: Gallery */}
          <div className="w-full lg:w-1/2 lg:min-h-[400px]">
            <GalleryCollage
              gallery={project.gallery}
              image={project.image}
              alt={project.name[locale]}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/*  ProjectsSection — scroll-driven stacking                           */
/* ------------------------------------------------------------------ */

export function ProjectsSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const total = projects.length

  const inView = useInView(sectionRef)
  const { activeIndex, progress, vhPerSlide } = useScrollCards(sectionRef, total)

  const sectionHeight = `${total * vhPerSlide}vh`

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative scroll-mt-16"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 flex h-screen">
        <div className="flex flex-1 flex-col">
          {/* Section header */}
          <div
            className="mx-auto w-full max-w-6xl px-4 pt-20 lg:px-8 transition-all duration-700 ease-out"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">
              {t.projects.sectionTitle}
            </h2>
          </div>

          {/* Card viewport */}
          <div
            className="relative mx-auto flex-1 w-full max-w-6xl px-4 lg:px-8 transition-all duration-700 ease-out delay-200"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(32px)",
            }}
          >
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                isVisible={i <= activeIndex}
                index={i}
                total={total}
                onOpenDetail={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>

        {/* Vertical progress bar */}
        <div
          className="hidden md:flex flex-col items-center gap-3 py-20 pr-6 transition-all duration-700 ease-out delay-500"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <span className="text-xs font-mono text-muted-foreground">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <div className="relative w-[2px] flex-1 rounded-full bg-border overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 rounded-full bg-accent transition-[height] duration-200 ease-out"
              style={{ height: `${progress * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {String(total).padStart(2, "0")}
          </span>
        </div>
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
