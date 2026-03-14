import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { renderDangerMarkdownInline } from '../../markdown'
import { useEffect, useMemo, useState } from 'react'
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

type MoveListFormProps = {
    values: string[]
    focusIndex?: number
    addLabel: string
    emptyPlaceholder: string
    fieldLabel: string
    defaultValue: string
    addValue: (value: string) => void
    updateValue: (index: number, value: string) => void
    removeValue: (index: number) => void
    moveValue: (from: number, to: number) => void
}

export default function MoveListForm({
    values,
    focusIndex,
    addLabel,
    emptyPlaceholder,
    fieldLabel,
    defaultValue,
    addValue,
    updateValue,
    removeValue,
    moveValue,
}: MoveListFormProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [draft, setDraft] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (typeof focusIndex === 'number' && values[focusIndex] != null) {
            startEdit(focusIndex)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const itemIds = useMemo(
        () => values.map((value, index) => `${index}::${value}`),
        [values]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split('::')[0] || -1)
        const to = Number(String(over.id).split('::')[0] || -1)
        if (from >= 0 && to >= 0 && from !== to) {
            moveValue(from, to)
        }
    }

    function addPlaceholder() {
        const index = values.length
        addValue(defaultValue)
        setEditingIndex(index)
        setDraft(defaultValue)
        setError(null)
    }

    function startEdit(index: number) {
        const value = values[index]
        if (value == null) return
        setEditingIndex(index)
        setDraft(value)
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setDraft('')
        setError(null)
    }

    function confirmEdit() {
        if (editingIndex == null) return
        const next = draft.trim()
        if (!next) {
            setError('Please enter a value.')
            return
        }

        updateValue(editingIndex, next)
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
                        {values.map((value, index) => (
                            <SortableMoveRow
                                key={itemIds[index]}
                                id={itemIds[index]}
                                value={value}
                                dragDisabled={editingIndex !== null}
                                onEdit={() => startEdit(index)}
                                onRemove={() => removeValue(index)}
                            >
                                {editingIndex === index ? (
                                    <div className="mt-2 space-y-3 rounded-md border bg-muted/30 p-3">
                                        {error ? (
                                            <p className="text-sm text-destructive">
                                                {error}
                                            </p>
                                        ) : null}
                                        <div className="grid gap-2">
                                            <Label htmlFor={`${fieldLabel}-${index}`}>
                                                {fieldLabel}
                                            </Label>
                                            <Textarea
                                                id={`${fieldLabel}-${index}`}
                                                rows={4}
                                                value={draft}
                                                onChange={(event) =>
                                                    setDraft(event.target.value)
                                                }
                                                placeholder={emptyPlaceholder}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button type="button" onClick={confirmEdit}>
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
                                        </div>
                                    </div>
                                ) : null}
                            </SortableMoveRow>
                        ))}

                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-1 w-full justify-center gap-2 border-dashed"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-4 w-4" />
                                {addLabel}
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableMoveRow({
    id,
    value,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    value: string
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

    return (
        <li
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={`rounded-md border bg-white px-3 py-2 max-w-full ${
                isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                    <button
                        type="button"
                        className={`inline-flex h-8 w-8 items-center justify-center rounded hover:bg-slate-50 ${
                            dragDisabled
                                ? 'cursor-not-allowed opacity-40 hover:bg-transparent'
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

                    <div className="min-w-0 city-danger-token-scope font-['PT_Serif'] text-sm leading-6">
                        <span
                            className="block"
                            dangerouslySetInnerHTML={{
                                __html: renderDangerMarkdownInline(value),
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onEdit}
                        title="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
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

            {children}
        </li>
    )
}
