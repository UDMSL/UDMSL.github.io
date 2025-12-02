import { parseFrontmatter, resolveImagePath } from '../utils/markdown'
import type { ResearchData, ResearchHighlight, ResearchIntro } from '../types/content'

// Load research content from Markdown to keep text author-friendly
const introFiles = import.meta.glob('../content/research/intro-*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>
const highlightFiles = import.meta.glob('../content/research/highlights/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const splitParagraphs = (content: string): string[] =>
  content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

// Build bilingual intro sections keyed by lang metadata
const intro = Object.entries(introFiles).reduce<ResearchIntro>(
  (acc, [, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const lang = ((data.lang as string) || '').toLowerCase()
    if (lang === 'ko') acc.ko = splitParagraphs(content)
    if (lang === 'en') acc.en = splitParagraphs(content)
    return acc
  },
  { ko: [], en: [] },
)

const highlights: ResearchHighlight[] = Object.entries(highlightFiles)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const slug = path.split('/').pop()?.replace('.md', '') ?? path
    return {
      title: (data.title as string) ?? slug,
      desc: (data.desc as string) ?? '',
      detail: content || '',
      img: resolveImagePath(data.img),
      order: Number(data.order) || 0,
      slug,
    }
  })
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))

export const researchData: ResearchData = {
  intro,
  highlights,
}
