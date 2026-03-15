import { Button } from '@/components/ui/button'
import { TemplateInspector } from '@/core/templates/shell/TemplateInspector'
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

type AppEditingViewProps = {
    activeGameThemeId?: string
    mobileInspectorOpen: boolean
    previewRootId: string
    templatePreview: ReactNode
    onToggleMobileInspector: () => void
}

export default function AppEditingView({
    activeGameThemeId,
    mobileInspectorOpen,
    previewRootId,
    templatePreview,
    onToggleMobileInspector,
}: AppEditingViewProps) {
    return (
        <div className="space-y-3">
            <div className="flex justify-end md:hidden">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleMobileInspector}
                >
                    {mobileInspectorOpen
                        ? 'Hide editor sidebar'
                        : 'Show editor sidebar'}
                </Button>
            </div>

            <div
                data-preview-root={previewRootId}
                data-game-theme={activeGameThemeId}
            >
                {templatePreview}
            </div>

            <div
                className={cn(
                    'md:hidden',
                    mobileInspectorOpen ? 'block' : 'hidden'
                )}
            >
                <div className="max-h-[75vh] overflow-hidden rounded-lg border bg-background">
                    <TemplateInspector />
                </div>
            </div>
        </div>
    )
}
