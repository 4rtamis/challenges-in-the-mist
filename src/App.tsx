// src/App.tsx

import { Toaster } from "@/components/ui/sonner";
import ImportExportBar from "@/editor/ImportExportBar";
import LivePreview from "@/preview/LivePreview";
import SectionSheetHost from "@/sheets/SectionSheetHost";

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
      <SectionSheetHost />
      <Toaster richColors closeButton position="top-right" expand />
    </>
  );
}
