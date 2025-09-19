// src/components/SyncIndicator.tsx
import { cn } from '@/lib/utils' // if you have a classnames helper
import { useSyncStore } from '@/store/syncStore'
import { useMemo } from 'react'

function timeAgo(ts?: number) {
    if (!ts) return ''
    const secs = Math.floor((Date.now() - ts) / 1000)
    if (secs < 5) return 'just now'
    if (secs < 60) return `${secs}s ago`
    const mins = Math.floor(secs / 60)
    return `${mins}m ago`
}

export default function SyncIndicator() {
    const { status, lastSavedAt } = useSyncStore()

    const label = useMemo(() => {
        switch (status) {
            case 'dirty':
                return 'Unsaved changes'
            case 'saving':
                return 'Saving…'
            case 'saved':
                return `Saved • ${timeAgo(lastSavedAt)}`
            case 'error':
                return 'Save error'
            default:
                return 'Ready'
        }
    }, [status, lastSavedAt])

    const dot = useMemo(() => {
        switch (status) {
            case 'dirty':
                return 'bg-amber-500'
            case 'saving':
                return 'bg-blue-500 animate-pulse'
            case 'saved':
                return 'bg-emerald-500'
            case 'error':
                return 'bg-red-500'
            default:
                return 'bg-slate-400'
        }
    }, [status])

    return (
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground select-none">
            <span className={cn('h-2 w-2 rounded-full', dot)} />
            <span className="tabular-nums">{label}</span>
        </div>
    )
}
