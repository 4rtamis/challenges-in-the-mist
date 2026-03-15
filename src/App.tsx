import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import AppDesktopInspector from './app/AppDesktopInspector'
import AppMainContent from './app/AppMainContent'
import AppTopBar from './app/AppTopBar'
import ImportDialog from './app/ImportDialog'
import { useAppShellState } from './app/useAppShellState'
import { useAppShellUi } from './app/useAppShellUi'
import { useBodyGameTheme } from './app/useBodyGameTheme'

export default function App() {
    const shell = useAppShellState()
    const ui = useAppShellUi(shell.activeTabId)

    useBodyGameTheme(shell.activeGameTheme?.id)

    return (
        <SidebarProvider data-game-theme={shell.activeGameTheme?.id}>
            <AppSidebar />
            <div className="min-w-0 flex-1">
                <AppTopBar />

                <main
                    className="mist-app-main mx-auto min-h-[calc(100svh-4rem)] w-full min-w-0 overflow-x-hidden px-4 py-6 sm:px-6"
                    style={{ maxWidth: `${shell.maxWidth}px` }}
                >
                    <AppMainContent
                        activeGameThemeId={shell.activeGameTheme?.id}
                        activeTab={shell.activeTab}
                        activeTemplate={shell.activeTemplate}
                        hydrated={shell.hydrated}
                        mobileInspectorOpen={ui.mobileInspectorOpen}
                        templatePreview={shell.templatePreview}
                        onOpenImport={() => ui.setImportOpen(true)}
                        onStartBlank={shell.startEditingBlank}
                        onStartExample={shell.startEditingWithExample}
                        onToggleMobileInspector={ui.toggleMobileInspector}
                    />
                </main>
            </div>

            {shell.hydrated &&
                shell.activeTab &&
                shell.activeTemplate?.implemented &&
                shell.activeTab.mode === 'landing' && (
                    <ImportDialog
                        open={ui.importOpen}
                        onOpenChange={ui.setImportOpen}
                    />
                )}

            {shell.showDesktopInspector && (
                <AppDesktopInspector
                    open={ui.desktopInspectorOpen}
                    onOpenChange={ui.setDesktopInspectorOpen}
                />
            )}

            <Toaster richColors closeButton position="top-center" expand />
        </SidebarProvider>
    )
}
