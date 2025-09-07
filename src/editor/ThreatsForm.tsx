import { useState } from "react";
import { useChallengeStore, type Threat } from "../store/challengeStore";
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";

export default function ThreatsForm() {
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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Threats & Consequences</h3>

      {/* Create Threat */}
      <div className="rounded border p-3 space-y-3">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Threat name (e.g., Swallow)"
            value={tName}
            onChange={(e) => setTName(e.target.value)}
          />
          <textarea
            className="border rounded px-2 py-1"
            rows={2}
            placeholder="Short description (what the challenge starts to do)"
            value={tDesc}
            onChange={(e) => setTDesc(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddThreat}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Add threat
          </button>
          {tErr && <p className="text-sm text-red-600">{tErr}</p>}
        </div>
        <p className="text-xs text-gray-500">
          Threat: what the Challenge is starting to do. If ignored (or on
          Consequences), apply one or more related Consequences.
        </p>
      </div>

      {/* Threats list */}
      <ul className="space-y-4">
        {challenge.threats.map((t, tIdx) => (
          <li
            key={`${t.name}-${tIdx}`}
            className="rounded border p-3 space-y-3"
          >
            {/* Threat header row */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{t.name}</div>
                {t.description && (
                  <div className="text-sm text-gray-600">{t.description}</div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => moveThreat(tIdx, Math.max(0, tIdx - 1))}
                  title="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() =>
                    moveThreat(
                      tIdx,
                      Math.min(challenge.threats.length - 1, tIdx + 1)
                    )
                  }
                  title="Move down"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => startEditThreat(tIdx)}
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="p-1 rounded hover:bg-red-50 text-red-600"
                  onClick={() => removeThreatAt(tIdx)}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Inline editor for a threat */}
            {editingTIndex === tIdx && (
              <div className="rounded border p-3 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Edit Threat #{tIdx + 1}</h4>
                  <button
                    type="button"
                    className="text-sm underline"
                    onClick={cancelEditThreat}
                  >
                    Cancel
                  </button>
                </div>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                />
                <textarea
                  className="w-full border rounded px-2 py-1"
                  rows={2}
                  value={eDesc}
                  onChange={(e) => setEDesc(e.target.value)}
                />
                <button
                  type="button"
                  onClick={confirmEditThreat}
                  className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save
                </button>
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
                <input
                  type="text"
                  className="flex-1 border rounded px-2 py-1"
                  placeholder='e.g., "Pull a grabbed victim into its maw ({crushed-4})"'
                  value={cNew[tIdx] ?? ""}
                  onChange={(e) =>
                    setCNew((s) => ({ ...s, [tIdx]: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => handleAddConsequence(tIdx)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              <p className="text-xs text-gray-500">
                You can use tokens like <code>{"{delirious-3}"}</code>,{" "}
                <code>{"{grabbed-4}"}</code>, or phrases like “scratch a tag”.
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* General (floating) Consequences */}
      <div className="rounded border p-3 space-y-3">
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
          <input
            type="text"
            className="flex-1 border rounded px-2 py-1"
            placeholder='e.g., "The poison spreads ({poisoned+2})"'
            value={gcNew}
            onChange={(e) => setGcNew(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddGeneralConsequence}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Add general consequence
          </button>
          {gcErr && <p className="text-sm text-red-600">{gcErr}</p>}
        </div>
      </div>
    </div>
  );
}

/* --- Small reusable row with inline edit --- */
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
    <li className="flex items-center justify-between gap-2 rounded border px-3 py-2">
      {editing ? (
        <input
          className="flex-1 border rounded px-2 py-1"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      ) : (
        <span className="flex-1">{text}</span>
      )}

      <div className="flex items-center gap-1">
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onMoveUp}
          title="Move up"
        >
          <ArrowUp size={16} />
        </button>
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onMoveDown}
          title="Move down"
        >
          <ArrowDown size={16} />
        </button>
        {editing ? (
          <button
            className="px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
            onClick={() => {
              onSave(val.trim());
              setEditing(false);
            }}
          >
            Save
          </button>
        ) : (
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setEditing(true)}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
        )}
        <button
          className="p-1 rounded hover:bg-red-50 text-red-600"
          onClick={onDelete}
          title="Remove"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
