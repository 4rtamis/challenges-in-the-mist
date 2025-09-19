import { useChallengeStore } from '@/store/challengeStore'
import { renderLitmMarkdown } from '@/utils/markdown'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

export default function TagsStatusesForm({
    focusIndex,
}: {
    focusIndex?: number
}) {
    const { challenge, addToken, removeTokenAt, replaceTokenAt, moveToken } =
        useChallengeStore()

    // One inline editor at a time
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [raw, setRaw] = useState('') // raw string for the editor
    const [error, setError] = useState<string | null>(null)

    // Open editor when sheet deep-links to an index
    useEffect(() => {
        if (
            typeof focusIndex === 'number' &&
            challenge.tags_and_statuses[focusIndex] != null
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

    // IDs must be unique even if values repeat. Use "index::value" snapshot IDs.
    const itemIds = useMemo(
        () => challenge.tags_and_statuses.map((v, i) => `${i}::${v}`),
        [challenge.tags_and_statuses]
    )

    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e
        if (!over || active.id === over.id) return
        const from = Number(String(active.id).split('::')[0] || -1)
        const to = Number(String(over.id).split('::')[0] || -1)
        if (from >= 0 && to >= 0 && from !== to) moveToken(from, to)
    }

    const dragDisabled = editingIndex !== null

    // Helpers
    function addPlaceholder() {
        const samples = [
            '{radiant beauty}',
            '{hungry maw}',
            '{!must be invited in}',
            '{mysterious-3}',
            '{furious-2}',
            '{sword}, {mace} or {dagger}',
        ]
        const sample = samples[Math.floor(Math.random() * samples.length)]
        const newIndex = challenge.tags_and_statuses.length
        addToken(sample)
        // open editor for the newly added one
        setEditingIndex(newIndex)
        setRaw(sample)
        setError(null)
    }

    function startEdit(idx: number) {
        const v = challenge.tags_and_statuses[idx]
        if (v == null) return
        setEditingIndex(idx)
        setRaw(v)
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setRaw('')
        setError(null)
    }

    function confirmEdit() {
        if (editingIndex == null) return
        const next = raw.trim()
        if (!next) {
            setError('Please enter a value.')
            return
        }
        // allow duplicates intentionally (they’re just strings)
        replaceTokenAt(editingIndex, next)
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
                        {challenge.tags_and_statuses.map((value, idx) => (
                            <SortableTokenItem
                                key={itemIds[idx]}
                                id={itemIds[idx]}
                                value={value}
                                dragDisabled={dragDisabled}
                                onEdit={() => startEdit(idx)}
                                onRemove={() => removeTokenAt(idx)}
                            >
                                {editingIndex === idx && (
                                    <div className="mt-2 rounded-md border p-3 bg-muted/30 space-y-3">
                                        {error && (
                                            <p className="text-sm text-destructive">
                                                {error}
                                            </p>
                                        )}
                                        <div className="grid gap-2">
                                            <Label htmlFor={`tag-raw-${idx}`}>
                                                Raw value{' '}
                                                <span className="text-muted-foreground font-normal">
                                                    (supports inline Markdown)
                                                </span>
                                            </Label>
                                            <Input
                                                id={`tag-raw-${idx}`}
                                                value={raw}
                                                onChange={(e) =>
                                                    setRaw(e.target.value)
                                                }
                                                placeholder="{power tag}, {status-3}, {!weakness tag} or plain text"
                                            />
                                        </div>

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
                            </SortableTokenItem>
                        ))}

                        {/* Add button row */}
                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-1 w-full justify-center gap-2 border-dashed"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-4 w-4" /> Add entry
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

/* ---------- Sortable item ---------- */
function SortableTokenItem({
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

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    // Inline renderer helper (same as parent)
    const inlineHTML = (s: string) => {
        const html = renderLitmMarkdown(s)
        const m = html.match(/^<p>([\s\S]*)<\/p>\s*$/)
        return m ? m[1] : html
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`rounded-md border bg-white px-3 py-2 max-w-full ${
                isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''
            }`}
        >
            {/* Top row */}
            <div className="flex items-center justify-between gap-3">
                {/* Left: handle + rendered preview */}
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
                        <span
                            className="prose-sm text-wrap max-w-none block truncate font-(family-name:--font-ch-tags-statuses)"
                            // the HTML is inline; keep a span
                            dangerouslySetInnerHTML={{
                                __html: inlineHTML(value),
                            }}
                            title={value}
                        />
                    </div>
                </div>

                {/* Actions */}
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
