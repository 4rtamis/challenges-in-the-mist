import type { TemplateMode } from '@/core/templates/types'

// Workspace tabs intentionally stay generic so every template can provide
// its own document, view, and editor sheet shape through the template contract.
export type WorkspaceTab<
    TDoc = unknown,
    TView = unknown,
    TSheet = unknown,
> = {
    id: string
    templateId: string
    title: string
    mode: TemplateMode
    createdAt: number
    updatedAt: number
    doc: TDoc
    view: TView
    sheet: TSheet
}

export type AnyWorkspaceTab = WorkspaceTab<unknown, unknown, unknown>

export type WorkspaceSnapshot = {
    version: 1
    tabs: AnyWorkspaceTab[]
    tabOrder: string[]
    activeTabId: string | null
}
