import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useActiveTab, useActiveTemplate } from '@/core/workspace/selectors'
import { slugify } from '@/utils/strings'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { useState } from 'react'
import { toast } from 'sonner'
import { useUIStore } from '@/store/uiStore'

export default function ExportDialog({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (value: boolean) => void
}) {
    const activeTab = useActiveTab()
    const activeTemplate = useActiveTemplate()

    const { exportPrefs, setExportPrefs } = useUIStore()

    const [busy, setBusy] = useState<'png' | 'svg' | 'toml' | null>(null)
    const [tab, setTab] = useState<'toml' | 'png' | 'svg'>('toml')

    const exportToml = activeTemplate?.io.exportToml
    const canExportImage = !!activeTemplate?.io.canExportImage

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

    async function handleCopyTOML() {
        if (!activeTab || !exportToml) return

        try {
            setBusy('toml')
            const toml = exportToml(activeTab.doc as never)
            await navigator.clipboard.writeText(toml)
            toast.success('Copied TOML to clipboard.')
        } catch (errorAny: any) {
            toast.error(errorAny?.message || 'Clipboard copy failed.')
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

    async function handleExportSVG() {
        const node = getPreviewNode()
        if (!node) {
            toast.error('Preview not found. Make sure the preview is visible.')
            return
        }

        node.classList.add('exporting')
        try {
            setBusy('svg')
            const pixelRatio = Number(exportPrefs.scale) || 1
            const snap: CaptureResult = await snapdom(node, {
                scale: pixelRatio,
                embedFonts: true,
                backgroundColor: exportPrefs.transparent
                    ? 'transparent'
                    : undefined,
            })

            await snap.download({
                filename: `${getFileStem()}@${pixelRatio}x.svg`,
                format: 'svg',
            })
            toast.success('Exported SVG.')
        } catch (errorAny: any) {
            toast.error(errorAny?.message || 'Failed to export SVG.')
        } finally {
            setBusy(null)
            node.classList.remove('exporting')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export</DialogTitle>
                    <DialogDescription>
                        Choose a format and options, then export your current tab.
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    value={tab}
                    onValueChange={(value) => setTab(value as 'toml' | 'png' | 'svg')}
                    className="w-full"
                >
                    <TabsList className="mb-4">
                        <TabsTrigger value="toml">TOML</TabsTrigger>
                        <TabsTrigger value="png" disabled={!canExportImage}>
                            PNG
                        </TabsTrigger>
                        <TabsTrigger value="svg" disabled={!canExportImage}>
                            SVG
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="toml">
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>Export your template data as TOML.</p>
                            <p>No visual settings apply here.</p>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button
                                variant="outline"
                                onClick={handleCopyTOML}
                                disabled={busy !== null || !activeTab || !exportToml}
                            >
                                Copy TOML
                            </Button>
                            <Button
                                onClick={handleExportTOML}
                                disabled={busy !== null || !activeTab || !exportToml}
                            >
                                Export TOML
                            </Button>
                        </DialogFooter>
                    </TabsContent>

                    <TabsContent value="png">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="exp-transp-png">
                                    Transparent background
                                </Label>
                                <Switch
                                    id="exp-transp-png"
                                    checked={exportPrefs.transparent}
                                    onCheckedChange={(value) =>
                                        setExportPrefs({ transparent: !!value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Scale</Label>
                                <RadioGroup
                                    value={String(exportPrefs.scale)}
                                    onValueChange={(value) =>
                                        setExportPrefs({ scale: Number(value) as 1 | 2 | 3 })
                                    }
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1" id="scale1" />
                                        <Label htmlFor="scale1">1×</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2" id="scale2" />
                                        <Label htmlFor="scale2">2×</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="3" id="scale3" />
                                        <Label htmlFor="scale3">3×</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                onClick={handleExportPNG}
                                disabled={busy !== null || !activeTab || !canExportImage}
                            >
                                Export PNG
                            </Button>
                        </DialogFooter>
                    </TabsContent>

                    <TabsContent value="svg">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="exp-transp-svg">
                                    Transparent background
                                </Label>
                                <Switch
                                    id="exp-transp-svg"
                                    checked={exportPrefs.transparent}
                                    onCheckedChange={(value) =>
                                        setExportPrefs({ transparent: !!value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Scale</Label>
                                <RadioGroup
                                    value={String(exportPrefs.scale)}
                                    onValueChange={(value) =>
                                        setExportPrefs({ scale: Number(value) as 1 | 2 | 3 })
                                    }
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1" id="scale1svg" />
                                        <Label htmlFor="scale1svg">1×</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2" id="scale2svg" />
                                        <Label htmlFor="scale2svg">2×</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="3" id="scale3svg" />
                                        <Label htmlFor="scale3svg">3×</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                onClick={handleExportSVG}
                                disabled={busy !== null || !activeTab || !canExportImage}
                            >
                                Export SVG
                            </Button>
                        </DialogFooter>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
