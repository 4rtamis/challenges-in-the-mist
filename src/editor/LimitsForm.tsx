import { useState } from "react";
import { useChallengeStore, type Limit } from "../store/challengeStore";
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus, Info } from "lucide-react";

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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Limits</h3>

      {/* Create */}
      <div className="rounded border p-3 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Name */}
          <input
            type="text"
            className="flex-1 min-w-[220px] border rounded px-2 py-1"
            placeholder="Limit name (e.g., Destroy)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Level */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Level</label>
            <input
              type="number"
              min={1}
              max={6}
              className="w-16 border rounded px-2 py-1"
              value={level}
              onChange={(e) =>
                setLevel(Math.max(1, Math.min(6, Number(e.target.value) || 1)))
              }
              disabled={isImmune}
              title={isImmune ? "Ignored when immune" : "1–6"}
            />
          </div>

          {/* Immune toggle */}
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isImmune}
              onChange={(e) => setIsImmune(e.target.checked)}
            />
            Immune
          </label>

          {/* Progress toggle */}
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isProgress}
              onChange={(e) => setIsProgress(e.target.checked)}
            />
            Progress limit
          </label>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {/* On max (only if progress) */}
        {isProgress && (
          <div className="flex items-start gap-2">
            <div className="pt-1 text-gray-500">
              <Info size={16} />
            </div>
            <textarea
              rows={2}
              className="w-full border rounded px-2 py-1"
              placeholder="When this progress limit is maxed, what happens?"
              value={onMax}
              onChange={(e) => setOnMax(e.target.value)}
            />
          </div>
        )}

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESET_LIMITS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => addPreset(p)}
              className="px-2 py-1 rounded border text-sm hover:bg-gray-50"
              title="Quick fill name"
            >
              {p}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <p className="text-xs text-gray-500">
          Tip: Immunities are limits with no maximum (displayed as “—” in
          print). Progress limits build toward an outcome—describe that outcome
          in “On max”.
        </p>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {challenge.limits.map((l, idx) => (
          <li
            key={`${l.name}-${idx}`}
            className="flex items-center justify-between gap-3 rounded border px-3 py-2"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium">{l.name}</span>

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
                <span className="text-xs text-gray-600">
                  On max: <em>{l.on_max}</em>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-100"
                onClick={() => moveLimit(idx, Math.max(0, idx - 1))}
                title="Move up"
              >
                <ArrowUp size={16} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-100"
                onClick={() =>
                  moveLimit(idx, Math.min(challenge.limits.length - 1, idx + 1))
                }
                title="Move down"
              >
                <ArrowDown size={16} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-100"
                onClick={() => startEdit(idx)}
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-red-50 text-red-600"
                onClick={() => removeLimitAt(idx)}
                title="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Inline editor */}
      {editingIndex != null && (
        <div className="rounded border p-3 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Edit Limit #{editingIndex + 1}</h4>
            <button
              type="button"
              className="text-sm underline"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              className="flex-1 min-w-[220px] border rounded px-2 py-1"
              value={eName}
              onChange={(e) => setEName(e.target.value)}
            />

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Level</label>
              <input
                type="number"
                min={1}
                max={6}
                className="w-16 border rounded px-2 py-1"
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

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={eImmune}
                onChange={(e) => setEImmune(e.target.checked)}
              />
              Immune
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={eProgress}
                onChange={(e) => setEProgress(e.target.checked)}
              />
              Progress limit
            </label>

            <button
              type="button"
              onClick={confirmEdit}
              className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>

          {eProgress && (
            <textarea
              rows={2}
              className="w-full border rounded px-2 py-1"
              placeholder="When this progress limit is maxed, what happens?"
              value={eOnMax}
              onChange={(ev) => setEOnMax(ev.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
}
