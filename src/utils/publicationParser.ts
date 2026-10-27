interface RawPublicationItem {
  text: string
  doi: string
}

interface ParsedPublication {
  year: number
  items: RawPublicationItem[]
}

// Minimal parser for the frontmatter-style publications format
export const parsePublicationFile = (raw: string): ParsedPublication => {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!match) return { year: 0, items: [] }

  const block = match[1].split('\n')
  let year = 0
  const items: RawPublicationItem[] = []
  let current: RawPublicationItem | null = null
  let lastKey: 'text' | 'doi' | null = null

  const pushCurrent = () => {
    if (current) {
      items.push({
        text: current.text || '',
        doi: current.doi || '',
      })
    }
    current = null
    lastKey = null
  }

  const unquote = (str = ''): string => {
    if (str.startsWith('"') && str.endsWith('"')) {
      try { return JSON.parse(str) as string } catch { /* Preserve support for legacy quoted values. */ }
    }
    return str.replace(/^"/, '').replace(/"$/, '').replace(/\\"/g, '"')
  }

  for (const line of block) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    if (trimmed.startsWith('year:')) {
      year = Number(trimmed.replace('year:', '').trim()) || 0
      continue
    }

    if (trimmed.startsWith('items:')) {
      pushCurrent()
      continue
    }

    if (trimmed.startsWith('- ')) {
      pushCurrent()
      current = { text: '', doi: '' }
      const textMatch = trimmed.match(/text:\s*(.+)/)
      if (textMatch) {
        current.text = unquote(textMatch[1].trim())
        lastKey = 'text'
      }
      const doiMatch = trimmed.match(/doi:\s*(.+)/)
      if (doiMatch) {
        current.doi = unquote(doiMatch[1].trim())
        lastKey = 'doi'
      }
      continue
    }

    if (current) {
      if (trimmed.startsWith('text:')) {
        current.text = unquote(trimmed.replace('text:', '').trim())
        lastKey = 'text'
      } else if (trimmed.startsWith('doi:')) {
        current.doi = unquote(trimmed.replace('doi:', '').trim())
        lastKey = 'doi'
      } else if (lastKey === 'text' && trimmed) {
        current.text = `${current.text} ${unquote(trimmed)}`.trim()
      }
    }
  }

  pushCurrent()
  return { year, items }
}
