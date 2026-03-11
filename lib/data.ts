import type { SkillCategory, Experience, Project } from "./types"
import skillsJson from "@/content/data/skills.json"
import experiencesJson from "@/content/data/experiences.json"
import projectsJson from "@/content/data/projects.json"

export const skills: SkillCategory[] = skillsJson as SkillCategory[]
export const experiences: Experience[] = experiencesJson as Experience[]
export const projects: Project[] = projectsJson as Project[]
