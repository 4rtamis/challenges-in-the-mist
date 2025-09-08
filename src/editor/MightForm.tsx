// src/editor/MightForm.tsx
import { useState } from "react";
import {
  useChallengeStore,
  type Might,
  type MightLevel,
} from "../store/challengeStore";
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus, Shield } from "lucide-react";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const LEVELS: MightLevel[] = ["adventure", "greatness"];

function levelLabel(level: MightLevel) {
  return level === "adventure" ? "Adventure" : "Greatness";
}

function levelIcon(level: MightLevel, size = 16) {
  const src =
    level === "adventure"
      ? "/assets/images/might-adventure.svg"
      : "/assets/images/might-greatness.svg";
  return (
    // decorative, so aria-hidden
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      aria-hidden
      className="inline-block align-[-2px]"
    />
  );
}

export default function MightForm() {
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
    if (!m.name) {
      setError("Name is required.");
      return;
    }
    if (isDuplicate(m)) {
      setError("A Might with the same name and level already exists.");
      return;
    }
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
    if (!updated.name) {
      setError("Name is required.");
      return;
    }
    if (isDuplicate(updated, editingIndex)) {
      setError("A Might with the same name and level already exists.");
      return;
    }
    updateMightAt(editingIndex, updated);
    cancelEdit();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Might</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Create */}
        <div className="rounded-md border p-4 space-y-3">
          <div className="flex flex-wrap items-end gap-4">
            {/* Name */}
            <div className="flex-1 min-w-[220px] grid gap-2">
              <Label htmlFor="might-name">Name</Label>
              <Input
                id="might-name"
                placeholder="e.g., Size and strength"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Level segmented control (with icons) */}
            <div className="grid gap-2">
              <Label>Level</Label>
              <div className="inline-flex rounded-md border overflow-hidden">
                {LEVELS.map((lv) => (
                  <Button
                    key={lv}
                    type="button"
                    variant={level === lv ? "default" : "ghost"}
                    className="capitalize rounded-none inline-flex items-center gap-2"
                    onClick={() => setLevel(lv)}
                  >
                    {levelIcon(lv, 14)}
                    {levelLabel(lv)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Vulnerability (optional) */}
            <div className="grid gap-2">
              <Label htmlFor="might-vuln" className="flex items-center gap-1">
                <Shield size={14} /> Vulnerability
              </Label>
              <Input
                id="might-vuln"
                className="w-56"
                placeholder="(optional, e.g., flattery)"
                value={vulnerability}
                onChange={(e) => setVulnerability(e.target.value)}
              />
            </div>

            <Button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <p className="text-xs text-muted-foreground">
            Tip: A Vulnerability nullifies this Might (treated as Origin in that
            aspect).
          </p>
        </div>

        {/* List */}
        <ul className="space-y-2">
          {challenge.mights.map((m, idx) => (
            <li
              key={`${m.name}-${m.level}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
            >
              <div className="flex items-center gap-3 flex-wrap">
                {/* Icon + name */}
                <span className="inline-flex items-center gap-2">
                  {levelIcon(m.level, 16)}
                  <span className="text-sm font-medium">{m.name}</span>
                </span>

                <Badge variant="secondary" className="capitalize">
                  {levelLabel(m.level)}
                </Badge>

                {m.vulnerability ? (
                  <Badge variant="destructive">
                    Vulnerability: {m.vulnerability}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No vulnerability
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveMight(idx, Math.max(0, idx - 1))}
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
                    moveMight(
                      idx,
                      Math.min(challenge.mights.length - 1, idx + 1)
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
          <>
            <Separator />
            <div className="rounded-md border p-4 bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  Edit Might #{editingIndex + 1}
                </h4>
                <Button variant="link" className="h-8 p-0" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[220px] grid gap-2">
                  <Label htmlFor="edit-might-name">Name</Label>
                  <Input
                    id="edit-might-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Level</Label>
                  <div className="inline-flex rounded-md border overflow-hidden">
                    {LEVELS.map((lv) => (
                      <Button
                        key={lv}
                        type="button"
                        variant={editLevel === lv ? "default" : "ghost"}
                        className="capitalize rounded-none inline-flex items-center gap-2"
                        onClick={() => setEditLevel(lv)}
                      >
                        {levelIcon(lv, 14)}
                        {levelLabel(lv)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="edit-might-vuln"
                    className="flex items-center gap-1"
                  >
                    <Shield size={14} /> Vulnerability
                  </Label>
                  <Input
                    id="edit-might-vuln"
                    className="w-56"
                    value={editVulnerability}
                    onChange={(e) => setEditVulnerability(e.target.value)}
                  />
                </div>

                <Button onClick={confirmEdit}>Save</Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
