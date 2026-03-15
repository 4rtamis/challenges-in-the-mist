import { useEffect } from 'react'

export function useBodyGameTheme(themeId?: string) {
    useEffect(() => {
        if (typeof document === 'undefined') return

        if (themeId) {
            document.body.dataset.gameTheme = themeId
        } else {
            delete document.body.dataset.gameTheme
        }

        return () => {
            delete document.body.dataset.gameTheme
        }
    }, [themeId])
}
