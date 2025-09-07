import { useState } from "react";
import {
  useChallengeStore,
  type Might,
  type MightLevel,
} from "../store/challengeStore";
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus, Shield } from "lucide-react";

const LEVELS: MightLevel[] = ["adventure", "greatness"];

function levelLabel(level: MightLevel) {
  return level === "adventure" ? "Adventure" : "Greatness";
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Might</h3>

      {/* Create */}
      <div className="rounded border p-3 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            className="flex-1 min-w-[220px] border rounded px-2 py-1"
            placeholder="Might name (e.g., Size and strength)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Level segmented control */}
          <div className="inline-flex rounded border overflow-hidden">
            {LEVELS.map((lv) => (
              <button
                key={lv}
                type="button"
                className={`px-3 py-1 capitalize ${
                  level === lv ? "bg-indigo-600 text-white" : "bg-white"
                }`}
                onClick={() => setLevel(lv)}
              >
                {levelLabel(lv)}
              </button>
            ))}
          </div>

          {/* Vulnerability (optional) */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 flex items-center gap-1">
              <Shield size={14} /> Vulnerability
            </label>
            <input
              type="text"
              className="w-48 border rounded px-2 py-1"
              placeholder="(optional, e.g., flattery)"
              value={vulnerability}
              onChange={(e) => setVulnerability(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <p className="text-xs text-gray-500">
          Tip: A Vulnerability nullifies this Might (treated as Origin in that
          aspect).
        </p>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {challenge.mights.map((m, idx) => (
          <li
            key={`${m.name}-${m.level}-${idx}`}
            className="flex items-center justify-between gap-3 rounded border px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{m.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 capitalize">
                {levelLabel(m.level)}
              </span>
              {m.vulnerability ? (
                <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  Vulnerability: {m.vulnerability}
                </span>
              ) : (
                <span className="text-xs text-gray-400">No vulnerability</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-100"
                onClick={() => moveMight(idx, Math.max(0, idx - 1))}
                title="Move up"
              >
                <ArrowUp size={16} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-100"
                onClick={() =>
                  moveMight(idx, Math.min(challenge.mights.length - 1, idx + 1))
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
                onClick={() => removeMightAt(idx)}
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
            <h4 className="font-semibold">Edit Might #{editingIndex + 1}</h4>
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
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <div className="inline-flex rounded border overflow-hidden">
              {LEVELS.map((lv) => (
                <button
                  key={lv}
                  type="button"
                  className={`px-3 py-1 capitalize ${editLevel === lv ? "bg-indigo-600 text-white" : "bg-white"}`}
                  onClick={() => setEditLevel(lv)}
                >
                  {levelLabel(lv)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 flex items-center gap-1">
                <Shield size={14} /> Vulnerability
              </label>
              <input
                type="text"
                className="w-48 border rounded px-2 py-1"
                value={editVulnerability}
                onChange={(e) => setEditVulnerability(e.target.value)}
              />
            </div>

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
