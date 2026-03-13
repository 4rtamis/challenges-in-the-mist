import type {
    ChallengeMeta,
    LegendInTheMistChallenge,
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

export type Challenge = {
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

export function toChallengeDocument(
    challenge: LegendInTheMistChallenge
): Challenge {
    return {
        name: challenge.name,
        description: challenge.description ?? '',
        rating: challenge.rating,
        roles: challenge.roles ?? [],
        tags_and_statuses: challenge.tags_and_statuses ?? [],
        mights: challenge.mights ?? [],
        limits: challenge.limits ?? [],
        threats: challenge.threats ?? [],
        general_consequences: challenge.general_consequences ?? [],
        special_features: challenge.special_features ?? [],
        meta: challenge.meta,
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

export type Background = 'parchment' | 'plain' | 'transparent'

export type ExportPrefs = {
    scale: 2 | 1 | 3
    transparent: boolean
}

export type ChallengeViewState = {
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

export type ChallengeSheetState = {
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

export const defaultChallengeView: ChallengeViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    background: 'parchment',
    autoHideEmpty: true,
    hidden: defaultHidden,
    exportPrefs: {
        scale: 2,
        transparent: false,
    },
}

export const defaultChallengeSheetState: ChallengeSheetState = {
    open: false,
    target: null,
}

export const blankChallenge = (): Challenge => ({
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
