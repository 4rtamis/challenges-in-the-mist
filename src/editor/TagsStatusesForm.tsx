// src/editor/TagsStatusesForm.tsx
import { useState } from "react";
import { useChallengeStore } from "../store/challengeStore";
import { parseToken, ensureFormatted, tokensEqual } from "../utils/tags";
import { renderLitmInline } from "../utils/markdown";
import {
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

type Mode = "power" | "status" | "weakness";

export default function TagsStatusesForm() {
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

  function resetCreate() {
    setMode("power");
    setNameInput("");
    setStatusVal("");
    setError(null);
    setLimitDetect(null);
  }

  function normalizeDigitsOnly(s: string) {
    return s.replace(/\D+/g, "");
  }

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

    // Prevent adding limits here even if user typed "{name:3}"
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
    <Card>
      <CardHeader>
        <CardTitle>Tags &amp; Statuses</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Create */}
        <div className="rounded-md border p-4 space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            {/* Mode selector */}
            <div className="inline-flex rounded-md border overflow-hidden">
              {(["power", "status", "weakness"] as Mode[]).map((m) => (
                <Button
                  key={m}
                  type="button"
                  variant={mode === m ? "default" : "ghost"}
                  className="capitalize rounded-none"
                  onClick={() => setMode(m)}
                >
                  {m === "power" ? "Tag" : m}
                </Button>
              ))}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-[220px] grid gap-2">
              <Label htmlFor="ts-name">
                {mode === "weakness"
                  ? "Weakness"
                  : mode === "status"
                    ? "Status name"
                    : "Tag"}
              </Label>
              <Input
                id="ts-name"
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

            {/* Status value (digits or empty) */}
            {mode === "status" && (
              <div className="grid gap-2">
                <Label htmlFor="ts-value">Value</Label>
                <Input
                  id="ts-value"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-20"
                  placeholder=""
                  value={statusVal}
                  onChange={(e) =>
                    setStatusVal(normalizeDigitsOnly(e.target.value))
                  }
                />
              </div>
            )}

            <Button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1"
            >
              <Plus size={16} />
              Add
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {limitDetect && (
            <Alert variant="default" className="py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Looks like a Limit</AlertTitle>
              <AlertDescription>{limitDetect}</AlertDescription>
            </Alert>
          )}

          <p className="text-xs text-muted-foreground">
            Tips: paste tokens like <code>{"{!beguiled}"}</code>,{" "}
            <code>{"{not-listening-3}"}</code>, <code>{"{status-}"}</code> or{" "}
            <code>{"{sharp tools}"}</code>. Status value can be empty; typical
            scene entries are 1–4.
          </p>
        </div>

        {/* Current tokens */}
        <ul className="space-y-2">
          {challenge.tags_and_statuses.map((token, idx) => (
            <li
              key={`${token}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
            >
              {/* Pretty token rendering (same as preview) */}
              <div
                className="prose-sm max-w-none"
                // spans with .litm-tag / .litm-status / .litm-limit / .litm-weakness
                dangerouslySetInnerHTML={{ __html: renderLitmInline(token) }}
              />

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveToken(idx, Math.max(0, idx - 1))}
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
                    moveToken(
                      idx,
                      Math.min(challenge.tags_and_statuses.length - 1, idx + 1)
                    )
                  }
                  title="Move down"
                >
                  <ArrowDown size={16} />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEdit(idx)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => removeTokenAt(idx)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  Edit Token #{editingIndex + 1}
                </h4>
                <Button variant="link" className="h-8 p-0" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                {/* Mode selector */}
                <div className="inline-flex rounded-md border overflow-hidden">
                  {(["power", "status", "weakness"] as Mode[]).map((m) => (
                    <Button
                      key={m}
                      type="button"
                      variant={editMode === m ? "default" : "ghost"}
                      className="capitalize rounded-none"
                      onClick={() => setEditMode(m)}
                    >
                      {m === "power" ? "Tag" : m}
                    </Button>
                  ))}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-[220px]">
                  <Label htmlFor="edit-name" className="sr-only">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                {/* Status value */}
                {editMode === "status" && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-value">Value</Label>
                    <Input
                      id="edit-value"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-20"
                      value={editStatusVal}
                      onChange={(e) =>
                        setEditStatusVal(normalizeDigitsOnly(e.target.value))
                      }
                    />
                  </div>
                )}

                <Button onClick={confirmEdit}>Save</Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
