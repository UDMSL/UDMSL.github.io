const files = import.meta.glob('../content/publications/*.md', { eager: true, query: '?raw', import: 'default' });

const parsePublicationFile = (raw) => {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return { year: 0, items: [] };

    const block = match[1].split('\n');
    let year = 0;
    const items = [];
    let current = null;

    const pushCurrent = () => {
        if (current) {
            items.push({
                text: current.text || '',
                doi: current.doi || '',
            });
        }
        current = null;
    };

    const unquote = (str = '') => str.replace(/^"/, '').replace(/"$/, '').replace(/\\"/g, '"');

    for (const line of block) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        if (trimmed.startsWith('year:')) {
            year = Number(trimmed.replace('year:', '').trim()) || 0;
            continue;
        }

        if (trimmed.startsWith('items:')) {
            pushCurrent();
            continue;
        }

        if (trimmed.startsWith('- ')) {
            pushCurrent();
            current = { text: '', doi: '' };
            const textMatch = trimmed.match(/text:\s*(.+)/);
            if (textMatch) current.text = unquote(textMatch[1].trim());
            const doiMatch = trimmed.match(/doi:\s*(.+)/);
            if (doiMatch) current.doi = unquote(doiMatch[1].trim());
            continue;
        }

        if (current) {
            if (trimmed.startsWith('text:')) {
                current.text = unquote(trimmed.replace('text:', '').trim());
            } else if (trimmed.startsWith('doi:')) {
                current.doi = unquote(trimmed.replace('doi:', '').trim());
            }
        }
    }

    pushCurrent();
    return { year, items };
};

export const publicationList = Object.entries(files)
    .flatMap(([path, raw]) => {
        const { year, items } = parsePublicationFile(raw);
        return items.map((entry, idx) => ({
            year,
            text: entry.text,
            doi: entry.doi,
            order: idx,
            slug: `${year}-${String(idx + 1).padStart(2, '0')}`,
        }));
    })
    .sort((a, b) => b.year - a.year || a.order - b.order);
