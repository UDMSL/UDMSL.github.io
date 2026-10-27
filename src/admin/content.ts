import { parseFrontmatter } from '../utils/markdown'
import { parsePublicationFile } from '../utils/publicationParser'

export type Kind = 'members' | 'publications' | 'gallery' | 'news'
export interface Entry {
  id: string
  kind: Kind
  path: string
  fields: Record<string, string>
  body: string
}
export interface Upload { path: string; base64: string; mime: string }
export interface Draft { version: 1; base: Record<string, string>; entries: Entry[]; uploads: Upload[]; head: string }
export const labels: Record<Kind, string> = { members: '그룹 멤버', publications: 'Publications', gallery: '갤러리', news: '뉴스' }
export const isContentPath = (path: string) => /^src\/content\/(members\/(current|alumni)|publications|gallery|news)\/[a-zA-Z0-9_-]+\.md$/.test(path)
export const isUploadPath = (path: string) => /^public\/img\/uploads\/[a-zA-Z0-9_-]+\.(png|jpg|webp)$/.test(path)
export const readEntries = (files: Record<string, string>): Entry[] => Object.entries(files).flatMap<Entry>(([path, raw]) => {
  if (!isContentPath(path)) return []
  if (path.includes('/publications/')) {
    const { year, items } = parsePublicationFile(raw)
    return items.map((item, index) => ({ id: `${path}:${index}`, kind: 'publications' as Kind, path, fields: { year: String(year), text: item.text, doi: item.doi }, body: '' }))
  }
  const { data, content } = parseFrontmatter(raw)
  const kind: Kind = path.includes('/members/') ? 'members' : path.includes('/gallery/') ? 'gallery' : 'news'
  return [{ id: path, kind, path, fields: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])), body: content }]
})
const serialize = (entry: Entry) => `---\n${Object.entries(entry.fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n${entry.body}\n`
export function buildFiles(entries: Entry[], base: Record<string, string>): Record<string, string> {
  const files: Record<string, string> = {}
  const originals = readEntries(base)
  for (const entry of entries.filter(e => e.kind !== 'publications')) {
    if (!isContentPath(entry.path)) throw new Error('허용되지 않은 콘텐츠 경로입니다.')
    const original = originals.find(e => e.id === entry.id)
    files[entry.path] = original && JSON.stringify(original) === JSON.stringify(entry) ? base[original.path] : serialize(entry)
  }
  const papers = entries.filter(e => e.kind === 'publications')
  const years = new Set(papers.map(e => e.fields.year))
  for (const year of years) {
    if (!/^\d{4}$/.test(year)) throw new Error('논문 연도는 네 자리 숫자로 입력해 주세요.')
    const path = `src/content/publications/${year}.md`
    const items = papers.filter(e => e.fields.year === year)
    const old = originals.filter(e => e.kind === 'publications' && e.path === path)
    files[path] = base[path] && JSON.stringify(items) === JSON.stringify(old) ? base[path] : `---\nyear: ${year}\nitems:\n${items.map(e => `  - text: ${JSON.stringify(e.fields.text)}\n    doi: ${JSON.stringify(e.fields.doi || '')}`).join('\n')}\n---\n`
  }
  return files
}
export const changedPaths = (base: Record<string, string>, next: Record<string, string>) => [...new Set([...Object.keys(base), ...Object.keys(next)])].filter(path => base[path] !== next[path])
export function validateEntries(entries: Entry[]): string[] {
  const errors: string[] = []
  const paths = new Set<string>()
  for (const entry of entries) {
    const name = entry.fields.name || entry.fields.title || entry.fields.text?.slice(0, 45) || '새 항목'
    if (!isContentPath(entry.path)) errors.push(`${name}: 파일 경로가 올바르지 않습니다.`)
    if (entry.kind !== 'publications') {
      if (paths.has(entry.path)) errors.push(`${name}: 파일 이름이 중복되었습니다.`)
      paths.add(entry.path)
    }
    if (entry.kind === 'members') {
      if (!entry.fields.name?.trim()) errors.push('구성원 이름을 입력해 주세요.')
      if (entry.fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.fields.email)) errors.push(`${name}: 이메일을 확인해 주세요.`)
      if (!Number.isFinite(Number(entry.fields.order))) errors.push(`${name}: 표시 순서는 숫자로 입력해 주세요.`)
    } else if (entry.kind === 'publications') {
      if (!entry.fields.text?.trim()) errors.push('논문 제목과 서지 정보를 입력해 주세요.')
      if (!/^\d{4}$/.test(entry.fields.year)) errors.push(`${name}: 네 자리 연도를 입력해 주세요.`)
      if (entry.fields.doi && !/^10\.\d{4,9}\/\S+$/i.test(entry.fields.doi)) errors.push(`${name}: DOI는 10.으로 시작하는 식별자를 입력해 주세요.`)
    } else {
      if (!entry.fields.title?.trim()) errors.push('제목을 입력해 주세요.')
      const date = entry.fields.date || ''
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date) errors.push(`${name}: 날짜를 확인해 주세요.`)
      if (entry.kind === 'gallery' && !entry.fields.img) errors.push(`${name}: 사진을 선택해 주세요.`)
    }
    for (const key of ['img', 'image']) {
      const url = entry.fields[key]
      if (url && !/^https?:\/\/[^\s]+$/i.test(url) && !/^\/img\/[a-zA-Z0-9_./% -]+$/.test(url)) errors.push(`${name}: 사진 주소는 https:// 또는 /img/로 시작해야 합니다.`)
    }
  }
  return [...new Set(errors)]
}
export function parseBackup(raw: string): Draft {
  const value = JSON.parse(raw)
  if (value.version !== 1 || typeof value.base !== 'object' || !value.base || !Array.isArray(value.entries) || !Array.isArray(value.uploads) || typeof value.head !== 'string') throw new Error('UDMS 관리 화면에서 내보낸 초안 파일이 아닙니다.')
  for (const [path, text] of Object.entries(value.base)) if (!isContentPath(path) || typeof text !== 'string') throw new Error('초안 원본을 확인할 수 없습니다.')
  for (const entry of value.entries) {
    if (!entry || !Object.keys(labels).includes(entry.kind) || typeof entry.id !== 'string' || typeof entry.path !== 'string' || !isContentPath(entry.path) || typeof entry.body !== 'string' || !entry.fields || typeof entry.fields !== 'object' || Array.isArray(entry.fields) || Object.values(entry.fields).some(x => typeof x !== 'string') || Object.keys(entry.fields).some(k => !/^[a-zA-Z][a-zA-Z0-9]*$/.test(k))) throw new Error('초안 항목의 형식이 올바르지 않습니다.')
    const expected = entry.kind === 'members' ? '/members/' : `/${entry.kind}/`
    if (!entry.path.includes(expected)) throw new Error('초안 항목 종류와 경로가 일치하지 않습니다.')
  }
  for (const upload of value.uploads) if (!isUploadPath(upload.path) || !['image/png','image/jpeg','image/webp'].includes(upload.mime) || typeof upload.base64 !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(upload.base64) || upload.base64.length > 7_000_000) throw new Error('초안 사진의 형식이 올바르지 않습니다.')
  return value as Draft
}
export function createEntry(kind: Kind): Entry {
  const id = crypto.randomUUID()
  const date = new Date().toLocaleDateString('en-CA')
  const path = `src/content/${kind === 'members' ? 'members/current' : kind}/${id}.md`
  const fields = kind === 'members' ? { name: '', degree: 'M.S. Student', email: '', currentPos: '', img: '', order: '1' }
    : kind === 'publications' ? { year: String(new Date().getFullYear()), text: '', doi: '' }
    : { title: '', date, [kind === 'gallery' ? 'img' : 'image']: '' }
  return { id, kind, path, fields: fields as Record<string,string>, body: '' }
}
