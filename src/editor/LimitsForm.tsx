// src/editor/LimitsForm.tsx
import { useEffect, useState } from "react";
import { useChallengeStore, type Limit } from "@/store/challengeStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Pencil, Trash2, Plus, Info } from "lucide-react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PRESET_LIMITS = ["Harm", "Scare", "Convince", "Subdue", "Banish"];

export default function LimitsForm({ focusIndex }: { focusIndex?: number }) {
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

  useEffect(() => {
    if (typeof focusIndex === "number" && challenge.limits[focusIndex]) {
      startEdit(focusIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIndex]);

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

  const itemIds = challenge.limits.map((l) => l.name); // names are unique in your form

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = itemIds.indexOf(String(active.id));
    const to = itemIds.indexOf(String(over.id));
    if (from !== -1 && to !== -1 && from !== to) moveLimit(from, to);
  }

  return (
    <div className="space-y-6">
      {/* Create */}
      <div className="rounded-md border p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
          {/* Name */}
          <div className="grid gap-1">
            <Label htmlFor="limit-name">Name</Label>
            <Input
              id="limit-name"
              placeholder="e.g., Harm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Level */}
          <div className="grid gap-1">
            <Label htmlFor="limit-level">Level</Label>
            <Input
              id="limit-level"
              type="number"
              min={1}
              max={6}
              className=""
              value={level}
              onChange={(e) =>
                setLevel(Math.max(1, Math.min(6, Number(e.target.value) || 1)))
              }
              disabled={isImmune}
              title={isImmune ? "Ignored when immune" : "1-6"}
            />
          </div>

          {/* Immune toggle */}
          <div className="flex items-center gap-2 pt-5 md:pt-0">
            <Switch
              checked={isImmune}
              onCheckedChange={(v) => setIsImmune(!!v)}
              id="limit-immune"
            />
            <Label htmlFor="limit-immune" className="text-sm">
              Immune
            </Label>
          </div>

          {/* Progress toggle */}
          <div className="flex items-center gap-2 pt-5 md:pt-0">
            <Switch
              checked={isProgress}
              onCheckedChange={(v) => setIsProgress(!!v)}
              id="limit-progress"
            />
            <Label htmlFor="limit-progress" className="text-sm">
              Progress limit
            </Label>
          </div>
        </div>

        {/* On max (only if progress) */}
        {isProgress && (
          <div className="grid gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>When this progress limit is maxed, what happens?</span>
            </div>
            <Textarea
              rows={2}
              placeholder="e.g., The portal fully opens and the room floods with ash."
              value={onMax}
              onChange={(e) => setOnMax(e.target.value)}
            />
          </div>
        )}

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESET_LIMITS.map((p) => (
            <Button
              key={p}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addPreset(p)}
              title="Quick fill name"
            >
              <span className="litm-limit lowercase">{p}</span>
            </Button>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <p className="text-xs text-muted-foreground">
          Immunities are limits with no maximum (displayed as “~”). <br />
          Progress limits build toward an outcome that happens when maxed.
        </p>

        <div>
          <Button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </Button>
        </div>
      </div>

      {/* List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {challenge.limits.map((l, idx) => (
              <SortableLimitItem
                key={itemIds[idx]}
                id={itemIds[idx]}
                limit={l}
                onEdit={() => startEdit(idx)}
                onRemove={() => removeLimitAt(idx)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {/* Inline editor */}
      {editingIndex != null && (
        <div className="rounded-md border p-3 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Edit Limit #{editingIndex + 1}</h4>
            <Button variant="link" className="h-8 p-0" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
            <div className="grid gap-1">
              <Label htmlFor="limit-name-edit">Name</Label>
              <Input value={eName} onChange={(e) => setEName(e.target.value)} />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="limit-level-edit">Level</Label>
              <Input
                id="limit-level-edit"
                type="number"
                min={1}
                max={6}
                value={eLevel}
                onChange={(e) =>
                  setELevel(
                    Math.max(1, Math.min(6, Number(e.target.value) || 1))
                  )
                }
                disabled={eImmune}
                title={eImmune ? "Ignored when immune" : "1-6"}
              />
            </div>

            <div className="flex items-center gap-2 pt-5 md:pt-0">
              <Switch
                checked={eImmune}
                onCheckedChange={(v) => setEImmune(!!v)}
                id="limit-immune-edit"
              />
              <Label htmlFor="limit-immune-edit" className="text-sm">
                Immune
              </Label>
            </div>

            <div className="flex items-center gap-2 pt-5 md:pt-0">
              <Switch
                checked={eProgress}
                onCheckedChange={(v) => setEProgress(!!v)}
                id="limit-progress-edit"
              />
              <Label htmlFor="limit-progress-edit" className="text-sm">
                Progress limit
              </Label>
            </div>
          </div>

          {eProgress && (
            <Textarea
              rows={2}
              placeholder="When this progress limit is maxed…"
              value={eOnMax}
              onChange={(ev) => setEOnMax(ev.target.value)}
            />
          )}

          <Button onClick={confirmEdit}>Save</Button>
        </div>
      )}
    </div>
  );
}

function SortableLimitItem({
  id,
  limit: l,
  onEdit,
  onRemove,
}: {
  id: string;
  limit: Limit;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 bg-white ${
        isDragging ? "shadow-lg ring-1 ring-slate-200" : ""
      }`}
    >
      {/* Left: drag handle + content */}
      <div className="flex items-start gap-2 min-w-0">
        <button
          className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-slate-50 cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-slate-500" />
        </button>

        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-end gap-1 flex-wrap">
            <span
              className="text-md litm-limit lowercase truncate"
              title={l.name}
              data-limit-value={
                l.is_immune
                  ? "~"
                  : Math.max(1, Math.min(6, Math.floor(l.level || 1)))
              }
            >
              {l.name}
            </span>

            {l.is_progress && (
              <img
                src="/assets/images/progress-limit-arrow.svg"
                alt=""
                aria-hidden="true"
                className="limit-progress__arrow"
              />
            )}
          </div>

          {l.is_progress && l.on_max && (
            <p className="text-xs text-slate-700">{l.on_max}</p>
          )}
        </div>
      </div>

      {/* Right: edit/delete */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onEdit}
          title="Edit"
        >
          <Pencil size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={onRemove}
          title="Remove"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
}
