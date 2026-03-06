import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { templateById } from '@/core/templates/registry'
import { useWorkspaceStore } from '@/core/workspace/store'
import { useWorkspaceHydration } from '@/core/workspace/useWorkspaceHydration'
import { PREVIEW_WIDTH_DEFAULT, useUIStore } from '@/store/uiStore'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppTopBar from './ui/AppTopBar'

export default function App() {
    const hydrated = useWorkspaceHydration()
    const navigate = useNavigate()
    const { tabId } = useParams<{ tabId?: string }>()

    const tabs = useWorkspaceStore((s) => s.tabs)
    const activeTabId = useWorkspaceStore((s) => s.activeTabId)
    const activateTab = useWorkspaceStore((s) => s.activateTab)
    const setTabMode = useWorkspaceStore((s) => s.setTabMode)
    const replaceTabDoc = useWorkspaceStore((s) => s.replaceTabDoc)
    const setTabSheet = useWorkspaceStore((s) => s.setTabSheet)

    const previewWidth = useUIStore((s) => s.previewWidth)

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
            ? tabs.find((tab) => tab.id === activeTabId) ?? null
            : null

    const activeTemplate = activeTab
        ? templateById.get(activeTab.templateId) ?? null
        : null

    const templatePreview = activeTemplate?.implemented
        ? activeTemplate.renderPreview()
        : null

    const templateSheetHost = activeTemplate?.implemented
        ? activeTemplate.renderSheetHost()
        : null

    const maxWidth = activeTemplate?.implemented
        ? previewWidth
        : PREVIEW_WIDTH_DEFAULT

    function startEditingWithSample() {
        if (!activeTab || !activeTemplate) return

        replaceTabDoc(activeTab.id, activeTemplate.createSample())
        setTabSheet(activeTab.id, activeTemplate.createInitialSheet())
        setTabMode(activeTab.id, 'editing')
    }

    function startEditingBlank() {
        if (!activeTab || !activeTemplate) return

        replaceTabDoc(activeTab.id, activeTemplate.createBlank())
        setTabSheet(activeTab.id, activeTemplate.createInitialSheet())
        setTabMode(activeTab.id, 'editing')
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="w-full">
                <AppTopBar />

                <main
                    className="mx-auto w-full px-4 py-6 sm:px-6"
                    style={{ maxWidth: `${maxWidth}px` }}
                >
                    {!hydrated && (
                        <div className="flex min-h-[70vh] items-center justify-center text-sm text-muted-foreground">
                            Loading workspace...
                        </div>
                    )}

                    {hydrated && !activeTab && (
                        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
                            <h2 className="text-xl font-semibold">
                                Welcome to Lantern
                            </h2>
                            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                                Pick a template in the left sidebar to open a new
                                tab and start editing.
                            </p>
                        </div>
                    )}

                    {hydrated && activeTab && (!activeTemplate || !activeTemplate.implemented) && (
                        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
                            <h2 className="text-xl font-semibold">
                                Template not available yet
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                This template is listed in the sidebar but is not
                                implemented yet.
                            </p>
                        </div>
                    )}

                    {hydrated &&
                        activeTab &&
                        activeTemplate &&
                        activeTemplate.implemented &&
                        activeTab.mode === 'landing' && (
                            <div className="space-y-5">
                                <div className="rounded-lg border bg-muted/20 p-4">
                                    <h2 className="text-lg font-semibold">
                                        New {activeTemplate.label}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        You can start from the editable sample or
                                        switch directly to a blank template.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Button onClick={startEditingWithSample}>
                                            Edit template
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={startEditingBlank}
                                        >
                                            Start from blank template
                                        </Button>
                                    </div>
                                </div>

                                <div data-preview-root={activeTab.id}>
                                    {templatePreview}
                                </div>
                            </div>
                        )}

                    {hydrated &&
                        activeTab &&
                        activeTemplate &&
                        activeTemplate.implemented &&
                        activeTab.mode === 'editing' && (
                            <div data-preview-root={activeTab.id}>
                                {templatePreview}
                            </div>
                        )}
                </main>
            </div>

            {hydrated &&
                activeTab &&
                activeTemplate?.implemented &&
                activeTab.mode === 'editing' &&
                templateSheetHost}

            <Toaster richColors closeButton position="top-center" expand />
        </SidebarProvider>
    )
}
