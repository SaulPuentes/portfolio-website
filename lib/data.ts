import type { SkillCategory, Project, Service, Client } from "./types"
import skillsJson from "@/content/data/skills.json"
import projectsJson from "@/content/data/projects.json"
import clientsJson from "@/content/data/clients.json"
import servicesJson from "@/content/data/services.json"

export const skills: SkillCategory[] = skillsJson as SkillCategory[]
export const projects: Project[] = projectsJson as Project[]
export const services: Service[] = servicesJson as Service[]
export const clients: Client[] = clientsJson as Client[]
