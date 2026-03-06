import { useEffect } from 'react'
import { useWorkspaceStore } from './store'

export function useWorkspaceHydration() {
    const hydrated = useWorkspaceStore((s) => s.hydrated)
    const hydrateWorkspace = useWorkspaceStore((s) => s.hydrateWorkspace)

    useEffect(() => {
        hydrateWorkspace()
    }, [hydrateWorkspace])

    return hydrated
}
