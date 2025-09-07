import { useState } from "react";
import { useChallengeStore } from "../store/challengeStore";
import { renderLitmMarkdown } from "../utils/markdown";
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus, Eye } from "lucide-react";

export default function SpecialFeaturesForm() {
  const {
    challenge,
    addSpecialFeature,
    updateSpecialFeatureAt,
    removeSpecialFeatureAt,
    moveSpecialFeature,
  } = useChallengeStore();

  // create
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // edit
  const [editing, setEditing] = useState<number | null>(null);
  const [eName, setEName] = useState("");
  const [eDesc, setEDesc] = useState("");
  const [ePreview, setEPreview] = useState(false);

  function handleAdd() {
    setErr(null);
    if (!name.trim()) return setErr("Name is required.");
    addSpecialFeature({ name, description: desc });
    setName("");
    setDesc("");
  }

  function startEdit(i: number) {
    const sf = challenge.special_features[i];
    if (!sf) return;
    setEditing(i);
    setEName(sf.name);
    setEDesc(sf.description || "");
    setEPreview(false);
  }

  function saveEdit() {
    if (editing == null) return;
    if (!eName.trim()) return setErr("Name is required.");
    updateSpecialFeatureAt(editing, { name: eName, description: eDesc });
    setEditing(null);
    setEName("");
    setEDesc("");
    setErr(null);
  }

  function cancelEdit() {
    setEditing(null);
    setEName("");
    setEDesc("");
    setErr(null);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Special Features</h3>

      {/* Create */}
      <div className="rounded border p-3 space-y-2">
        <input
          type="text"
          className="w-full border rounded px-2 py-1"
          placeholder="Name (e.g., Gifts of Refuse)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600">
            Description (Markdown supported)
          </label>
          <button
            type="button"
            className="text-sm inline-flex items-center gap-1 px-2 py-1 rounded border bg-white hover:bg-slate-50"
            onClick={() => setShowPreview((v) => !v)}
          >
            <Eye size={14} /> {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
        <textarea
          rows={4}
          className="w-full border rounded px-2 py-1"
          placeholder="When this happens... then do that."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        {showPreview && (
          <div
            className="prose max-w-none border rounded p-3 bg-slate-50"
            dangerouslySetInnerHTML={{ __html: renderLitmMarkdown(desc) }}
          />
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Add feature
          </button>
          {err && <span className="text-sm text-red-600">{err}</span>}
        </div>
      </div>

      {/* List */}
      <ul className="space-y-3">
        {challenge.special_features.map((sf, i) => (
          <li key={`${sf.name}-${i}`} className="rounded border p-3 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{sf.name}</div>
                {sf.description && (
                  <div
                    className="text-sm text-slate-700"
                    dangerouslySetInnerHTML={{
                      __html: renderLitmMarkdown(sf.description),
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  title="Move up"
                  onClick={() => moveSpecialFeature(i, Math.max(0, i - 1))}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  title="Move down"
                  onClick={() =>
                    moveSpecialFeature(
                      i,
                      Math.min(challenge.special_features.length - 1, i + 1)
                    )
                  }
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  title="Edit"
                  onClick={() => startEdit(i)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="p-1 rounded hover:bg-red-50 text-red-600"
                  title="Remove"
                  onClick={() => removeSpecialFeatureAt(i)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {editing === i && (
              <div className="rounded border p-3 space-y-2 bg-gray-50">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">
                    Description (Markdown)
                  </label>
                  <button
                    type="button"
                    className="text-sm inline-flex items-center gap-1 px-2 py-1 rounded border bg-white hover:bg-slate-50"
                    onClick={() => setEPreview((v) => !v)}
                  >
                    <Eye size={14} />{" "}
                    {ePreview ? "Hide Preview" : "Show Preview"}
                  </button>
                </div>
                <textarea
                  rows={4}
                  className="w-full border rounded px-2 py-1"
                  value={eDesc}
                  onChange={(e) => setEDesc(e.target.value)}
                />
                {ePreview && (
                  <div
                    className="prose max-w-none border rounded p-3 bg-slate-50"
                    dangerouslySetInnerHTML={{
                      __html: renderLitmMarkdown(eDesc),
                    }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-sm underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
