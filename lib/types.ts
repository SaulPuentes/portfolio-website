import type { Locale } from "./i18n/types"

export interface Skill {
  name: string
}

export interface SkillCategory {
  key: string
  items: Skill[]
}

export interface ProjectDetail {
  problem: Record<Locale, string>
  architecture: Record<Locale, string>
  decisions: Record<Locale, string>
  challenges: Record<Locale, string>
  results: Record<Locale, string>
  lessons: Record<Locale, string>
}

export interface Service {
  number: string
  key: string
}

export interface Project {
  id: string
  name: Record<Locale, string>
  description: Record<Locale, string>
  technologies: string[]
  liveUrl?: string
  repoUrl?: string
  featured?: boolean
  image?: string
  detail: ProjectDetail
}
