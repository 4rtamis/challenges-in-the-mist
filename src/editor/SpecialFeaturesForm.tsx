import { useChallengeStore } from '@/store/challengeStore'
import { renderLitmMarkdown } from '@/utils/markdown'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'

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

export default function SpecialFeaturesForm({
    focusIndex,
}: {
    focusIndex?: number
}) {
    const {
        challenge,
        addSpecialFeature,
        updateSpecialFeatureAt,
        removeSpecialFeatureAt,
        moveSpecialFeature,
    } = useChallengeStore()

    // One inline editor at a time
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [eName, setEName] = useState('')
    const [eDesc, setEDesc] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Deep-link open from preview/sheet
    useEffect(() => {
        if (
            typeof focusIndex === 'number' &&
            challenge.special_features[focusIndex]
        ) {
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

    // Stable IDs for current render (index::name)
    const itemIds = useMemo(
        () =>
            challenge.special_features.map(
                (sf, i) => `${i}::${sf.name || 'feature'}`
            ),
        [challenge.special_features]
    )

    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e
        if (!over || active.id === over.id) return
        const from = Number(String(active.id).split('::')[0] || -1)
        const to = Number(String(over.id).split('::')[0] || -1)
        if (from >= 0 && to >= 0 && from !== to) moveSpecialFeature(from, to)
    }

    const dragDisabled = editingIndex !== null

    // Helpers
    function uniquePlaceholderName(): string {
        const base = 'New Feature'
        const used = new Set(
            challenge.special_features.map((sf) =>
                (sf.name || '').toLowerCase()
            )
        )
        if (!used.has(base.toLowerCase())) return base
        let n = 2
        while (used.has(`${base} ${n}`.toLowerCase())) n++
        return `${base} ${n}`
    }

    function addPlaceholder() {
        const placeholder = { name: uniquePlaceholderName(), description: '' }
        const newIndex = challenge.special_features.length
        addSpecialFeature(placeholder)
        // open inline editor for the new item
        setEditingIndex(newIndex)
        setEName(placeholder.name)
        setEDesc('')
        setError(null)
    }

    function startEdit(i: number) {
        const sf = challenge.special_features[i]
        if (!sf) return
        setEditingIndex(i)
        setEName(sf.name || '')
        setEDesc(sf.description || '')
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setEName('')
        setEDesc('')
        setError(null)
    }

    function saveEdit() {
        if (editingIndex == null) return
        if (!eName.trim()) return setError('Name is required.')
        updateSpecialFeatureAt(editingIndex, {
            name: eName.trim(),
            description: eDesc,
        })
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
                    <ul className="space-y-3">
                        {challenge.special_features.map((sf, i) => (
                            <SortableFeatureItem
                                key={itemIds[i]}
                                id={itemIds[i]}
                                name={sf.name}
                                description={sf.description}
                                isEditing={editingIndex === i}
                                dragDisabled={dragDisabled}
                                onEdit={() => startEdit(i)}
                                onRemove={() => removeSpecialFeatureAt(i)}
                            >
                                {editingIndex === i && (
                                    <div className="mt-2 rounded-md border p-3 bg-muted/30 space-y-3">
                                        {error && (
                                            <p className="text-sm text-destructive">
                                                {error}
                                            </p>
                                        )}
                                        <div className="grid gap-1">
                                            <Label htmlFor={`sf-name-${i}`}>
                                                Name
                                            </Label>
                                            <Input
                                                id={`sf-name-${i}`}
                                                value={eName}
                                                onChange={(e) =>
                                                    setEName(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label htmlFor={`sf-desc-${i}`}>
                                                Description{' '}
                                                <span className="text-muted-foreground">
                                                    (Markdown)
                                                </span>
                                            </Label>
                                            <Textarea
                                                id={`sf-desc-${i}`}
                                                rows={4}
                                                value={eDesc}
                                                onChange={(e) =>
                                                    setEDesc(e.target.value)
                                                }
                                                placeholder="When this happens... then do that."
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button onClick={saveEdit}>
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
                            </SortableFeatureItem>
                        ))}

                        {/* Add button row */}
                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-1 w-full justify-center gap-2 border-dashed"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-4 w-4" /> Add feature
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

/* ---------- Sortable item ---------- */
function SortableFeatureItem({
    id,
    name,
    description,
    isEditing,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    name: string
    description?: string | null
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
            className={`rounded-md border bg-white px-3 py-3 ${
                isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Left: handle + content */}
                <div className="flex items-start gap-2 min-w-0">
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

                    <div className="min-w-0">
                        <div className="font-medium truncate">{name}</div>
                        {description ? (
                            <div
                                className="text-sm text-foreground/80 prose-sm max-w-none"
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

            {/* Inline editor content */}
            {children}
        </li>
    )
}
