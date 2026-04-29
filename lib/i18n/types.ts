export type Locale = "de" | "en" | "es"

export interface Translations {
  nav: {
    about: string
    services: string
    projects: string
    contact: string
    quote: string
  }
  hero: {
    title: string
    description: string
    downloadCv: string
    viewProjects: string
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
    description: string
    links: string
    techStack: string
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
