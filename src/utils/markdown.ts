export interface FrontmatterResult {
  data: Record<string, unknown>
  content: string
}

export const parseFrontmatter = (raw: string): FrontmatterResult => {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw.trim() }

  const [, frontmatter, body] = match
  const data: Record<string, unknown> = {}

  frontmatter.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const [key, ...rest] = line.split(':')
    if (!key) return
    data[key.trim()] = parseValue(rest.join(':'))
  })

  return { data, content: body.trim() }
}

export const toTimestamp = (value: string): number => {
  const time = Date.parse(value)
  return Number.isNaN(time) ? 0 : time
}

export const resolveImagePath = (value: unknown): string => {
  const img = (typeof value === 'string' ? value : '').trim()
  if (!img) return ''
  if (/^https?:\/\//i.test(img)) return img
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const normalized = img.replace(/^\/+/, '')
  return `${base}/${normalized}`
}

const parseValue = (value = ''): unknown => {
  const trimmed = value.trim()
  if (!trimmed) return ''

  const first = trimmed[0]
  const last = trimmed[trimmed.length - 1]

  // Try JSON parsing for arrays/objects or quoted strings
  if (
    (first === '[' && last === ']') ||
    (first === '{' && last === '}') ||
    ((first === '"' || first === "'") && last === first)
  ) {
    try {
      return JSON.parse(trimmed)
    } catch {
      // fall through
    }
  }

  // Fallback: strip matching quotes
  if ((first === '"' || first === "'") && last === first) {
    return trimmed.slice(1, -1)
  }

  return trimmed
}
