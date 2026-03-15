import { templateById } from '@/core/templates/registry'
import { useWorkspaceStore } from './store'
import type { WorkspaceTab } from './types'

export function useActiveTab() {
    return useWorkspaceStore((state) => {
        if (!state.activeTabId) return null
        return state.tabs.find((tab) => tab.id === state.activeTabId) ?? null
    })
}

export function useActiveTemplate() {
    const activeTab = useActiveTab()
    if (!activeTab) return null
    return templateById.get(activeTab.templateId) ?? null
}

export function useActiveTemplateTab<
    TDoc = unknown,
    TView = unknown,
    TSheet = unknown,
>(templateId: string): WorkspaceTab<TDoc, TView, TSheet> | null {
    // Templates opt into typed access on demand, but workspace persistence stays generic.
    const activeTab = useActiveTab()
    if (!activeTab || activeTab.templateId !== templateId) return null

    return activeTab as WorkspaceTab<TDoc, TView, TSheet>
}
