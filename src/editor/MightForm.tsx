// src/editor/MightForm.tsx
import { useEffect, useState } from "react";
import {
  useChallengeStore,
  type Might,
  type MightLevel,
} from "@/store/challengeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, Shield } from "lucide-react";

const LEVELS: MightLevel[] = ["adventure", "greatness"];
const levelLabel = (l: MightLevel) =>
  l === "adventure" ? "Adventure" : "Greatness";

export default function MightForm({ focusIndex }: { focusIndex?: number }) {
  const { challenge, addMight, updateMightAt, removeMightAt, moveMight } =
    useChallengeStore();

  // create state
  const [name, setName] = useState("");
  const [level, setLevel] = useState<MightLevel>("adventure");
  const [vulnerability, setVulnerability] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // edit state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editLevel, setEditLevel] = useState<MightLevel>("adventure");
  const [editVulnerability, setEditVulnerability] = useState<string>("");

  useEffect(() => {
    if (typeof focusIndex === "number" && challenge.mights[focusIndex]) {
      startEdit(focusIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIndex]);

  function resetCreate() {
    setName("");
    setLevel("adventure");
    setVulnerability("");
    setError(null);
  }

  function isDuplicate(candidate: Might, exceptIndex?: number) {
    return challenge.mights.some((m, i) => {
      if (i === exceptIndex) return false;
      return (
        m.name.trim().toLowerCase() === candidate.name.trim().toLowerCase() &&
        m.level === candidate.level
      );
    });
  }

  function handleAdd() {
    setError(null);
    const m: Might = {
      name: name.trim(),
      level,
      vulnerability: vulnerability.trim() || null,
    };
    if (!m.name) return setError("Name is required.");
    if (isDuplicate(m))
      return setError("A Might with that name and level already exists.");
    addMight(m);
    resetCreate();
  }

  function startEdit(idx: number) {
    const m = challenge.mights[idx];
    if (!m) return;
    setEditingIndex(idx);
    setEditName(m.name);
    setEditLevel(m.level);
    setEditVulnerability(m.vulnerability ?? "");
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditName("");
    setEditLevel("adventure");
    setEditVulnerability("");
    setError(null);
  }

  function confirmEdit() {
    if (editingIndex == null) return;
    const updated: Might = {
      name: editName.trim(),
      level: editLevel,
      vulnerability: editVulnerability.trim() || null,
    };
    if (!updated.name) return setError("Name is required.");
    if (isDuplicate(updated, editingIndex))
      return setError("A Might with that name and level already exists.");
    updateMightAt(editingIndex, updated);
    cancelEdit();
  }

  return (
    <div className="space-y-6">
      {/* Create */}
      <div className="rounded-md border p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
          {/* Name */}
          <div className="grid gap-1">
            <Label htmlFor="might-name">Name</Label>
            <Input
              id="might-name"
              placeholder="e.g., Size and strength"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Level segmented */}
          <div className="grid gap-1">
            <Label className="invisible md:visible">Level</Label>
            <div className="inline-flex rounded-md border overflow-hidden">
              {LEVELS.map((lv) => (
                <Button
                  key={lv}
                  type="button"
                  variant={level === lv ? "default" : "ghost"}
                  className={`rounded-none ${level === lv ? "" : "bg-white"}`}
                  onClick={() => setLevel(lv)}
                >
                  {levelLabel(lv)}
                </Button>
              ))}
            </div>
          </div>

          {/* Vulnerability */}
          <div className="grid gap-1">
            <Label
              htmlFor="might-vulnerability"
              className="flex items-center gap-1"
            >
              <Shield className="h-4 w-4" /> Vulnerability (optional)
            </Label>
            <Input
              id="might-vulnerability"
              placeholder="e.g., flattery"
              value={vulnerability}
              onChange={(e) => setVulnerability(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <p className="text-xs text-muted-foreground">
          A Vulnerability nullifies this Might in that aspect (treated as
          Origin).
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
        {challenge.mights.map((m, idx) => (
          <li
            key={`${m.name}-${m.level}-${idx}`}
            className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
          >
            <div className="flex items-center gap-3 flex-wrap min-w-0">
              <span className="text-sm font-medium truncate">{m.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 capitalize">
                {levelLabel(m.level)}
              </span>
              {m.vulnerability ? (
                <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 truncate">
                  Vulnerability: {m.vulnerability}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No vulnerability
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => moveMight(idx, Math.max(0, idx - 1))}
                title="Move up"
              >
                <ArrowUp size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  moveMight(idx, Math.min(challenge.mights.length - 1, idx + 1))
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
                onClick={() => removeMightAt(idx)}
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
            <h4 className="font-semibold">Edit Might #{editingIndex + 1}</h4>
            <Button variant="link" className="h-8 p-0" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <Input
              className="min-w-[220px]"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <div className="inline-flex rounded-md border overflow-hidden w-fit">
              {LEVELS.map((lv) => (
                <Button
                  key={lv}
                  type="button"
                  variant={editLevel === lv ? "default" : "ghost"}
                  className={`rounded-none ${editLevel === lv ? "" : "bg-white"}`}
                  onClick={() => setEditLevel(lv)}
                >
                  {levelLabel(lv)}
                </Button>
              ))}
            </div>

            <Input
              placeholder="Vulnerability (optional)"
              value={editVulnerability}
              onChange={(e) => setEditVulnerability(e.target.value)}
            />
          </div>

          <Button onClick={confirmEdit}>Save</Button>
        </div>
      )}
    </div>
  );
}
