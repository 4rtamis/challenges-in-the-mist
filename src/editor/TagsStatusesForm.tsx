// src/editor/TagsStatusesForm.tsx
import { useEffect, useState } from "react";
import { useChallengeStore } from "@/store/challengeStore";
import { parseToken, ensureFormatted, tokensEqual } from "@/utils/tags";
import { renderLitmInline } from "@/utils/markdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react";

type Mode = "power" | "status" | "weakness";

export default function TagsStatusesForm({
  focusIndex,
}: {
  focusIndex?: number;
}) {
  const { challenge, addToken, removeTokenAt, replaceTokenAt, moveToken } =
    useChallengeStore();

  // Create state
  const [mode, setMode] = useState<Mode>("power");
  const [nameInput, setNameInput] = useState("");
  const [statusVal, setStatusVal] = useState(""); // "" or digits
  const [error, setError] = useState<string | null>(null);
  const [limitDetect, setLimitDetect] = useState<string | null>(null);

  // Edit state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<Mode>("power");
  const [editName, setEditName] = useState("");
  const [editStatusVal, setEditStatusVal] = useState("");

  // Focus a row when opened from preview
  useEffect(() => {
    if (
      typeof focusIndex === "number" &&
      challenge.tags_and_statuses[focusIndex]
    ) {
      startEdit(focusIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIndex]);

  function normalizeDigitsOnly(s: string) {
    return s.replace(/\D+/g, "");
  }

  function resetCreate() {
    setMode("power");
    setNameInput("");
    setStatusVal("");
    setError(null);
    setLimitDetect(null);
  }

  // Smart-paste: parse curly content and prefill fields
  function onSmartFillFromPaste(raw: string) {
    const p = parseToken(raw);
    if (!p) return;
    if (p.kind === "limit") {
      setLimitDetect(
        `That looks like a Limit (“${p.name}${p.value !== "" ? ":" + p.value : ":"}”). Please add it in the Limits section.`
      );
      setMode("power");
      setNameInput("");
      setStatusVal("");
      return;
    }
    setLimitDetect(null);
    if (p.kind === "weakness") {
      setMode("weakness");
      setNameInput(p.name);
      setStatusVal("");
    } else if (p.kind === "status") {
      setMode("status");
      setNameInput(p.name);
      setStatusVal(p.value ?? "");
    } else {
      setMode("power");
      setNameInput(p.name);
      setStatusVal("");
    }
  }

  function handleAdd() {
    setError(null);
    setLimitDetect(null);

    if (!nameInput.trim()) {
      setError("Enter a name.");
      return;
    }

    const cleanedVal = mode === "status" ? normalizeDigitsOnly(statusVal) : "";
    const token = ensureFormatted(nameInput, mode, cleanedVal);

    // Prevent adding limits here even if user typed/pasted them
    const parsed = parseToken(token);
    if (parsed?.kind === "limit") {
      setLimitDetect(
        `That looks like a Limit (“${parsed.name}${parsed.value !== "" ? ":" + parsed.value : ":"}”). Please add it in the Limits section.`
      );
      return;
    }

    const dup = challenge.tags_and_statuses.some((t) => tokensEqual(t, token));
    if (dup) {
      setError("Already added.");
      return;
    }

    addToken(token);
    resetCreate();
  }

  function startEdit(idx: number) {
    const token = challenge.tags_and_statuses[idx];
    const p = parseToken(token);
    if (!p) return;

    setEditingIndex(idx);
    if (p.kind === "weakness") {
      setEditMode("weakness");
      setEditName(p.name);
      setEditStatusVal("");
    } else if (p.kind === "status") {
      setEditMode("status");
      setEditName(p.name);
      setEditStatusVal(p.value ?? "");
    } else {
      setEditMode("power");
      setEditName(p.kind === "power" ? p.name : "");
      setEditStatusVal("");
    }
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditMode("power");
    setEditName("");
    setEditStatusVal("");
    setError(null);
  }

  function confirmEdit() {
    if (editingIndex == null) return;

    if (!editName.trim()) {
      setError("Enter a name.");
      return;
    }

    const cleanedVal =
      editMode === "status" ? normalizeDigitsOnly(editStatusVal) : "";
    const token = ensureFormatted(editName, editMode, cleanedVal);

    const parsed = parseToken(token);
    if (parsed?.kind === "limit") {
      setLimitDetect(
        `That looks like a Limit (“${parsed.name}${parsed.value !== "" ? ":" + parsed.value : ":"}”). Please move it to the Limits section.`
      );
      return;
    }

    const dup = challenge.tags_and_statuses.some(
      (t, i) => i !== editingIndex && tokensEqual(t, token)
    );
    if (dup) {
      setError("Duplicate after edit.");
      return;
    }

    replaceTokenAt(editingIndex, token);
    cancelEdit();
  }

  return (
    <div className="space-y-6">
      {/* Create */}
      <div className="rounded-md border p-4 space-y-3">
        {/* Mode selector */}
        <div className="grid gap-2">
          <Label className="text-sm">Type</Label>
          <div className="inline-flex rounded-md border overflow-hidden">
            {(["power", "status", "weakness"] as Mode[]).map((m) => (
              <Button
                key={m}
                type="button"
                variant={mode === m ? "default" : "ghost"}
                className={`rounded-none ${mode === m ? "" : "bg-white"}`}
                onClick={() => setMode(m)}
              >
                {m === "power" ? "Tag" : m[0].toUpperCase() + m.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Name + optional status value */}
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-1">
            <Label htmlFor="token-name">Name</Label>
            <Input
              id="token-name"
              placeholder={
                mode === "weakness"
                  ? "e.g., beguiled"
                  : mode === "status"
                    ? "e.g., not-listening"
                    : "e.g., sharp broken tools"
              }
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                if (pasted?.includes("{")) {
                  setTimeout(() => onSmartFillFromPaste(pasted), 0);
                }
              }}
            />
          </div>

          {mode === "status" && (
            <div className="grid gap-1">
              <Label htmlFor="token-status-val">Value (optional)</Label>
              <Input
                id="token-status-val"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder=""
                className="w-[110px]"
                value={statusVal}
                onChange={(e) =>
                  setStatusVal(normalizeDigitsOnly(e.target.value))
                }
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {limitDetect && (
          <p className="text-sm text-amber-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {limitDetect}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Tips: paste tokens like <code>{"{!beguiled}"}</code>,{" "}
          <code>{"{not-listening-3}"}</code>, <code>{"{status-}"}</code> or{" "}
          <code>{"{sharp tools}"}</code>. Status value can be empty; typical
          scene entries are 1–4.
        </p>

        <div>
          <Button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {challenge.tags_and_statuses.map((token, idx) => {
          const parsed = parseToken(token);
          const kind = parsed?.kind ?? "power";

          return (
            <li
              key={`${token}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
            >
              <div className="min-w-0">
                {/* Render with your inline renderer for consistency */}
                <span
                  className="prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderLitmInline(token) }}
                />
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveToken(idx, Math.max(0, idx - 1))}
                  title="Move up"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    moveToken(
                      idx,
                      Math.min(challenge.tags_and_statuses.length - 1, idx + 1)
                    )
                  }
                  title="Move down"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startEdit(idx)}
                  title="Edit"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeTokenAt(idx)}
                  title="Remove"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Inline editor */}
      {editingIndex != null && (
        <div className="rounded-md border p-3 space-y-3 bg-muted/30">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-semibold">Edit Token #{editingIndex + 1}</h4>
            <Button variant="link" className="h-8 p-0" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>

          <div className="grid gap-3">
            {/* Mode selector */}
            <div className="inline-flex rounded-md border overflow-hidden w-fit">
              {(["power", "status", "weakness"] as Mode[]).map((m) => (
                <Button
                  key={m}
                  type="button"
                  variant={editMode === m ? "default" : "ghost"}
                  className={`rounded-none ${editMode === m ? "" : "bg-white"}`}
                  onClick={() => setEditMode(m)}
                >
                  {m === "power" ? "Tag" : m[0].toUpperCase() + m.slice(1)}
                </Button>
              ))}
            </div>

            {/* Name + optional status value */}
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <Input
                className="min-w-[220px]"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              {editMode === "status" && (
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-[110px]"
                  value={editStatusVal}
                  onChange={(e) =>
                    setEditStatusVal(normalizeDigitsOnly(e.target.value))
                  }
                />
              )}
            </div>

            <div>
              <Button onClick={confirmEdit}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
