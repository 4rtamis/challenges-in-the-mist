// src/App.tsx

import { Toaster } from "@/components/ui/sonner";

import LivePreview from "@/preview/LivePreview";
import SectionSheetHost from "@/sheets/SectionSheetHost";
import AppTopBar from "./ui/AppTopBar";

export default function App() {
  return (
    <>
      <AppTopBar />

      {/* Main preview area */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <LivePreview />
      </main>
      <SectionSheetHost />
      <Toaster richColors closeButton position="top-center" expand />
    </>
  );
}
