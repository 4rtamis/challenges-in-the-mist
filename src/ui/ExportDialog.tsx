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

export default function ExportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { exportPrefs, setExportPrefs } = useUIStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
          <DialogDescription>
            Export as TOML, PNG, or SVG (coming soon).
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
            <Label htmlFor="exp-transp">Transparent background (PNG/SVG)</Label>
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

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => toast("Export TOML: wired elsewhere.")}
          >
            Export TOML
          </Button>
          <Button onClick={() => toast("PNG/SVG export coming soon ✨")}>
            Export PNG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
