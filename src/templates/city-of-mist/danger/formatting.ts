import type { Spectrum } from './model'

export function formatSpectrumLabel(
    spectrum: Pick<Spectrum, 'name' | 'maximum'> & {
        is_immune?: boolean
    }
) {
    return `${spectrum.name} ${spectrum.is_immune ? '-' : spectrum.maximum}`
}
