// src/editor/SpecialFeaturesForm.tsx
import { useEffect, useState } from "react";
import { useChallengeStore } from "@/store/challengeStore";
import { renderLitmMarkdown } from "@/utils/markdown";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, Eye } from "lucide-react";

export default function SpecialFeaturesForm({
  focusIndex,
}: {
  focusIndex?: number;
}) {
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

  useEffect(() => {
    if (
      typeof focusIndex === "number" &&
      challenge.special_features[focusIndex]
    ) {
      startEdit(focusIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIndex]);

  function handleAdd() {
    setErr(null);
    if (!name.trim()) return setErr("Name is required.");
    addSpecialFeature({ name: name.trim(), description: desc });
    setName("");
    setDesc("");
    setShowPreview(false);
  }

  function startEdit(i: number) {
    const sf = challenge.special_features[i];
    if (!sf) return;
    setEditing(i);
    setEName(sf.name);
    setEDesc(sf.description || "");
    setEPreview(false);
    setErr(null);
  }

  function saveEdit() {
    if (editing == null) return;
    if (!eName.trim()) return setErr("Name is required.");
    updateSpecialFeatureAt(editing, { name: eName.trim(), description: eDesc });
    cancelEdit();
  }

  function cancelEdit() {
    setEditing(null);
    setEName("");
    setEDesc("");
    setEPreview(false);
    setErr(null);
  }

  return (
    <div className="space-y-6">
      {/* Create */}
      <div className="rounded-md border p-4 space-y-3">
        <div className="grid gap-1">
          <Label htmlFor="sf-name">Name</Label>
          <Input
            id="sf-name"
            placeholder="e.g., Gifts of Refuse"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sf-desc" className="text-sm text-muted-foreground">
            Description (Markdown supported)
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? "Hide preview" : "Show preview"}
          </Button>
        </div>

        <Textarea
          id="sf-desc"
          rows={4}
          placeholder="When this happens... then do that."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {showPreview && (
          <div
            className="prose max-w-none border rounded-md p-3 bg-muted/30"
            dangerouslySetInnerHTML={{ __html: renderLitmMarkdown(desc) }}
          />
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add feature
          </Button>
          {err && <span className="text-sm text-destructive">{err}</span>}
        </div>
      </div>

      {/* List */}
      <ul className="space-y-3">
        {challenge.special_features.map((sf, i) => (
          <li
            key={`${sf.name}-${i}`}
            className="rounded-md border p-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{sf.name}</div>
                {sf.description && (
                  <div
                    className="text-sm text-foreground/80 prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderLitmMarkdown(sf.description),
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Move up"
                  onClick={() => moveSpecialFeature(i, Math.max(0, i - 1))}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Move down"
                  onClick={() =>
                    moveSpecialFeature(
                      i,
                      Math.min(challenge.special_features.length - 1, i + 1)
                    )
                  }
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Edit"
                  onClick={() => startEdit(i)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  title="Remove"
                  onClick={() => removeSpecialFeatureAt(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {editing === i && (
              <div className="rounded-md border p-3 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Edit Feature #{i + 1}</h4>
                  <Button
                    variant="link"
                    className="h-8 p-0"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                </div>

                <Input
                  className="w-full"
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                />

                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    Description (Markdown)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEPreview((v) => !v)}
                    className="inline-flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />{" "}
                    {ePreview ? "Hide preview" : "Show preview"}
                  </Button>
                </div>

                <Textarea
                  rows={4}
                  value={eDesc}
                  onChange={(e) => setEDesc(e.target.value)}
                />

                {ePreview && (
                  <div
                    className="prose max-w-none border rounded-md p-3 bg-muted/30"
                    dangerouslySetInnerHTML={{
                      __html: renderLitmMarkdown(eDesc),
                    }}
                  />
                )}

                <div>
                  <Button onClick={saveEdit}>Save</Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
