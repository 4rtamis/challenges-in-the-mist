import type { Challenge } from '@/core/templates/legendChallengeModel'
import {
    PREVIEW_WIDTH_DEFAULT,
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
    defaultChallengeView,
    defaultHidden,
} from '@/core/templates/legendChallengeModel'
import type {
    ChallengeViewState,
    SectionId,
} from '@/core/templates/legendChallengeModel'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import { create } from 'zustand'

export type {
    Background,
    ChallengeViewState,
    ExportPrefs,
    SectionId,
} from '@/core/templates/legendChallengeModel'

export { PREVIEW_WIDTH_DEFAULT, PREVIEW_WIDTH_MAX, PREVIEW_WIDTH_MIN }

type UIState = ChallengeViewState & {
    setZoom: (z: number) => void
    setPreviewWidth: (w: number) => void
    setBackground: (b: ChallengeViewState['background']) => void
    toggleHidden: (id: SectionId) => void
    setHidden: (id: SectionId, value: boolean) => void
    setAutoHideEmpty: (v: boolean) => void
    setExportPrefs: (partial: Partial<ChallengeViewState['exportPrefs']>) => void
    resetViewPrefs: () => void
}

function pickViewState(state: ChallengeViewState): ChallengeViewState {
    return {
        zoom: state.zoom,
        previewWidth: state.previewWidth,
        background: state.background,
        autoHideEmpty: state.autoHideEmpty,
        hidden: cloneValue(state.hidden),
        exportPrefs: cloneValue(state.exportPrefs),
    }
}

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function getActiveLegendTabId(): string | null {
    const ws = useWorkspaceStore.getState()
    const active = getActiveTab(ws)
    return active?.templateId === 'legend.challenge' ? active.id : null
}

function syncViewToWorkspace(nextView: ChallengeViewState) {
    const tabId = getActiveLegendTabId()
    if (!tabId) return

    useWorkspaceStore.getState().patchTabView(tabId, cloneValue(nextView) as Record<string, unknown>)
}

const defaultView = cloneValue(defaultChallengeView)

export const useUIStore = create<UIState>((set, get) => {
    const apply = (producer: (current: ChallengeViewState) => ChallengeViewState) => {
        const next = pickViewState(producer(pickViewState(get())))
        set(next)
        syncViewToWorkspace(next)
    }

    return {
        ...defaultView,

        setZoom: (z) =>
            apply((current) => ({
                ...current,
                zoom: Math.max(0.5, Math.min(2, z)),
            })),

        setPreviewWidth: (w) =>
            apply((current) => ({
                ...current,
                previewWidth: Math.max(
                    PREVIEW_WIDTH_MIN,
                    Math.min(PREVIEW_WIDTH_MAX, w)
                ),
            })),

        setBackground: (b) =>
            apply((current) => ({
                ...current,
                background: b,
            })),

        toggleHidden: (id) =>
            apply((current) => ({
                ...current,
                hidden: {
                    ...current.hidden,
                    [id]: !current.hidden[id],
                },
            })),

        setHidden: (id, value) =>
            apply((current) => ({
                ...current,
                hidden: {
                    ...current.hidden,
                    [id]: value,
                },
            })),

        setAutoHideEmpty: (v) =>
            apply((current) => ({
                ...current,
                autoHideEmpty: v,
            })),

        setExportPrefs: (partial) =>
            apply((current) => ({
                ...current,
                exportPrefs: {
                    ...current.exportPrefs,
                    ...partial,
                },
            })),

        resetViewPrefs: () =>
            apply(() => ({
                ...cloneValue(defaultChallengeView),
                hidden: cloneValue(defaultHidden),
            })),
    }
})

let lastTabId: string | null = null
let lastViewRef: unknown = null

function syncUIStoreFromWorkspace() {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)

    if (active?.templateId !== 'legend.challenge') {
        if (lastTabId !== null || lastViewRef !== null) {
            lastTabId = null
            lastViewRef = null
            useUIStore.setState(cloneValue(defaultChallengeView))
        }
        return
    }

    if (active.id === lastTabId && active.view === lastViewRef) return

    lastTabId = active.id
    lastViewRef = active.view
    useUIStore.setState(cloneValue(active.view as ChallengeViewState))
}

useWorkspaceStore.subscribe(syncUIStoreFromWorkspace)
syncUIStoreFromWorkspace()

export function isEmptySection(ch: Challenge, id: SectionId): boolean {
    switch (id) {
        case 'rolesDesc':
            return !(ch.roles?.length || ch.description?.trim())
        case 'limits':
            return !ch.limits.length
        case 'tagsStatuses':
            return !ch.tags_and_statuses.length
        case 'might':
            return !ch.mights.length
        case 'specialFeatures':
            return !ch.special_features.length
        case 'threats':
            return !ch.threats.length
        case 'generalConsequences':
            return !ch.general_consequences.length
        case 'meta': {
            const m = ch.meta
            if (!m) return true

            const hasNew =
                !!m.publication_type ||
                !!(m.source && String(m.source).trim()) ||
                (Array.isArray(m.authors) && m.authors.length > 0) ||
                m.page != null
            return !hasNew
        }
        default:
            return true
    }
}

export function shouldShow(ch: Challenge, id: SectionId, ui: UIState) {
    if (ui.hidden[id]) return false
    if (ui.autoHideEmpty && isEmptySection(ch, id)) return false
    return true
}

export function groupShouldShow(ch: Challenge, sectionIds: SectionId[], ui: UIState) {
    return sectionIds.some((id) => shouldShow(ch, id, ui))
}
