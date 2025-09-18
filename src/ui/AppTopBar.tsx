import { Button } from '@/components/ui/button'
import { Cog, Download, Eye, FilePlus2, HelpCircle, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import ExportDialog from './ExportDialog'
import ImportDialog from './ImportDialog'
import NewDialog from './NewDialog'
import ViewMenu from './ViewMenu'

export default function AppTopBar() {
    const [exportOpen, setExportOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)
    const [newOpen, setNewOpen] = useState(false)

    return (
        <div className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-6xl px-3 py-2 flex items-center justify-between">
                {/* Left: brand / game selector placeholder */}
                <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold tracking-wide">
                        LANTERN —{' '}
                        <span className="opacity-70">
                            Challenges in the Mist
                        </span>
                    </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        title="New"
                        onClick={() => {
                            setNewOpen(true)
                        }}
                    >
                        <FilePlus2 className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        title="Import (.toml)"
                        onClick={() => setImportOpen(true)}
                    >
                        <Upload className="h-4 w-4" />
                    </Button>

                    {/* Export */}
                    <Button
                        variant="ghost"
                        size="icon"
                        title="Export"
                        onClick={() => setExportOpen(true)}
                    >
                        <Download className="h-4 w-4" />
                    </Button>

                    {/* View menu */}
                    <ViewMenu>
                        <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </ViewMenu>

                    <Button
                        variant="ghost"
                        size="icon"
                        title="Settings"
                        onClick={() =>
                            toast('Settings: theme & language (coming soon).')
                        }
                    >
                        <Cog className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        title="Help / Shortcuts"
                        onClick={() => toast('Help & shortcuts (coming soon).')}
                    >
                        <HelpCircle className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <NewDialog open={newOpen} onOpenChange={setNewOpen} />
            <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
            <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
        </div>
    )
}
