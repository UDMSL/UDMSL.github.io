import { parsePublicationFile } from '../utils/publicationParser'
import type { PublicationEntry } from '../types/content'

// Publications are stored as frontmatter blocks to keep content non-developers friendly
const files = import.meta.glob('../content/publications/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<
  string,
  string
>

const parsedPublications = Object.entries(files)
  .map(([, raw], index) => ({
    ...parsePublicationFile(raw),
    sourceOrder: index,
  }))
  .sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year
    }
    return a.sourceOrder - b.sourceOrder
  })

export const publicationList: PublicationEntry[] = parsedPublications.flatMap(({ year, items }) =>
  items.map((entry, idx) => ({
    year,
    text: entry.text,
    doi: entry.doi,
    slug: `${year}-${String(idx + 1).padStart(2, '0')}`,
  })),
)
