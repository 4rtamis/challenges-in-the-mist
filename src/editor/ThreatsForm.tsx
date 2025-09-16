// src/editor/ThreatsForm.tsx
import { useEffect, useMemo, useState } from "react";
import { useChallengeStore } from "@/store/challengeStore";
import { renderLitmMarkdown } from "@/utils/markdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  GripVertical,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";

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

/* ----------------------------------------------------------------------------
   Two-panel Threats Editor
   - Panel A: Threats list (reorder + inline edit, NO consequences)
   - Panel B: Consequences for a selected threat OR General Consequences
   Slide transition between panels (only one visible at a time).
---------------------------------------------------------------------------- */

type Panel =
  | { kind: "threats" }
  | { kind: "cons"; tIdx: number }
  | { kind: "general" };

export default function ThreatsForm({ focusIndex }: { focusIndex?: number }) {
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

  // Which view is shown
  const [panel, setPanel] = useState<Panel>({ kind: "threats" });

  // Inline threat editor
  const [editingThreat, setEditingThreat] = useState<number | null>(null);
  const [tName, setTName] = useState("");
  const [tDesc, setTDesc] = useState("");
  const [tErr, setTErr] = useState<string | null>(null);

  // Inline consequence editors (panel B)
  const [editingCons, setEditingCons] = useState<number | null>(null);
  const [consDraft, setConsDraft] = useState("");

  const [editingGeneralCons, setEditingGeneralCons] = useState<number | null>(
    null
  );
  const [generalDraft, setGeneralDraft] = useState("");

  // Deep-link from preview to a given threat
  useEffect(() => {
    if (typeof focusIndex === "number" && challenge.threats[focusIndex]) {
      startEditThreat(focusIndex);
      setPanel({ kind: "threats" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIndex]);

  /* ----------------------------- Drag & Drop ----------------------------- */

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const dragDisabled =
    editingThreat !== null ||
    editingCons !== null ||
    editingGeneralCons !== null;

  const threatIds = useMemo(
    () => challenge.threats.map((t, i) => `t:${i}:${t.name || "threat"}`),
    [challenge.threats]
  );

  const currentThreatIndex = panel.kind === "cons" ? panel.tIdx : null;
  const consIds = useMemo(() => {
    if (currentThreatIndex == null) return [];
    const t = challenge.threats[currentThreatIndex];
    return t ? t.consequences.map((_, i) => `c:${i}`) : [];
  }, [challenge.threats, currentThreatIndex]);

  const generalIds = useMemo(
    () => challenge.general_consequences.map((_, i) => `gc:${i}`),
    [challenge.general_consequences]
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    // Threats reordering (panel A)
    if (
      panel.kind === "threats" &&
      String(active.id).startsWith("t:") &&
      String(over.id).startsWith("t:")
    ) {
      const from = Number(String(active.id).split(":")[1] || -1);
      const to = Number(String(over.id).split(":")[1] || -1);
      if (from >= 0 && to >= 0 && from !== to) moveThreat(from, to);
      return;
    }

    // Consequences reordering (panel B, single threat mode)
    if (
      panel.kind === "cons" &&
      String(active.id).startsWith("c:") &&
      String(over.id).startsWith("c:")
    ) {
      const from = Number(String(active.id).split(":")[1] || -1);
      const to = Number(String(over.id).split(":")[1] || -1);
      if (currentThreatIndex != null && from >= 0 && to >= 0 && from !== to) {
        moveConsequence(currentThreatIndex, from, to);
      }
      return;
    }

    // General consequences reordering (panel B, general mode)
    if (
      panel.kind === "general" &&
      String(active.id).startsWith("gc:") &&
      String(over.id).startsWith("gc:")
    ) {
      const from = Number(String(active.id).split(":")[1] || -1);
      const to = Number(String(over.id).split(":")[1] || -1);
      if (from >= 0 && to >= 0 && from !== to) moveGeneralConsequence(from, to);
      return;
    }
  }

  /* ------------------------------ Threats A ------------------------------ */

  function uniqueThreatName() {
    const base = "New Threat";
    const used = new Set(
      challenge.threats.map((t) => (t.name || "").toLowerCase())
    );
    if (!used.has(base.toLowerCase())) return base;
    let n = 2;
    while (used.has(`${base} ${n}`.toLowerCase())) n++;
    return `${base} ${n}`;
  }

  function addThreatPlaceholder() {
    const name = uniqueThreatName();
    addThreat({ name, description: "", consequences: [] });
    const idx = challenge.threats.length; // end
    startEditThreat(idx);
  }

  function startEditThreat(idx: number) {
    const t = challenge.threats[idx];
    if (!t) return;
    setEditingThreat(idx);
    setTName(t.name || "");
    setTDesc(t.description || "");
    setTErr(null);
  }

  function cancelEditThreat() {
    setEditingThreat(null);
    setTName("");
    setTDesc("");
    setTErr(null);
  }

  function saveThreat() {
    if (editingThreat == null) return;
    const name = tName.trim();
    if (!name) return setTErr("Threat name is required.");
    updateThreatAt(editingThreat, { name, description: tDesc.trim() });
    cancelEditThreat();
  }

  /* ----------------------------- Consequences B ----------------------------- */

  function goConsFor(tIdx: number) {
    setEditingCons(null);
    setPanel({ kind: "cons", tIdx });
  }

  function goGeneralCons() {
    setEditingGeneralCons(null);
    setPanel({ kind: "general" });
  }

  function backToThreats() {
    setPanel({ kind: "threats" });
  }

  function addConsequencePlaceholder() {
    if (currentThreatIndex == null) return;
    addConsequence(currentThreatIndex, "New consequence");
    const idx = challenge.threats[currentThreatIndex].consequences.length; // end
    setEditingCons(idx);
    setConsDraft("New consequence");
  }

  function startEditConsequence(cIdx: number, text: string) {
    setEditingCons(cIdx);
    setConsDraft(text);
  }

  function saveConsequence() {
    if (currentThreatIndex == null || editingCons == null) return;
    updateConsequence(currentThreatIndex, editingCons, consDraft.trim());
    setEditingCons(null);
    setConsDraft("");
  }

  function addGeneralPlaceholder() {
    addGeneralConsequence("New consequence");
    const idx = challenge.general_consequences.length; // end
    setEditingGeneralCons(idx);
    setGeneralDraft("New consequence");
  }

  function startEditGeneral(idx: number, text: string) {
    setEditingGeneralCons(idx);
    setGeneralDraft(text);
  }

  function saveGeneral() {
    if (editingGeneralCons == null) return;
    updateGeneralConsequence(editingGeneralCons, generalDraft.trim());
    setEditingGeneralCons(null);
    setGeneralDraft("");
  }

  /* --------------------------------- UI --------------------------------- */

  const slideClass =
    panel.kind === "threats" ? "translate-x-0" : "-translate-x-1/2";

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div className="relative overflow-hidden">
        <div
          className={`grid grid-cols-2 w-[200%] transition-transform duration-300 ease-out ${slideClass}`}
        >
          {/* PANEL A: Threats list (left half) */}
          <div className="w-full pr-2 min-w-0">
            <SortableContext
              items={threatIds}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3">
                {challenge.threats.map((t, tIdx) => {
                  const id = threatIds[tIdx];
                  const isEditing = editingThreat === tIdx;

                  return (
                    <ThreatRow
                      key={id}
                      id={id}
                      name={t.name}
                      description={t.description}
                      count={t.consequences.length}
                      dragDisabled={dragDisabled}
                      onEdit={() => startEditThreat(tIdx)}
                      onRemove={() => {
                        // If we were looking at its consequences, bounce back.
                        if (panel.kind === "cons" && panel.tIdx === tIdx) {
                          backToThreats();
                        }
                        removeThreatAt(tIdx);
                      }}
                      onOpenConsequences={() => goConsFor(tIdx)}
                    >
                      {isEditing && (
                        <div className="mt-2 rounded-md border p-3 bg-muted/30 space-y-3">
                          {tErr && (
                            <p className="text-sm text-destructive">{tErr}</p>
                          )}
                          <div className="grid gap-1">
                            <Label htmlFor={`t-name-${tIdx}`}>Name</Label>
                            <Input
                              id={`t-name-${tIdx}`}
                              value={tName}
                              onChange={(e) => setTName(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor={`t-desc-${tIdx}`}>
                              Short description{" "}
                              <span className="text-muted-foreground">
                                (Markdown + tokens)
                              </span>
                            </Label>
                            <Textarea
                              id={`t-desc-${tIdx}`}
                              rows={2}
                              value={tDesc}
                              onChange={(e) => setTDesc(e.target.value)}
                              placeholder="What the challenge starts to do…"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button onClick={saveThreat}>
                              <Check className="h-4 w-4 mr-1" /> Save
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={cancelEditThreat}
                            >
                              <X className="h-4 w-4 mr-1" /> Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </ThreatRow>
                  );
                })}

                {/* Add threat row */}
                <li className="flex">
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-1 w-full justify-center gap-2 border-dashed"
                    onClick={addThreatPlaceholder}
                  >
                    <Plus className="h-4 w-4" /> Add threat
                  </Button>
                </li>
              </ul>
            </SortableContext>

            {/* Footer actions for general consequences entry point */}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={goGeneralCons}>
                Edit general consequences
              </Button>
            </div>
          </div>

          {/* PANEL B: Consequences editor (right half) */}
          <div className="w-full pl-2 min-w-0">
            {panel.kind === "cons" && currentThreatIndex != null ? (
              <div className="space-y-4">
                {/* Back + context */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={backToThreats}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <div className="font-semibold">
                    Consequences for:{" "}
                    {challenge.threats[currentThreatIndex]?.name}
                  </div>
                </div>

                {challenge.threats[currentThreatIndex]?.description ? (
                  <div
                    className="text-sm text-foreground/80 prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderLitmMarkdown(
                        challenge.threats[currentThreatIndex]?.description || ""
                      ),
                    }}
                  />
                ) : null}

                {/* Consequences list */}
                <SortableContext
                  items={consIds}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="space-y-2">
                    {challenge.threats[currentThreatIndex]?.consequences.map(
                      (text, cIdx) => {
                        const isEditing = editingCons === cIdx;
                        return (
                          <ConsequenceRow
                            key={`c:${cIdx}`}
                            id={`c:${cIdx}`}
                            dragDisabled={dragDisabled}
                            isEditing={isEditing}
                            text={text}
                            onEdit={() => startEditConsequence(cIdx, text)}
                            onRemove={() =>
                              removeConsequence(currentThreatIndex, cIdx)
                            }
                          >
                            {isEditing && (
                              <InlineConsequenceEditor
                                value={consDraft}
                                onChange={setConsDraft}
                                onSave={saveConsequence}
                                onCancel={() => {
                                  setEditingCons(null);
                                  setConsDraft("");
                                }}
                              />
                            )}
                          </ConsequenceRow>
                        );
                      }
                    )}

                    {/* Add consequence */}
                    <li className="flex">
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-1 w-full justify-center gap-2 border-dashed"
                        onClick={addConsequencePlaceholder}
                      >
                        <Plus className="h-4 w-4" /> Add consequence
                      </Button>
                    </li>
                  </ul>
                </SortableContext>
              </div>
            ) : panel.kind === "general" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={backToThreats}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <div className="font-semibold">General Consequences</div>
                </div>

                <SortableContext
                  items={generalIds}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="space-y-2">
                    {challenge.general_consequences.map((text, idx) => {
                      const isEditing = editingGeneralCons === idx;
                      return (
                        <ConsequenceRow
                          key={`gc:${idx}`}
                          id={`gc:${idx}`}
                          dragDisabled={dragDisabled}
                          isEditing={isEditing}
                          text={text}
                          onEdit={() => startEditGeneral(idx, text)}
                          onRemove={() => removeGeneralConsequence(idx)}
                        >
                          {isEditing && (
                            <InlineConsequenceEditor
                              value={generalDraft}
                              onChange={setGeneralDraft}
                              onSave={saveGeneral}
                              onCancel={() => {
                                setEditingGeneralCons(null);
                                setGeneralDraft("");
                              }}
                            />
                          )}
                        </ConsequenceRow>
                      );
                    })}

                    <li className="flex">
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-1 w-full justify-center gap-2 border-dashed"
                        onClick={addGeneralPlaceholder}
                      >
                        <Plus className="h-4 w-4" /> Add general consequence
                      </Button>
                    </li>
                  </ul>
                </SortableContext>
              </div>
            ) : (
              <div className="flex items-center justify-center text-muted-foreground">
                {/* Filler when panel.kind === "threats" but the slide hasn't moved yet */}
                Select a threat to edit its consequences
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
}

/* ----------------------------------------------------------------------------
   Row components
---------------------------------------------------------------------------- */

function ThreatRow({
  id,
  name,
  description,
  dragDisabled,
  count,
  onEdit,
  onRemove,
  onOpenConsequences,
  children,
}: {
  id: string;
  name: string;
  description?: string | null;
  dragDisabled: boolean;
  count?: number;
  onEdit: () => void;
  onRemove: () => void;
  onOpenConsequences: () => void;
  children?: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: dragDisabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`rounded-md border bg-white px-3 py-3 ${
        isDragging ? "shadow-lg ring-1 ring-slate-200" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Left: drag + content */}
        <div className="flex items-start gap-2 min-w-0">
          <button
            className={`h-8 w-8 inline-flex items-center justify-center rounded hover:bg-slate-50
              ${dragDisabled ? "opacity-40 cursor-not-allowed hover:bg-transparent" : "cursor-grab active:cursor-grabbing"}`}
            aria-label="Drag to reorder threat"
            title={
              dragDisabled ? "Finish editing to reorder" : "Drag to reorder"
            }
            disabled={dragDisabled}
            {...(!dragDisabled ? attributes : {})}
            {...(!dragDisabled ? listeners : {})}
          >
            <GripVertical className="h-4 w-4 text-slate-500" />
          </button>

          <div className="min-w-0">
            <div className="font-semibold threat-pill !text-xs">{name}</div>
            {description ? (
              <div
                className="text-sm prose-sm max-w-none font-(family-name:--font-ch-threat-desc)"
                dangerouslySetInnerHTML={{
                  __html: renderLitmMarkdown(description),
                }}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No description
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Consequences icon button with count */}

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onOpenConsequences}
              aria-label="Edit consequences"
              title="Consequences"
            >
              <img
                src="/assets/images/consequence.svg"
                alt=""
                className="h-6 w-6"
              />
            </Button>

            {/* tiny count badge (optional) */}
            {typeof count === "number" && count > 0 && (
              <span className="pointer-events-none absolute -top-1 -right-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-secondary border-1 border-zinc-400 text-secondary-foreground text-sm font-bold font-serif leading-none px-1">
                <span className="-translate-y-0.5">{count}</span>
              </span>
            )}
          </div>

          {/* Edit / Remove keep the same */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Edit"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            title="Remove"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Inline editor block (optional) */}
      {children}
    </li>
  );
}

function ConsequenceRow({
  id,
  text,
  dragDisabled,
  isEditing,
  onEdit,
  onRemove,
  children,
}: {
  id: string;
  text: string;
  dragDisabled: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onRemove: () => void;
  children?: React.ReactNode; // inline editor when editing
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: dragDisabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 ${
        isDragging ? "shadow-lg ring-1 ring-slate-200" : ""
      }`}
    >
      {/* Left: drag + text / editor */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          className={`h-8 w-8 inline-flex items-center justify-center rounded hover:bg-slate-50
            ${dragDisabled ? "opacity-40 cursor-not-allowed hover:bg-transparent" : "cursor-grab active:cursor-grabbing"}`}
          aria-label="Drag to reorder consequence"
          title={dragDisabled ? "Finish editing to reorder" : "Drag to reorder"}
          disabled={dragDisabled}
          {...(!dragDisabled ? attributes : {})}
          {...(!dragDisabled ? listeners : {})}
        >
          <GripVertical className="h-4 w-4 text-slate-500" />
        </button>

        {isEditing ? (
          <div className="flex-1 min-w-0">{children}</div>
        ) : (
          <div
            className="flex-1 prose-sm max-w-none text-foreground/90 min-w-0"
            dangerouslySetInnerHTML={{ __html: renderLitmMarkdown(text) }}
          />
        )}
      </div>

      {/* Actions */}
      {!isEditing ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Edit"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : null}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive"
        title="Remove"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}

function InlineConsequenceEditor({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        className="flex-1"
        autoFocus
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave();
          if (e.key === "Escape") onCancel();
        }}
      />
      <Button size="icon" title="Save" onClick={onSave}>
        <Check className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="secondary" title="Cancel" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
