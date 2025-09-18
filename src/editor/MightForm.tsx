import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    useChallengeStore,
    type Might,
    type MightLevel, // ensure this includes "origin" | "adventure" | "greatness"
} from '@/store/challengeStore'
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

// Levels & assets
const LEVELS: MightLevel[] = ['origin', 'adventure', 'greatness']
const ICON_BY_LEVEL: Record<MightLevel, string> = {
    origin: '/assets/images/might-origin.svg',
    adventure: '/assets/images/might-adventure.svg',
    greatness: '/assets/images/might-greatness.svg',
}

export default function MightForm({ focusIndex }: { focusIndex?: number }) {
    const { challenge, addMight, updateMightAt, removeMightAt, moveMight } =
        useChallengeStore()

    // One inline editor at a time
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [eName, setEName] = useState('')
    const [eLevel, setELevel] = useState<MightLevel>('adventure')
    const [hasVuln, setHasVuln] = useState(false)
    const [eVulnerability, setEVulnerability] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Deep-link open
    useEffect(() => {
        if (typeof focusIndex === 'number' && challenge.mights[focusIndex]) {
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

    // Stable-ish IDs for current render (index::name::level)
    const itemIds = useMemo(
        () => challenge.mights.map((m, i) => `${i}::${m.name}::${m.level}`),
        [challenge.mights]
    )

    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e
        if (!over || active.id === over.id) return
        const from = Number(String(active.id).split('::')[0] || -1)
        const to = Number(String(over.id).split('::')[0] || -1)
        if (from >= 0 && to >= 0 && from !== to) moveMight(from, to)
    }

    const dragDisabled = editingIndex !== null

    // Helpers
    function isDuplicate(candidate: Might, exceptIndex?: number) {
        return challenge.mights.some((m, i) => {
            if (i === exceptIndex) return false
            return (
                m.name.trim().toLowerCase() ===
                    candidate.name.trim().toLowerCase() &&
                m.level === candidate.level
            )
        })
    }

    function uniquePlaceholderName(): string {
        const base = 'New Might'
        const used = new Set(challenge.mights.map((m) => m.name.toLowerCase()))
        if (!used.has(base.toLowerCase())) return base
        let n = 2
        while (used.has(`${base} ${n}`.toLowerCase())) n++
        return `${base} ${n}`
    }

    function addPlaceholder() {
        const placeholder: Might = {
            name: uniquePlaceholderName(),
            level: 'adventure',
            vulnerability: null,
        }
        const newIndex = challenge.mights.length
        addMight(placeholder)
        // Open inline editor for it
        setEditingIndex(newIndex)
        setEName(placeholder.name)
        setELevel(placeholder.level)
        setEVulnerability('')
        setHasVuln(false)
        setError(null)
    }

    function startEdit(idx: number) {
        const m = challenge.mights[idx]
        if (!m) return
        setEditingIndex(idx)
        setEName(m.name)
        setELevel(m.level)
        setEVulnerability(m.vulnerability ?? '')
        setHasVuln(!!m.vulnerability)
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setEName('')
        setELevel('adventure')
        setEVulnerability('')
        setHasVuln(false)
        setError(null)
    }

    function confirmEdit() {
        if (editingIndex == null) return
        const updated: Might = {
            name: eName.trim(),
            level: eLevel,
            vulnerability:
                hasVuln && eVulnerability.trim() ? eVulnerability.trim() : null,
        }
        if (!updated.name) return setError('Name is required.')
        if (isDuplicate(updated, editingIndex))
            return setError('A Might with that name and level already exists.')
        updateMightAt(editingIndex, updated)
        cancelEdit()
    }

    return (
        <div className="space-y-3">
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
                        {challenge.mights.map((m, idx) => (
                            <SortableMightItem
                                key={itemIds[idx]}
                                id={itemIds[idx]}
                                might={m}
                                isEditing={editingIndex === idx}
                                dragDisabled={dragDisabled}
                                onEdit={() => startEdit(idx)}
                                onRemove={() => removeMightAt(idx)}
                            >
                                {editingIndex === idx && (
                                    <div className="mt-2 rounded-md border p-3 bg-muted/30 space-y-3">
                                        {error && (
                                            <p className="text-sm text-destructive">
                                                {error}
                                            </p>
                                        )}

                                        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
                                            {/* Name */}
                                            <div className="grid gap-1">
                                                <Label
                                                    htmlFor={`might-name-${idx}`}
                                                >
                                                    Name
                                                </Label>
                                                <Input
                                                    id={`might-name-${idx}`}
                                                    value={eName}
                                                    onChange={(e) =>
                                                        setEName(e.target.value)
                                                    }
                                                />
                                            </div>

                                            {/* Level icons (buttons) */}
                                            <div className="grid gap-1">
                                                <Label className="text-sm">
                                                    Level
                                                </Label>
                                                <div className="flex items-center gap-1">
                                                    {LEVELS.map((lv) => (
                                                        <button
                                                            key={lv}
                                                            type="button"
                                                            onClick={() =>
                                                                setELevel(lv)
                                                            }
                                                            title={lv} // optional tooltip
                                                            className={`rounded-md border p-1 transition
                                ${eLevel === lv ? 'ring-2 ring-slate-400' : 'hover:bg-slate-50'}`}
                                                            aria-pressed={
                                                                eLevel === lv
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    ICON_BY_LEVEL[
                                                                        lv
                                                                    ]
                                                                }
                                                                alt={lv}
                                                                className="h-6 w-6"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Vulnerability switch */}
                                            <div className="flex items-center gap-2 pt-5 md:pt-0">
                                                <Switch
                                                    id={`might-vuln-${idx}`}
                                                    checked={hasVuln}
                                                    onCheckedChange={(v) =>
                                                        setHasVuln(!!v)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`might-vuln-${idx}`}
                                                    className="text-sm"
                                                >
                                                    Vulnerability
                                                </Label>
                                            </div>
                                        </div>

                                        {hasVuln && (
                                            <div className="grid gap-1">
                                                <Label
                                                    htmlFor={`might-vuln-input-${idx}`}
                                                >
                                                    Vulnerability
                                                </Label>
                                                <Input
                                                    id={`might-vuln-input-${idx}`}
                                                    placeholder="e.g., flattery"
                                                    value={eVulnerability}
                                                    onChange={(e) =>
                                                        setEVulnerability(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
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
                            </SortableMightItem>
                        ))}

                        {/* Add button row */}
                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-1 w-full justify-center gap-2 border-dashed"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-4 w-4" /> Add might
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

/* ---------- Sortable item ---------- */
function SortableMightItem({
    id,
    might: m,
    isEditing,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    might: Might
    isEditing: boolean
    dragDisabled: boolean
    onEdit: () => void
    onRemove: () => void
    children?: React.ReactNode
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
            {/* Row: handle + icon + name (+ vuln) + actions */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    {/* drag handle */}
                    <button
                        className={`h-8 w-8 inline-flex items-center justify-center rounded hover:bg-slate-50
              ${
                  dragDisabled
                      ? 'opacity-40 cursor-not-allowed hover:bg-transparent'
                      : 'cursor-grab active:cursor-grabbing'
              }`}
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

                    {/* level icon */}
                    <img
                        src={ICON_BY_LEVEL[m.level]}
                        alt={m.level}
                        className="h-5 w-5 shrink-0"
                    />

                    {/* text */}
                    <div className="min-w-0 truncate text-wrap">
                        <span className="text-sm font-medium truncate">
                            {m.name}
                        </span>
                        {m.vulnerability && (
                            <span className="text-sm">
                                {' '}
                                ({m.vulnerability})
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onEdit}
                        title="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={onRemove}
                        title="Remove"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Inline editor content */}
            {children}
        </li>
    )
}
