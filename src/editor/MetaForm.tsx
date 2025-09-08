// src/editor/MetaForm.tsx
import { useChallengeStore } from "../store/challengeStore";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function MetaForm() {
  const { challenge, updateMeta } = useChallengeStore();
  const m = challenge.meta ?? {};

  function handlePageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (!raw) {
      updateMeta({ page: undefined });
      return;
    }
    const n = Math.max(1, Math.floor(Number(raw) || 1));
    updateMeta({ page: n });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sourcebook */}
          <div className="grid gap-2">
            <Label htmlFor="meta-sourcebook">Sourcebook</Label>
            <Input
              id="meta-sourcebook"
              value={m.sourcebook ?? ""}
              onChange={(e) => updateMeta({ sourcebook: e.target.value })}
              placeholder="Core Book"
            />
          </div>

          {/* Chapter */}
          <div className="grid gap-2">
            <Label htmlFor="meta-chapter">Chapter</Label>
            <Input
              id="meta-chapter"
              value={m.chapter ?? ""}
              onChange={(e) => updateMeta({ chapter: e.target.value })}
              placeholder="Chapter 6"
            />
          </div>

          {/* Page */}
          <div className="grid gap-2">
            <Label htmlFor="meta-page">Page</Label>
            <Input
              id="meta-page"
              type="number"
              min={1}
              value={m.page ?? ""}
              onChange={handlePageChange}
              className="w-32"
              placeholder="12"
            />
          </div>

          {/* Official */}
          <div className="grid gap-2">
            <Label className="text-sm">Official</Label>
            <div className="flex items-center gap-2">
              <Switch
                id="meta-official"
                checked={!!m.is_official}
                onCheckedChange={(checked) =>
                  updateMeta({ is_official: checked })
                }
              />
              <Label
                htmlFor="meta-official"
                className="font-normal text-muted-foreground"
              >
                Mark this challenge as official
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        <p className="text-xs text-muted-foreground">
          Tip: Meta is optional and used for attribution/search. It's preserved
          on import/export.
        </p>
      </CardContent>
    </Card>
  );
}
