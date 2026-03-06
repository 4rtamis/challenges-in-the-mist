import type { ChallengeSheetState, SheetTarget } from '@/core/templates/legendChallengeModel'
import { defaultChallengeSheetState } from '@/core/templates/legendChallengeModel'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import { create } from 'zustand'

export type { SheetTarget }

type State = ChallengeSheetState & {
    openSheet: (t: SheetTarget) => void
    closeSheet: () => void
}

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function getActiveLegendTab() {
    const ws = useWorkspaceStore.getState()
    const active = getActiveTab(ws)
    if (!active || active.templateId !== 'legend.challenge') return null
    return active
}

function syncSheetToWorkspace(nextSheet: ChallengeSheetState) {
    const active = getActiveLegendTab()
    if (!active) return

    useWorkspaceStore.getState().setTabSheet(active.id, cloneValue(nextSheet))
}

export const useSheetStore = create<State>((set) => ({
    ...defaultChallengeSheetState,

    openSheet: (target) => {
        const active = getActiveLegendTab()
        if (!active || active.mode !== 'editing') return

        const nextSheet: ChallengeSheetState = {
            open: true,
            target,
        }

        syncSheetToWorkspace(nextSheet)
        set(nextSheet)
    },

    closeSheet: () => {
        const nextSheet = cloneValue(defaultChallengeSheetState)
        syncSheetToWorkspace(nextSheet)
        set(nextSheet)
    },
}))

let lastTabId: string | null = null
let lastSheetRef: unknown = null

function syncSheetStoreFromWorkspace() {
    const active = getActiveLegendTab()

    if (!active) {
        if (lastTabId !== null || lastSheetRef !== null) {
            lastTabId = null
            lastSheetRef = null
            useSheetStore.setState(cloneValue(defaultChallengeSheetState))
        }
        return
    }

    if (active.id === lastTabId && active.sheet === lastSheetRef) return

    lastTabId = active.id
    lastSheetRef = active.sheet
    useSheetStore.setState(cloneValue(active.sheet as ChallengeSheetState))
}

useWorkspaceStore.subscribe(syncSheetStoreFromWorkspace)
syncSheetStoreFromWorkspace()
