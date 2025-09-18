export function slugify(s: string, fallback = 'challenge') {
    const t = (s || '').toLowerCase().trim()
    const core = t
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '') // strip accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    return core || fallback
}
