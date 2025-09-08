// src/editor/LimitsForm.tsx
import { useState } from "react";
import { useChallengeStore, type Limit } from "../store/challengeStore";
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus, Info } from "lucide-react";

// shadcn/ui
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";

const PRESET_LIMITS = ["Destroy", "Banish", "Overwhelm", "Convince", "Free"];

export default function LimitsForm() {
  const { challenge, addLimit, updateLimitAt, removeLimitAt, moveLimit } =
    useChallengeStore();

  // Create state
  const [name, setName] = useState("");
  const [level, setLevel] = useState(4);
  const [isImmune, setIsImmune] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [onMax, setOnMax] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [eName, setEName] = useState("");
  const [eLevel, setELevel] = useState(4);
  const [eImmune, setEImmune] = useState(false);
  const [eProgress, setEProgress] = useState(false);
  const [eOnMax, setEOnMax] = useState("");

  function isDuplicateName(nm: string, except?: number) {
    const target = nm.trim().toLowerCase();
    return challenge.limits.some(
      (l, i) => i !== except && l.name.trim().toLowerCase() === target
    );
  }

  function resetCreate() {
    setName("");
    setLevel(4);
    setIsImmune(false);
    setIsProgress(false);
    setOnMax("");
    setError(null);
  }

  function handleAdd() {
    setError(null);
    const nm = name.trim();
    if (!nm) return setError("Name is required.");
    if (isDuplicateName(nm)) return setError("Limit name already exists.");

    const limit: Limit = {
      name: nm,
      level: Math.max(1, Math.min(6, Number(level) || 1)),
      is_immune: isImmune,
      is_progress: isProgress,
      on_max: isProgress ? onMax.trim() || null : null,
    };
    addLimit(limit);
    resetCreate();
  }

  function addPreset(nm: string) {
    setName(nm);
  }

  function startEdit(idx: number) {
    const l = challenge.limits[idx];
    if (!l) return;
    setEditingIndex(idx);
    setEName(l.name);
    setELevel(l.level);
    setEImmune(!!l.is_immune);
    setEProgress(!!l.is_progress);
    setEOnMax(l.on_max ?? "");
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEName("");
    setELevel(4);
    setEImmune(false);
    setEProgress(false);
    setEOnMax("");
    setError(null);
  }

  function confirmEdit() {
    if (editingIndex == null) return;
    const nm = eName.trim();
    if (!nm) return setError("Name is required.");
    if (isDuplicateName(nm, editingIndex))
      return setError("Limit name already exists.");

    updateLimitAt(editingIndex, {
      name: nm,
      level: Math.max(1, Math.min(6, Number(eLevel) || 1)),
      is_immune: eImmune,
      is_progress: eProgress,
      on_max: eProgress ? eOnMax.trim() || null : null,
    });
    cancelEdit();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Limits</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Create row */}
        <div className="space-y-3 rounded-md border p-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Name */}
            <div className="min-w-[220px] flex-1 grid gap-2">
              <Label htmlFor="limit-name">Name</Label>
              <Input
                id="limit-name"
                placeholder="e.g., Destroy"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Level */}
            <div className="grid gap-2">
              <Label htmlFor="limit-level">Level</Label>
              <Input
                id="limit-level"
                type="number"
                min={1}
                max={6}
                className="w-20"
                value={level}
                onChange={(e) =>
                  setLevel(
                    Math.max(1, Math.min(6, Number(e.target.value) || 1))
                  )
                }
                disabled={isImmune}
                title={isImmune ? "Ignored when immune" : "1–6"}
              />
            </div>

            {/* Immune */}
            <div className="grid gap-1">
              <Label className="text-sm">Immune</Label>
              <div className="flex items-center gap-2">
                <Switch checked={isImmune} onCheckedChange={setIsImmune} />
              </div>
            </div>

            {/* Progress */}
            <div className="grid gap-1">
              <Label className="text-sm">Progress limit</Label>
              <div className="flex items-center gap-2">
                <Switch checked={isProgress} onCheckedChange={setIsProgress} />
              </div>
            </div>

            <Button
              onClick={handleAdd}
              className="inline-flex items-center gap-1"
            >
              <Plus size={16} />
              Add
            </Button>
          </div>

          {/* On max (only if progress) */}
          {isProgress && (
            <div className="flex items-start gap-2">
              <div className="pt-1 text-muted-foreground">
                <Info size={16} />
              </div>
              <div className="flex-1 grid gap-2">
                <Label htmlFor="limit-onmax">On max</Label>
                <Textarea
                  id="limit-onmax"
                  rows={2}
                  placeholder="When this progress limit is maxed, what happens?"
                  value={onMax}
                  onChange={(e) => setOnMax(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {PRESET_LIMITS.map((p) => (
              <Button
                key={p}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addPreset(p)}
                title="Quick fill name"
              >
                {p}
              </Button>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <p className="text-xs text-muted-foreground">
            Tip: Immunities are limits with no maximum (displayed as “—” in
            print). Progress limits build toward an outcome—describe that
            outcome in “On max”.
          </p>
        </div>

        {/* Existing limits list */}
        <ul className="space-y-2">
          {challenge.limits.map((l, idx) => (
            <li
              key={`${l.name}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium">{l.name}</span>

                {l.is_immune ? (
                  <Badge variant="destructive">Immune</Badge>
                ) : (
                  <Badge variant="secondary">Level {l.level}</Badge>
                )}

                {l.is_progress && <Badge variant="outline">Progress</Badge>}

                {l.is_progress && l.on_max && (
                  <span className="text-xs text-muted-foreground">
                    On max: <em>{l.on_max}</em>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveLimit(idx, Math.max(0, idx - 1))}
                  title="Move up"
                >
                  <ArrowUp size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    moveLimit(
                      idx,
                      Math.min(challenge.limits.length - 1, idx + 1)
                    )
                  }
                  title="Move down"
                >
                  <ArrowDown size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startEdit(idx)}
                  title="Edit"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeLimitAt(idx)}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {/* Inline editor */}
        {editingIndex != null && (
          <>
            <Separator />
            <div className="rounded-md border p-4 bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  Edit Limit #{editingIndex + 1}
                </h4>
                <Button variant="link" className="h-8 p-0" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div className="min-w-[220px] flex-1 grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={eName}
                    onChange={(e) => setEName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-level">Level</Label>
                  <Input
                    id="edit-level"
                    type="number"
                    min={1}
                    max={6}
                    className="w-20"
                    value={eLevel}
                    onChange={(e) =>
                      setELevel(
                        Math.max(1, Math.min(6, Number(e.target.value) || 1))
                      )
                    }
                    disabled={eImmune}
                    title={eImmune ? "Ignored when immune" : "1–6"}
                  />
                </div>

                <div className="grid gap-1">
                  <Label className="text-sm">Immune</Label>
                  <Switch checked={eImmune} onCheckedChange={setEImmune} />
                </div>

                <div className="grid gap-1">
                  <Label className="text-sm">Progress limit</Label>
                  <Switch checked={eProgress} onCheckedChange={setEProgress} />
                </div>

                <Button onClick={confirmEdit}>Save</Button>
              </div>

              {eProgress && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-onmax">On max</Label>
                  <Textarea
                    id="edit-onmax"
                    rows={2}
                    placeholder="When this progress limit is maxed, what happens?"
                    value={eOnMax}
                    onChange={(ev) => setEOnMax(ev.target.value)}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
