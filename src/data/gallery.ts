import { parseFrontmatter, resolveImagePath, toTimestamp } from '../utils/markdown'
import type { GalleryImage } from '../types/content'

// Gallery entries come from Markdown for quick content updates
const files = import.meta.glob('../content/gallery/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<
  string,
  string
>

export const galleryImages: GalleryImage[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data } = parseFrontmatter(raw)
    const slug = path.split('/').pop()?.replace('.md', '') ?? path
    const date = (data.date as string) ?? ''
    return {
      title: (data.title as string) ?? slug,
      date,
      img: resolveImagePath(data.img),
      slug,
    }
  })
  .sort((a, b) => {
    const diff = toTimestamp(b.date) - toTimestamp(a.date)
    if (diff !== 0) return diff
    return a.title.localeCompare(b.title)
  })
