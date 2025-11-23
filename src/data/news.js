import { parseFrontmatter, toTimestamp } from '../utils/markdown.js';

const newsFiles = import.meta.glob('../content/news/*.md', { eager: true, query: '?raw', import: 'default' });

export const newsPosts = Object.entries(newsFiles)
    .map(([path, raw]) => {
        const { data, content } = parseFrontmatter(raw);
        const slug = path.split('/').pop()?.replace('.md', '') ?? path;

        return {
            ...data,
            date: data.date ?? '',
            title: data.title ?? slug,
            content,
            slug,
        };
    })
    .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));
