import { useEffect, useState } from 'react'

export function useAppShellUi(activeTabId: string | null) {
    const [importOpen, setImportOpen] = useState(false)
    const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false)
    const [desktopInspectorOpen, setDesktopInspectorOpen] = useState(true)

    useEffect(() => {
        setImportOpen(false)
        setMobileInspectorOpen(false)
        setDesktopInspectorOpen(true)
    }, [activeTabId])

    return {
        importOpen,
        setImportOpen,
        mobileInspectorOpen,
        toggleMobileInspector: () => setMobileInspectorOpen((open) => !open),
        desktopInspectorOpen,
        setDesktopInspectorOpen,
    }
}
