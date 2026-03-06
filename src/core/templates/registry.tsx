import SectionSheetHost from '@/editor/SectionSheetHost'
import LivePreview from '@/preview/LivePreview'
import { templateSeeds } from './seeds'
import type { TemplateDefinition } from './types'

export const templateRegistry: TemplateDefinition[] = templateSeeds.map(
    (seed) => {
        if (seed.id === 'legend.challenge') {
            return {
                ...seed,
                renderPreview: () => <LivePreview />,
                renderSheetHost: () => <SectionSheetHost />,
            }
        }

        return {
            ...seed,
            renderPreview: () => null,
            renderSheetHost: () => null,
        }
    }
)

export const templateById = new Map(templateRegistry.map((t) => [t.id, t]))
