import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { formatSpectrumLabel } from '../../markdown'
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

const DEFAULT_SPECTRUM = {
    name: 'hurt',
    maximum: 3,
    is_immune: false,
}

export default function SpectrumsForm({
    focusIndex,
}: {
    focusIndex?: number
}) {
    const {
        cityOfMistDanger,
        addSpectrum,
        updateSpectrumAt,
        removeSpectrumAt,
        moveSpectrum,
    } = useCityOfMistDangerStore()

    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [name, setName] = useState(DEFAULT_SPECTRUM.name)
    const [maximum, setMaximum] = useState(DEFAULT_SPECTRUM.maximum)
    const [isImmune, setIsImmune] = useState(DEFAULT_SPECTRUM.is_immune)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (
            typeof focusIndex === 'number' &&
            cityOfMistDanger.spectrums[focusIndex]
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
            cityOfMistDanger.spectrums.map(
                (spectrum, index) => `${index}:${spectrum.name}:${spectrum.maximum}`
            ),
        [cityOfMistDanger.spectrums]
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = Number(String(active.id).split(':')[0] || -1)
        const to = Number(String(over.id).split(':')[0] || -1)
        if (from >= 0 && to >= 0 && from !== to) {
            moveSpectrum(from, to)
        }
    }

    function addPlaceholder() {
        const index = cityOfMistDanger.spectrums.length
        addSpectrum(DEFAULT_SPECTRUM)
        setEditingIndex(index)
        setName(DEFAULT_SPECTRUM.name)
        setMaximum(DEFAULT_SPECTRUM.maximum)
        setIsImmune(DEFAULT_SPECTRUM.is_immune)
        setError(null)
    }

    function startEdit(index: number) {
        const spectrum = cityOfMistDanger.spectrums[index]
        if (!spectrum) return
        setEditingIndex(index)
        setName(spectrum.name)
        setMaximum(spectrum.maximum)
        setIsImmune(!!spectrum.is_immune)
        setError(null)
    }

    function cancelEdit() {
        setEditingIndex(null)
        setName(DEFAULT_SPECTRUM.name)
        setMaximum(DEFAULT_SPECTRUM.maximum)
        setIsImmune(DEFAULT_SPECTRUM.is_immune)
        setError(null)
    }

    function confirmEdit() {
        if (editingIndex == null) return
        const trimmed = name.trim()
        if (!trimmed) {
            setError('Spectrum name is required.')
            return
        }

        updateSpectrumAt(editingIndex, {
            name: trimmed,
            maximum: Math.max(1, Math.min(6, Math.floor(Number(maximum) || 1))),
            is_immune: isImmune,
        })
        cancelEdit()
    }

    return (
        <div className="space-y-2.5">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={itemIds}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="space-y-1.5">
                        {cityOfMistDanger.spectrums.map((spectrum, index) => (
                            <SortableSpectrumRow
                                key={itemIds[index]}
                                id={itemIds[index]}
                                label={formatSpectrumLabel(spectrum)}
                                dragDisabled={editingIndex !== null}
                                onEdit={() => startEdit(index)}
                                onRemove={() => removeSpectrumAt(index)}
                            >
                                {editingIndex === index ? (
                                    <div className="mt-2 space-y-2.5 rounded-md border bg-muted/30 p-2.5">
                                        {error ? (
                                            <p className="text-sm text-destructive">
                                                {error}
                                            </p>
                                        ) : null}
                                        <div className="grid gap-2 md:grid-cols-[1fr_5.5rem] md:items-end">
                                            <div className="grid gap-1">
                                                <Label
                                                    htmlFor={`spectrum-name-${index}`}
                                                    className="text-xs"
                                                >
                                                    Spectrum name
                                                </Label>
                                                <Input
                                                    id={`spectrum-name-${index}`}
                                                    className="h-8 px-2 text-sm"
                                                    value={name}
                                                    onChange={(event) =>
                                                        setName(event.target.value)
                                                    }
                                                    placeholder="hurt"
                                                />
                                            </div>
                                            <div className="grid gap-1">
                                                <Label
                                                    htmlFor={`spectrum-maximum-${index}`}
                                                    className="text-xs"
                                                >
                                                    Maximum
                                                </Label>
                                                <Input
                                                    id={`spectrum-maximum-${index}`}
                                                    className="h-8 px-2 text-sm"
                                                    type="number"
                                                    min={1}
                                                    max={6}
                                                    value={maximum}
                                                    onChange={(event) =>
                                                        setMaximum(
                                                            Math.max(
                                                                1,
                                                                Math.min(
                                                                    6,
                                                                    Math.floor(
                                                                        Number(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        ) || 1
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id={`spectrum-immune-${index}`}
                                                checked={isImmune}
                                                onCheckedChange={(value) =>
                                                    setIsImmune(!!value)
                                                }
                                            />
                                            <Label
                                                htmlFor={`spectrum-immune-${index}`}
                                                className="text-xs"
                                            >
                                                Immune
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="h-7 px-2.5 text-xs"
                                                onClick={confirmEdit}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="h-7 px-0 text-xs"
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : null}
                            </SortableSpectrumRow>
                        ))}
                        <li className="flex">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                onClick={addPlaceholder}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add spectrum
                            </Button>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableSpectrumRow({
    id,
    label,
    dragDisabled,
    onEdit,
    onRemove,
    children,
}: {
    id: string
    label: string
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
            className={`max-w-full rounded-md border bg-white px-2.5 py-1.5 ${
                isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''
            }`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <button
                        type="button"
                        className={`inline-flex h-7 w-7 items-center justify-center rounded hover:bg-slate-50 ${
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
                        <GripVertical className="h-3.5 w-3.5 text-slate-500" />
                    </button>
                    <span className="truncate font-['Bebas_Neue'] text-xl uppercase tracking-wide">
                        {label}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={onEdit}
                        title="Edit"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={onRemove}
                        title="Remove"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
            {children}
        </li>
    )
}
