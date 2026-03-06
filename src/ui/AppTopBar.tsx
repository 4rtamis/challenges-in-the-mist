import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import {
    Cog,
    Download,
    Eye,
    FilePlus2,
    HelpCircle,
    TagIcon,
    Upload,
    X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ExportDialog from './ExportDialog'
import ImportDialog from './ImportDialog'
import NewDialog from './NewDialog'
import ViewMenu from './ViewMenu'

const HIDE_CLOSE_TAB_ALERT_KEY = 'mist:hide-close-tab-alert:v1'

export default function AppTopBar() {
    const navigate = useNavigate()

    const tabs = useWorkspaceStore((s) => s.tabs)
    const tabOrder = useWorkspaceStore((s) => s.tabOrder)
    const activeTabId = useWorkspaceStore((s) => s.activeTabId)
    const activateTab = useWorkspaceStore((s) => s.activateTab)
    const closeTab = useWorkspaceStore((s) => s.closeTab)

    const [exportOpen, setExportOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)
    const [newOpen, setNewOpen] = useState(false)
    const [confirmCloseTabId, setConfirmCloseTabId] = useState<string | null>(
        null
    )
    const [dontShowCloseTabAlertAgain, setDontShowCloseTabAlertAgain] =
        useState(false)
    const [hideCloseTabAlert, setHideCloseTabAlert] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.localStorage.getItem(HIDE_CLOSE_TAB_ALERT_KEY) === '1'
    })

    const orderedTabs = useMemo(
        () =>
            tabOrder
                .map((id) => tabs.find((tab) => tab.id === id) ?? null)
                .filter((tab): tab is WorkspaceTab => tab !== null),
        [tabOrder, tabs]
    )

    const pendingCloseTab = useMemo(
        () => tabs.find((tab) => tab.id === confirmCloseTabId) ?? null,
        [confirmCloseTabId, tabs]
    )

    const hasActiveTab = activeTabId != null

    function closeAndNavigate(tabId: string) {
        const next = closeTab(tabId)
        if (next) {
            navigate(`/tabs/${next}`)
        } else {
            navigate('/')
        }
    }

    return (
        <div className="sticky top-0 z-40 flex min-h-12 w-full items-center gap-2 border-b bg-background/85 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/65">
            <SidebarTrigger />

            <div className="mr-1 border-x px-2 text-sm font-semibold uppercase md:pl-2.5 md:pr-3">
                Lantern
                <Badge variant="outline" className="ml-2">
                    <TagIcon />
                    <span className="-translate-y-0.5">0.1.0</span>
                </Badge>
            </div>

            <div className="min-w-0 flex-1">
                {orderedTabs.length > 0 ? (
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                        {orderedTabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`group inline-flex max-w-[220px] items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                                    tab.id === activeTabId
                                        ? 'border-primary/40 bg-primary/10 text-foreground'
                                        : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground'
                                }`}
                            >
                                <button
                                    type="button"
                                    className="truncate text-left"
                                    onClick={() => {
                                        activateTab(tab.id)
                                        navigate(`/tabs/${tab.id}`)
                                    }}
                                >
                                    {tab.title}
                                </button>
                                <button
                                    type="button"
                                    className="rounded p-0.5 opacity-70 hover:bg-background/70 hover:opacity-100"
                                    onClick={(event) => {
                                        event.stopPropagation()

                                        if (tab.mode === 'landing') {
                                            closeAndNavigate(tab.id)
                                            return
                                        }

                                        if (hideCloseTabAlert) {
                                            closeAndNavigate(tab.id)
                                            return
                                        }

                                        setDontShowCloseTabAlertAgain(false)
                                        setConfirmCloseTabId(tab.id)
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-1 text-xs text-muted-foreground">
                        No open tabs
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    title="New"
                    disabled={!hasActiveTab}
                    onClick={() => setNewOpen(true)}
                >
                    <FilePlus2 className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    title="Import (.toml)"
                    disabled={!hasActiveTab}
                    onClick={() => setImportOpen(true)}
                >
                    <Upload className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    title="Export"
                    disabled={!hasActiveTab}
                    onClick={() => setExportOpen(true)}
                >
                    <Download className="h-4 w-4" />
                </Button>

                <ViewMenu disabled={!hasActiveTab}>
                    <Button
                        variant="ghost"
                        size="icon"
                        title="View"
                        disabled={!hasActiveTab}
                    >
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

            <NewDialog open={newOpen} onOpenChange={setNewOpen} />
            <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
            <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />

            <AlertDialog
                open={confirmCloseTabId !== null}
                onOpenChange={(open) => {
                    if (!open) setConfirmCloseTabId(null)
                }}
            >
                <AlertDialogContent size="default">
                    <AlertDialogHeader className="place-items-start text-left">
                        <AlertDialogTitle>
                            Are you absolutely sure you want to remove this tab?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete{' '}
                            <strong>
                                {pendingCloseTab?.title ?? 'this tab'}
                            </strong>
                            .
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="hide-close-tab-alert"
                            checked={dontShowCloseTabAlertAgain}
                            onCheckedChange={(checked) =>
                                setDontShowCloseTabAlertAgain(checked === true)
                            }
                        />
                        <Label
                            htmlFor="hide-close-tab-alert"
                            className="text-sm font-normal text-muted-foreground"
                        >
                            Don&apos;t show me this again
                        </Label>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                if (dontShowCloseTabAlertAgain) {
                                    setHideCloseTabAlert(true)
                                    if (typeof window !== 'undefined') {
                                        window.localStorage.setItem(
                                            HIDE_CLOSE_TAB_ALERT_KEY,
                                            '1'
                                        )
                                    }
                                }
                                if (confirmCloseTabId) {
                                    closeAndNavigate(confirmCloseTabId)
                                }
                                setConfirmCloseTabId(null)
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
