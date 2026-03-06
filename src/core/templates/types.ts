import type { ReactNode } from 'react'

export type GameId = 'city' | 'legend' | 'otherscape'

export type TemplateMode = 'landing' | 'editing'

export type BackgroundOption = 'parchment' | 'plain' | 'transparent'

export type TemplateImportResult<TDoc> = {
    doc: TDoc
    warnings: string[]
    previewName?: string
}

export type TemplateDefinition<TDoc = unknown, TView = unknown, TSheet = unknown> = {
    id: string
    gameId: GameId
    gameLabel: string
    label: string
    implemented: boolean
    comingSoonLabel?: string

    createBlank: () => TDoc
    createSample: () => TDoc
    defaultView: TView
    createInitialSheet: () => { open: boolean; target: TSheet | null }

    io: {
        importToml?: (tomlText: string) => TemplateImportResult<TDoc>
        exportToml?: (doc: TDoc) => string
        canExportImage?: boolean
    }

    viewConfig: {
        sectionItems: Array<{ id: string; label: string }>
        zoomOptions: number[]
        backgroundOptions: Array<{ value: BackgroundOption; label: string }>
    }

    getTabTitle: (doc: TDoc) => string
    getPreviewRootSelector: (tabId: string) => string

    renderPreview: () => ReactNode
    renderSheetHost: () => ReactNode
}

export type TemplateSeedDefinition<
    TDoc = unknown,
    TView = unknown,
    TSheet = unknown,
> = Omit<
    TemplateDefinition<TDoc, TView, TSheet>,
    'renderPreview' | 'renderSheetHost'
>
