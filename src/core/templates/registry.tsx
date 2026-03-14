import dangerTemplate from '@/templates/city-of-mist/danger/definition'
import challengeTemplate from '@/templates/legend-in-the-mist/challenge/definition'
import {
    DEFAULT_TEMPLATE_PREVIEW_WIDTH,
    type AnyTemplateDefinition,
    type GameId,
} from './types'

function createComingSoonTemplate(config: {
    id: string
    gameId: GameId
    gameLabel: string
    label: string
}) {
    const placeholder: AnyTemplateDefinition = {
        ...config,
        implemented: false,
        comingSoonLabel: 'Coming soon',
        createBlank: () => ({}),
        createExample: () => ({}),
        createInitialView: () => ({}),
        createInitialSheet: () => ({ open: false, target: null }),
        getTabTitle: () => config.label,
        sections: [],
        landing: {
            description: `${config.label} support is not implemented yet.`,
        },
        io: {},
        preview: {
            getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
            render: () => null,
        },
        editor: {
            emptyState: `${config.label} editing is not available yet.`,
            renderPanel: () => null,
        },
        appearance: {
            getPreviewWidth: () => DEFAULT_TEMPLATE_PREVIEW_WIDTH,
            renderPanel: () => null,
        },
        export: {
            actions: [],
        },
    }

    return placeholder
}

export const templateRegistry: AnyTemplateDefinition[] = [
    dangerTemplate,
    createComingSoonTemplate({
        id: 'city.customMove',
        gameId: 'city',
        gameLabel: 'City of Mist',
        label: 'Custom Move',
    }),
    createComingSoonTemplate({
        id: 'city.iceberg',
        gameId: 'city',
        gameLabel: 'City of Mist',
        label: 'Iceberg',
    }),
    createComingSoonTemplate({
        id: 'city.themeKit',
        gameId: 'city',
        gameLabel: 'City of Mist',
        label: 'Theme Kit',
    }),
    challengeTemplate,
    createComingSoonTemplate({
        id: 'legend.journey',
        gameId: 'legend',
        gameLabel: 'Legend in the Mist',
        label: 'Journey',
    }),
    createComingSoonTemplate({
        id: 'legend.storyTheme',
        gameId: 'legend',
        gameLabel: 'Legend in the Mist',
        label: 'Story Theme',
    }),
    createComingSoonTemplate({
        id: 'legend.themeKit',
        gameId: 'legend',
        gameLabel: 'Legend in the Mist',
        label: 'Theme Kit',
    }),
    createComingSoonTemplate({
        id: 'otherscape.challenge',
        gameId: 'otherscape',
        gameLabel: ':Otherscape',
        label: 'Challenge',
    }),
    createComingSoonTemplate({
        id: 'otherscape.themeKit',
        gameId: 'otherscape',
        gameLabel: ':Otherscape',
        label: 'Theme Kit',
    }),
]

export const templateById = new Map(
    templateRegistry.map((template) => [template.id, template] as const)
)

export const templatesByGame = [
    {
        gameId: 'city',
        gameLabel: 'City of Mist',
        templates: templateRegistry.filter(
            (template) => template.gameId === 'city'
        ),
    },
    {
        gameId: 'legend',
        gameLabel: 'Legend in the Mist',
        templates: templateRegistry.filter(
            (template) => template.gameId === 'legend'
        ),
    },
    {
        gameId: 'otherscape',
        gameLabel: ':Otherscape',
        templates: templateRegistry.filter(
            (template) => template.gameId === 'otherscape'
        ),
    },
] as const
