import { useActiveTab, useActiveTemplate } from '@/core/workspace/selectors'
import { useWorkspaceStore } from '@/core/workspace/store'
import * as React from 'react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, FileText, Upload } from 'lucide-react'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export default function ImportDialog({ open, onOpenChange }: Props) {
    const activeTab = useActiveTab()
    const activeTemplate = useActiveTemplate()

    const replaceTabDoc = useWorkspaceStore((s) => s.replaceTabDoc)
    const setTabMode = useWorkspaceStore((s) => s.setTabMode)

    const importToml = activeTemplate?.io.importToml

    const [previewName, setPreviewName] = useState<string | null>(null)
    const [warnings, setWarnings] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    const fileRef = useRef<HTMLInputElement>(null)
    const [fileRawToml, setFileRawToml] = useState<string | null>(null)

    const [rawToml, setRawToml] = useState('')

    function resetAll() {
        setPreviewName(null)
        setWarnings([])
        setError(null)
        setFileRawToml(null)
        setRawToml('')
        if (fileRef.current) fileRef.current.value = ''
    }

    function close() {
        onOpenChange(false)
        setTimeout(resetAll, 150)
    }

    function validateToml(content: string) {
        if (!importToml) {
            throw new Error('Import is not available for this template.')
        }

        const parsed = importToml(content)
        setPreviewName(parsed.previewName || `${activeTemplate?.label || 'Template'} import`)
        setWarnings(parsed.warnings || [])
        setError(null)
        return parsed
    }

    function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            try {
                const text = String(reader.result || '')
                validateToml(text)
                setFileRawToml(text)
                toast.success('TOML validated.')
            } catch (errAny: any) {
                setPreviewName(null)
                setWarnings([])
                setFileRawToml(null)
                setError(errAny?.message || 'Failed to parse/validate TOML.')
            }
        }

        reader.onerror = () => {
            setPreviewName(null)
            setWarnings([])
            setFileRawToml(null)
            setError('Failed to read file.')
        }

        reader.readAsText(file)
    }

    function importFromFile() {
        if (!fileRawToml || !activeTab || !importToml) return

        try {
            const parsed = importToml(fileRawToml)
            replaceTabDoc(activeTab.id, parsed.doc)
            setTabMode(activeTab.id, 'editing')
            toast.success(`Imported “${parsed.previewName || activeTemplate?.label || 'template'}”.`)
            if (parsed.warnings?.length) {
                toast.warning(`Imported with ${parsed.warnings.length} warning(s).`)
            }
            close()
        } catch (errorAny: any) {
            toast.error(errorAny?.message || 'Failed to import.')
        }
    }

    function onTomlChange(value: string) {
        setRawToml(value)
        if (!value.trim()) {
            setPreviewName(null)
            setWarnings([])
            setError(null)
            return
        }

        try {
            validateToml(value)
        } catch (errorAny: any) {
            setPreviewName(null)
            setWarnings([])
            setError(errorAny?.message || 'Invalid TOML.')
        }
    }

    function importFromPaste() {
        if (!activeTab || !importToml) return

        try {
            const parsed = importToml(rawToml)
            replaceTabDoc(activeTab.id, parsed.doc)
            setTabMode(activeTab.id, 'editing')
            toast.success(`Imported “${parsed.previewName || activeTemplate?.label || 'template'}”.`)
            if (parsed.warnings?.length) {
                toast.warning(`Imported with ${parsed.warnings.length} warning(s).`)
            }
            close()
        } catch (errorAny: any) {
            toast.error(errorAny?.message || 'Failed to import.')
        }
    }

    const templateLabel = activeTemplate?.label || 'Template'

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => (value ? onOpenChange(true) : close())}
        >
            <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                    <DialogTitle>Import {templateLabel}</DialogTitle>
                    <DialogDescription>
                        Import from a <code>.toml</code> file or by pasting TOML.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="file" className="space-y-3">
                    <TabsList>
                        <TabsTrigger value="file" className="gap-2">
                            <Upload className="h-4 w-4" />
                            File
                        </TabsTrigger>
                        <TabsTrigger value="paste" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Paste
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="file" className="space-y-3">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Import from trusted sources only</AlertTitle>
                            <AlertDescription>
                                Importing files can include malicious content. Only open TOML from creators you trust.
                            </AlertDescription>
                        </Alert>

                        <input
                            ref={fileRef}
                            type="file"
                            accept=".toml,text/plain"
                            className="hidden"
                            onChange={onFileChange}
                        />

                        <div className="grid gap-2">
                            <Label>Select a .toml file</Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => fileRef.current?.click()}
                                    disabled={!importToml}
                                >
                                    Choose file…
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    We validate before importing.
                                </span>
                            </div>
                        </div>

                        <PreviewPane name={previewName} warnings={warnings} error={error} />

                        <div className="flex justify-end">
                            <Button
                                onClick={importFromFile}
                                disabled={!fileRawToml || !!error || !importToml || !activeTab}
                            >
                                Import file
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="paste" className="space-y-3">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Import from trusted sources only</AlertTitle>
                            <AlertDescription>
                                Pasted TOML can include malicious payloads. Only paste content from creators you trust.
                            </AlertDescription>
                        </Alert>

                        <div className="grid gap-2">
                            <Label htmlFor="paste-toml">Paste TOML</Label>
                            <Textarea
                                id="paste-toml"
                                rows={12}
                                className="h-48 resize-y font-mono text-sm leading-5"
                                spellCheck={false}
                                placeholder='[[limits]] name = "Free" ...'
                                value={rawToml}
                                onChange={(event) => onTomlChange(event.target.value)}
                            />
                            <div className="text-xs text-muted-foreground">
                                Auto-validates as you type/paste.
                            </div>
                        </div>

                        <PreviewPane name={previewName} warnings={warnings} error={error} />

                        <div className="flex justify-end">
                            <Button
                                onClick={importFromPaste}
                                disabled={!rawToml.trim() || !!error || !importToml || !activeTab}
                            >
                                Import pasted TOML
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

function PreviewPane({
    name,
    warnings,
    error,
}: {
    name: string | null
    warnings: string[]
    error: string | null
}) {
    if (error) {
        return (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive whitespace-pre-wrap">
                {error}
            </div>
        )
    }

    if (!name && warnings.length === 0) {
        return (
            <div className="text-sm text-muted-foreground">
                No preview yet. Select a file or paste TOML.
            </div>
        )
    }

    return (
        <div className="space-y-2 rounded-md border p-3">
            {name && (
                <div className="text-sm">
                    <span className="font-medium">Detected template:</span> {name}
                </div>
            )}
            {warnings.length > 0 && (
                <div className="rounded-md border bg-amber-50/60 p-3">
                    <div className="flex items-center gap-2 font-medium text-amber-800">
                        <AlertTriangle className="h-4 w-4" />
                        {warnings.length} warning(s)
                    </div>
                    <ScrollArea className="mt-2 h-24">
                        <ul className="ml-5 list-disc space-y-1 text-sm text-amber-900">
                            {warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    </ScrollArea>
                </div>
            )}
        </div>
    )
}
