import { parseFrontmatter, toTimestamp } from '../utils/markdown'
import type { NewsPost } from '../types/content'

const newsFiles = import.meta.glob('../content/news/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<
  string,
  string
>

export const newsPosts: NewsPost[] = Object.entries(newsFiles)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const slug = path.split('/').pop()?.replace('.md', '') ?? path

    return {
      date: (data.date as string) ?? '',
      title: (data.title as string) ?? slug,
      content,
      slug,
      image: typeof data.image === 'string' ? data.image : undefined,
    }
  })
  .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))
