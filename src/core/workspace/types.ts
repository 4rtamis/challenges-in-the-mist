import type { TemplateMode } from '@/core/templates/types'
import type {
    Challenge,
    ChallengeSheetState,
    ChallengeViewState,
} from '@/core/templates/legendChallengeModel'

export type LegendChallengeTab = {
    id: string
    templateId: 'legend.challenge'
    title: string
    mode: TemplateMode
    createdAt: number
    updatedAt: number
    doc: Challenge
    view: ChallengeViewState
    sheet: ChallengeSheetState
}

export type GenericTab = {
    id: string
    templateId: string
    title: string
    mode: TemplateMode
    createdAt: number
    updatedAt: number
    doc: unknown
    view: unknown
    sheet: unknown
}

export type WorkspaceTab = LegendChallengeTab | GenericTab

export type WorkspaceSnapshot = {
    version: 1
    tabs: WorkspaceTab[]
    tabOrder: string[]
    activeTabId: string | null
}
