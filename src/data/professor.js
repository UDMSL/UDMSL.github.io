import { parseFrontmatter, resolveImagePath } from '../utils/markdown.js';
import { generalInfo } from './general';

const files = import.meta.glob('../content/professor.md', { eager: true, query: '?raw', import: 'default' });
const raw = Object.values(files)[0] ?? '';
const { data } = parseFrontmatter(raw);

export const professorProfile = {
    name: data.name ?? '',
    title: data.title ?? '',
    affiliation: data.affiliation ?? generalInfo.affiliation,
    email: data.email ?? '',
    phone: data.phone ?? '',
    office: Array.isArray(data.office) ? data.office : [],
    img: resolveImagePath(data.img),
    cvLink: data.cvLink ?? '#',
    bio: Array.isArray(data.bio) ? data.bio : [],
    education: Array.isArray(data.education) ? data.education : [],
    career: Array.isArray(data.career) ? data.career : [],
};
