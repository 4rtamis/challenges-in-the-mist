import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { TemplateInspector } from '@/core/templates/shell/TemplateInspector'

type AppDesktopInspectorProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function AppDesktopInspector({
    open,
    onOpenChange,
}: AppDesktopInspectorProps) {
    return (
        <SidebarProvider
            open={open}
            onOpenChange={onOpenChange}
            keyboardShortcut={null}
            className="contents"
        >
            <SidebarTrigger
                className="fixed top-14 right-4 z-40 hidden rounded-md border bg-background shadow-sm md:inline-flex"
                aria-label="Toggle editor sidebar"
                title="Toggle editor sidebar"
            />

            <Sidebar
                side="right"
                variant="floating"
                collapsible="offcanvas"
                withGap={false}
                className="z-30 hidden !top-16 !bottom-auto !h-auto !max-h-[calc(100svh-8rem)] md:flex [--sidebar-width:22rem]"
            >
                <TemplateInspector />
            </Sidebar>
        </SidebarProvider>
    )
}
