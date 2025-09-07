import { useState } from "react";
import { useChallengeStore } from "../store/challengeStore";
import { parseToken, ensureFormatted, tokensEqual } from "../utils/tags";
import {
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  AlertTriangle,
} from "lucide-react";

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
      // treat everything else as 'power'
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tags & Statuses</h3>

      {/* Create */}
      <div className="rounded border p-3 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode selector */}
          <div className="inline-flex rounded border overflow-hidden">
            {(["power", "status", "weakness"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                className={`px-3 py-1 capitalize ${mode === m ? "bg-indigo-600 text-white" : "bg-white"}`}
                onClick={() => setMode(m)}
              >
                {m === "power" ? "Tag" : m}
              </button>
            ))}
          </div>

          {/* Name */}
          <input
            type="text"
            className="flex-1 min-w-[220px] border rounded px-2 py-1"
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

          {/* Status value (digits or empty) */}
          {mode === "status" && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Value</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-20 border rounded px-2 py-1"
                placeholder=""
                value={statusVal}
                onChange={(e) =>
                  setStatusVal(normalizeDigitsOnly(e.target.value))
                }
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {limitDetect && (
          <p className="text-sm text-amber-700 flex items-center gap-2">
            <AlertTriangle size={16} /> {limitDetect}
          </p>
        )}

        <p className="text-xs text-gray-500">
          Tips: paste tokens like <code>{"{!beguiled}"}</code>,{" "}
          <code>{"{not-listening-3}"}</code>, <code>{"{status-}"}</code> or{" "}
          <code>{"{sharp tools}"}</code>. Status value can be empty; typical
          scene entries are 1–4.
        </p>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {challenge.tags_and_statuses.map((token, idx) => {
          const parsed = parseToken(token);
          const kind = parsed?.kind ?? "power";

          const badge =
            parsed?.kind === "weakness"
              ? "Weakness"
              : parsed?.kind === "status"
                ? parsed.value
                  ? `Status ${parsed.value}`
                  : "Status"
                : "Tag";

          return (
            <li
              key={`${token}-${idx}`}
              className="flex items-center justify-between gap-3 rounded border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    kind === "weakness"
                      ? "bg-rose-100 text-rose-800"
                      : kind === "status"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {badge}
                </span>
                <span className="font-mono">{token}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => moveToken(idx, Math.max(0, idx - 1))}
                  title="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() =>
                    moveToken(
                      idx,
                      Math.min(challenge.tags_and_statuses.length - 1, idx + 1)
                    )
                  }
                  title="Move down"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => startEdit(idx)}
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="p-1 rounded hover:bg-red-50 text-red-600"
                  onClick={() => removeTokenAt(idx)}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Inline editor */}
      {editingIndex != null && (
        <div className="rounded border p-3 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Edit Token #{editingIndex + 1}</h4>
            <button
              type="button"
              className="text-sm underline"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded border overflow-hidden">
              {(["power", "status", "weakness"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`px-3 py-1 capitalize ${editMode === m ? "bg-indigo-600 text-white" : "bg-white"}`}
                  onClick={() => setEditMode(m)}
                >
                  {m === "power" ? "Tag" : m}
                </button>
              ))}
            </div>

            <input
              type="text"
              className="flex-1 min-w-[220px] border rounded px-2 py-1"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            {editMode === "status" && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Value</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-20 border rounded px-2 py-1"
                  value={editStatusVal}
                  onChange={(e) =>
                    setEditStatusVal(normalizeDigitsOnly(e.target.value))
                  }
                />
              </div>
            )}

            <button
              type="button"
              onClick={confirmEdit}
              className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
