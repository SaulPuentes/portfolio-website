import type { Project } from "./types"

export const SLIDE_MS = 3000
export const SINGLE_IMAGE_MS = 6000

export interface Timeline {
  project: number
  slide: number
  elapsedMs: number
}

export function projectImages(p: Project): string[] {
  if (p.gallery && p.gallery.length > 0) return p.gallery
  return p.image ? [p.image] : []
}

export function slideMs(imageCount: number): number {
  return imageCount > 1 ? SLIDE_MS : SINGLE_IMAGE_MS
}

// Crosses one boundary at most: a tab waking from sleep moves one step, not through every project
export function advance(t: Timeline, dtMs: number, imageCounts: number[]): Timeline {
  const count = imageCounts[t.project] ?? 0
  const elapsedMs = t.elapsedMs + dtMs
  if (elapsedMs < slideMs(count)) return { ...t, elapsedMs }
  if (t.slide + 1 < count) return { project: t.project, slide: t.slide + 1, elapsedMs: 0 }
  return { project: (t.project + 1) % imageCounts.length, slide: 0, elapsedMs: 0 }
}

export function progress(t: Timeline, imageCounts: number[]): number {
  const count = imageCounts[t.project] ?? 0
  const slides = Math.max(count, 1)
  return Math.min((t.slide + t.elapsedMs / slideMs(count)) / slides, 1)
}

export function selectProject(t: Timeline, project: number): Timeline {
  return t.project === project ? t : { project, slide: 0, elapsedMs: 0 }
}

export function splitProjectName(name: string): { title: string; kind?: string } {
  const [title, ...rest] = name.split(" — ")
  return rest.length > 0 ? { title, kind: rest.join(" — ") } : { title }
}

export function stripCards(count: number): { index: number; duplicate: boolean }[] {
  const cards = Array.from({ length: count }, (_, index) => ({ index, duplicate: false }))
  return [...cards, ...cards.map((c) => ({ ...c, duplicate: true }))]
}
