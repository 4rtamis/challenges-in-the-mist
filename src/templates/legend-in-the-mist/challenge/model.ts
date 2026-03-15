import type {
    ChallengeMeta,
    LegendInTheMistChallengeData,
    Limit,
    Might,
    MightLevel,
    PublicationType,
    SpecialFeature,
    Threat,
} from './schema'

export type {
    ChallengeMeta,
    Limit,
    Might,
    MightLevel,
    PublicationType,
    SpecialFeature,
    Threat,
}

export type LegendInTheMistChallenge = {
    name: string
    description: string
    rating: number
    roles: string[]
    tags_and_statuses: string[]
    mights: Might[]
    limits: Limit[]
    threats: Threat[]
    general_consequences: string[]
    special_features: SpecialFeature[]
    meta?: ChallengeMeta
}

export function toLegendInTheMistChallengeDocument(
    legendInTheMistChallenge: LegendInTheMistChallengeData
): LegendInTheMistChallenge {
    return {
        name: legendInTheMistChallenge.name,
        description: legendInTheMistChallenge.description ?? '',
        rating: legendInTheMistChallenge.rating,
        roles: legendInTheMistChallenge.roles ?? [],
        tags_and_statuses: legendInTheMistChallenge.tags_and_statuses ?? [],
        mights: legendInTheMistChallenge.mights ?? [],
        limits: legendInTheMistChallenge.limits ?? [],
        threats: legendInTheMistChallenge.threats ?? [],
        general_consequences:
            legendInTheMistChallenge.general_consequences ?? [],
        special_features: legendInTheMistChallenge.special_features ?? [],
        meta: legendInTheMistChallenge.meta,
    }
}

export type SectionId =
    | 'rolesDesc'
    | 'limits'
    | 'tagsStatuses'
    | 'might'
    | 'specialFeatures'
    | 'threats'
    | 'generalConsequences'
    | 'meta'

export type Background = 'parchment' | 'plain'

export type ExportPrefs = {
    scale: 2 | 1 | 3
}

export type LegendInTheMistChallengeViewState = {
    zoom: number
    previewWidth: number
    background: Background
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    exportPrefs: ExportPrefs
}

export type SheetTarget =
    | { kind: 'basic'; mode?: 'edit' }
    | { kind: 'meta'; mode?: 'edit' }
    | { kind: 'limits'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'tags'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'mights'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'special'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'threats'; mode?: 'create' | 'edit'; index?: number }

export type LegendInTheMistChallengeSheetState = {
    open: boolean
    target: SheetTarget | null
}

export const PREVIEW_WIDTH_MIN = 700
export const PREVIEW_WIDTH_MAX = 1400
export const PREVIEW_WIDTH_DEFAULT = 1152

export const defaultHidden: Record<SectionId, boolean> = {
    rolesDesc: false,
    limits: false,
    tagsStatuses: false,
    might: false,
    specialFeatures: false,
    threats: false,
    generalConsequences: false,
    meta: false,
}

export const defaultLegendInTheMistChallengeView: LegendInTheMistChallengeViewState =
    {
        zoom: 1,
        previewWidth: PREVIEW_WIDTH_DEFAULT,
        background: 'parchment',
        autoHideEmpty: false,
        hidden: defaultHidden,
        exportPrefs: {
            scale: 2,
        },
    }

export const defaultLegendInTheMistChallengeSheetState: LegendInTheMistChallengeSheetState =
    {
        open: false,
        target: null,
    }

export const blankLegendInTheMistChallenge = (): LegendInTheMistChallenge => ({
    name: 'Untitled Challenge',
    description: '',
    rating: 1,
    roles: [],
    tags_and_statuses: [],
    mights: [],
    limits: [],
    threats: [],
    general_consequences: [],
    special_features: [],
})
