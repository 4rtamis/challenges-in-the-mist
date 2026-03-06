export type MightLevel = 'origin' | 'adventure' | 'greatness'

export type Might = {
    name: string
    level: MightLevel
    vulnerability?: string | null
}

export type Limit = {
    name: string
    level: number
    is_immune?: boolean
    is_progress?: boolean
    on_max?: string | null
}

export type Threat = {
    name: string
    description: string
    consequences: string[]
}

export type SpecialFeature = { name: string; description: string }

export type PublicationType =
    | 'official'
    | 'third_party'
    | 'cauldron'
    | 'homebrew'

export type ChallengeMeta = {
    publication_type?: PublicationType
    source?: string
    source_id?: string
    authors?: string[]
    page?: number
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
    name: '',
    description: '',
    rating: 1,
    roles: [],
    tags_and_statuses: [],
    mights: [],
    limits: [],
    threats: [],
    general_consequences: [],
    special_features: [],
    meta: {
        publication_type: 'homebrew',
        source: '',
        authors: [],
        page: undefined,
    },
})
