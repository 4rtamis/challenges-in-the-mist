import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { renderDangerMarkdownInline } from '../../markdown'
import { useCityOfMistDangerStore } from '../../hooks'
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

const DEFAULT_CUSTOM_MOVE = {
    name: 'Custom Move',
    description: 'Describe the custom move.',
}

export default function CustomMovesForm({
    focusIndex,
}: {
    focusIndex?: number
}) {
    const {
        cityOfMistDanger,
        addCustomMove,
        updateCustomMoveAt,
        removeCustomMoveAt,
        moveCustomMove,
    } = useCityOfMistDangerStore()

    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [name, setName] = useState(DEFAULT_CUSTOM_MOVE.name)
    const [description, setDescription] = useState(DEFAULT_CUSTOM_MOVE.description)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (
            typeof focusIndex === 'number' &&
            cityOfMistDanger.custom_moves[focusIndex]
        ) {
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
        () =>
            cityOfMistDanger.custom_moves.map(
                (customMove, index) => `${index}:${customMove.name}`
            ),
        [cityOfMistDanger.custom_moves]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split(':')[0] || -1)
        const to = Number(String(over.id).split(':')[0] || -1)
        if (from >= 0 && to >= 0 && from !== to) {
            moveCustomMove(from, to)
        }
    }

    function addPlaceholder() {
        const index = cityOfMistDanger.custom_moves.length
        addCustomMove(DEFAULT_CUSTOM_MOVE)
        setEditingIndex(index)
        setName(DEFAULT_CUSTOM_MOVE.name)
        setDescription(DEFAULT_CUSTOM_MOVE.description)
        setError(null)
    }

    function startEdit(index: number) {
        const customMove = cityOfMistDanger.custom_moves[index]
        if (!customMove) return
        setEditingIndex(index)
        setName(customMove.name)
        setDescription(customMove.description)
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setName(DEFAULT_CUSTOM_MOVE.name)
        setDescription(DEFAULT_CUSTOM_MOVE.description)
        setError(null)
    }

    function confirmEdit() {
        if (editingIndex == null) return
        const trimmedName = name.trim()
        const trimmedDescription = description.trim()
        if (!trimmedName) {
            setError('Custom move name is required.')
            return
        }
        if (!trimmedDescription) {
            setError('Custom move description is required.')
            return
        }

        updateCustomMoveAt(editingIndex, {
            name: trimmedName,
            description: trimmedDescription,
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
                    <ul className="space-y-2">
                        {cityOfMistDanger.custom_moves.map((customMove, index) => (
                            <SortableCustomMoveRow
                                key={itemIds[index]}
                                id={itemIds[index]}
                                name={customMove.name}
                                description={customMove.description}
                                dragDisabled={editingIndex !== null}
                                onEdit={() => startEdit(index)}
                                onRemove={() => removeCustomMoveAt(index)}
                            >
                                {editingIndex === index ? (
                                    <div className="mt-2 space-y-3 rounded-md border bg-muted/30 p-3">
                                        {error ? (
                                            <p className="text-sm text-destructive">
                                                {error}
                                            </p>
                                        ) : null}
                                        <div className="grid gap-2">
                                            <Label htmlFor={`custom-move-name-${index}`}>
                                                Name
                                            </Label>
                                            <Input
                                                id={`custom-move-name-${index}`}
                                                value={name}
                                                onChange={(event) =>
                                                    setName(event.target.value)
                                                }
                                                placeholder="Custom Move"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`custom-move-description-${index}`}>
                                                Description
                                            </Label>
                                            <Textarea
                                                id={`custom-move-description-${index}`}
                                                rows={5}
                                                value={description}
                                                onChange={(event) =>
                                                    setDescription(event.target.value)
                                                }
                                                placeholder="Describe the custom move."
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
                            </SortableCustomMoveRow>
                        ))}
                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-1 w-full justify-center gap-2 border-dashed"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-4 w-4" />
                                Add custom move
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableCustomMoveRow({
    id,
    name,
    description,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    name: string
    description: string
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
                        <div className="font-bold">{name}</div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: renderDangerMarkdownInline(description),
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
