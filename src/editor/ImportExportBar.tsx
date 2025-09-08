// src/editor/ImportExportBar.tsx
import { useRef, useState } from "react";
import { useChallengeStore, type Challenge } from "../store/challengeStore";
import { exportToTOML, importFromTOMLWithWarnings } from "../utils/tomlIO";
import { slugify } from "../utils/strings";
import { Download, Upload, Copy, AlertTriangle } from "lucide-react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// sonner
import { toast } from "sonner";

export default function ImportExportBar() {
  const { challenge, replaceChallenge } = useChallengeStore();
  const fileRef = useRef<HTMLInputElement>(null);

  // Persisted warnings after import
  const [warnings, setWarnings] = useState<string[]>([]);

  // Import confirm dialog state
  const [open, setOpen] = useState(false);
  const [importName, setImportName] = useState<string>("");
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [importParsed, setImportParsed] = useState<Challenge | null>(null);

  function downloadText(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleExport() {
    try {
      const toml = exportToTOML(challenge);
      const name = slugify(challenge.name || "challenge");
      downloadText(`${name}.toml`, toml);
      toast.success("Exported", {
        description: "Your challenge was saved as .toml",
      });
      setWarnings([]);
    } catch (e: any) {
      toast.error("Export failed", {
        description: e?.message || "Failed to export TOML.",
      });
    }
  }

  async function handleCopy() {
    try {
      const toml = exportToTOML(challenge);
      await navigator.clipboard.writeText(toml);
      toast.success("Copied", { description: "TOML copied to clipboard." });
      setWarnings([]);
    } catch (e: any) {
      toast.error("Copy failed", {
        description: e?.message || "Clipboard copy failed.",
      });
    }
  }

  function onPickFile() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const { challenge: imported, warnings } =
          importFromTOMLWithWarnings(text);

        setImportParsed(imported as Challenge);
        setImportName(imported.name || "Imported Challenge");
        setImportWarnings(warnings || []);
        setOpen(true);
      } catch (errAny: any) {
        toast.error("Import failed", {
          description: `Failed to parse/validate TOML: ${errAny?.message || errAny}`,
        });
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    reader.onerror = () => {
      toast.error("Import failed", { description: "Failed to read file." });
    };
    reader.readAsText(f);
  }

  function confirmImport() {
    if (!importParsed) return;
    replaceChallenge(importParsed);
    setWarnings(importWarnings);
    setOpen(false);
    toast.success("Imported", { description: importName });
  }

  return (
    <div className="flex flex-col gap-2 items-stretch">
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept=".toml,text/plain"
        className="hidden"
        onChange={onFileChange}
      />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" onClick={onPickFile} title="Import .toml">
          <Upload className="mr-2 h-4 w-4" /> Import TOML
        </Button>

        <Button
          variant="outline"
          onClick={handleCopy}
          title="Copy .toml to clipboard"
        >
          <Copy className="mr-2 h-4 w-4" /> Copy TOML
        </Button>

        <Button onClick={handleExport} title="Download .toml">
          <Download className="mr-2 h-4 w-4" /> Export TOML
        </Button>
      </div>

      {/* Persisted warnings after import */}
      {warnings.length > 0 && (
        <Alert className="mt-1" variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Imported with warnings</AlertTitle>
          <AlertDescription>
            <ul className="list-disc ml-5 space-y-1">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Confirm dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import challenge?</DialogTitle>
            <DialogDescription>
              This will replace your current editor content with:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Name:</span>{" "}
              {importName || "Untitled"}
            </div>

            {importWarnings.length > 0 && (
              <Alert variant="default">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Detected warnings</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc ml-5 space-y-1">
                    {importWarnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmImport}>Replace current</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
