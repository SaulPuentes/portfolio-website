"use client"

import { useState } from "react"
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
  ChevronRight,
  Star,
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
    {
      label: t.projects.architecture,
      content: project.detail.architecture[locale],
    },
    { label: t.projects.decisions, content: project.detail.decisions[locale] },
    {
      label: t.projects.challenges,
      content: project.detail.challenges[locale],
    },
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

        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs font-normal">
              {tech}
            </Badge>
          ))}
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

        <div className="mt-4 flex gap-3 border-t border-border pt-4">
          {project.liveUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-3.5" />
                {t.projects.viewLive}
              </a>
            </Button>
          )}
          {project.repoUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
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
    <div
      className={cn(
        "group flex cursor-pointer flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/40",
        project.featured && "sm:col-span-2 lg:row-span-2"
      )}
      onClick={onOpenDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpenDetail()
        }
      }}
    >
      {project.featured && (
        <div className="mb-3 flex items-center gap-1.5">
          <Star className="size-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium uppercase tracking-wider text-accent">
            {t.projects.featured}
          </span>
        </div>
      )}

      <h3 className="text-base font-semibold text-foreground">
        {project.name[locale]}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.description[locale]}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.slice(0, project.featured ? 6 : 4).map((tech) => (
          <Badge key={tech} variant="outline" className="text-xs font-normal">
            {tech}
          </Badge>
        ))}
        {project.technologies.length > (project.featured ? 6 : 4) && (
          <Badge variant="outline" className="text-xs font-normal">
            +{project.technologies.length - (project.featured ? 6 : 4)}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
        <span className="flex items-center gap-1 text-xs font-medium text-accent transition-colors group-hover:text-foreground">
          {t.projects.viewDetails}
          <ChevronRight className="size-3" />
        </span>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
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
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="size-3" />
            {t.projects.viewRepo}
          </a>
        )}
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const { t } = useI18n()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <section id="projects" className="scroll-mt-16 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center gap-2">
          <FolderGit2 className="size-4 text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t.projects.sectionTitle}
          </h2>
        </div>

        {/* Masonry-style grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenDetail={() => setSelectedProject(project)}
            />
          ))}
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
