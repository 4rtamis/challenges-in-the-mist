import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    ChallengeMeta,
    LegendInTheMistChallenge,
    LegendInTheMistChallengeSheetState,
    LegendInTheMistChallengeViewState,
    Limit,
    Might,
    SectionId,
    SheetTarget,
    SpecialFeature,
    Threat,
} from './model'
import {
    blankLegendInTheMistChallenge,
    defaultHidden,
    defaultLegendInTheMistChallengeSheetState,
    defaultLegendInTheMistChallengeView,
} from './model'

type LegendInTheMistChallengeTab = WorkspaceTab<
    LegendInTheMistChallenge,
    LegendInTheMistChallengeViewState,
    LegendInTheMistChallengeSheetState
>

const TEMPLATE_ID = 'legend.challenge'
const fallbackLegendInTheMistChallenge = blankLegendInTheMistChallenge()
const fallbackView = cloneValue(defaultLegendInTheMistChallengeView)

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

function normalizeRequiredStrings(
    values: string[] | undefined,
    fallback: string
) {
    const normalized = (values ?? [])
        .map((value) => value.trim())
        .filter(Boolean)

    return normalized.length > 0 ? normalized : [fallback]
}

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function useLegendInTheMistChallengeTab() {
    return useActiveTemplateTab<
        LegendInTheMistChallenge,
        LegendInTheMistChallengeViewState,
        LegendInTheMistChallengeSheetState
    >(TEMPLATE_ID)
}

function getLegendInTheMistChallengeTab(): LegendInTheMistChallengeTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as LegendInTheMistChallengeTab
}

export type {
    ChallengeMeta,
    LegendInTheMistChallenge,
    LegendInTheMistChallengeSheetState,
    LegendInTheMistChallengeViewState,
    Limit,
    Might,
    MightLevel,
    PublicationType,
    SectionId,
    SheetTarget,
    SpecialFeature,
    Threat,
} from './model'

// These template-scoped hooks replace the legacy global stores while keeping
// the editor and preview API familiar for the challenge module.
export function useLegendInTheMistChallengeStore() {
    const tab = useLegendInTheMistChallengeTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const legendInTheMistChallenge =
        tab?.doc ?? fallbackLegendInTheMistChallenge

    const apply = (
        producer: (
            current: LegendInTheMistChallenge
        ) => LegendInTheMistChallenge
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as LegendInTheMistChallenge))
        )
    }

    return {
        legendInTheMistChallenge,
        setLegendInTheMistChallenge: (
            update: Partial<LegendInTheMistChallenge>
        ) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceLegendInTheMistChallenge: (next: LegendInTheMistChallenge) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetLegendInTheMistChallenge: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankLegendInTheMistChallenge())
        },
        addToken: (token: string) =>
            apply((current) => ({
                ...current,
                tags_and_statuses: [...current.tags_and_statuses, token],
            })),
        removeTokenAt: (index: number) =>
            apply((current) => {
                const arr = [...current.tags_and_statuses]
                arr.splice(index, 1)
                return { ...current, tags_and_statuses: arr }
            }),
        replaceTokenAt: (index: number, token: string) =>
            apply((current) => {
                const arr = [...current.tags_and_statuses]
                arr[index] = token
                return { ...current, tags_and_statuses: arr }
            }),
        moveToken: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.tags_and_statuses]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, tags_and_statuses: arr }
            }),
        addMight: (might: Might) =>
            apply((current) => ({
                ...current,
                mights: [
                    ...current.mights,
                    { ...might, vulnerability: strOrNull(might.vulnerability) },
                ],
            })),
        updateMightAt: (index: number, update: Partial<Might>) =>
            apply((current) => {
                const arr = [...current.mights]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    vulnerability: strOrNull(
                        update.vulnerability ?? prev.vulnerability ?? null
                    ),
                }

                return { ...current, mights: arr }
            }),
        removeMightAt: (index: number) =>
            apply((current) => {
                const arr = [...current.mights]
                arr.splice(index, 1)
                return { ...current, mights: arr }
            }),
        moveMight: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.mights]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, mights: arr }
            }),
        addLimit: (limit: Limit) =>
            apply((current) => ({
                ...current,
                limits: [
                    ...current.limits,
                    {
                        name: limit.name.trim(),
                        level: clamp(limit.level, 1, 6),
                        is_immune: !!limit.is_immune,
                        is_progress: !!limit.is_progress,
                        on_max: strOrNull(limit.on_max),
                    },
                ],
            })),
        updateLimitAt: (index: number, update: Partial<Limit>) =>
            apply((current) => {
                const arr = [...current.limits]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    name: (update.name ?? prev.name).trim(),
                    level: clamp(update.level ?? prev.level, 1, 6),
                    is_immune: !!(update.is_immune ?? prev.is_immune),
                    is_progress: !!(update.is_progress ?? prev.is_progress),
                    on_max: strOrNull(update.on_max ?? prev.on_max ?? null),
                }

                return { ...current, limits: arr }
            }),
        removeLimitAt: (index: number) =>
            apply((current) => {
                const arr = [...current.limits]
                arr.splice(index, 1)
                return { ...current, limits: arr }
            }),
        moveLimit: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.limits]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, limits: arr }
            }),
        addThreat: (threat: Threat) =>
            apply((current) => ({
                ...current,
                threats: [
                    ...current.threats,
                    {
                        name: threat.name.trim(),
                        description: strOrFallback(
                            threat.description,
                            'Describe how this threat escalates.'
                        ),
                        consequences: normalizeRequiredStrings(
                            threat.consequences,
                            'Describe a consequence.'
                        ),
                    },
                ],
            })),
        updateThreatAt: (index: number, update: Partial<Threat>) =>
            apply((current) => {
                const arr = [...current.threats]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    name: (update.name ?? prev.name).trim(),
                    description: strOrFallback(
                        update.description ?? prev.description,
                        prev.description
                    ),
                    consequences: update.consequences
                        ? normalizeRequiredStrings(
                              update.consequences,
                              prev.consequences[0] ?? 'Describe a consequence.'
                          )
                        : [...prev.consequences],
                }

                return { ...current, threats: arr }
            }),
        removeThreatAt: (index: number) =>
            apply((current) => {
                const arr = [...current.threats]
                arr.splice(index, 1)
                return { ...current, threats: arr }
            }),
        moveThreat: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.threats]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, threats: arr }
            }),
        addConsequence: (threatIndex: number, text: string) =>
            apply((current) => {
                const threats = [...current.threats]
                const threat = threats[threatIndex]
                if (!threat) return current

                const nextText = text.trim()
                if (!nextText) return current

                threats[threatIndex] = {
                    ...threat,
                    consequences: [...threat.consequences, nextText],
                }

                return { ...current, threats }
            }),
        updateConsequence: (
            threatIndex: number,
            cIndex: number,
            text: string
        ) =>
            apply((current) => {
                const threats = [...current.threats]
                const threat = threats[threatIndex]
                if (!threat) return current

                const consequences = [...threat.consequences]
                if (cIndex < 0 || cIndex >= consequences.length) return current

                const nextText = text.trim()
                if (!nextText) return current

                consequences[cIndex] = nextText
                threats[threatIndex] = { ...threat, consequences }

                return { ...current, threats }
            }),
        removeConsequence: (threatIndex: number, cIndex: number) =>
            apply((current) => {
                const threats = [...current.threats]
                const threat = threats[threatIndex]
                if (!threat) return current

                if (threat.consequences.length <= 1) return current

                const consequences = [...threat.consequences]
                consequences.splice(cIndex, 1)
                threats[threatIndex] = { ...threat, consequences }

                return { ...current, threats }
            }),
        moveConsequence: (threatIndex: number, from: number, to: number) =>
            apply((current) => {
                const threats = [...current.threats]
                const threat = threats[threatIndex]
                if (!threat) return current

                const consequences = [...threat.consequences]
                if (
                    from < 0 ||
                    from >= consequences.length ||
                    to < 0 ||
                    to >= consequences.length
                ) {
                    return current
                }

                const [item] = consequences.splice(from, 1)
                consequences.splice(to, 0, item)
                threats[threatIndex] = { ...threat, consequences }

                return { ...current, threats }
            }),
        addGeneralConsequence: (text: string) =>
            apply((current) => ({
                ...current,
                general_consequences: [...current.general_consequences, text],
            })),
        updateGeneralConsequence: (index: number, text: string) =>
            apply((current) => {
                const arr = [...current.general_consequences]
                if (index < 0 || index >= arr.length) return current

                arr[index] = text
                return { ...current, general_consequences: arr }
            }),
        removeGeneralConsequence: (index: number) =>
            apply((current) => {
                const arr = [...current.general_consequences]
                arr.splice(index, 1)
                return { ...current, general_consequences: arr }
            }),
        moveGeneralConsequence: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.general_consequences]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, general_consequences: arr }
            }),
        addSpecialFeature: (feature: SpecialFeature) =>
            apply((current) => ({
                ...current,
                special_features: [
                    ...current.special_features,
                    {
                        name: feature.name.trim(),
                        description: strOrFallback(
                            feature.description,
                            'Describe when this feature triggers and what it does.'
                        ),
                    },
                ],
            })),
        updateSpecialFeatureAt: (
            index: number,
            update: Partial<SpecialFeature>
        ) =>
            apply((current) => {
                const arr = [...current.special_features]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    name: (update.name ?? prev.name).trim(),
                    description: strOrFallback(
                        update.description ?? prev.description,
                        prev.description
                    ),
                }

                return { ...current, special_features: arr }
            }),
        removeSpecialFeatureAt: (index: number) =>
            apply((current) => {
                const arr = [...current.special_features]
                arr.splice(index, 1)
                return { ...current, special_features: arr }
            }),
        moveSpecialFeature: (from: number, to: number) =>
            apply((current) => {
                const arr = [...current.special_features]
                if (
                    from < 0 ||
                    from >= arr.length ||
                    to < 0 ||
                    to >= arr.length
                ) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, special_features: arr }
            }),
        updateMeta: (update: Partial<ChallengeMeta>) =>
            apply((current) => ({
                ...current,
                meta: {
                    publication_type:
                        current.meta?.publication_type || 'homebrew',
                    ...(current.meta || {}),
                    ...update,
                },
            })),
    }
}

export function useLegendInTheMistChallengeViewStore() {
    const tab = useLegendInTheMistChallengeTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const view = tab?.view ?? fallbackView

    const patchView = (patch: Partial<LegendInTheMistChallengeViewState>) => {
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
                previewWidth,
            }),
        setBackground: (
            background: LegendInTheMistChallengeViewState['background']
        ) => patchView({ background }),
        toggleHidden: (id: SectionId) =>
            patchView({
                hidden: {
                    ...view.hidden,
                    [id]: !view.hidden[id],
                },
            }),
        setHidden: (id: SectionId, value: boolean) =>
            patchView({
                hidden: {
                    ...view.hidden,
                    [id]: value,
                },
            }),
        setAutoHideEmpty: (autoHideEmpty: boolean) =>
            patchView({ autoHideEmpty }),
        setExportPrefs: (
            partial: Partial<LegendInTheMistChallengeViewState['exportPrefs']>
        ) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultLegendInTheMistChallengeView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useLegendInTheMistChallengeSheetStore() {
    const tab = useLegendInTheMistChallengeTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultLegendInTheMistChallengeSheetState

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

            setTabSheet(
                tab.id,
                cloneValue(defaultLegendInTheMistChallengeSheetState)
            )
        },
    }
}

export function isEmptySection(
    legendInTheMistChallenge: LegendInTheMistChallenge,
    id: SectionId
) {
    switch (id) {
        case 'rolesDesc':
            return !(
                legendInTheMistChallenge.roles?.length ||
                legendInTheMistChallenge.description?.trim()
            )
        case 'limits':
            return !legendInTheMistChallenge.limits.length
        case 'tagsStatuses':
            return !legendInTheMistChallenge.tags_and_statuses.length
        case 'might':
            return !legendInTheMistChallenge.mights.length
        case 'specialFeatures':
            return !legendInTheMistChallenge.special_features.length
        case 'threats':
            return !legendInTheMistChallenge.threats.length
        case 'generalConsequences':
            return !legendInTheMistChallenge.general_consequences.length
        case 'meta': {
            const meta = legendInTheMistChallenge.meta
            if (!meta) return true

            const hasMeta =
                !!meta.publication_type ||
                !!(meta.source && String(meta.source).trim()) ||
                (Array.isArray(meta.authors) && meta.authors.length > 0) ||
                meta.page != null
            return !hasMeta
        }
        default:
            return true
    }
}

export function shouldShow(
    legendInTheMistChallenge: LegendInTheMistChallenge,
    id: SectionId,
    view: LegendInTheMistChallengeViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(legendInTheMistChallenge, id)) {
        return false
    }
    return true
}

export function groupShouldShow(
    legendInTheMistChallenge: LegendInTheMistChallenge,
    sectionIds: SectionId[],
    view: LegendInTheMistChallengeViewState
) {
    return sectionIds.some((sectionId) =>
        shouldShow(legendInTheMistChallenge, sectionId, view)
    )
}

export function getLegendInTheMistChallengePreviewWidth(
    view: LegendInTheMistChallengeViewState
) {
    return view.previewWidth
}

export function getLiveLegendInTheMistChallengeTab() {
    return getLegendInTheMistChallengeTab()
}
