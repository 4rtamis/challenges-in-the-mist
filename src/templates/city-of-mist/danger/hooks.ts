import type { WorkspaceTab } from '@/core/workspace/types'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import { useActiveTemplateTab } from '@/core/workspace/selectors'
import type {
    CityOfMistDanger,
    CityOfMistDangerSheetState,
    CityOfMistDangerViewState,
    ColumnCount,
    CustomMove,
    DangerMeta,
    SheetTarget,
    Spectrum,
    TitlePlacement,
} from './model'
import {
    blankCityOfMistDanger,
    COLUMN_HEIGHT_MAX,
    COLUMN_HEIGHT_MIN,
    defaultCityOfMistDangerSheetState,
    defaultCityOfMistDangerView,
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
} from './model'

type CityOfMistDangerTab = WorkspaceTab<
    CityOfMistDanger,
    CityOfMistDangerViewState,
    CityOfMistDangerSheetState
>

const TEMPLATE_ID = 'city.danger'
const fallbackCityOfMistDanger = blankCityOfMistDanger()
const fallbackView = cloneValue(defaultCityOfMistDangerView)

function clamp(n: number, lo: number, hi: number) {
    const x = Math.floor(Number(n) || 0)
    return Math.max(lo, Math.min(hi, x))
}

function strOrNull(v?: string | null) {
    const s = (v ?? '').trim()
    return s ? s : null
}

function strOrFallback(v: string | undefined, fallback: string) {
    const s = (v ?? '').trim()
    return s || fallback
}

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function useCityOfMistDangerTab() {
    return useActiveTemplateTab<
        CityOfMistDanger,
        CityOfMistDangerViewState,
        CityOfMistDangerSheetState
    >(TEMPLATE_ID)
}

function getCityOfMistDangerTab(): CityOfMistDangerTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as CityOfMistDangerTab
}

export type {
    Background,
    CityOfMistDanger,
    CityOfMistDangerSheetState,
    CityOfMistDangerViewState,
    ColumnCount,
    CustomMove,
    DangerMeta,
    ExportPrefs,
    PublicationType,
    SectionId,
    SheetTarget,
    Spectrum,
    TitlePlacement,
} from './model'

export function useCityOfMistDangerStore() {
    const tab = useCityOfMistDangerTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const cityOfMistDanger = tab?.doc ?? fallbackCityOfMistDanger

    const apply = (
        producer: (current: CityOfMistDanger) => CityOfMistDanger
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as CityOfMistDanger))
        )
    }

    return {
        cityOfMistDanger,
        setCityOfMistDanger: (update: Partial<CityOfMistDanger>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceCityOfMistDanger: (next: CityOfMistDanger) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetCityOfMistDanger: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankCityOfMistDanger())
        },
        addSpectrum: (spectrum: Spectrum) =>
            apply((current) => ({
                ...current,
                spectrums: [
                    ...current.spectrums,
                    {
                        name: spectrum.name.trim(),
                        maximum: clamp(spectrum.maximum, 1, 6),
                        is_immune: !!spectrum.is_immune,
                    },
                ],
            })),
        updateSpectrumAt: (index: number, update: Partial<Spectrum>) =>
            apply((current) => {
                const arr = [...current.spectrums]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    name: strOrFallback(update.name ?? prev.name, prev.name),
                    maximum: clamp(update.maximum ?? prev.maximum, 1, 6),
                    is_immune: !!(update.is_immune ?? prev.is_immune),
                }

                return { ...current, spectrums: arr }
            }),
        removeSpectrumAt: (index: number) =>
            apply((current) => {
                const arr = [...current.spectrums]
                arr.splice(index, 1)
                return { ...current, spectrums: arr }
            }),
        moveSpectrum: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.spectrums]
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, spectrums: arr }
            }),
        addCustomMove: (customMove: CustomMove) =>
            apply((current) => ({
                ...current,
                custom_moves: [
                    ...current.custom_moves,
                    {
                        name: customMove.name.trim(),
                        description: strOrFallback(
                            customMove.description,
                            'Describe the custom move.'
                        ),
                    },
                ],
            })),
        updateCustomMoveAt: (index: number, update: Partial<CustomMove>) =>
            apply((current) => {
                const arr = [...current.custom_moves]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    name: strOrFallback(update.name ?? prev.name, prev.name),
                    description: strOrFallback(
                        update.description ?? prev.description,
                        prev.description
                    ),
                }

                return { ...current, custom_moves: arr }
            }),
        removeCustomMoveAt: (index: number) =>
            apply((current) => {
                const arr = [...current.custom_moves]
                arr.splice(index, 1)
                return { ...current, custom_moves: arr }
            }),
        moveCustomMove: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.custom_moves]
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, custom_moves: arr }
            }),
        addHardMove: (value: string) =>
            apply((current) => ({
                ...current,
                hard_moves: [...current.hard_moves, strOrFallback(value, 'New hard move')],
            })),
        updateHardMoveAt: (index: number, value: string) =>
            apply((current) => {
                const arr = [...current.hard_moves]
                if (arr[index] == null) return current
                arr[index] = strOrFallback(value, arr[index])
                return { ...current, hard_moves: arr }
            }),
        removeHardMoveAt: (index: number) =>
            apply((current) => {
                const arr = [...current.hard_moves]
                arr.splice(index, 1)
                return { ...current, hard_moves: arr }
            }),
        moveHardMove: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.hard_moves]
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, hard_moves: arr }
            }),
        addSoftMove: (value: string) =>
            apply((current) => ({
                ...current,
                soft_moves: [...current.soft_moves, strOrFallback(value, 'New soft move')],
            })),
        updateSoftMoveAt: (index: number, value: string) =>
            apply((current) => {
                const arr = [...current.soft_moves]
                if (arr[index] == null) return current
                arr[index] = strOrFallback(value, arr[index])
                return { ...current, soft_moves: arr }
            }),
        removeSoftMoveAt: (index: number) =>
            apply((current) => {
                const arr = [...current.soft_moves]
                arr.splice(index, 1)
                return { ...current, soft_moves: arr }
            }),
        moveSoftMove: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.soft_moves]
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, soft_moves: arr }
            }),
        updateMeta: (update: Partial<DangerMeta>) =>
            apply((current) => ({
                ...current,
                meta: {
                    publication_type:
                        current.meta?.publication_type || 'homebrew',
                    ...(current.meta || {}),
                    ...update,
                    source: strOrNull(update.source ?? current.meta?.source) ?? undefined,
                },
            })),
    }
}

export function useCityOfMistDangerViewStore() {
    const tab = useCityOfMistDangerTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const view = tab?.view ?? fallbackView

    const patchView = (patch: Partial<CityOfMistDangerViewState>) => {
        if (!tab) return
        patchTabView(tab.id, cloneValue(patch) as Record<string, unknown>)
    }

    return {
        ...view,
        setZoom: (zoom: number) =>
            patchView({
                zoom: Math.max(0.5, Math.min(2, zoom)),
            }),
        setPreviewWidth: (previewWidth: number) =>
            patchView({
                previewWidth: clamp(previewWidth, PREVIEW_WIDTH_MIN, PREVIEW_WIDTH_MAX),
            }),
        setBackground: (background: CityOfMistDangerViewState['background']) =>
            patchView({ background }),
        setColumnCount: (columnCount: ColumnCount) =>
            patchView({ columnCount }),
        setTitlePlacement: (titlePlacement: TitlePlacement) =>
            patchView({ titlePlacement }),
        setColumnHeight: (columnHeight: number) =>
            patchView({
                columnHeight: clamp(
                    columnHeight,
                    COLUMN_HEIGHT_MIN,
                    COLUMN_HEIGHT_MAX
                ),
            }),
        setShowSeparators: (showSeparators: boolean) =>
            patchView({ showSeparators }),
        setExportPrefs: (
            partial: Partial<CityOfMistDangerViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView(cloneValue(defaultCityOfMistDangerView)),
    }
}

export function useCityOfMistDangerSheetStore() {
    const tab = useCityOfMistDangerTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultCityOfMistDangerSheetState

    return {
        ...sheet,
        openSheet: (target: SheetTarget) => {
            if (!tab || tab.mode !== 'editing') return

            setTabSheet(tab.id, {
                open: true,
                target,
            })
        },
        closeSheet: () => {
            if (!tab) return

            setTabSheet(tab.id, cloneValue(defaultCityOfMistDangerSheetState))
        },
    }
}

export function getCityOfMistDangerPreviewWidth(
    view: CityOfMistDangerViewState
) {
    return view.previewWidth
}

export function getLiveCityOfMistDangerTab() {
    return getCityOfMistDangerTab()
}
