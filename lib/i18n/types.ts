export type Locale = "de" | "en" | "es"

export interface Translations {
  nav: {
    about: string
    skills: string
    experience: string
    projects: string
    contact: string
  }
  hero: {
    title: string
    subtitle: string
    description: string
    downloadCv: string
    viewProjects: string
    salsaWorld: string
  }
  about: {
    sectionTitle: string
    content: string[]
  }
  skills: {
    sectionTitle: string
    frontend: string
    backend: string
    cloud: string
    databases: string
    practices: string
  }
  experience: {
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
