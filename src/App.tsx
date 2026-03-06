// src/App.tsx

import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import SectionSheetHost from '@/editor/SectionSheetHost'
import { useAutosave } from '@/hooks/useAutosave'
import LivePreview from '@/preview/LivePreview'
import { useUIStore } from '@/store/uiStore'
import AppTopBar from './ui/AppTopBar'

export default function App() {
    useAutosave()
    const previewWidth = useUIStore((s) => s.previewWidth)

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full">
                    <AppTopBar />

                    {/* Main preview area */}
                    <main
                        className="mx-auto w-full px-4 sm:px-6 py-6"
                        style={{ maxWidth: `${previewWidth}px` }}
                    >
                        <LivePreview />
                    </main>
                </div>
                <SectionSheetHost />
                <Toaster richColors closeButton position="top-center" expand />
            </SidebarProvider>
        </>
    )
}
