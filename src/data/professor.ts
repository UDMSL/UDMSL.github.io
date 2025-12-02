import { parseFrontmatter, resolveImagePath } from '../utils/markdown'
import { generalInfo } from './general'
import type { ProfessorProfile, TimelineEntry } from '../types/content'

// Normalize timeline-like frontmatter arrays into a safe typed shape
const normalizeTimeline = (entries: unknown): TimelineEntry[] =>
  Array.isArray(entries)
    ? (entries as unknown[])
        .map((entry) => {
          if (!entry || typeof entry !== 'object') return null
          const { year, desc } = entry as { year?: unknown; desc?: unknown }
          const normalizedYear = year ? String(year) : ''
          const normalizedDesc = desc ? String(desc) : ''
          if (!normalizedYear && !normalizedDesc) return null
          return { year: normalizedYear, desc: normalizedDesc }
        })
        .filter((entry): entry is TimelineEntry => Boolean(entry))
    : []

// Load professor profile from Markdown frontmatter for easy content edits
const files = import.meta.glob('../content/professor.md', { eager: true, query: '?raw', import: 'default' }) as Record<
  string,
  string
>
const raw = Object.values(files)[0] ?? ''
const { data } = parseFrontmatter(raw)

export const professorProfile: ProfessorProfile = {
  name: (data.name as string) ?? '',
  title: (data.title as string) ?? '',
  affiliation: (data.affiliation as string) ?? generalInfo.affiliation,
  email: (data.email as string) ?? '',
  phone: (data.phone as string) ?? '',
  office: Array.isArray(data.office) ? (data.office as string[]) : [],
  img: resolveImagePath(data.img),
  cvLink: (data.cvLink as string) ?? '#',
  bio: Array.isArray(data.bio) ? (data.bio as string[]) : [],
  education: normalizeTimeline(data.education),
  career: normalizeTimeline(data.career),
}
