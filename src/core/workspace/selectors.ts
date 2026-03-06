import { templateById } from '@/core/templates/registry'
import { useWorkspaceStore } from './store'

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
