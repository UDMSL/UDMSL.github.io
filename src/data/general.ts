import { parseFrontmatter } from '../utils/markdown'
import type { GeneralInfo } from '../types/content'

// Pull general site metadata from Markdown frontmatter at build time
const files = import.meta.glob('../content/general.md', { eager: true, query: '?raw', import: 'default' }) as Record<
  string,
  string
>
const raw = Object.values(files)[0] ?? ''
const { data } = parseFrontmatter(raw)

export const generalInfo: GeneralInfo = {
  labName: (data.labName as string) ?? '',
  labShortName: (data.labShortName as string) ?? '',
  department: (data.department as string) ?? '',
  university: (data.university as string) ?? '',
  affiliation: (data.affiliation as string) ?? '',
  address: (data.address as string) ?? '',
  recruitingTitle: (data.recruitingTitle as string) ?? '',
}
