import { useChallengeStore } from '@/store/challengeStore'
import { importFromTOMLWithWarnings } from '@/utils/tomlIO'
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
    const { replaceChallenge } = useChallengeStore()

    // Shared preview
    const [previewName, setPreviewName] = useState<string | null>(null)
    const [warnings, setWarnings] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    // File tab
    const fileRef = useRef<HTMLInputElement>(null)
    const [fileRawToml, setFileRawToml] = useState<string | null>(null)

    // Paste tab
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
        // Let dialog animation finish before clearing state
        setTimeout(resetAll, 150)
    }

    /* ---------- FILE TAB ---------- */
    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]
        if (!f) return
        const reader = new FileReader()
        reader.onload = () => {
            try {
                const text = String(reader.result || '')
                const { challenge, warnings } = importFromTOMLWithWarnings(text)
                setPreviewName(challenge.name || 'Imported Challenge')
                setWarnings(warnings || [])
                setError(null)
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
        reader.readAsText(f)
    }

    function importFromFile() {
        if (!fileRawToml) return
        try {
            const { challenge, warnings } =
                importFromTOMLWithWarnings(fileRawToml)
            replaceChallenge(challenge)
            toast.success(
                `Imported “${challenge.name || 'Challenge'}”. Replaced current draft.`
            )
            if (warnings?.length)
                toast.warning(`Imported with ${warnings.length} warning(s).`)
            close()
        } catch (e: any) {
            toast.error(e?.message || 'Failed to import.')
        }
    }

    /* ---------- PASTE TAB (auto-validate) ---------- */
    function onTomlChange(v: string) {
        setRawToml(v)
        if (!v.trim()) {
            setPreviewName(null)
            setWarnings([])
            setError(null)
            return
        }
        try {
            const { challenge, warnings } = importFromTOMLWithWarnings(v)
            setPreviewName(challenge.name || 'Imported Challenge')
            setWarnings(warnings || [])
            setError(null)
        } catch (e: any) {
            setPreviewName(null)
            setWarnings([])
            setError(e?.message || 'Invalid TOML.')
        }
    }

    function importFromPaste() {
        try {
            const { challenge, warnings } = importFromTOMLWithWarnings(rawToml)
            replaceChallenge(challenge)
            toast.success(
                `Imported “${challenge.name || 'Challenge'}”. Replaced current draft.`
            )
            if (warnings?.length)
                toast.warning(`Imported with ${warnings.length} warning(s).`)
            close()
        } catch (e: any) {
            toast.error(e?.message || 'Failed to import.')
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => (v ? onOpenChange(true) : close())}
        >
            <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                    <DialogTitle>Import Challenge</DialogTitle>
                    <DialogDescription>
                        Import from a <code>.toml</code> file or by pasting
                        TOML.
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

                    {/* ---- Trusted sources warning (shared copy in each tab) ---- */}
                    {/* FILE TAB */}
                    <TabsContent value="file" className="space-y-3">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>
                                Import from trusted sources only
                            </AlertTitle>
                            <AlertDescription>
                                Importing files can include malicious content.
                                Only open TOML from creators you trust.
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
                                >
                                    Choose file…
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    We validate before importing.
                                </span>
                            </div>
                        </div>

                        <PreviewPane
                            name={previewName}
                            warnings={warnings}
                            error={error}
                        />

                        {/* Action for FILE tab lives inside this tab now */}
                        <div className="flex justify-end">
                            <Button
                                onClick={importFromFile}
                                disabled={!fileRawToml || !!error}
                            >
                                Import file
                            </Button>
                        </div>
                    </TabsContent>

                    {/* PASTE TAB */}
                    <TabsContent value="paste" className="space-y-3">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>
                                Import from trusted sources only
                            </AlertTitle>
                            <AlertDescription>
                                Pasted TOML can include malicious payloads. Only
                                paste content from creators you trust.
                            </AlertDescription>
                        </Alert>

                        <div className="grid gap-2">
                            <Label htmlFor="paste-toml">Paste TOML</Label>
                            {/* Code-like textarea, height-limited, scrollable */}
                            <Textarea
                                id="paste-toml"
                                rows={12}
                                className="font-mono text-sm leading-5 h-48 resize-y"
                                spellCheck={false}
                                placeholder='[[limits]] name = "Free" ...'
                                value={rawToml}
                                onChange={(e) => onTomlChange(e.target.value)}
                            />
                            <div className="text-xs text-muted-foreground">
                                Auto-validates as you type/paste.
                            </div>
                        </div>

                        <PreviewPane
                            name={previewName}
                            warnings={warnings}
                            error={error}
                        />

                        {/* Action for PASTE tab lives inside this tab now */}
                        <div className="flex justify-end">
                            <Button
                                onClick={importFromPaste}
                                disabled={!rawToml.trim() || !!error}
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
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm whitespace-pre-wrap">
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
        <div className="rounded-md border p-3 space-y-2">
            {name && (
                <div className="text-sm">
                    <span className="font-medium">Detected challenge:</span>{' '}
                    {name}
                </div>
            )}
            {warnings.length > 0 && (
                <div className="rounded-md border bg-amber-50/60 p-3">
                    <div className="flex items-center gap-2 text-amber-800 font-medium">
                        <AlertTriangle className="h-4 w-4" />
                        {warnings.length} warning(s)
                    </div>
                    <ScrollArea className="mt-2 h-24">
                        <ul className="list-disc ml-5 text-amber-900 text-sm space-y-1">
                            {warnings.map((w, i) => (
                                <li key={i}>{w}</li>
                            ))}
                        </ul>
                    </ScrollArea>
                </div>
            )}
        </div>
    )
}
