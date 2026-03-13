import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SidebarContent, SidebarFooter } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useActiveTab, useActiveTemplate } from '@/core/workspace/selectors'
import BasicForm from '@/editor/BasicForm'
import LimitsForm from '@/editor/LimitsForm'
import MetaForm from '@/editor/MetaForm'
import MightForm from '@/editor/MightForm'
import SpecialFeaturesForm from '@/editor/SpecialFeaturesForm'
import TagsStatusesForm from '@/editor/TagsStatusesForm'
import ThreatsForm from '@/editor/ThreatsForm'
import { useSheetStore } from '@/store/sheetStore'
import {
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
    useUIStore,
    type Background,
    type SectionId,
} from '@/store/uiStore'
import { slugify } from '@/utils/strings'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

type EditorContent = {
    title: string
    description: string
    content: ReactNode
}

function useEditorContent(): EditorContent | null {
    const { open, target } = useSheetStore()

    return useMemo(() => {
        if (!open || !target) return null

        switch (target.kind) {
            case 'threats':
                return {
                    title: 'Threats & Consequences',
                    description:
                        target.mode === 'create'
                            ? 'Add threats and consequences.'
                            : 'Edit threats and consequences.',
                    content: <ThreatsForm focusIndex={target.index} />,
                }
            case 'limits':
                return {
                    title: 'Limits',
                    description:
                        target.mode === 'create'
                            ? 'Add limits and immunities.'
                            : 'Edit limits and progress outcomes.',
                    content: <LimitsForm focusIndex={target.index} />,
                }
            case 'tags':
                return {
                    title: 'Tags & Statuses',
                    description:
                        target.mode === 'create'
                            ? 'Add tags and statuses.'
                            : 'Edit tags and statuses.',
                    content: <TagsStatusesForm focusIndex={target.index} />,
                }
            case 'mights':
                return {
                    title: 'Might',
                    description:
                        target.mode === 'create'
                            ? 'Add Might entries.'
                            : 'Edit Might entries.',
                    content: <MightForm focusIndex={target.index} />,
                }
            case 'special':
                return {
                    title: 'Special Features',
                    description:
                        target.mode === 'create'
                            ? 'Add special features.'
                            : 'Edit special features.',
                    content: <SpecialFeaturesForm focusIndex={target.index} />,
                }
            case 'basic':
                return {
                    title: 'Basic Info',
                    description: 'Name, rating, roles, and description.',
                    content: <BasicForm />,
                }
            case 'meta':
                return {
                    title: 'Meta',
                    description: 'Attribution and publication details.',
                    content: <MetaForm />,
                }
            default:
                return null
        }
    }, [open, target])
}

function EditorSection() {
    const editor = useEditorContent()

    if (!editor) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                Click on the preview to edit a specific section.
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="space-y-1">
                <h3 className="text-sm font-semibold">{editor.title}</h3>
                {editor.description ? (
                    <p className="text-xs text-muted-foreground">
                        {editor.description}
                    </p>
                ) : null}
            </div>
            <div>{editor.content}</div>
        </div>
    )
}

function GeneralAppearanceSection() {
    const template = useActiveTemplate()
    const {
        hidden,
        toggleHidden,
        autoHideEmpty,
        setAutoHideEmpty,
        previewWidth,
        setPreviewWidth,
        background,
        setBackground,
        resetViewPrefs,
    } = useUIStore()

    if (!template || !template.implemented) {
        return (
            <p className="text-sm text-muted-foreground">
                Open an implemented template to edit appearance.
            </p>
        )
    }

    const sectionItems = template.viewConfig.sectionItems as Array<{
        id: SectionId
        label: string
    }>

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="auto-hide-empty" className="text-xs">
                    Auto-hide empty sections
                </Label>
                <Switch
                    id="auto-hide-empty"
                    checked={autoHideEmpty}
                    onCheckedChange={(value) => setAutoHideEmpty(!!value)}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sections
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {sectionItems.map((section) => (
                        <label
                            key={section.id}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <Checkbox
                                checked={!hidden[section.id]}
                                onCheckedChange={() => toggleHidden(section.id)}
                            />
                            <span className="text-xs">{section.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="preview-width" className="text-xs">
                        Preview width
                    </Label>
                    <span className="text-xs font-medium">
                        {previewWidth}px
                    </span>
                </div>
                <input
                    id="preview-width"
                    type="range"
                    min={PREVIEW_WIDTH_MIN}
                    max={PREVIEW_WIDTH_MAX}
                    step={10}
                    value={previewWidth}
                    onChange={(event) =>
                        setPreviewWidth(Number(event.target.value))
                    }
                    className="w-full accent-primary"
                    aria-label="Preview width"
                />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{PREVIEW_WIDTH_MIN}px</span>
                    <span>{PREVIEW_WIDTH_MAX}px</span>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Background
                </p>
                <RadioGroup
                    value={background}
                    onValueChange={(value) =>
                        setBackground(value as Background)
                    }
                    className="flex flex-wrap items-center gap-3"
                >
                    {template.viewConfig.backgroundOptions.map((option) => (
                        <label
                            key={option.value}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <RadioGroupItem
                                value={option.value}
                                id={`background-${option.value}`}
                            />
                            <span className="text-xs">{option.label}</span>
                        </label>
                    ))}
                </RadioGroup>
            </div>

            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 w-full text-xs"
                onClick={resetViewPrefs}
            >
                Reset view
            </Button>
        </div>
    )
}

function ExportSection() {
    const activeTab = useActiveTab()
    const activeTemplate = useActiveTemplate()
    const { exportPrefs, setExportPrefs } = useUIStore()
    const [busy, setBusy] = useState<'png' | 'toml' | null>(null)
    const [exportTab, setExportTab] = useState<'toml' | 'png'>('toml')

    const exportToml = activeTemplate?.io.exportToml
    const canExportImage = !!activeTemplate?.io.canExportImage

    useEffect(() => {
        if (!canExportImage) {
            setExportTab('toml')
        }
    }, [canExportImage])

    function downloadText(filename: string, text: string) {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = filename
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        URL.revokeObjectURL(url)
    }

    function getFileStem() {
        return slugify(activeTab?.title || 'template')
    }

    function getPreviewNode(): HTMLElement | null {
        if (!activeTab || !activeTemplate) return null
        const selector = activeTemplate.getPreviewRootSelector(activeTab.id)
        return document.querySelector<HTMLElement>(selector)
    }

    async function handleExportTOML() {
        if (!activeTab || !exportToml) return

        try {
            setBusy('toml')
            const toml = exportToml(activeTab.doc as never)
            downloadText(`${getFileStem()}.toml`, toml)
            toast.success('Exported TOML.')
        } catch (errorAny: any) {
            toast.error(errorAny?.message || 'Failed to export TOML.')
        } finally {
            setBusy(null)
        }
    }

    async function handleExportPNG() {
        const node = getPreviewNode()
        if (!node) {
            toast.error('Preview not found. Make sure the preview is visible.')
            return
        }

        node.classList.add('exporting')
        try {
            setBusy('png')
            const pixelRatio = Number(exportPrefs.scale) || 1
            const snap: CaptureResult = await snapdom(node, {
                scale: pixelRatio,
                embedFonts: true,
                backgroundColor: exportPrefs.transparent
                    ? 'transparent'
                    : undefined,
            })

            await snap.download({
                filename: `${getFileStem()}@${pixelRatio}x`,
                format: 'png',
            })
            toast.success('Exported PNG.')
        } catch (errorAny: any) {
            toast.error(errorAny?.message || 'Failed to export PNG.')
        } finally {
            setBusy(null)
            node.classList.remove('exporting')
        }
    }

    return (
        <div className="space-y-4">
            <Tabs
                value={exportTab}
                onValueChange={(value) => setExportTab(value as 'toml' | 'png')}
                className="space-y-4"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="toml">TOML</TabsTrigger>
                    <TabsTrigger value="png" disabled={!canExportImage}>
                        PNG
                    </TabsTrigger>
                </TabsList>

                {exportTab === 'png' ? (
                    canExportImage ? (
                        <>
                            <div className="flex items-center justify-between gap-4">
                                <Label
                                    htmlFor="export-transparent"
                                    className="text-xs"
                                >
                                    Transparent background
                                </Label>
                                <Switch
                                    id="export-transparent"
                                    checked={exportPrefs.transparent}
                                    onCheckedChange={(value) =>
                                        setExportPrefs({ transparent: !!value })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Image scale
                                </p>
                                <RadioGroup
                                    value={String(exportPrefs.scale)}
                                    onValueChange={(value) =>
                                        setExportPrefs({
                                            scale: Number(value) as 1 | 2 | 3,
                                        })
                                    }
                                    className="flex items-center gap-3"
                                >
                                    <label className="flex cursor-pointer items-center gap-1.5">
                                        <RadioGroupItem
                                            value="1"
                                            id="export-scale-1"
                                        />
                                        <span className="text-xs">1x</span>
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-1.5">
                                        <RadioGroupItem
                                            value="2"
                                            id="export-scale-2"
                                        />
                                        <span className="text-xs">2x</span>
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-1.5">
                                        <RadioGroupItem
                                            value="3"
                                            id="export-scale-3"
                                        />
                                        <span className="text-xs">3x</span>
                                    </label>
                                </RadioGroup>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Image export is not available for this template.
                        </p>
                    )
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Export your template data as TOML.
                    </p>
                )}
            </Tabs>

            <Button
                type="button"
                size="sm"
                className="h-8 w-full text-xs"
                onClick={
                    exportTab === 'toml' ? handleExportTOML : handleExportPNG
                }
                disabled={
                    busy !== null ||
                    !activeTab ||
                    (exportTab === 'toml' ? !exportToml : !canExportImage)
                }
            >
                {exportTab === 'toml' ? 'Export TOML' : 'Export PNG'}
            </Button>
        </div>
    )
}

export default function SectionSheetHost() {
    return (
        <div className="flex min-h-0 max-h-[calc(100svh-6rem)] flex-col overflow-hidden rounded-2xl">
            <SidebarContent className="min-h-0 flex-1 px-3 py-2 [scrollbar-width:thin] [scrollbar-color:rgba(100,116,139,0.28)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/35 hover:[&::-webkit-scrollbar-thumb]:bg-border/50">
                <Accordion
                    type="multiple"
                    defaultValue={['editor']}
                    className="w-full"
                >
                    <AccordionItem value="editor">
                        <AccordionTrigger className="py-3 text-sm">
                            Editor
                        </AccordionTrigger>
                        <AccordionContent className="pb-3">
                            <div className="[&_input[data-slot=input]]:text-xs [&_textarea[data-slot=textarea]]:text-xs [&_textarea[data-slot=textarea]]:leading-snug">
                                <EditorSection />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </SidebarContent>

            <div className="shrink-0 border-t bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <Accordion type="multiple" defaultValue={[]} className="w-full">
                    <AccordionItem value="appearance">
                        <AccordionTrigger className="py-2 text-sm">
                            General Appearance
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            <GeneralAppearanceSection />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <SidebarFooter className="shrink-0 border-t bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <Accordion
                    type="multiple"
                    defaultValue={['export']}
                    className="w-full"
                >
                    <AccordionItem value="export">
                        <AccordionTrigger className="py-2 text-sm">
                            Export
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            <ExportSection />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </SidebarFooter>
        </div>
    )
}
