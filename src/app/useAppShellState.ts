import { getGameTheme } from '@/core/gameThemes'
import { templateById } from '@/core/templates/registry'
import { DEFAULT_TEMPLATE_PREVIEW_WIDTH } from '@/core/templates/types'
import { useWorkspaceStore } from '@/core/workspace/store'
import { useWorkspaceHydration } from '@/core/workspace/useWorkspaceHydration'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function useAppShellState() {
    const hydrated = useWorkspaceHydration()
    const navigate = useNavigate()
    const { tabId } = useParams<{ tabId?: string }>()

    const tabs = useWorkspaceStore((s) => s.tabs)
    const activeTabId = useWorkspaceStore((s) => s.activeTabId)
    const activateTab = useWorkspaceStore((s) => s.activateTab)
    const setTabMode = useWorkspaceStore((s) => s.setTabMode)
    const replaceTabDoc = useWorkspaceStore((s) => s.replaceTabDoc)
    const setTabSheet = useWorkspaceStore((s) => s.setTabSheet)

    useEffect(() => {
        if (!hydrated) return

        if (!tabId) {
            if (activeTabId !== null) {
                activateTab(null)
            }
            return
        }

        const exists = tabs.some((tab) => tab.id === tabId)
        if (!exists) {
            navigate('/', { replace: true })
            return
        }

        if (activeTabId !== tabId) {
            activateTab(tabId)
        }
    }, [activeTabId, activateTab, hydrated, navigate, tabId, tabs])

    const activeTab =
        activeTabId != null
            ? (tabs.find((tab) => tab.id === activeTabId) ?? null)
            : null

    const activeTemplate = activeTab
        ? (templateById.get(activeTab.templateId) ?? null)
        : null
    const activeGameTheme = activeTemplate
        ? getGameTheme(activeTemplate.gameId)
        : null

    const templatePreview = activeTemplate?.implemented
        ? activeTemplate.preview.render()
        : null

    const showDesktopInspector = Boolean(
        hydrated &&
            activeTab &&
            activeTemplate?.implemented &&
            activeTab.mode === 'editing'
    )

    const maxWidth = activeTemplate?.implemented
        ? activeTemplate.appearance.getPreviewWidth(activeTab?.view as never)
        : DEFAULT_TEMPLATE_PREVIEW_WIDTH

    function startEditingWithExample() {
        if (!activeTab || !activeTemplate) return

        replaceTabDoc(activeTab.id, activeTemplate.createExample())
        setTabSheet(activeTab.id, activeTemplate.createInitialSheet())
        setTabMode(activeTab.id, 'editing')
    }

    function startEditingBlank() {
        if (!activeTab || !activeTemplate) return

        replaceTabDoc(activeTab.id, activeTemplate.createBlank())
        setTabSheet(activeTab.id, activeTemplate.createInitialSheet())
        setTabMode(activeTab.id, 'editing')
    }

    return {
        hydrated,
        activeTabId,
        activeTab,
        activeTemplate,
        activeGameTheme,
        templatePreview,
        showDesktopInspector,
        maxWidth,
        startEditingBlank,
        startEditingWithExample,
    }
}
