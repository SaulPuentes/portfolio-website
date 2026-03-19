export type Locale = "de" | "en" | "es"

export interface Translations {
  nav: {
    about: string
    projects: string
    contact: string
  }
  hero: {
    title: string
    description: string
    downloadCv: string
    viewProjects: string
    salsaWorld: string
  }
  about: {
    sectionTitle: string
    content: string[]
  }
  services: {
    sectionTitle: string
    planning: { title: string; description: string }
    development: { title: string; description: string }
    analysis: { title: string; description: string }
    consulting: { title: string; description: string }
  }
  skills: {
    sectionTitle: string
  }
  projects: {
    sectionTitle: string
    viewLive: string
    viewRepo: string
    viewDetails: string
    problem: string
    architecture: string
    decisions: string
    challenges: string
    results: string
    lessons: string
    close: string
    featured: string
  }
  contact: {
    sectionTitle: string
    description: string
    email: string
    namePlaceholder: string
    emailPlaceholder: string
    messagePlaceholder: string
    send: string
  }
  footer: {
    rights: string
  }
}
