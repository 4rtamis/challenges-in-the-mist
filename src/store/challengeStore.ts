import type {
    Challenge,
    ChallengeMeta,
    Limit,
    Might,
    SpecialFeature,
    Threat,
} from '@/core/templates/legendChallengeModel'
import { blankChallenge } from '@/core/templates/legendChallengeModel'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import { create } from 'zustand'

export type {
    Challenge,
    ChallengeMeta,
    Limit,
    Might,
    MightLevel,
    PublicationType,
    SpecialFeature,
    Threat,
} from '@/core/templates/legendChallengeModel'

type ChallengeStore = {
    challenge: Challenge
    setChallenge: (update: Partial<Challenge>) => void
    replaceChallenge: (next: Challenge) => void
    resetChallenge: () => void

    addToken: (token: string) => void
    removeTokenAt: (index: number) => void
    replaceTokenAt: (index: number, token: string) => void
    moveToken: (from: number, to: number) => void

    addMight: (might: Might) => void
    updateMightAt: (index: number, update: Partial<Might>) => void
    removeMightAt: (index: number) => void
    moveMight: (from: number, to: number) => void

    addLimit: (limit: Limit) => void
    updateLimitAt: (index: number, update: Partial<Limit>) => void
    removeLimitAt: (index: number) => void
    moveLimit: (from: number, to: number) => void

    addThreat: (t: Threat) => void
    updateThreatAt: (index: number, update: Partial<Threat>) => void
    removeThreatAt: (index: number) => void
    moveThreat: (from: number, to: number) => void
    addConsequence: (threatIndex: number, text: string) => void
    updateConsequence: (
        threatIndex: number,
        cIndex: number,
        text: string
    ) => void
    removeConsequence: (threatIndex: number, cIndex: number) => void
    moveConsequence: (threatIndex: number, from: number, to: number) => void

    addGeneralConsequence: (text: string) => void
    updateGeneralConsequence: (index: number, text: string) => void
    removeGeneralConsequence: (index: number) => void
    moveGeneralConsequence: (from: number, to: number) => void

    addSpecialFeature: (sf: SpecialFeature) => void
    updateSpecialFeatureAt: (
        index: number,
        update: Partial<SpecialFeature>
    ) => void
    removeSpecialFeatureAt: (index: number) => void
    moveSpecialFeature: (from: number, to: number) => void

    updateMeta: (update: Partial<ChallengeMeta>) => void
}

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

function getActiveLegendTabId(): string | null {
    const ws = useWorkspaceStore.getState()
    const active = getActiveTab(ws)
    return active?.templateId === 'legend.challenge' ? active.id : null
}

function syncChallengeToWorkspace(nextChallenge: Challenge) {
    const tabId = getActiveLegendTabId()
    if (!tabId) return

    useWorkspaceStore.getState().replaceTabDoc(tabId, nextChallenge)
}

const fallbackChallenge = blankChallenge()

export const useChallengeStore = create<ChallengeStore>((set, get) => {
    const apply = (producer: (current: Challenge) => Challenge) => {
        const next = producer(get().challenge)
        set({ challenge: next })
        syncChallengeToWorkspace(next)
    }

    return {
        challenge: fallbackChallenge,

        setChallenge: (update) =>
            apply((current) => ({
                ...current,
                ...update,
            })),

        replaceChallenge: (next) => apply(() => cloneValue(next)),

        resetChallenge: () => apply(() => blankChallenge()),

        addToken: (token) =>
            apply((current) => ({
                ...current,
                tags_and_statuses: [...current.tags_and_statuses, token],
            })),

        removeTokenAt: (index) =>
            apply((current) => {
                const arr = [...current.tags_and_statuses]
                arr.splice(index, 1)
                return { ...current, tags_and_statuses: arr }
            }),

        replaceTokenAt: (index, token) =>
            apply((current) => {
                const arr = [...current.tags_and_statuses]
                arr[index] = token
                return { ...current, tags_and_statuses: arr }
            }),

        moveToken: (from, to) =>
            apply((current) => {
                const arr = [...current.tags_and_statuses]
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, tags_and_statuses: arr }
            }),

        addMight: (might) =>
            apply((current) => ({
                ...current,
                mights: [
                    ...current.mights,
                    { ...might, vulnerability: strOrNull(might.vulnerability) },
                ],
            })),

        updateMightAt: (index, update) =>
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

        removeMightAt: (index) =>
            apply((current) => {
                const arr = [...current.mights]
                arr.splice(index, 1)
                return { ...current, mights: arr }
            }),

        moveMight: (from, to) =>
            apply((current) => {
                const arr = [...current.mights]
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, mights: arr }
            }),

        addLimit: (limit) =>
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

        updateLimitAt: (index, update) =>
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

        removeLimitAt: (index) =>
            apply((current) => {
                const arr = [...current.limits]
                arr.splice(index, 1)
                return { ...current, limits: arr }
            }),

        moveLimit: (from, to) =>
            apply((current) => {
                const arr = [...current.limits]
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, limits: arr }
            }),

        addThreat: (t) =>
            apply((current) => ({
                ...current,
                threats: [
                    ...current.threats,
                    {
                        name: t.name.trim(),
                        description: t.description ?? '',
                        consequences: [...(t.consequences || [])],
                    },
                ],
            })),

        updateThreatAt: (index, update) =>
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

        removeThreatAt: (index) =>
            apply((current) => {
                const arr = [...current.threats]
                arr.splice(index, 1)
                return { ...current, threats: arr }
            }),

        moveThreat: (from, to) =>
            apply((current) => {
                const arr = [...current.threats]
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, threats: arr }
            }),

        addConsequence: (threatIndex, text) =>
            apply((current) => {
                const threats = [...current.threats]
                const t = threats[threatIndex]
                if (!t) return current

                threats[threatIndex] = {
                    ...t,
                    consequences: [...t.consequences, text],
                }

                return { ...current, threats }
            }),

        updateConsequence: (threatIndex, cIndex, text) =>
            apply((current) => {
                const threats = [...current.threats]
                const t = threats[threatIndex]
                if (!t) return current

                const cons = [...t.consequences]
                if (cIndex < 0 || cIndex >= cons.length) return current

                cons[cIndex] = text
                threats[threatIndex] = { ...t, consequences: cons }

                return { ...current, threats }
            }),

        removeConsequence: (threatIndex, cIndex) =>
            apply((current) => {
                const threats = [...current.threats]
                const t = threats[threatIndex]
                if (!t) return current

                const cons = [...t.consequences]
                cons.splice(cIndex, 1)
                threats[threatIndex] = { ...t, consequences: cons }

                return { ...current, threats }
            }),

        moveConsequence: (threatIndex, from, to) =>
            apply((current) => {
                const threats = [...current.threats]
                const t = threats[threatIndex]
                if (!t) return current

                const cons = [...t.consequences]
                if (from < 0 || from >= cons.length || to < 0 || to >= cons.length) {
                    return current
                }

                const [item] = cons.splice(from, 1)
                cons.splice(to, 0, item)
                threats[threatIndex] = { ...t, consequences: cons }

                return { ...current, threats }
            }),

        addGeneralConsequence: (text) =>
            apply((current) => ({
                ...current,
                general_consequences: [...current.general_consequences, text],
            })),

        updateGeneralConsequence: (index, text) =>
            apply((current) => {
                const arr = [...current.general_consequences]
                if (index < 0 || index >= arr.length) return current

                arr[index] = text
                return { ...current, general_consequences: arr }
            }),

        removeGeneralConsequence: (index) =>
            apply((current) => {
                const arr = [...current.general_consequences]
                arr.splice(index, 1)
                return { ...current, general_consequences: arr }
            }),

        moveGeneralConsequence: (from, to) =>
            apply((current) => {
                const arr = [...current.general_consequences]
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, general_consequences: arr }
            }),

        addSpecialFeature: (sf) =>
            apply((current) => ({
                ...current,
                special_features: [
                    ...current.special_features,
                    {
                        name: sf.name.trim(),
                        description: sf.description ?? '',
                    },
                ],
            })),

        updateSpecialFeatureAt: (index, update) =>
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

        removeSpecialFeatureAt: (index) =>
            apply((current) => {
                const arr = [...current.special_features]
                arr.splice(index, 1)
                return { ...current, special_features: arr }
            }),

        moveSpecialFeature: (from, to) =>
            apply((current) => {
                const arr = [...current.special_features]
                if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
                    return current
                }

                const [item] = arr.splice(from, 1)
                arr.splice(to, 0, item)
                return { ...current, special_features: arr }
            }),

        updateMeta: (update) =>
            apply((current) => ({
                ...current,
                meta: {
                    ...(current.meta || {}),
                    ...update,
                },
            })),
    }
})

let lastTabId: string | null = null
let lastDocRef: unknown = null

function syncChallengeStoreFromWorkspace() {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)

    if (active?.templateId !== 'legend.challenge') {
        if (lastTabId !== null || lastDocRef !== null) {
            lastTabId = null
            lastDocRef = null
            useChallengeStore.setState({ challenge: blankChallenge() })
        }
        return
    }

    if (active.id === lastTabId && active.doc === lastDocRef) return

    lastTabId = active.id
    lastDocRef = active.doc
    useChallengeStore.setState({
        challenge: cloneValue(active.doc as Challenge),
    })
}

useWorkspaceStore.subscribe(syncChallengeStoreFromWorkspace)
syncChallengeStoreFromWorkspace()
