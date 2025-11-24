import { parseFrontmatter, resolveImagePath } from '../utils/markdown'
import type { MemberProfile } from '../types/content'

const mapFiles = (
  files: Record<string, string>,
  mapper: (data: Record<string, unknown>, slug: string) => MemberProfile,
): MemberProfile[] =>
  Object.entries(files)
    .map(([path, raw]) => {
      const { data } = parseFrontmatter(raw)
      const slug = path.split('/').pop()?.replace('.md', '') ?? path
      return mapper(data, slug)
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))

const currentFiles = import.meta.glob('../content/members/current/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>
const alumniFiles = import.meta.glob('../content/members/alumni/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

export const membersData: { current: MemberProfile[]; alumni: MemberProfile[] } = {
  current: mapFiles(currentFiles, (data, slug) => ({
    name: (data.name as string) ?? slug,
    order: Number.isFinite(Number(data.order)) ? Number(data.order) : Number.POSITIVE_INFINITY,
    degree: (data.degree as string) ?? (data.role as string) ?? '',
    email: (data.email as string) ?? '',
    currentPos: (data.currentPos as string) ?? '',
    img: resolveImagePath(data.img),
  })),
  alumni: mapFiles(alumniFiles, (data, slug) => ({
    name: (data.name as string) ?? slug,
    order: Number.isFinite(Number(data.order)) ? Number(data.order) : Number.POSITIVE_INFINITY,
    degree: (data.degree as string) ?? (data.role as string) ?? '',
    email: (data.email as string) ?? '',
    currentPos: (data.currentPos as string) ?? '',
    img: resolveImagePath(data.img),
  })),
}
