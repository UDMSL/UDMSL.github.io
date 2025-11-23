export const parseFrontmatter = (raw) => {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!match) return { data: {}, content: raw.trim() };

    const [, frontmatter, body] = match;
    const data = {};

    frontmatter.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const [key, ...rest] = line.split(':');
        if (!key) return;
        data[key.trim()] = parseValue(rest.join(':'));
    });

    return { data, content: body.trim() };
};

export const toTimestamp = (value) => {
    const time = Date.parse(value);
    return Number.isNaN(time) ? 0 : time;
};

export const resolveImagePath = (value) => {
    const img = (value || '').trim();
    if (!img) return '';
    if (/^https?:\/\//i.test(img)) return img;
    if (img.startsWith('/')) return img;
    return '/' + img.replace(/^\/+/, '');
};

const parseValue = (value = '') => {
    const trimmed = value.trim();
    if (!trimmed) return '';

    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];

    // Try JSON parsing for arrays/objects or quoted strings
    if ((first === '[' && last === ']') || (first === '{' && last === '}') || ((first === '"' || first === "'") && last === first)) {
        try {
            return JSON.parse(trimmed);
        } catch {
            // fall through
        }
    }

    // Fallback: strip matching quotes
    if ((first === '"' || first === "'") && last === first) {
        return trimmed.slice(1, -1);
    }

    return trimmed;
};
