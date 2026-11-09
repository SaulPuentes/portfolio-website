"use client"

import { useRef, useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { projects } from "@/lib/data"
import { useShowcase } from "@/hooks/use-showcase"
import { Stage } from "./stage"
import { Strip } from "./strip"

const MOBILE = "(max-width: 767.98px)"
const HEADER_PX = 56

export function ProjectsSection() {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(false)
  // Held while expanded: the text must not change under someone reading it
  const { timeline, paused, togglePaused, select, onScreen, sectionRef, fillRef } = useShowcase(projects, expanded)
  const stageRef = useRef<HTMLDivElement | null>(null)

  const onSelectCard = (index: number) => {
    setExpanded(false)
    select(index)
    // The only scroll in this feature: on phones the strip sits below the stage, and the visitor asked for this
    const stage = stageRef.current
    if (!stage || !matchMedia(MOBILE).matches) return
    const { top, bottom } = stage.getBoundingClientRect()
    if (top < HEADER_PX || bottom > document.documentElement.clientHeight) stage.scrollIntoView({ block: "start" })
  }

  const project = projects[timeline.project]

  return (
    <section id="projects" ref={sectionRef} className="relative -scroll-mt-10 py-16 md:-scroll-mt-18 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title mb-6">{t.projects.sectionTitle}</h2>
        {project && (
          <Stage
            ref={stageRef}
            project={project}
            next={projects[(timeline.project + 1) % projects.length]}
            slide={timeline.slide}
            paused={paused}
            onTogglePaused={togglePaused}
            expanded={expanded}
            onToggleExpanded={() => setExpanded((e) => !e)}
            fillRef={fillRef}
          />
        )}
        <Strip projects={projects} activeIndex={timeline.project} running={onScreen} onSelect={onSelectCard} />
      </div>
    </section>
  )
}
