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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import { TagIcon, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HIDE_CLOSE_TAB_ALERT_KEY = 'mist:hide-close-tab-alert:v1'

export default function AppTopBar() {
    const navigate = useNavigate()

    const tabs = useWorkspaceStore((s) => s.tabs)
    const tabOrder = useWorkspaceStore((s) => s.tabOrder)
    const activeTabId = useWorkspaceStore((s) => s.activeTabId)
    const activateTab = useWorkspaceStore((s) => s.activateTab)
    const closeTab = useWorkspaceStore((s) => s.closeTab)

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

    function closeAndNavigate(tabId: string) {
        const next = closeTab(tabId)
        if (next) {
            navigate(`/tabs/${next}`)
        } else {
            navigate('/')
        }
    }

    return (
        <div className="sticky top-0 z-40 flex min-h-12 w-full min-w-0 items-center gap-2 overflow-x-hidden border-b bg-background/85 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/65">
            <SidebarTrigger />

            <div className="mr-1 border-x px-2 text-sm font-semibold uppercase md:pl-2.5 md:pr-3">
                <span
                    className="cursor-pointer"
                    onClick={() => {
                        activateTab(null)
                        navigate('/')
                    }}
                >
                    Lantern
                </span>
                <Badge variant="outline" className="ml-2">
                    <TagIcon />
                    <span>{__APP_VERSION__}</span>
                </Badge>
            </div>

            <div className="min-w-0 flex-1">
                {orderedTabs.length > 0 ? (
                    <div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {orderedTabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`group inline-flex max-w-[220px] shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                                    tab.id === activeTabId
                                        ? 'border-primary/40 bg-primary/10 text-foreground'
                                        : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground'
                                }`}
                            >
                                <button
                                    type="button"
                                    className="min-w-0 truncate text-left"
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
