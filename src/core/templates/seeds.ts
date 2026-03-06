import { getSampleChallenge } from '@/data/sampleChallenges'
import { exportToTOML, importFromTOMLWithWarnings } from '@/utils/tomlIO'
import {
    blankChallenge,
    defaultChallengeSheetState,
    defaultChallengeView,
} from './legendChallengeModel'
import type {
    Challenge,
    ChallengeSheetState,
    ChallengeViewState,
} from './legendChallengeModel'
import type { TemplateSeedDefinition } from './types'

const legendChallengeSeed: TemplateSeedDefinition<
    Challenge,
    ChallengeViewState,
    ChallengeSheetState
> = {
    id: 'legend.challenge',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'Challenge',
    implemented: true,

    createBlank: blankChallenge,
    createSample: getSampleChallenge,
    defaultView: defaultChallengeView,
    createInitialSheet: () => defaultChallengeSheetState,

    io: {
        importToml: (tomlText) => {
            const { challenge, warnings } = importFromTOMLWithWarnings(tomlText)
            return {
                doc: challenge,
                warnings,
                previewName: challenge.name || 'Imported Challenge',
            }
        },
        exportToml: (doc) => exportToTOML(doc),
        canExportImage: true,
    },

    viewConfig: {
        sectionItems: [
            { id: 'rolesDesc', label: 'Roles & Description' },
            { id: 'tagsStatuses', label: 'Tags & Statuses' },
            { id: 'might', label: 'Might' },
            { id: 'specialFeatures', label: 'Special Features' },
            { id: 'meta', label: 'Meta footer' },
        ],
        zoomOptions: [0.75, 1, 1.25, 1.5],
        backgroundOptions: [
            { value: 'parchment', label: 'Parchment' },
            { value: 'plain', label: 'Plain' },
            { value: 'transparent', label: 'Transparent' },
        ],
    },

    getTabTitle: (doc) => doc.name.trim() || 'Challenge',
    getPreviewRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
}

const cityDangerSeed: TemplateSeedDefinition = {
    id: 'city.danger',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'Danger',
    implemented: false,
    comingSoonLabel: 'Coming soon',
    createBlank: () => ({}),
    createSample: () => ({}),
    defaultView: {},
    createInitialSheet: () => ({ open: false, target: null }),
    io: {},
    viewConfig: { sectionItems: [], zoomOptions: [], backgroundOptions: [] },
    getTabTitle: () => 'Danger',
    getPreviewRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
}

const cityCustomMoveSeed: TemplateSeedDefinition = {
    id: 'city.customMove',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'Custom Move',
    implemented: false,
    comingSoonLabel: 'Coming soon',
    createBlank: () => ({}),
    createSample: () => ({}),
    defaultView: {},
    createInitialSheet: () => ({ open: false, target: null }),
    io: {},
    viewConfig: { sectionItems: [], zoomOptions: [], backgroundOptions: [] },
    getTabTitle: () => 'Custom Move',
    getPreviewRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
}

const cityIcebergSeed: TemplateSeedDefinition = {
    id: 'city.iceberg',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'Iceberg',
    implemented: false,
    comingSoonLabel: 'Coming soon',
    createBlank: () => ({}),
    createSample: () => ({}),
    defaultView: {},
    createInitialSheet: () => ({ open: false, target: null }),
    io: {},
    viewConfig: { sectionItems: [], zoomOptions: [], backgroundOptions: [] },
    getTabTitle: () => 'Iceberg',
    getPreviewRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
}

const cityThemeKitSeed: TemplateSeedDefinition = {
    id: 'city.themeKit',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'Theme Kit',
    implemented: false,
    comingSoonLabel: 'Coming soon',
    createBlank: () => ({}),
    createSample: () => ({}),
    defaultView: {},
    createInitialSheet: () => ({ open: false, target: null }),
    io: {},
    viewConfig: { sectionItems: [], zoomOptions: [], backgroundOptions: [] },
    getTabTitle: () => 'Theme Kit',
    getPreviewRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
}

const legendJourneySeed: TemplateSeedDefinition = {
    id: 'legend.journey',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'Journey',
    implemented: false,
    comingSoonLabel: 'Coming soon',
    createBlank: () => ({}),
    createSample: () => ({}),
    defaultView: {},
    createInitialSheet: () => ({ open: false, target: null }),
    io: {},
    viewConfig: { sectionItems: [], zoomOptions: [], backgroundOptions: [] },
    getTabTitle: () => 'Journey',
    getPreviewRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
}

const legendStoryThemeSeed: TemplateSeedDefinition = {
    id: 'legend.storyTheme',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'Story Theme',
    implemented: false,
    comingSoonLabel: 'Coming soon',
    createBlank: () => ({}),
    createSample: () => ({}),
    defaultView: {},
    createInitialSheet: () => ({ open: false, target: null }),
    io: {},
    viewConfig: { sectionItems: [], zoomOptions: [], backgroundOptions: [] },
    getTabTitle: () => 'Story Theme',
    getPreviewRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
}

const legendThemeKitSeed: TemplateSeedDefinition = {
    id: 'legend.themeKit',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'Theme Kit',
    implemented: false,
    comingSoonLabel: 'Coming soon',
    createBlank: () => ({}),
    createSample: () => ({}),
    defaultView: {},
    createInitialSheet: () => ({ open: false, target: null }),
    io: {},
    viewConfig: { sectionItems: [], zoomOptions: [], backgroundOptions: [] },
    getTabTitle: () => 'Theme Kit',
    getPreviewRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
}

const otherscapeChallengeSeed: TemplateSeedDefinition = {
    id: 'otherscape.challenge',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'Challenge',
    implemented: false,
    comingSoonLabel: 'Coming soon',
    createBlank: () => ({}),
    createSample: () => ({}),
    defaultView: {},
    createInitialSheet: () => ({ open: false, target: null }),
    io: {},
    viewConfig: { sectionItems: [], zoomOptions: [], backgroundOptions: [] },
    getTabTitle: () => 'Challenge',
    getPreviewRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
}

const otherscapeThemeKitSeed: TemplateSeedDefinition = {
    id: 'otherscape.themeKit',
    gameId: 'otherscape',
    gameLabel: ':Otherscape',
    label: 'Theme Kit',
    implemented: false,
    comingSoonLabel: 'Coming soon',
    createBlank: () => ({}),
    createSample: () => ({}),
    defaultView: {},
    createInitialSheet: () => ({ open: false, target: null }),
    io: {},
    viewConfig: { sectionItems: [], zoomOptions: [], backgroundOptions: [] },
    getTabTitle: () => 'Theme Kit',
    getPreviewRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
}

export const templateSeeds = [
    cityDangerSeed,
    cityCustomMoveSeed,
    cityIcebergSeed,
    cityThemeKitSeed,
    legendChallengeSeed,
    legendJourneySeed,
    legendStoryThemeSeed,
    legendThemeKitSeed,
    otherscapeChallengeSeed,
    otherscapeThemeKitSeed,
]

export const templateSeedById = new Map(templateSeeds.map((t) => [t.id, t]))

export const templatesByGame = [
    {
        gameId: 'city',
        gameLabel: 'City of Mist',
        templates: templateSeeds.filter((t) => t.gameId === 'city'),
    },
    {
        gameId: 'legend',
        gameLabel: 'Legend in the Mist',
        templates: templateSeeds.filter((t) => t.gameId === 'legend'),
    },
    {
        gameId: 'otherscape',
        gameLabel: ':Otherscape',
        templates: templateSeeds.filter((t) => t.gameId === 'otherscape'),
    },
] as const
