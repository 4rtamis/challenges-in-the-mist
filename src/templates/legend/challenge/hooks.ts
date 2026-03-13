import type { WorkspaceTab } from '@/core/workspace/types'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import { useActiveTemplateTab } from '@/core/workspace/selectors'
import type {
    Challenge,
    ChallengeMeta,
    ChallengeSheetState,
    ChallengeViewState,
    Limit,
    Might,
    SpecialFeature,
    Threat,
    SheetTarget,
    SectionId,
} from './model'
import {
    blankChallenge,
    defaultChallengeSheetState,
    defaultChallengeView,
    defaultHidden,
} from './model'

type ChallengeTab = WorkspaceTab<Challenge, ChallengeViewState, ChallengeSheetState>

const TEMPLATE_ID = 'legend.challenge'
const fallbackChallenge = blankChallenge()
const fallbackView = cloneValue(defaultChallengeView)

function clamp(n: number, lo: number, hi: number) {
    const x = Math.floor(Number(n) || 0)
    return Math.max(lo, Math.min(hi, x))
}

function strOrNull(v?: string | null) {
    const s = (v ?? '').trim()
    return s ? s : null
}

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function useLegendChallengeTab() {
    return useActiveTemplateTab<Challenge, ChallengeViewState, ChallengeSheetState>(
        TEMPLATE_ID
    )
}

function getLegendChallengeTab(): ChallengeTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as ChallengeTab
}

export type {
    Challenge,
    ChallengeMeta,
    ChallengeSheetState,
    ChallengeViewState,
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
export function useChallengeStore() {
    const tab = useLegendChallengeTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const challenge = tab?.doc ?? fallbackChallenge

    const apply = (producer: (current: Challenge) => Challenge) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as Challenge))
        )
    }

    return {
        challenge,
        setChallenge: (update: Partial<Challenge>) =>
            apply((current) => ({
                ...current,
                ...update,
            })),
        replaceChallenge: (next: Challenge) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetChallenge: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankChallenge())
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
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
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
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
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
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
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
                        description: threat.description ?? '',
                        consequences: [...(threat.consequences || [])],
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
                    description: update.description ?? prev.description ?? '',
                    consequences: update.consequences
                        ? [...update.consequences]
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
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
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

                threats[threatIndex] = {
                    ...threat,
                    consequences: [...threat.consequences, text],
                }

                return { ...current, threats }
            }),
        updateConsequence: (threatIndex: number, cIndex: number, text: string) =>
            apply((current) => {
                const threats = [...current.threats]
                const threat = threats[threatIndex]
                if (!threat) return current

                const consequences = [...threat.consequences]
                if (cIndex < 0 || cIndex >= consequences.length) return current

                consequences[cIndex] = text
                threats[threatIndex] = { ...threat, consequences }

                return { ...current, threats }
            }),
        removeConsequence: (threatIndex: number, cIndex: number) =>
            apply((current) => {
                const threats = [...current.threats]
                const threat = threats[threatIndex]
                if (!threat) return current

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
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
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
                        description: feature.description ?? '',
                    },
                ],
            })),
        updateSpecialFeatureAt: (index: number, update: Partial<SpecialFeature>) =>
            apply((current) => {
                const arr = [...current.special_features]
                const prev = arr[index]
                if (!prev) return current

                arr[index] = {
                    ...prev,
                    ...update,
                    name: (update.name ?? prev.name).trim(),
                    description: update.description ?? prev.description ?? '',
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
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
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
                    ...(current.meta || {}),
                    ...update,
                },
            })),
    }
}

export function useChallengeViewStore() {
    const tab = useLegendChallengeTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const view = tab?.view ?? fallbackView

    const patchView = (patch: Partial<ChallengeViewState>) => {
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
        setBackground: (background: ChallengeViewState['background']) =>
            patchView({ background }),
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
        setExportPrefs: (partial: Partial<ChallengeViewState['exportPrefs']>) =>
            patchView({
                exportPrefs: {
                    ...view.exportPrefs,
                    ...partial,
                },
            }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultChallengeView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useChallengeSheetStore() {
    const tab = useLegendChallengeTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultChallengeSheetState

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

            setTabSheet(tab.id, cloneValue(defaultChallengeSheetState))
        },
    }
}

export function isEmptySection(challenge: Challenge, id: SectionId) {
    switch (id) {
        case 'rolesDesc':
            return !(challenge.roles?.length || challenge.description?.trim())
        case 'limits':
            return !challenge.limits.length
        case 'tagsStatuses':
            return !challenge.tags_and_statuses.length
        case 'might':
            return !challenge.mights.length
        case 'specialFeatures':
            return !challenge.special_features.length
        case 'threats':
            return !challenge.threats.length
        case 'generalConsequences':
            return !challenge.general_consequences.length
        case 'meta': {
            const meta = challenge.meta
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
    challenge: Challenge,
    id: SectionId,
    view: ChallengeViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(challenge, id)) return false
    return true
}

export function groupShouldShow(
    challenge: Challenge,
    sectionIds: SectionId[],
    view: ChallengeViewState
) {
    return sectionIds.some((sectionId) => shouldShow(challenge, sectionId, view))
}

export function getChallengePreviewWidth(view: ChallengeViewState) {
    return view.previewWidth
}

export function getLiveLegendChallengeTab() {
    return getLegendChallengeTab()
}
