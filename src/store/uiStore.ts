import type { Challenge } from '@/store/challengeStore'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Identify sections we can show/hide
export type SectionId =
    | 'rolesDesc'
    | 'limits'
    | 'tagsStatuses'
    | 'might'
    | 'specialFeatures'
    | 'threats'
    | 'generalConsequences'
    | 'meta'

type Background = 'parchment' | 'plain' | 'transparent'

type ExportPrefs = {
    scale: 2 | 1 | 3
    transparent: boolean
}

type UIState = {
    zoom: number
    background: Background
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    exportPrefs: ExportPrefs

    // actions
    setZoom: (z: number) => void
    setBackground: (b: Background) => void
    toggleHidden: (id: SectionId) => void
    setHidden: (id: SectionId, value: boolean) => void
    setAutoHideEmpty: (v: boolean) => void
    setExportPrefs: (partial: Partial<ExportPrefs>) => void
    resetViewPrefs: () => void
}

const defaultHidden: Record<SectionId, boolean> = {
    rolesDesc: false,
    limits: false,
    tagsStatuses: false,
    might: false,
    specialFeatures: false,
    threats: false,
    generalConsequences: false,
    meta: false,
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            zoom: 1,
            background: 'parchment',
            autoHideEmpty: true,
            hidden: defaultHidden,
            exportPrefs: {
                scale: 2,
                transparent: false,
            },

            setZoom: (z) => set({ zoom: Math.max(0.5, Math.min(2, z)) }),
            setBackground: (b) => set({ background: b }),
            toggleHidden: (id) =>
                set((s) => ({ hidden: { ...s.hidden, [id]: !s.hidden[id] } })),
            setHidden: (id, value) =>
                set((s) => ({ hidden: { ...s.hidden, [id]: value } })),
            setAutoHideEmpty: (v) => set({ autoHideEmpty: v }),
            setExportPrefs: (partial) =>
                set((s) => ({ exportPrefs: { ...s.exportPrefs, ...partial } })),
            resetViewPrefs: () =>
                set({
                    zoom: 1,
                    background: 'parchment',
                    autoHideEmpty: false,
                    hidden: defaultHidden,
                }),
        }),
        { name: 'litm-ui-prefs' }
    )
)

// Helpers
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
            // Works with both old and new meta shapes; if you already migrated:
            // publication/source/authors/page; otherwise sourcebook/chapter/page/is_official
            const anyNew =
                'publication' in m ||
                'source' in m ||
                'authors' in m ||
                'page' in m
            if (anyNew) {
                const nm: any = m
                const hasNew =
                    !!nm.publication ||
                    !!(nm.source && String(nm.source).trim()) ||
                    (Array.isArray(nm.authors) && nm.authors.length > 0) ||
                    nm.page != null
                return !hasNew
            }
            const hasOld =
                !!(m as any).sourcebook ||
                !!(m as any).chapter ||
                (m as any).page != null ||
                (m as any).is_official != null
            return !hasOld
        }
        default:
            return true
    }
}

export function shouldShow(
    ch: Challenge,
    id: SectionId,
    ui = useUIStore.getState()
) {
    if (ui.hidden[id]) return false
    if (ui.autoHideEmpty && isEmptySection(ch, id)) return false
    return true
}

export function groupShouldShow(
    ch: Challenge,
    sectionIds: SectionId[],
    ui = useUIStore.getState()
) {
    return sectionIds.some((id) => shouldShow(ch, id, ui))
}
