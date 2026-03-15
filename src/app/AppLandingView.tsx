import { TemplateLanding } from '@/core/templates/shell/TemplateLanding'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import type { ReactNode } from 'react'

type AppLandingViewProps = {
    activeGameThemeId?: string
    previewRootId: string
    template: AnyTemplateDefinition
    templatePreview: ReactNode
    onImport: () => void
    onStartBlank: () => void
    onStartExample: () => void
}

export default function AppLandingView({
    activeGameThemeId,
    previewRootId,
    template,
    templatePreview,
    onImport,
    onStartBlank,
    onStartExample,
}: AppLandingViewProps) {
    return (
        <div className="space-y-5">
            <TemplateLanding
                template={template}
                onStartExample={onStartExample}
                onStartBlank={onStartBlank}
                onImport={onImport}
            />

            <div
                data-preview-root={previewRootId}
                data-game-theme={activeGameThemeId}
            >
                {templatePreview}
            </div>
        </div>
    )
}
