import { parseFrontmatter, resolveImagePath, toTimestamp } from '../utils/markdown.js';

const files = import.meta.glob('../content/gallery/*.md', { eager: true, query: '?raw', import: 'default' });

export const galleryImages = Object.entries(files)
    .map(([path, raw]) => {
        const { data } = parseFrontmatter(raw);
        const slug = path.split('/').pop()?.replace('.md', '') ?? path;
        const date = data.date ?? '';
        return {
            title: data.title ?? slug,
            date,
            img: resolveImagePath(data.img),
            slug,
        };
    })
    .sort((a, b) => {
        const diff = toTimestamp(b.date) - toTimestamp(a.date);
        if (diff !== 0) return diff;
        return a.title.localeCompare(b.title);
    });
