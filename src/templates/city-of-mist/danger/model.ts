import type {
    CityOfMistDanger as CityOfMistDangerData,
    CustomMove,
    DangerMeta,
    PublicationType,
    Spectrum,
} from './schema'

export type { CustomMove, DangerMeta, PublicationType, Spectrum }

export type CityOfMistDanger = {
    name: string
    description: string
    rating: number
    spectrums: Spectrum[]
    soft_moves: string[]
    hard_moves: string[]
    custom_moves: CustomMove[]
    meta?: DangerMeta
}

export function toCityOfMistDangerDocument(
    cityOfMistDanger: CityOfMistDangerData
): CityOfMistDanger {
    return {
        name: cityOfMistDanger.name,
        description: cityOfMistDanger.description ?? '',
        rating: cityOfMistDanger.rating,
        spectrums: cityOfMistDanger.spectrums ?? [],
        soft_moves: cityOfMistDanger.soft_moves ?? [],
        hard_moves: cityOfMistDanger.hard_moves ?? [],
        custom_moves: cityOfMistDanger.custom_moves ?? [],
        meta: cityOfMistDanger.meta,
    }
}

export type SectionId =
    | 'basic'
    | 'description'
    | 'spectrums'
    | 'customMoves'
    | 'hardMoves'
    | 'softMoves'
    | 'meta'

export type Background =
    | 'bg0'
    | 'bg1'
    | 'bg2'
    | 'bg3'
    | 'bg4'
    | 'bg5'
    | 'bg6'
    | 'bg7'

export type ColumnCount = 1 | 2
export type TitlePlacement = 'outside' | 'inside'

export type ExportPrefs = {
    scale: 2 | 1 | 3
    transparent: boolean
}

export type CityOfMistDangerViewState = {
    zoom: number
    previewWidth: number
    background: Background
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    columnCount: ColumnCount
    titlePlacement: TitlePlacement
    columnHeight: number
    showSeparators: boolean
    exportPrefs: ExportPrefs
}

export type SheetTarget =
    | { kind: 'basic'; mode?: 'edit' }
    | { kind: 'meta'; mode?: 'edit' }
    | { kind: 'spectrums'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'customMoves'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'hardMoves'; mode?: 'create' | 'edit'; index?: number }
    | { kind: 'softMoves'; mode?: 'create' | 'edit'; index?: number }

export type CityOfMistDangerSheetState = {
    open: boolean
    target: SheetTarget | null
}

export const PREVIEW_WIDTH_MIN = 360
export const PREVIEW_WIDTH_MAX = 920
export const PREVIEW_WIDTH_DEFAULT = 460

export const COLUMN_HEIGHT_MIN = 360
export const COLUMN_HEIGHT_MAX = 1400
export const COLUMN_HEIGHT_DEFAULT = 620

export const defaultHidden: Record<SectionId, boolean> = {
    basic: false,
    description: false,
    spectrums: false,
    customMoves: false,
    hardMoves: false,
    softMoves: false,
    meta: false,
}

export const defaultCityOfMistDangerView: CityOfMistDangerViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    background: 'bg0',
    autoHideEmpty: true,
    hidden: defaultHidden,
    columnCount: 1,
    titlePlacement: 'outside',
    columnHeight: COLUMN_HEIGHT_DEFAULT,
    showSeparators: true,
    exportPrefs: {
        scale: 2,
        transparent: false,
    },
}

export const defaultCityOfMistDangerSheetState: CityOfMistDangerSheetState = {
    open: false,
    target: null,
}

export const blankCityOfMistDanger = (): CityOfMistDanger => ({
    name: 'Untitled Danger',
    description: '',
    rating: 1,
    spectrums: [],
    soft_moves: [],
    hard_moves: [],
    custom_moves: [],
})
