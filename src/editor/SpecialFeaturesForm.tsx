// src/editor/SpecialFeaturesForm.tsx
import { useState } from "react";
import { useChallengeStore } from "../store/challengeStore";
import { renderLitmMarkdown } from "../utils/markdown";
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus, Eye } from "lucide-react";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
    setEditing(null);
    setEName("");
    setEDesc("");
    setEPreview(false);
    setErr(null);
  }

  function cancelEdit() {
    setEditing(null);
    setEName("");
    setEDesc("");
    setEPreview(false);
    setErr(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Features</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Create */}
        <div className="rounded-md border p-4 space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="sf-name">Name</Label>
            <Input
              id="sf-name"
              placeholder="e.g., Gifts of Refuse"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sf-desc" className="text-sm">
              Description (Markdown supported)
            </Label>
            <Button
              type="button"
              variant={showPreview ? "secondary" : "outline"}
              size="sm"
              className="inline-flex items-center gap-1"
              onClick={() => setShowPreview((v) => !v)}
            >
              <Eye size={14} />
              {showPreview ? "Hide Preview" : "Show Preview"}
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
              className="prose-sm max-w-none border rounded-md p-3 bg-muted/30"
              // Uses the same inline renderer so .litm-* spans match your preview styling
              dangerouslySetInnerHTML={{ __html: renderLitmMarkdown(desc) }}
            />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1"
            >
              <Plus size={16} /> Add feature
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
                  <div className="font-medium">{sf.name}</div>
                  {sf.description && (
                    <div
                      className="text-sm text-foreground/80 prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: renderLitmMarkdown(sf.description),
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Move up"
                    onClick={() => moveSpecialFeature(i, Math.max(0, i - 1))}
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button
                    type="button"
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
                    <ArrowDown size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Edit"
                    onClick={() => startEdit(i)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    title="Remove"
                    onClick={() => removeSpecialFeatureAt(i)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {editing === i && (
                <div className="rounded-md border p-3 space-y-3 bg-muted/30">
                  <div className="grid gap-2">
                    <Label htmlFor={`sf-edit-name-${i}`}>Name</Label>
                    <Input
                      id={`sf-edit-name-${i}`}
                      value={eName}
                      onChange={(e) => setEName(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor={`sf-edit-desc-${i}`} className="text-sm">
                      Description (Markdown)
                    </Label>
                    <Button
                      type="button"
                      variant={ePreview ? "secondary" : "outline"}
                      size="sm"
                      className="inline-flex items-center gap-1"
                      onClick={() => setEPreview((v) => !v)}
                    >
                      <Eye size={14} />{" "}
                      {ePreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                  </div>

                  <Textarea
                    id={`sf-edit-desc-${i}`}
                    rows={4}
                    value={eDesc}
                    onChange={(e) => setEDesc(e.target.value)}
                  />

                  {ePreview && (
                    <div
                      className="prose-sm max-w-none border rounded-md p-3 bg-muted/30"
                      dangerouslySetInnerHTML={{
                        __html: renderLitmMarkdown(eDesc),
                      }}
                    />
                  )}

                  <div className="flex items-center gap-2">
                    <Button type="button" onClick={saveEdit}>
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      className="h-8 p-0"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                    {err && (
                      <span className="text-sm text-destructive">{err}</span>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {challenge.special_features.length > 0 && <Separator />}
      </CardContent>
    </Card>
  );
}
