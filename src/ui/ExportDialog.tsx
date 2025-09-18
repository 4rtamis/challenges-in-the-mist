import { useState } from "react";
import { useChallengeStore } from "@/store/challengeStore";
import { useUIStore } from "@/store/uiStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import * as htmlToImage from "html-to-image";
import { exportToTOML } from "@/utils/tomlIO";
import { slugify } from "@/utils/strings";

export default function ExportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { challenge } = useChallengeStore();
  const { exportPrefs, setExportPrefs } = useUIStore();
  const [busy, setBusy] = useState<"png" | "toml" | null>(null);

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

  async function handleExportTOML() {
    try {
      setBusy("toml");
      const toml = exportToTOML(challenge);
      const name = slugify(challenge.name || "challenge");
      downloadText(`${name}.toml`, toml);
      toast.success("Exported TOML.");
    } catch (e: any) {
      toast.error(e?.message || "Failed to export TOML.");
    } finally {
      setBusy(null);
    }
  }

  async function handleCopyTOML() {
    try {
      setBusy("toml");
      const toml = exportToTOML(challenge);
      await navigator.clipboard.writeText(toml);
      toast.success("Copied TOML to clipboard.");
    } catch (e: any) {
      toast.error(e?.message || "Clipboard copy failed.");
    } finally {
      setBusy(null);
    }
  }

  /** PNG export of the first .challenge-sheet on the page */
  async function handleExportPNG() {
    const node = document.querySelector<HTMLElement>(".challenge-sheet");
    if (!node) {
      toast.error("Preview not found. Make sure the preview is visible.");
      return;
    }

    // Optional: temporarily add a class to hint CSS if you want special print/export fixes
    node.classList.add("exporting");

    try {
      setBusy("png");

      // Filter out UI-only elements (hover controls, click blockers, add buttons, etc.)
      const filter = (el: HTMLElement) => {
        // Ignore anything explicitly marked or that is clearly an overlay
        if (el.dataset && el.dataset.exportIgnore === "true") return false;
        const cls = el.classList;
        if (cls?.contains("pointer-events-none")) return false;
        if (cls?.contains("export-ignore")) return false;
        return true;
      };

      const pixelRatio = Number(exportPrefs.scale) || 1;

      const dataUrl = await htmlToImage.toPng(node, {
        pixelRatio,
        backgroundColor: exportPrefs.transparent ? "transparent" : undefined,
        filter,
        // Fonts sometimes need a little time; cache bust helps in some setups:
        cacheBust: true,
      });

      const name = slugify(challenge.name || "challenge");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${name}@${pixelRatio}x.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Exported PNG.");
    } catch (e: any) {
      toast.error(e?.message || "Failed to export PNG.");
    } finally {
      setBusy(null);
      node.classList.remove("exporting");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
          <DialogDescription>
            Export as TOML or PNG (SVG coming soon).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="exp-hidden">Respect hidden sections</Label>
            <Switch
              id="exp-hidden"
              checked={exportPrefs.respectHidden}
              onCheckedChange={(v) => setExportPrefs({ respectHidden: !!v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="exp-auto">Auto-hide empty</Label>
            <Switch
              id="exp-auto"
              checked={exportPrefs.autoHideEmpty}
              onCheckedChange={(v) => setExportPrefs({ autoHideEmpty: !!v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="exp-transp">Transparent background (PNG)</Label>
            <Switch
              id="exp-transp"
              checked={exportPrefs.transparent}
              onCheckedChange={(v) => setExportPrefs({ transparent: !!v })}
            />
          </div>

          <div className="space-y-2">
            <Label>Scale</Label>
            <RadioGroup
              value={String(exportPrefs.scale)}
              onValueChange={(v) => setExportPrefs({ scale: Number(v) as any })}
              className="flex items-center gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="scale1" />
                <Label htmlFor="scale1">1×</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="scale2" />
                <Label htmlFor="scale2">2×</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="scale3" />
                <Label htmlFor="scale3">3×</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleExportTOML}
            disabled={busy !== null}
          >
            Export TOML
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyTOML}
            disabled={busy !== null}
          >
            Copy TOML
          </Button>
          <Button onClick={handleExportPNG} disabled={busy !== null}>
            Export PNG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
