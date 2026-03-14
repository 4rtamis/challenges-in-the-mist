import { renderLitmMarkdown } from '@/utils/markdown'
import type { Spectrum } from './model'

export function renderDangerMarkdownInline(text: string) {
    const html = renderLitmMarkdown(text)
    const match = html.match(/^<p>([\s\S]*)<\/p>\s*$/)
    return match ? match[1] : html
}

export function formatSpectrumLabel(
    spectrum: Pick<Spectrum, 'name' | 'maximum'> & {
        is_immune?: boolean
    }
) {
    return `${spectrum.name} ${spectrum.is_immune ? '-' : spectrum.maximum}`
}
