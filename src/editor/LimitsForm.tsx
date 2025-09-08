// src/editor/LimitsForm.tsx
import { useEffect, useState } from "react";
import { useChallengeStore, type Limit } from "@/store/challengeStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, Info } from "lucide-react";

const PRESET_LIMITS = ["Destroy", "Banish", "Overwhelm", "Convince", "Free"];

export default function LimitsForm({ focusIndex }: { focusIndex?: number }) {
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

  useEffect(() => {
    if (typeof focusIndex === "number" && challenge.limits[focusIndex]) {
      startEdit(focusIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIndex]);

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
    <div className="space-y-6">
      {/* Create */}
      <div className="rounded-md border p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
          {/* Name */}
          <div className="grid gap-1">
            <Label htmlFor="limit-name">Name</Label>
            <Input
              id="limit-name"
              placeholder="e.g., Destroy"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Level */}
          <div className="grid gap-1">
            <Label htmlFor="limit-level">Level</Label>
            <Input
              id="limit-level"
              type="number"
              min={1}
              max={6}
              className="w-[92px]"
              value={level}
              onChange={(e) =>
                setLevel(Math.max(1, Math.min(6, Number(e.target.value) || 1)))
              }
              disabled={isImmune}
              title={isImmune ? "Ignored when immune" : "1–6"}
            />
          </div>

          {/* Immune toggle */}
          <div className="flex items-center gap-2 pt-5 md:pt-0">
            <Switch
              checked={isImmune}
              onCheckedChange={(v) => setIsImmune(!!v)}
              id="limit-immune"
            />
            <Label htmlFor="limit-immune" className="text-sm">
              Immune
            </Label>
          </div>

          {/* Progress toggle */}
          <div className="flex items-center gap-2 pt-5 md:pt-0">
            <Switch
              checked={isProgress}
              onCheckedChange={(v) => setIsProgress(!!v)}
              id="limit-progress"
            />
            <Label htmlFor="limit-progress" className="text-sm">
              Progress limit
            </Label>
          </div>
        </div>

        {/* On max (only if progress) */}
        {isProgress && (
          <div className="grid gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>When this progress limit is maxed, what happens?</span>
            </div>
            <Textarea
              rows={2}
              placeholder="e.g., The portal fully opens and the room floods with ash."
              value={onMax}
              onChange={(e) => setOnMax(e.target.value)}
            />
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
          Immunities are limits with no maximum (displayed as “—”). Progress
          limits build toward an outcome—describe that outcome in “On max”.
        </p>

        <div>
          <Button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </Button>
        </div>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {challenge.limits.map((l, idx) => (
          <li
            key={`${l.name}-${idx}`}
            className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
          >
            <div className="flex items-center gap-3 flex-wrap min-w-0">
              <span className="text-sm font-medium truncate">{l.name}</span>

              {l.is_immune ? (
                <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  Immune
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                  Level {l.level}
                </span>
              )}

              {l.is_progress && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Progress
                </span>
              )}

              {l.is_progress && l.on_max && (
                <span className="text-xs text-muted-foreground truncate">
                  On max: <em>{l.on_max}</em>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => moveLimit(idx, Math.max(0, idx - 1))}
                title="Move up"
              >
                <ArrowUp size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  moveLimit(idx, Math.min(challenge.limits.length - 1, idx + 1))
                }
                title="Move down"
              >
                <ArrowDown size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => startEdit(idx)}
                title="Edit"
              >
                <Pencil size={16} />
              </Button>
              <Button
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
        <div className="rounded-md border p-3 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Edit Limit #{editingIndex + 1}</h4>
            <Button variant="link" className="h-8 p-0" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
            <Input
              className="min-w-[220px]"
              value={eName}
              onChange={(e) => setEName(e.target.value)}
            />

            <div className="grid gap-1">
              <Label htmlFor="limit-level-edit">Level</Label>
              <Input
                id="limit-level-edit"
                type="number"
                min={1}
                max={6}
                className="w-[92px]"
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

            <div className="flex items-center gap-2 pt-5 md:pt-0">
              <Switch
                checked={eImmune}
                onCheckedChange={(v) => setEImmune(!!v)}
                id="limit-immune-edit"
              />
              <Label htmlFor="limit-immune-edit" className="text-sm">
                Immune
              </Label>
            </div>

            <div className="flex items-center gap-2 pt-5 md:pt-0">
              <Switch
                checked={eProgress}
                onCheckedChange={(v) => setEProgress(!!v)}
                id="limit-progress-edit"
              />
              <Label htmlFor="limit-progress-edit" className="text-sm">
                Progress limit
              </Label>
            </div>
          </div>

          {eProgress && (
            <Textarea
              rows={2}
              placeholder="When this progress limit is maxed…"
              value={eOnMax}
              onChange={(ev) => setEOnMax(ev.target.value)}
            />
          )}

          <Button onClick={confirmEdit}>Save</Button>
        </div>
      )}
    </div>
  );
}
