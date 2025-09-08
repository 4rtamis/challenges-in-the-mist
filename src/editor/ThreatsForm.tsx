// src/editor/ThreatsForm.tsx
import { useEffect, useState } from "react";
import { useChallengeStore, type Threat } from "../store/challengeStore";
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { renderLitmMarkdown } from "../utils/markdown";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  variant?: "card" | "bare";
  focusIndex?: number;
};

export default function ThreatsForm({ variant = "card", focusIndex }: Props) {
  const {
    challenge,
    addThreat,
    updateThreatAt,
    removeThreatAt,
    moveThreat,
    addConsequence,
    updateConsequence,
    removeConsequence,
    moveConsequence,
    addGeneralConsequence,
    updateGeneralConsequence,
    removeGeneralConsequence,
    moveGeneralConsequence,
  } = useChallengeStore();

  // --- Create Threat state ---
  const [tName, setTName] = useState("");
  const [tDesc, setTDesc] = useState("");
  const [tErr, setTErr] = useState<string | null>(null);

  // --- Edit Threat state ---
  const [editingTIndex, setEditingTIndex] = useState<number | null>(null);
  const [eName, setEName] = useState("");
  const [eDesc, setEDesc] = useState("");

  // --- Create Consequence under a Threat ---
  const [cNew, setCNew] = useState<Record<number, string>>({}); // keyed by threat index

  // --- General consequences create ---
  const [gcNew, setGcNew] = useState("");
  const [gcErr, setGcErr] = useState<string | null>(null);

  // Auto-open editing row when Sheet opens with focusIndex
  useEffect(() => {
    if (typeof focusIndex === "number" && challenge.threats[focusIndex]) {
      startEditThreat(focusIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIndex]);

  function resetCreateThreat() {
    setTName("");
    setTDesc("");
    setTErr(null);
  }

  function handleAddThreat() {
    setTErr(null);
    const name = tName.trim();
    if (!name) return setTErr("Threat name is required.");
    const t: Threat = { name, description: tDesc.trim(), consequences: [] };
    addThreat(t);
    resetCreateThreat();
  }

  function startEditThreat(idx: number) {
    const t = challenge.threats[idx];
    if (!t) return;
    setEditingTIndex(idx);
    setEName(t.name);
    setEDesc(t.description || "");
  }

  function cancelEditThreat() {
    setEditingTIndex(null);
    setEName("");
    setEDesc("");
    setTErr(null);
  }

  function confirmEditThreat() {
    if (editingTIndex == null) return;
    const name = eName.trim();
    if (!name) return setTErr("Threat name is required.");
    updateThreatAt(editingTIndex, { name, description: eDesc.trim() });
    cancelEditThreat();
  }

  function handleAddConsequence(tIdx: number) {
    const text = (cNew[tIdx] ?? "").trim();
    if (!text) return;
    addConsequence(tIdx, text);
    setCNew((s) => ({ ...s, [tIdx]: "" }));
  }

  function handleAddGeneralConsequence() {
    setGcErr(null);
    const text = gcNew.trim();
    if (!text) return setGcErr("Write a consequence first.");
    addGeneralConsequence(text);
    setGcNew("");
  }

  const Body = (
    <div className="space-y-6">
      {/* Create Threat */}
      <div className="rounded-md border p-4 space-y-3">
        <div className="grid gap-2">
          <Label htmlFor="threat-name">Threat name</Label>
          <Input
            id="threat-name"
            placeholder="e.g., Swallow"
            value={tName}
            onChange={(e) => setTName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="threat-desc">Short description</Label>
          <Textarea
            id="threat-desc"
            rows={2}
            placeholder="What the challenge starts to do (Markdown + tokens supported)"
            value={tDesc}
            onChange={(e) => setTDesc(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleAddThreat}
            className="inline-flex items-center gap-1"
          >
            <Plus size={16} /> Add threat
          </Button>
          {tErr && <p className="text-sm text-destructive">{tErr}</p>}
        </div>
        <p className="text-xs text-muted-foreground">
          Threat: what the Challenge is starting to do. If ignored (or on
          Consequences), apply one or more related Consequences.
        </p>
      </div>

      {/* Threats list */}
      <ul className="space-y-4">
        {challenge.threats.map((t, tIdx) => (
          <li
            key={`${t.name}-${tIdx}`}
            className="rounded-md border p-4 space-y-3"
          >
            {/* Threat header row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold">{t.name}</div>
                {t.description && (
                  <div
                    className="text-sm text-foreground/80 prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderLitmMarkdown(t.description),
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveThreat(tIdx, Math.max(0, tIdx - 1))}
                  title="Move up"
                >
                  <ArrowUp size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    moveThreat(
                      tIdx,
                      Math.min(challenge.threats.length - 1, tIdx + 1)
                    )
                  }
                  title="Move down"
                >
                  <ArrowDown size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startEditThreat(tIdx)}
                  title="Edit"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeThreatAt(tIdx)}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            {/* Inline editor for a threat */}
            {editingTIndex === tIdx && (
              <div className="rounded-md border p-3 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Edit Threat #{tIdx + 1}</h4>
                  <Button
                    variant="link"
                    className="h-8 p-0"
                    onClick={cancelEditThreat}
                  >
                    Cancel
                  </Button>
                </div>
                <Input
                  className="w-full"
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                />
                <Textarea
                  rows={2}
                  value={eDesc}
                  onChange={(e) => setEDesc(e.target.value)}
                />
                <Button onClick={confirmEditThreat}>Save</Button>
              </div>
            )}

            {/* Consequences list for this threat */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Consequences</div>
              <ul className="space-y-2">
                {t.consequences.map((c, cIdx) => (
                  <ConsequenceRow
                    key={`${tIdx}-${cIdx}`}
                    text={c}
                    onMoveUp={() =>
                      moveConsequence(tIdx, cIdx, Math.max(0, cIdx - 1))
                    }
                    onMoveDown={() =>
                      moveConsequence(
                        tIdx,
                        cIdx,
                        Math.min(t.consequences.length - 1, cIdx + 1)
                      )
                    }
                    onDelete={() => removeConsequence(tIdx, cIdx)}
                    onSave={(val) => updateConsequence(tIdx, cIdx, val)}
                  />
                ))}
              </ul>

              {/* Add consequence */}
              <div className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  placeholder='e.g., "Pull a grabbed victim into its maw ({crushed-4})"'
                  value={cNew[tIdx] ?? ""}
                  onChange={(e) =>
                    setCNew((s) => ({
                      ...s,
                      [tIdx]: (e.target as HTMLInputElement).value,
                    }))
                  }
                />
                <Button
                  type="button"
                  onClick={() => handleAddConsequence(tIdx)}
                  className="inline-flex items-center gap-1"
                >
                  <Plus size={16} /> Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                You can use tokens like <code>{"{delirious-3}"}</code>,{" "}
                <code>{"{grabbed-4}"}</code>, or phrases like “scratch a tag”.
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* General (floating) Consequences */}
      <div className="rounded-md border p-4 space-y-3">
        <div className="text-base font-semibold">
          General Consequences (no specific Threat)
        </div>

        <ul className="space-y-2">
          {challenge.general_consequences.map((c, idx) => (
            <ConsequenceRow
              key={`gc-${idx}`}
              text={c}
              onMoveUp={() => moveGeneralConsequence(idx, Math.max(0, idx - 1))}
              onMoveDown={() =>
                moveGeneralConsequence(
                  idx,
                  Math.min(challenge.general_consequences.length - 1, idx + 1)
                )
              }
              onDelete={() => removeGeneralConsequence(idx)}
              onSave={(val) => updateGeneralConsequence(idx, val)}
            />
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder='e.g., "The poison spreads ({poisoned+2})"'
            value={gcNew}
            onChange={(e) => setGcNew(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleAddGeneralConsequence}
            className="inline-flex items-center gap-1"
          >
            <Plus size={16} /> Add general consequence
          </Button>
          {gcErr && <p className="text-sm text-destructive">{gcErr}</p>}
        </div>
      </div>

      <Separator />
    </div>
  );

  if (variant === "bare") {
    // No Card wrapper, tighter spacing – used inside Sheet
    return <div className="space-y-6">{Body}</div>;
  }

  // Default Card wrapper (for any other page using the form)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Threats &amp; Consequences</CardTitle>
      </CardHeader>
      <CardContent className="p-0">{Body}</CardContent>
    </Card>
  );
}

/* --- Small reusable row with inline edit (shadcn) --- */
function ConsequenceRow({
  text,
  onMoveUp,
  onMoveDown,
  onDelete,
  onSave,
}: {
  text: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onSave: (val: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(text);

  return (
    <li className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
      {editing ? (
        <Input
          className="flex-1"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      ) : (
        <div
          className="flex-1 prose-sm max-w-none text-foreground/90"
          dangerouslySetInnerHTML={{ __html: renderLitmMarkdown(text) }}
        />
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onMoveUp}
          title="Move up"
        >
          <ArrowUp size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onMoveDown}
          title="Move down"
        >
          <ArrowDown size={16} />
        </Button>
        {editing ? (
          <Button
            size="sm"
            onClick={() => {
              onSave(val.trim());
              setEditing(false);
            }}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setEditing(true)}
            title="Edit"
          >
            <Pencil size={16} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={onDelete}
          title="Remove"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
}
