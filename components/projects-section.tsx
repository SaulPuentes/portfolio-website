"use client"

import { useState } from "react"
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
  ExternalLink,
  Github,
  Star,
} from "lucide-react"
import type { Project } from "@/lib/types"
import { ScrollCarousel } from "@/components/scroll-carousel"
import type { CarouselItem } from "@/components/scroll-carousel"

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
/*  ProjectsSection                                                    */
/* ------------------------------------------------------------------ */

export function ProjectsSection() {
  const { locale, t } = useI18n()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const carouselItems: CarouselItem[] = projects.map((p) => ({
    image: p.image
      ? { src: p.image, alt: p.name[locale], width: 1024, height: 640 }
      : undefined,
    title: p.name[locale],
    description: p.description[locale],
    badges: p.technologies,
    cta: {
      label: t.projects.viewDetails,
      href: "#",
    },
  }))

  const handleCtaClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const ctaEl = target.closest<HTMLAnchorElement>(".cta-button")
    if (!ctaEl) return

    e.preventDefault()
    // Find which slide was clicked
    const slideEl = ctaEl.closest(".swiper-slide")
    if (!slideEl) return
    const slideContainer = slideEl.parentElement
    if (!slideContainer) return
    const index = Array.from(slideContainer.children).filter(
      (el) => el.classList.contains("swiper-slide"),
    ).indexOf(slideEl)
    if (index >= 0 && index < projects.length) {
      setSelectedProject(projects[index])
    }
  }

  return (
    <section id="projects" className="relative scroll-mt-16">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={handleCtaClick}>
        <ScrollCarousel
          id="projects-carousel"
          items={carouselItems}
          heading={t.projects.sectionTitle}
          scrub
        />
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
