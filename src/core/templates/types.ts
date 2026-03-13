import type { ReactNode } from 'react'
import type { ZodType } from 'zod'

export type GameId = 'city' | 'legend' | 'otherscape'

export type TemplateMode = 'landing' | 'editing'

export const DEFAULT_TEMPLATE_PREVIEW_WIDTH = 1152

export type TemplateImportResult<TDoc> = {
    doc: TDoc
    warnings: string[]
    previewName?: string
}

export type TemplateSectionDefinition = {
    id: string
    label: string
}

export type TemplateExportAction<
    TDoc = unknown,
    TView = unknown,
    TSheet = unknown,
> = {
    id: string
    label: string
    buttonLabel?: string
    description: string
    renderSettings?: () => ReactNode
    run: (context: {
        tabId: string
        title: string
        doc: TDoc
        view: TView
        sheet: TSheet
        getPreviewNode: () => HTMLElement | null
        fileStem: string
    }) => Promise<void> | void
}

export type TemplateDefinition<
    TDoc = unknown,
    TView = unknown,
    TSheet = unknown,
> = {
    // Template modules own their document/view/sheet contracts, while the app
    // shell owns routing, tab management, layout, and common workflow chrome.
    id: string
    gameId: GameId
    gameLabel: string
    label: string
    implemented: boolean
    comingSoonLabel?: string

    schema?: ZodType<TDoc>
    createBlank: () => TDoc
    createExample: () => TDoc
    createInitialView: () => TView
    createInitialSheet: () => TSheet
    getTabTitle: (doc: TDoc) => string

    sections: TemplateSectionDefinition[]
    landing: {
        description: string
        exampleLabel?: string
        blankLabel?: string
        importLabel?: string
    }

    io: {
        importToml?: (tomlText: string) => TemplateImportResult<TDoc>
        exportToml?: (doc: TDoc) => string
    }

    preview: {
        getRootSelector: (tabId: string) => string
        render: () => ReactNode
    }

    editor: {
        emptyState: string
        renderPanel: () => ReactNode
    }

    appearance: {
        getPreviewWidth: (view: TView) => number
        renderPanel: () => ReactNode
    }

    export: {
        actions: TemplateExportAction<TDoc, TView, TSheet>[]
    }
}

export type AnyTemplateDefinition = TemplateDefinition<any, any, any>
