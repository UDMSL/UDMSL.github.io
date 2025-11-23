import { parseFrontmatter } from '../utils/markdown.js';

const files = import.meta.glob('../content/general.md', { eager: true, query: '?raw', import: 'default' });
const raw = Object.values(files)[0] ?? '';
const { data } = parseFrontmatter(raw);

export const generalInfo = {
    labName: data.labName ?? '',
    labShortName: data.labShortName ?? '',
    department: data.department ?? '',
    university: data.university ?? '',
    affiliation: data.affiliation ?? '',
    address: data.address ?? '',
    recruitingTitle: data.recruitingTitle ?? '',
};
