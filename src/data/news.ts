import { parseFrontmatter, resolveImagePath, toTimestamp } from '../utils/markdown'
import type { NewsPost } from '../types/content'

// Load news posts from Markdown and keep them sorted by recency
const newsFiles = import.meta.glob('../content/news/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<
  string,
  string
>

export const newsPosts: NewsPost[] = Object.entries(newsFiles)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const slug = path.split('/').pop()?.replace('.md', '') ?? path

    const image = resolveImagePath(data.image)

    return {
      date: (data.date as string) ?? '',
      title: (data.title as string) ?? slug,
      content,
      slug,
      image: image || undefined,
    }
  })
  .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))
