import { parseFrontmatter, resolveImagePath } from '../utils/markdown.js';

const introFiles = import.meta.glob('../content/research/intro-*.md', { eager: true, query: '?raw', import: 'default' });
const highlightFiles = import.meta.glob('../content/research/highlights/*.md', { eager: true, query: '?raw', import: 'default' });

const splitParagraphs = (content) =>
    content
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

const intro = Object.entries(introFiles).reduce(
    (acc, [, raw]) => {
        const { data, content } = parseFrontmatter(raw);
        const lang = (data.lang || '').toLowerCase();
        if (lang === 'ko') acc.ko = splitParagraphs(content);
        if (lang === 'en') acc.en = splitParagraphs(content);
        return acc;
    },
    { ko: [], en: [] }
);

const highlights = Object.entries(highlightFiles)
    .map(([path, raw]) => {
        const { data, content } = parseFrontmatter(raw);
        const slug = path.split('/').pop()?.replace('.md', '') ?? path;
        return {
            title: data.title ?? slug,
            desc: data.desc ?? '',
            detail: content || '',
            img: resolveImagePath(data.img),
            order: Number(data.order) || 0,
            slug,
        };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

export const researchData = {
    intro,
    highlights,
};
