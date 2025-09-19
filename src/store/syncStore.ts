// src/store/syncStore.ts
import { create } from 'zustand'

export type SyncStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

type SyncState = {
    status: SyncStatus
    lastSavedAt?: number // Date.now()
    error?: string | null
    setStatus: (s: SyncStatus, err?: string | null) => void
    setSavedNow: () => void
}

export const useSyncStore = create<SyncState>((set) => ({
    status: 'idle',
    lastSavedAt: undefined,
    error: null,
    setStatus: (status, error) => set({ status, error }),
    setSavedNow: () =>
        set({ status: 'saved', lastSavedAt: Date.now(), error: null }),
}))
