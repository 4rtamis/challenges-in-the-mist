import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useActiveTab, useActiveTemplate } from '@/core/workspace/selectors'
import { slugify } from '@/utils/strings'
import { useEffect, useMemo, useState } from 'react'

export function TemplateExportPanel() {
    const activeTab = useActiveTab()
    const activeTemplate = useActiveTemplate()
    const [activeActionId, setActiveActionId] = useState<string | null>(null)
    const [busyActionId, setBusyActionId] = useState<string | null>(null)

    const actions = useMemo(
        () => activeTemplate?.export.actions ?? [],
        [activeTemplate]
    )
    const activeAction =
        actions.find((action) => action.id === activeActionId) ?? actions[0] ?? null

    useEffect(() => {
        setActiveActionId(actions[0]?.id ?? null)
    }, [activeTab?.id, actions])

    if (!activeTab || !activeTemplate || !activeAction) {
        return (
            <p className="text-sm text-muted-foreground">
                Open an implemented template to export it.
            </p>
        )
    }

    const tab = activeTab
    const template = activeTemplate

    const getPreviewNode = () => {
        const selector = template.preview.getRootSelector(tab.id)
        return document.querySelector<HTMLElement>(selector)
    }

    async function runExportAction() {
        if (!activeAction) return

        try {
            setBusyActionId(activeAction.id)
            await activeAction.run({
                tabId: tab.id,
                title: tab.title,
                doc: tab.doc,
                view: tab.view,
                sheet: tab.sheet,
                getPreviewNode,
                fileStem: slugify(tab.title || template.label),
            })
        } finally {
            setBusyActionId(null)
        }
    }

    return (
        <div className="space-y-4">
            <Tabs
                value={activeAction.id}
                onValueChange={setActiveActionId}
                className="space-y-4"
            >
                <TabsList
                    className="grid w-full"
                    style={{
                        gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))`,
                    }}
                >
                    {actions.map((action) => (
                        <TabsTrigger key={action.id} value={action.id}>
                            {action.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    {activeAction.description}
                </p>
                {activeAction.renderSettings?.()}
            </div>

            <Button
                type="button"
                size="sm"
                className="h-8 w-full text-xs"
                onClick={runExportAction}
                disabled={busyActionId !== null}
            >
                {activeAction.buttonLabel ?? `Export ${activeAction.label}`}
            </Button>
        </div>
    )
}
