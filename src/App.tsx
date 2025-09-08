// src/App.tsx
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import AppSidebar from "@/components/app-sidebar";
import ImportExportBar from "@/editor/ImportExportBar";
import LivePreview from "@/preview/LivePreview";

export default function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />

      <SidebarInset>
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-1" />
              <span className="font-semibold tracking-wide">
                Challenges in the Mist
              </span>
            </div>
            <ImportExportBar />
          </div>
        </header>

        {/* Main preview area */}
        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
          <LivePreview />
        </main>

        <Toaster richColors closeButton position="top-right" expand />
      </SidebarInset>
    </SidebarProvider>
  );
}
