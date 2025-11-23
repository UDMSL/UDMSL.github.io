import { parseFrontmatter, resolveImagePath } from '../utils/markdown.js';

const mapFiles = (files, mapper) =>
    Object.entries(files)
        .map(([path, raw]) => {
            const { data } = parseFrontmatter(raw);
            const slug = path.split('/').pop()?.replace('.md', '') ?? path;
            return mapper(data, slug);
        })
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

const currentFiles = import.meta.glob('../content/members/current/*.md', { eager: true, query: '?raw', import: 'default' });
const alumniFiles = import.meta.glob('../content/members/alumni/*.md', { eager: true, query: '?raw', import: 'default' });

export const membersData = {
    current: mapFiles(currentFiles, (data, slug) => ({
        name: data.name ?? slug,
        order: Number.isFinite(Number(data.order)) ? Number(data.order) : Number.POSITIVE_INFINITY,
        degree: data.degree ?? data.role ?? '',
        email: data.email ?? '',
        currentPos: data.currentPos ?? '',
        img: resolveImagePath(data.img),
    })),
    alumni: mapFiles(alumniFiles, (data, slug) => ({
        name: data.name ?? slug,
        order: Number.isFinite(Number(data.order)) ? Number(data.order) : Number.POSITIVE_INFINITY,
        degree: data.degree ?? data.role ?? '',
        email: data.email ?? '',
        currentPos: data.currentPos ?? '',
        img: resolveImagePath(data.img),
    })),
};
