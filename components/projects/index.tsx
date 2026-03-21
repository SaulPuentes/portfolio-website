"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { projects } from "@/lib/data"
import type { Project } from "@/lib/types"
import { ScrollCarousel } from "@/components/scroll-carousel"
import type { CarouselItem } from "@/components/scroll-carousel"
import { ProjectDetailModal } from "./project-detail-modal"

export function ProjectsSection() {
  const { locale, t } = useI18n()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const carouselItems: CarouselItem[] = projects.map((p) => ({
    image: p.image
      ? { src: p.image, alt: p.name[locale], width: 1024, height: 640 }
      : undefined,
    gallery:
      p.gallery && p.gallery.length > 1
        ? p.gallery.map((src, i) => ({
            src,
            alt: `${p.name[locale]} ${i + 1}`,
            width: 1024,
            height: 640,
          }))
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
