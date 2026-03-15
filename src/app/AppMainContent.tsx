import type { AnyTemplateDefinition } from '@/core/templates/types'
import type { WorkspaceTab } from '@/core/workspace/types'
import type { ReactNode } from 'react'
import AppEditingView from './AppEditingView'
import AppEmptyState from './AppEmptyState'
import AppLandingView from './AppLandingView'
import AppUnavailableTemplateState from './AppUnavailableTemplateState'

type AppMainContentProps = {
    activeGameThemeId?: string
    activeTab: WorkspaceTab | null
    activeTemplate: AnyTemplateDefinition | null
    hydrated: boolean
    mobileInspectorOpen: boolean
    templatePreview: ReactNode
    onOpenImport: () => void
    onStartBlank: () => void
    onStartExample: () => void
    onToggleMobileInspector: () => void
}

export default function AppMainContent({
    activeGameThemeId,
    activeTab,
    activeTemplate,
    hydrated,
    mobileInspectorOpen,
    templatePreview,
    onOpenImport,
    onStartBlank,
    onStartExample,
    onToggleMobileInspector,
}: AppMainContentProps) {
    if (!hydrated) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center text-sm text-muted-foreground">
                Loading workspace...
            </div>
        )
    }

    if (!activeTab) {
        return <AppEmptyState />
    }

    if (!activeTemplate || !activeTemplate.implemented) {
        return <AppUnavailableTemplateState />
    }

    if (activeTab.mode === 'landing') {
        return (
            <AppLandingView
                activeGameThemeId={activeGameThemeId}
                previewRootId={activeTab.id}
                template={activeTemplate}
                templatePreview={templatePreview}
                onImport={onOpenImport}
                onStartBlank={onStartBlank}
                onStartExample={onStartExample}
            />
        )
    }

    if (activeTab.mode === 'editing') {
        return (
            <AppEditingView
                activeGameThemeId={activeGameThemeId}
                mobileInspectorOpen={mobileInspectorOpen}
                previewRootId={activeTab.id}
                templatePreview={templatePreview}
                onToggleMobileInspector={onToggleMobileInspector}
            />
        )
    }

    return null
}
