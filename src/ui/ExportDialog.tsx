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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { snapdom, type CaptureResult } from "@zumer/snapdom";
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
  const [busy, setBusy] = useState<"png" | "svg" | "toml" | null>(null);
  const [tab, setTab] = useState<"toml" | "png" | "svg">("toml");

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

  function getSheetNode(): HTMLElement | null {
    return document.querySelector<HTMLElement>(".challenge-sheet");
  }

  async function handleExportPNG() {
    const node = getSheetNode();
    if (!node) {
      toast.error("Preview not found. Make sure the preview is visible.");
      return;
    }
    node.classList.add("exporting");
    try {
      setBusy("png");
      const pixelRatio = Number(exportPrefs.scale) || 1;
      const snap: CaptureResult = await snapdom(node, {
        scale: pixelRatio,
        embedFonts: true,
        backgroundColor: exportPrefs.transparent ? "transparent" : undefined,
      });
      const name = slugify(challenge.name || "challenge");
      await snap.download({
        filename: `${name}@${pixelRatio}x.png`,
        format: "png",
      });
      toast.success("Exported PNG.");
    } catch (e: any) {
      toast.error(e?.message || "Failed to export PNG.");
    } finally {
      setBusy(null);
      node.classList.remove("exporting");
    }
  }

  async function handleExportSVG() {
    const node = getSheetNode();
    if (!node) {
      toast.error("Preview not found. Make sure the preview is visible.");
      return;
    }
    node.classList.add("exporting");
    try {
      setBusy("svg");
      const pixelRatio = Number(exportPrefs.scale) || 1;
      const snap: CaptureResult = await snapdom(node, {
        scale: pixelRatio,
        embedFonts: true,
        backgroundColor: exportPrefs.transparent ? "transparent" : undefined,
      });
      const name = slugify(challenge.name || "challenge");
      await snap.download({
        filename: `${name}@${pixelRatio}x.svg`,
        format: "svg",
      });
      toast.success("Exported SVG.");
    } catch (e: any) {
      toast.error(e?.message || "Failed to export SVG.");
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
            Choose a format and options, then export your challenge.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as any)}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="toml">TOML</TabsTrigger>
            <TabsTrigger value="png">PNG</TabsTrigger>
            <TabsTrigger value="svg">SVG</TabsTrigger>
          </TabsList>

          {/* TOML */}
          <TabsContent value="toml">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Export your challenge data as TOML.</p>
              <p>No visual settings apply here.</p>
            </div>
            <DialogFooter className="mt-4 gap-2">
              <Button
                variant="outline"
                onClick={handleCopyTOML}
                disabled={busy !== null}
              >
                Copy TOML
              </Button>
              <Button onClick={handleExportTOML} disabled={busy !== null}>
                Export TOML
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* PNG */}
          <TabsContent value="png">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="exp-transp-png">Transparent background</Label>
                <Switch
                  id="exp-transp-png"
                  checked={exportPrefs.transparent}
                  onCheckedChange={(v) => setExportPrefs({ transparent: !!v })}
                />
              </div>
              <div className="space-y-2">
                <Label>Scale</Label>
                <RadioGroup
                  value={String(exportPrefs.scale)}
                  onValueChange={(v) =>
                    setExportPrefs({ scale: Number(v) as any })
                  }
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
            <DialogFooter className="mt-4">
              <Button onClick={handleExportPNG} disabled={busy !== null}>
                Export PNG
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* SVG */}
          <TabsContent value="svg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="exp-transp-svg">Transparent background</Label>
                <Switch
                  id="exp-transp-svg"
                  checked={exportPrefs.transparent}
                  onCheckedChange={(v) => setExportPrefs({ transparent: !!v })}
                />
              </div>
              <div className="space-y-2">
                <Label>Scale</Label>
                <RadioGroup
                  value={String(exportPrefs.scale)}
                  onValueChange={(v) =>
                    setExportPrefs({ scale: Number(v) as any })
                  }
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="scale1svg" />
                    <Label htmlFor="scale1svg">1×</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="scale2svg" />
                    <Label htmlFor="scale2svg">2×</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="scale3svg" />
                    <Label htmlFor="scale3svg">3×</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleExportSVG} disabled={busy !== null}>
                Export SVG
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
