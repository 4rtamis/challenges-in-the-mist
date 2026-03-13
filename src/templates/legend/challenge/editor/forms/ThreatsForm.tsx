// src/editor/ThreatsForm.tsx
import { renderLitmMarkdown } from '@/utils/markdown'
import { useLegendInTheMistChallengeStore } from '../../hooks'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
    ArrowLeft,
    Check,
    GripVertical,
    Pencil,
    Plus,
    Trash2,
    X,
} from 'lucide-react'

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

/* ----------------------------------------------------------------------------
   Two-panel Threats Editor
   - Panel A: Threats list (reorder + inline edit, NO consequences)
   - Panel B: Consequences for a selected threat OR General Consequences
   Slide transition between panels (only one visible at a time).
---------------------------------------------------------------------------- */

type Panel =
    | { kind: 'threats' }
    | { kind: 'cons'; tIdx: number }
    | { kind: 'general' }

const THREAT_DESCRIPTION_LIMIT = 100
const DEFAULT_THREAT_DESCRIPTION = 'Describe how this threat escalates.'
const DEFAULT_CONSEQUENCE = 'Describe a consequence.'

export default function ThreatsForm({ focusIndex }: { focusIndex?: number }) {
    const {
        legendInTheMistChallenge,
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
    } = useLegendInTheMistChallengeStore()

    // Which view is shown
    const [panel, setPanel] = useState<Panel>({ kind: 'threats' })

    // Inline threat editor
    const [editingThreat, setEditingThreat] = useState<number | null>(null)
    const [tName, setTName] = useState('')
    const [tDesc, setTDesc] = useState('')
    const [tErr, setTErr] = useState<string | null>(null)

    // Inline consequence editors (panel B)
    const [editingCons, setEditingCons] = useState<number | null>(null)
    const [consDraft, setConsDraft] = useState('')

    const [editingGeneralCons, setEditingGeneralCons] = useState<number | null>(
        null
    )
    const [generalDraft, setGeneralDraft] = useState('')

    // Deep-link from preview to a given threat
    useEffect(() => {
        if (typeof focusIndex === 'number' && legendInTheMistChallenge.threats[focusIndex]) {
            startEditThreat(focusIndex)
            setPanel({ kind: 'threats' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex])

    /* ----------------------------- Drag & Drop ----------------------------- */

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const dragDisabled =
        editingThreat !== null ||
        editingCons !== null ||
        editingGeneralCons !== null

    const threatIds = useMemo(
        () => legendInTheMistChallenge.threats.map((t, i) => `t:${i}:${t.name || 'threat'}`),
        [legendInTheMistChallenge.threats]
    )

    const currentThreatIndex = panel.kind === 'cons' ? panel.tIdx : null
    const consIds = useMemo(() => {
        if (currentThreatIndex == null) return []
        const t = legendInTheMistChallenge.threats[currentThreatIndex]
        return t ? t.consequences.map((_, i) => `c:${i}`) : []
    }, [legendInTheMistChallenge.threats, currentThreatIndex])

    const generalIds = useMemo(
        () => legendInTheMistChallenge.general_consequences.map((_, i) => `gc:${i}`),
        [legendInTheMistChallenge.general_consequences]
    )

    function onDragEnd(e: DragEndEvent) {
        const { active, over } = e
        if (!over || active.id === over.id) return

        // Threats reordering (panel A)
        if (
            panel.kind === 'threats' &&
            String(active.id).startsWith('t:') &&
            String(over.id).startsWith('t:')
        ) {
            const from = Number(String(active.id).split(':')[1] || -1)
            const to = Number(String(over.id).split(':')[1] || -1)
            if (from >= 0 && to >= 0 && from !== to) moveThreat(from, to)
            return
        }

        // Consequences reordering (panel B, single threat mode)
        if (
            panel.kind === 'cons' &&
            String(active.id).startsWith('c:') &&
            String(over.id).startsWith('c:')
        ) {
            const from = Number(String(active.id).split(':')[1] || -1)
            const to = Number(String(over.id).split(':')[1] || -1)
            if (
                currentThreatIndex != null &&
                from >= 0 &&
                to >= 0 &&
                from !== to
            ) {
                moveConsequence(currentThreatIndex, from, to)
            }
            return
        }

        // General consequences reordering (panel B, general mode)
        if (
            panel.kind === 'general' &&
            String(active.id).startsWith('gc:') &&
            String(over.id).startsWith('gc:')
        ) {
            const from = Number(String(active.id).split(':')[1] || -1)
            const to = Number(String(over.id).split(':')[1] || -1)
            if (from >= 0 && to >= 0 && from !== to)
                moveGeneralConsequence(from, to)
            return
        }
    }

    /* ------------------------------ Threats A ------------------------------ */

    function uniqueThreatName() {
        const base = 'New Threat'
        const used = new Set(
            legendInTheMistChallenge.threats.map((t) => (t.name || '').toLowerCase())
        )
        if (!used.has(base.toLowerCase())) return base
        let n = 2
        while (used.has(`${base} ${n}`.toLowerCase())) n++
        return `${base} ${n}`
    }

    function addThreatPlaceholder() {
        const name = uniqueThreatName()
        const idx = legendInTheMistChallenge.threats.length
        addThreat({
            name,
            description: DEFAULT_THREAT_DESCRIPTION,
            consequences: [DEFAULT_CONSEQUENCE],
        })
        setEditingThreat(idx)
        setTName(name)
        setTDesc(DEFAULT_THREAT_DESCRIPTION)
        setTErr(null)
    }

    function startEditThreat(idx: number) {
        const t = legendInTheMistChallenge.threats[idx]
        if (!t) return
        setEditingThreat(idx)
        setTName(t.name || '')
        setTDesc(t.description || '')
        setTErr(null)
    }

    function cancelEditThreat() {
        setEditingThreat(null)
        setTName('')
        setTDesc('')
        setTErr(null)
    }

    function saveThreat() {
        if (editingThreat == null) return
        const name = tName.trim()
        const description = tDesc.trim()
        if (!name) return setTErr('Threat name is required.')
        if (!description) return setTErr('Threat description is required.')
        if (description.length > THREAT_DESCRIPTION_LIMIT) {
            return setTErr(
                `Threat description must be ${THREAT_DESCRIPTION_LIMIT} characters or fewer.`
            )
        }

        updateThreatAt(editingThreat, { name, description })
        cancelEditThreat()
    }

    /* ----------------------------- Consequences B ----------------------------- */

    function goConsFor(tIdx: number) {
        setEditingCons(null)
        setPanel({ kind: 'cons', tIdx })
    }

    function goGeneralCons() {
        setEditingGeneralCons(null)
        setPanel({ kind: 'general' })
    }

    function backToThreats() {
        setPanel({ kind: 'threats' })
    }

    function addConsequencePlaceholder() {
        if (currentThreatIndex == null) return
        addConsequence(currentThreatIndex, DEFAULT_CONSEQUENCE)
        const idx = legendInTheMistChallenge.threats[currentThreatIndex].consequences.length // end
        setEditingCons(idx)
        setConsDraft(DEFAULT_CONSEQUENCE)
    }

    function startEditConsequence(cIdx: number, text: string) {
        setEditingCons(cIdx)
        setConsDraft(text)
    }

    function saveConsequence() {
        if (currentThreatIndex == null || editingCons == null) return
        const next = consDraft.trim()
        if (!next) {
            toast.error('Consequence cannot be empty.')
            return
        }

        updateConsequence(currentThreatIndex, editingCons, next)
        setEditingCons(null)
        setConsDraft('')
    }

    function addGeneralPlaceholder() {
        addGeneralConsequence('New consequence')
        const idx = legendInTheMistChallenge.general_consequences.length // end
        setEditingGeneralCons(idx)
        setGeneralDraft('New consequence')
    }

    function startEditGeneral(idx: number, text: string) {
        setEditingGeneralCons(idx)
        setGeneralDraft(text)
    }

    function saveGeneral() {
        if (editingGeneralCons == null) return
        updateGeneralConsequence(editingGeneralCons, generalDraft.trim())
        setEditingGeneralCons(null)
        setGeneralDraft('')
    }

    /* --------------------------------- UI --------------------------------- */

    const slideClass =
        panel.kind === 'threats' ? 'translate-x-0' : '-translate-x-1/2'

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
                            <ul className="space-y-2">
                                {legendInTheMistChallenge.threats.map((t, tIdx) => {
                                    const id = threatIds[tIdx]
                                    const isEditing = editingThreat === tIdx

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
                                                if (
                                                    panel.kind === 'cons' &&
                                                    panel.tIdx === tIdx
                                                ) {
                                                    backToThreats()
                                                }
                                                removeThreatAt(tIdx)
                                            }}
                                            onOpenConsequences={() =>
                                                goConsFor(tIdx)
                                            }
                                        >
                                            {isEditing && (
                                                <div className="mt-2 space-y-2.5 rounded-md border bg-muted/30 p-2.5">
                                                    {tErr && (
                                                        <p className="text-sm text-destructive">
                                                            {tErr}
                                                        </p>
                                                    )}
                                                    <div className="grid gap-1">
                                                        <Label
                                                            htmlFor={`t-name-${tIdx}`}
                                                            className="text-xs"
                                                        >
                                                            Name
                                                        </Label>
                                                        <Input
                                                            id={`t-name-${tIdx}`}
                                                            className="h-8 px-2 text-sm"
                                                            value={tName}
                                                            onChange={(e) =>
                                                                setTName(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <div className="grid gap-1">
                                                        <Label
                                                            htmlFor={`t-desc-${tIdx}`}
                                                            className="text-xs"
                                                        >
                                                            Short description{' '}
                                                            <span className="text-muted-foreground">
                                                                (Markdown +
                                                                tokens)
                                                            </span>
                                                        </Label>
                                                        <Textarea
                                                            id={`t-desc-${tIdx}`}
                                                            rows={2}
                                                            className="min-h-16 px-2 py-1 text-sm"
                                                            value={tDesc}
                                                            onChange={(e) =>
                                                                setTDesc(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="What the challenge starts to do…"
                                                            maxLength={
                                                                THREAT_DESCRIPTION_LIMIT
                                                            }
                                                        />
                                                        <div className="text-[11px] text-muted-foreground">
                                                            {tDesc.trim().length}/
                                                            {
                                                                THREAT_DESCRIPTION_LIMIT
                                                            }{' '}
                                                            characters
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="h-7 px-2.5 text-xs"
                                                            onClick={saveThreat}
                                                        >
                                                            <Check className="mr-1 h-3.5 w-3.5" />{' '}
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="h-7 px-2.5 text-xs"
                                                            onClick={
                                                                cancelEditThreat
                                                            }
                                                        >
                                                            <X className="mr-1 h-3.5 w-3.5" />{' '}
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </ThreatRow>
                                    )
                                })}

                                {/* Add threat row */}
                                <li className="flex">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                        onClick={addThreatPlaceholder}
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Add
                                        threat
                                    </Button>
                                </li>
                            </ul>
                        </SortableContext>

                        {/* Footer actions for general consequences entry point */}
                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2.5 text-xs"
                                onClick={goGeneralCons}
                            >
                                Edit general consequences
                            </Button>
                        </div>
                    </div>

                    {/* PANEL B: Consequences editor (right half) */}
                    <div className="w-full pl-2 min-w-0">
                        {panel.kind === 'cons' && currentThreatIndex != null ? (
                            <div className="space-y-3">
                                {/* Back + context */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-xs"
                                        onClick={backToThreats}
                                    >
                                        <ArrowLeft className="mr-1 h-3.5 w-3.5" />{' '}
                                        Back
                                    </Button>
                                    <div className="font-semibold">
                                        Consequences for:{' '}
                                        {
                                            legendInTheMistChallenge.threats[
                                                currentThreatIndex
                                            ]?.name
                                        }
                                    </div>
                                </div>

                                {legendInTheMistChallenge.threats[currentThreatIndex]
                                    ?.description ? (
                                    <div
                                        className="text-sm text-foreground/80 prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: renderLitmMarkdown(
                                                legendInTheMistChallenge.threats[
                                                    currentThreatIndex
                                                ]?.description || ''
                                            ),
                                        }}
                                    />
                                ) : null}

                                {/* Consequences list */}
                                <SortableContext
                                    items={consIds}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <ul className="space-y-1.5">
                                        {legendInTheMistChallenge.threats[
                                            currentThreatIndex
                                        ]?.consequences.map((text, cIdx) => {
                                            const isEditing =
                                                editingCons === cIdx
                                            return (
                                                <ConsequenceRow
                                                    key={`c:${cIdx}`}
                                                    id={`c:${cIdx}`}
                                                    dragDisabled={dragDisabled}
                                                    isEditing={isEditing}
                                                    text={text}
                                                    onEdit={() =>
                                                        startEditConsequence(
                                                            cIdx,
                                                            text
                                                        )
                                                    }
                                                    onRemove={() =>
                                                        legendInTheMistChallenge.threats[
                                                            currentThreatIndex
                                                        ]?.consequences
                                                            .length <= 1
                                                            ? toast.error(
                                                                  'Each threat needs at least one consequence.'
                                                              )
                                                            : removeConsequence(
                                                                  currentThreatIndex,
                                                                  cIdx
                                                              )
                                                    }
                                                >
                                                    {isEditing && (
                                                        <InlineConsequenceEditor
                                                            value={consDraft}
                                                            onChange={
                                                                setConsDraft
                                                            }
                                                            onSave={
                                                                saveConsequence
                                                            }
                                                            onCancel={() => {
                                                                setEditingCons(
                                                                    null
                                                                )
                                                                setConsDraft('')
                                                            }}
                                                        />
                                                    )}
                                                </ConsequenceRow>
                                            )
                                        })}

                                        {/* Add consequence */}
                                        <li className="flex">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                                onClick={
                                                    addConsequencePlaceholder
                                                }
                                            >
                                                <Plus className="h-3.5 w-3.5" />{' '}
                                                Add consequence
                                            </Button>
                                        </li>
                                    </ul>
                                </SortableContext>
                            </div>
                        ) : panel.kind === 'general' ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-xs"
                                        onClick={backToThreats}
                                    >
                                        <ArrowLeft className="mr-1 h-3.5 w-3.5" />{' '}
                                        Back
                                    </Button>
                                    <div className="font-semibold">
                                        General Consequences
                                    </div>
                                </div>

                                <SortableContext
                                    items={generalIds}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <ul className="space-y-1.5">
                                        {legendInTheMistChallenge.general_consequences.map(
                                            (text, idx) => {
                                                const isEditing =
                                                    editingGeneralCons === idx
                                                return (
                                                    <ConsequenceRow
                                                        key={`gc:${idx}`}
                                                        id={`gc:${idx}`}
                                                        dragDisabled={
                                                            dragDisabled
                                                        }
                                                        isEditing={isEditing}
                                                        text={text}
                                                        onEdit={() =>
                                                            startEditGeneral(
                                                                idx,
                                                                text
                                                            )
                                                        }
                                                        onRemove={() =>
                                                            removeGeneralConsequence(
                                                                idx
                                                            )
                                                        }
                                                    >
                                                        {isEditing && (
                                                            <InlineConsequenceEditor
                                                                value={
                                                                    generalDraft
                                                                }
                                                                onChange={
                                                                    setGeneralDraft
                                                                }
                                                                onSave={
                                                                    saveGeneral
                                                                }
                                                                onCancel={() => {
                                                                    setEditingGeneralCons(
                                                                        null
                                                                    )
                                                                    setGeneralDraft(
                                                                        ''
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                    </ConsequenceRow>
                                                )
                                            }
                                        )}

                                        <li className="flex">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                                                onClick={addGeneralPlaceholder}
                                            >
                                                <Plus className="h-3.5 w-3.5" />{' '}
                                                Add general consequence
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
    )
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
    id: string
    name: string
    description?: string | null
    dragDisabled: boolean
    count?: number
    onEdit: () => void
    onRemove: () => void
    onOpenConsequences: () => void
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
            className={`rounded-md border bg-white px-2.5 py-2 ${
                isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''
            }`}
        >
            <div className="flex items-center gap-2">
                <button
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center self-center rounded hover:bg-slate-50
              ${dragDisabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : 'cursor-grab active:cursor-grabbing'}`}
                    aria-label="Drag to reorder threat"
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

                <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1.5">
                    {/* Header left: threat name */}
                    <div className="min-w-0">
                        <div className="font-semibold threat-pill !text-[10px] !h-auto !min-h-[1.6em] !w-fit !max-w-full !px-1.5 !py-1 leading-tight whitespace-normal break-words">
                            {name}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                        {/* Consequences icon button with count */}

                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7"
                                onClick={onOpenConsequences}
                                aria-label="Edit consequences"
                                title="Consequences"
                            >
                                <img
                                    src="/assets/images/consequence.svg"
                                    alt=""
                                    className="h-5 w-5"
                                />
                            </Button>

                            {/* tiny count badge (optional) */}
                            {typeof count === 'number' && count > 0 && (
                                <span className="pointer-events-none absolute -right-1 -top-1 inline-flex h-3.5 min-w-[0.9rem] items-center justify-center rounded-full border border-zinc-400 bg-secondary px-1 text-[10px] leading-none text-secondary-foreground">
                                    <span className="-translate-y-0.5">
                                        {count}
                                    </span>
                                </span>
                            )}
                        </div>

                        {/* Edit / Remove keep the same */}
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7"
                            title="Edit"
                            onClick={onEdit}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7 text-destructive"
                            title="Remove"
                            onClick={onRemove}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    {description ? (
                        <div
                            className="col-span-2 min-w-0 text-sm prose-sm max-w-none font-(family-name:--font-ch-threat-desc)"
                            dangerouslySetInnerHTML={{
                                __html: renderLitmMarkdown(description),
                            }}
                        />
                    ) : (
                        <div className="col-span-2 text-sm text-muted-foreground">
                            No description
                        </div>
                    )}
                </div>
            </div>

            {/* Inline editor block (optional) */}
            {children}
        </li>
    )
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
    id: string
    text: string
    dragDisabled: boolean
    isEditing: boolean
    onEdit: () => void
    onRemove: () => void
    children?: React.ReactNode // inline editor when editing
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
            className={`flex items-center justify-between gap-1.5 rounded-md border bg-white px-2.5 py-1.5 ${
                isDragging ? 'shadow-lg ring-1 ring-slate-200' : ''
            }`}
        >
            {/* Left: drag + text / editor */}
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <button
                    className={`inline-flex h-7 w-7 items-center justify-center rounded hover:bg-slate-50
            ${dragDisabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : 'cursor-grab active:cursor-grabbing'}`}
                    aria-label="Drag to reorder consequence"
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

                {isEditing ? (
                    <div className="flex-1 min-w-0">{children}</div>
                ) : (
                    <div
                        className="flex-1 prose-sm max-w-none text-foreground/90 min-w-0"
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(text),
                        }}
                    />
                )}
            </div>

            {/* Actions */}
            {!isEditing ? (
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-7 w-7"
                    title="Edit"
                    onClick={onEdit}
                >
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
            ) : null}
            <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 text-destructive"
                title="Remove"
                onClick={onRemove}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </li>
    )
}

function InlineConsequenceEditor({
    value,
    onChange,
    onSave,
    onCancel,
}: {
    value: string
    onChange: (v: string) => void
    onSave: () => void
    onCancel: () => void
}) {
    return (
        <div className="flex items-center gap-1.5">
            <Input
                className="h-8 flex-1 px-2 text-sm"
                autoFocus
                value={value}
                onChange={(e) => onChange((e.target as HTMLInputElement).value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave()
                    if (e.key === 'Escape') onCancel()
                }}
            />
            <Button
                size="icon-xs"
                className="h-5 w-5 shrink-0"
                title="Save"
                onClick={onSave}
            >
                <Check className="h-3 w-3" />
            </Button>
            <Button
                size="icon-xs"
                variant="secondary"
                className="h-5 w-5 shrink-0"
                title="Cancel"
                onClick={onCancel}
            >
                <X className="h-3 w-3" />
            </Button>
        </div>
    )
}
