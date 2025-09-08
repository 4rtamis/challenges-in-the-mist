// src/editor/MetaForm.tsx
import { useChallengeStore } from "@/store/challengeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function MetaForm() {
  const { challenge, updateMeta } = useChallengeStore();
  const m = challenge.meta ?? {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-1">
          <Label htmlFor="meta-sourcebook">Sourcebook</Label>
          <Input
            id="meta-sourcebook"
            value={m.sourcebook ?? ""}
            onChange={(e) => updateMeta({ sourcebook: e.target.value })}
            placeholder="e.g., Legend in the Mist Core"
          />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="meta-chapter">Chapter</Label>
          <Input
            id="meta-chapter"
            value={m.chapter ?? ""}
            onChange={(e) => updateMeta({ chapter: e.target.value })}
            placeholder="e.g., Chapter 6"
          />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="meta-page">Page</Label>
          <Input
            id="meta-page"
            type="number"
            min={1}
            value={m.page ?? ""}
            onChange={(e) =>
              updateMeta({
                page: e.target.value
                  ? Math.max(1, Math.floor(+e.target.value))
                  : undefined,
              })
            }
            placeholder="e.g., 142"
          />
        </div>

        <div className="flex items-center gap-3 pt-6 sm:pt-[unset]">
          <Switch
            id="meta-official"
            checked={!!m.is_official}
            onCheckedChange={(v) => updateMeta({ is_official: !!v })}
          />
          <Label htmlFor="meta-official">Official</Label>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Meta is optional and used for attribution/search. It’s preserved on
        import/export.
      </p>
    </div>
  );
}
