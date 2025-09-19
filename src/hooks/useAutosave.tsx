// src/hooks/useAutosave.tsx
import { ChallengeSchema } from '@/schema/challengeSchema'
import { useChallengeStore } from '@/store/challengeStore'
import { useSyncStore } from '@/store/syncStore'
import { useEffect, useRef } from 'react'

const STORAGE_KEY = 'litm:challenge:v2'

function debounce<F extends (...args: any[]) => void>(fn: F, ms: number) {
    let t: ReturnType<typeof setTimeout> | null = null
    return (...args: Parameters<F>) => {
        if (t) clearTimeout(t)
        t = setTimeout(() => fn(...args), ms)
    }
}

export function useAutosave() {
    const { challenge, replaceChallenge } = useChallengeStore()
    const setStatus = useSyncStore((s) => s.setStatus)
    const setSavedNow = useSyncStore((s) => s.setSavedNow)

    // On first mount: try to hydrate from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) {
                setStatus('idle')
                return
            }
            const parsed = JSON.parse(raw) as { version: number; data: any }

            const ok = ChallengeSchema.safeParse(parsed.data)
            if (!ok.success) throw new Error('Invalid saved data')
            replaceChallenge(parsed.data)
            setSavedNow()
        } catch (e: any) {
            console.warn('Autosave hydrate failed:', e)
            setStatus('error', e?.message || 'Hydration failed')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Debounced saver
    const saveRef = useRef(
        debounce((data: any) => {
            try {
                useSyncStore.getState().setStatus('saving')
                const payload = JSON.stringify({ version: 2, data })
                localStorage.setItem(STORAGE_KEY, payload)
                useSyncStore.getState().setSavedNow()
            } catch (e: any) {
                useSyncStore
                    .getState()
                    .setStatus('error', e?.message || 'Save failed')
            }
        }, 500)
    )

    // Subscribe to changes and save
    useEffect(() => {
        // Mark dirty immediately; the debounced saver will flip it to "saving" then "saved"
        setStatus('dirty')
        saveRef.current(challenge)
    }, [challenge, setStatus])

    // OPTIONAL: listen to storage changes from other tabs and re-hydrate
    useEffect(() => {
        const onStorage = (ev: StorageEvent) => {
            if (ev.key !== STORAGE_KEY || ev.newValue == null) return
            try {
                const parsed = JSON.parse(ev.newValue)
                replaceChallenge(parsed.data)
                setSavedNow()
            } catch {}
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}
