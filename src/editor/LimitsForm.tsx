import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useChallengeStore, type Limit } from '@/store/challengeStore'
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const PRESET_LIMITS = ['Harm', 'Scare', 'Convince', 'Subdue', 'Banish']

export default function LimitsForm({ focusIndex }: { focusIndex?: number }) {
    const { challenge, addLimit, updateLimitAt, removeLimitAt, moveLimit } =
        useChallengeStore()

    // --- inline editor state (for a single item at a time) ---
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [eName, setEName] = useState('')
    const [eLevel, setELevel] = useState(4)
    const [eImmune, setEImmune] = useState(false)
    const [eProgress, setEProgress] = useState(false)
    const [eOnMax, setEOnMax] = useState('')
    const [error, setError] = useState<string | null>(null)

    const dragDisabled = editingIndex !== null

    // open editor for the focused index (from sheet deep link)
    useEffect(() => {
        if (typeof focusIndex === 'number' && challenge.limits[focusIndex]) {
            startEdit(focusIndex)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex])

    // dnd-kit sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const itemIds = useMemo(
        () => challenge.limits.map((l) => l.name),
        [challenge.limits]
    )

    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e
        if (!over || active.id === over.id) return
        const from = itemIds.indexOf(String(active.id))
        const to = itemIds.indexOf(String(over.id))
        if (from !== -1 && to !== -1 && from !== to) moveLimit(from, to)
    }

    // ---- helpers ----
    function isDuplicateName(nm: string, except?: number) {
        const target = nm.trim().toLowerCase()
        return challenge.limits.some(
            (l, i) => i !== except && l.name.trim().toLowerCase() === target
        )
    }

    function startEdit(idx: number) {
        const l = challenge.limits[idx]
        if (!l) return
        setEditingIndex(idx)
        setEName(l.name)
        setELevel(l.level)
        setEImmune(!!l.is_immune)
        setEProgress(!!l.is_progress)
        setEOnMax(l.on_max ?? '')
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setEName('')
        setELevel(4)
        setEImmune(false)
        setEProgress(false)
        setEOnMax('')
        setError(null)
    }

    function confirmEdit() {
        if (editingIndex == null) return
        const nm = eName.trim()
        if (!nm) return setError('Name is required.')
        if (isDuplicateName(nm, editingIndex))
            return setError('Limit name already exists.')
        updateLimitAt(editingIndex, {
            name: nm,
            level: Math.max(1, Math.min(6, Number(eLevel) || 1)),
            is_immune: eImmune,
            is_progress: eProgress,
            on_max: eProgress ? eOnMax.trim() || null : null,
        })
        cancelEdit()
    }

    function uniquePlaceholderName(): string {
        // Prefer an unused preset at random
        const used = new Set(challenge.limits.map((l) => l.name.toLowerCase()))
        const available = PRESET_LIMITS.filter(
            (p) => !used.has(p.toLowerCase())
        )
        if (available.length) {
            const pick = available[Math.floor(Math.random() * available.length)]
            return pick
        }
        // Fallback: New Limit, New Limit 2, 3, ...
        const base = 'New Limit'
        if (!used.has(base.toLowerCase())) return base
        let n = 2
        while (used.has(`${base} ${n}`.toLowerCase())) n++
        return `${base} ${n}`
    }

    function addPlaceholder() {
        const placeholder: Limit = {
            name: uniquePlaceholderName(),
            level: 4,
            is_immune: false,
            is_progress: false,
            on_max: null,
        }
        // Add at the end, then open editor for it.
        const newIndex = challenge.limits.length
        addLimit(placeholder)
        // Optimistically open the editor with placeholder values.
        setEditingIndex(newIndex)
        setEName(placeholder.name)
        setELevel(placeholder.level)
        setEImmune(!!placeholder.is_immune)
        setEProgress(!!placeholder.is_progress)
        setEOnMax(placeholder.on_max ?? '')
        setError(null)
    }

    return (
        <div className="space-y-3">
            {/* Drag & drop list */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={itemIds}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="space-y-2">
                        {challenge.limits.map((l, idx) => (
                            <SortableLimitItem
                                key={itemIds[idx]}
                                id={itemIds[idx]}
                                limit={l}
                                dragDisabled={dragDisabled}
                                // row actions
                                onEdit={() => startEdit(idx)}
                                onRemove={() => removeLimitAt(idx)}
                            >
                                {editingIndex === idx && (
                                    <div className="mt-2 rounded-md border p-3 bg-muted/30 space-y-3">
                                        {error && (
                                            <p className="text-sm text-destructive">
                                                {error}
                                            </p>
                                        )}

                                        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
                                            {/* Name */}
                                            <div className="grid gap-1">
                                                <Label
                                                    htmlFor={`limit-name-${idx}`}
                                                >
                                                    Name
                                                </Label>
                                                <Input
                                                    id={`limit-name-${idx}`}
                                                    value={eName}
                                                    onChange={(e) =>
                                                        setEName(e.target.value)
                                                    }
                                                />
                                            </div>

                                            {/* Level */}
                                            <div className="grid gap-1">
                                                <Label
                                                    htmlFor={`limit-level-${idx}`}
                                                >
                                                    Level
                                                </Label>
                                                <Input
                                                    id={`limit-level-${idx}`}
                                                    type="number"
                                                    min={1}
                                                    max={6}
                                                    value={eLevel}
                                                    onChange={(e) =>
                                                        setELevel(
                                                            Math.max(
                                                                1,
                                                                Math.min(
                                                                    6,
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    ) || 1
                                                                )
                                                            )
                                                        )
                                                    }
                                                    disabled={eImmune}
                                                    title={
                                                        eImmune
                                                            ? 'Ignored when immune'
                                                            : '1–6'
                                                    }
                                                />
                                            </div>

                                            {/* Immune */}
                                            <div className="flex items-center gap-2 pt-5 md:pt-0">
                                                <Switch
                                                    id={`limit-immune-${idx}`}
                                                    checked={eImmune}
                                                    onCheckedChange={(v) =>
                                                        setEImmune(!!v)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`limit-immune-${idx}`}
                                                    className="text-sm"
                                                >
                                                    Immune
                                                </Label>
                                            </div>

                                            {/* Progress */}
                                            <div className="flex items-center gap-2 pt-5 md:pt-0">
                                                <Switch
                                                    id={`limit-progress-${idx}`}
                                                    checked={eProgress}
                                                    onCheckedChange={(v) =>
                                                        setEProgress(!!v)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`limit-progress-${idx}`}
                                                    className="text-sm"
                                                >
                                                    Progress limit
                                                </Label>
                                            </div>
                                        </div>

                                        {eProgress && (
                                            <Textarea
                                                rows={2}
                                                placeholder="When this progress limit is maxed…"
                                                value={eOnMax}
                                                onChange={(ev) =>
                                                    setEOnMax(ev.target.value)
                                                }
                                            />
                                        )}

                                        <div className="flex items-center gap-2">
                                            <Button onClick={confirmEdit}>
                                                Save
                                            </Button>
                                            <Button
                                                variant="link"
                                                className="h-8 p-0"
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </SortableLimitItem>
                        ))}

                        {/* Add button as a list row */}
                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-1 w-full justify-center gap-2 border-dashed"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-4 w-4" /> Add limit
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

/* ---------- Sortable item ---------- */
function SortableLimitItem({
    id,
    limit: l,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    limit: Limit
    dragDisabled: boolean
    onEdit: () => void
    onRemove: () => void
    children?: React.ReactNode // inline editor renders here when open
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled: dragDisabled })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`rounded-md border bg-white px-3 py-2 ${
                isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''
            }`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                    <button
                        className={`h-8 w-8 inline-flex items-center justify-center rounded hover:bg-slate-50
              ${dragDisabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : 'cursor-grab active:cursor-grabbing'}`}
                        aria-label="Drag to reorder"
                        title={
                            dragDisabled
                                ? 'Finish editing to reorder'
                                : 'Drag to reorder'
                        }
                        disabled={dragDisabled}
                        {...(!dragDisabled ? attributes : {})}
                        {...(!dragDisabled ? listeners : {})}
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
                                        ? '~'
                                        : Math.max(
                                              1,
                                              Math.min(
                                                  6,
                                                  Math.floor(l.level || 1)
                                              )
                                          )
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

                {/* Right: row actions */}
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
            </div>

            {/* Inline editor (collapsible area) */}
            {children}
        </li>
    )
}
