import { templateById } from '@/core/templates/registry'
import { LegendInTheMistChallengeSchema } from '@/templates/legend/challenge/schema'
import { toChallengeDocument } from '@/templates/legend/challenge/model'
import { create } from 'zustand'
import type { TemplateMode } from '../templates/types'
import type { AnyWorkspaceTab, WorkspaceSnapshot, WorkspaceTab } from './types'

const WORKSPACE_STORAGE_KEY = 'mist:workspace:v1'
const LEGACY_CHALLENGE_KEY = 'litm:challenge:v2'

type WorkspaceState = {
    tabs: WorkspaceTab[]
    tabOrder: string[]
    activeTabId: string | null
    hydrated: boolean

    createTab: (templateId: string) => string | null
    closeTab: (tabId: string) => string | null
    activateTab: (tabId: string | null) => void

    setTabMode: (tabId: string, mode: TemplateMode) => void
    replaceTabDoc: (tabId: string, doc: unknown) => void
    updateTabDoc: (
        tabId: string,
        updater: (currentDoc: unknown) => unknown
    ) => void
    patchTabView: (tabId: string, patch: Record<string, unknown>) => void
    setTabSheet: (tabId: string, sheet: unknown) => void

    hydrateWorkspace: () => void
    persistWorkspace: () => void
}

function createTabId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }

    return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function toSnapshot(state: Pick<WorkspaceState, 'tabs' | 'tabOrder' | 'activeTabId'>): WorkspaceSnapshot {
    return {
        version: 1,
        tabs: state.tabs,
        tabOrder: state.tabOrder,
        activeTabId: state.activeTabId,
    }
}

function persistSnapshot(
    state: Pick<WorkspaceState, 'tabs' | 'tabOrder' | 'activeTabId'>
) {
    if (typeof window === 'undefined') return

    try {
        const serialized = JSON.stringify(toSnapshot(state))
        window.localStorage.setItem(WORKSPACE_STORAGE_KEY, serialized)
    } catch (error) {
        console.warn('Workspace persistence failed:', error)
    }
}

function applyOrder(tabs: AnyWorkspaceTab[], tabOrder: string[]) {
    const ordered = tabOrder.filter((id) => tabs.some((tab) => tab.id === id))
    const missing = tabs
        .map((tab) => tab.id)
        .filter((id) => !ordered.includes(id))

    return [...ordered, ...missing]
}

function withTouched(
    tab: AnyWorkspaceTab,
    patch: Partial<AnyWorkspaceTab>
): AnyWorkspaceTab {
    return {
        ...tab,
        ...patch,
        updatedAt: Date.now(),
    }
}

function withDerivedTitle(tab: AnyWorkspaceTab, nextDoc: unknown): AnyWorkspaceTab {
    const template = templateById.get(tab.templateId)
    const getTitle = template?.getTabTitle

    if (!getTitle) {
        return withTouched(tab, { doc: nextDoc })
    }

    const title = getTitle(nextDoc as any)
    return withTouched(tab, { doc: nextDoc, title })
}

function migrateLegacyChallenge(): WorkspaceSnapshot | null {
    if (typeof window === 'undefined') return null

    try {
        const rawLegacy = window.localStorage.getItem(LEGACY_CHALLENGE_KEY)
        if (!rawLegacy) return null

        const parsed = JSON.parse(rawLegacy) as { version?: number; data?: unknown }
        const legacyData = parsed?.data
        const validated = LegendInTheMistChallengeSchema.safeParse(legacyData)
        if (!validated.success) return null

        const template = templateById.get('legend.challenge')
        if (!template) return null

        const now = Date.now()
        const tabId = createTabId()
        const doc = cloneValue(toChallengeDocument(validated.data))

        const migratedTab: AnyWorkspaceTab = {
            id: tabId,
            templateId: template.id,
            title: template.getTabTitle(doc),
            mode: 'editing',
            createdAt: now,
            updatedAt: now,
            doc,
            view: cloneValue(template.createInitialView()),
            sheet: cloneValue(template.createInitialSheet()),
        }

        window.localStorage.removeItem(LEGACY_CHALLENGE_KEY)

        return {
            version: 1,
            tabs: [migratedTab],
            tabOrder: [tabId],
            activeTabId: tabId,
        }
    } catch (error) {
        console.warn('Legacy workspace migration failed:', error)
        return null
    }
}

function readWorkspaceSnapshot(): WorkspaceSnapshot | null {
    if (typeof window === 'undefined') return null

    try {
        const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY)
        if (!raw) return null

        const parsed = JSON.parse(raw) as WorkspaceSnapshot
        if (parsed?.version !== 1) return null
        if (!Array.isArray(parsed.tabs)) return null
        if (!Array.isArray(parsed.tabOrder)) return null

        const tabs = parsed.tabs.filter(
            (tab): tab is AnyWorkspaceTab =>
                typeof tab?.id === 'string' &&
                typeof tab?.templateId === 'string' &&
                typeof tab?.title === 'string' &&
                (tab?.mode === 'landing' || tab?.mode === 'editing') &&
                typeof tab?.createdAt === 'number' &&
                typeof tab?.updatedAt === 'number'
        )

        const tabOrder = applyOrder(tabs, parsed.tabOrder)
        const hasActive =
            parsed.activeTabId != null && tabOrder.includes(parsed.activeTabId)

        return {
            version: 1,
            tabs,
            tabOrder,
            activeTabId: hasActive ? parsed.activeTabId : null,
        }
    } catch (error) {
        console.warn('Workspace hydrate failed:', error)
        return null
    }
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => {
    const setAndPersist = (
        updater: (state: WorkspaceState) => Partial<WorkspaceState>
    ) => {
        set((state) => {
            const patch = updater(state)
            const next = {
                ...state,
                ...patch,
            }
            persistSnapshot(next)
            return patch
        })
    }

    return {
        tabs: [],
        tabOrder: [],
        activeTabId: null,
        hydrated: false,

        createTab: (templateId) => {
            const template = templateById.get(templateId)
            if (!template || !template.implemented) return null

            const tabId = createTabId()
            const now = Date.now()
            const doc = cloneValue(template.createExample())

            const tab: AnyWorkspaceTab = {
                id: tabId,
                templateId: template.id,
                title: template.getTabTitle(doc),
                mode: 'landing',
                createdAt: now,
                updatedAt: now,
                doc,
                view: cloneValue(template.createInitialView()),
                sheet: cloneValue(template.createInitialSheet()),
            }

            setAndPersist((state) => ({
                tabs: [...state.tabs, tab],
                tabOrder: [...state.tabOrder, tabId],
                activeTabId: tabId,
            }))

            return tabId
        },

        closeTab: (tabId) => {
            let nextActive: string | null = null

            setAndPersist((state) => {
                const currentOrder = state.tabOrder
                const index = currentOrder.indexOf(tabId)
                const nextTabs = state.tabs.filter((tab) => tab.id !== tabId)
                const nextOrder = currentOrder.filter((id) => id !== tabId)

                if (state.activeTabId !== tabId) {
                    nextActive = state.activeTabId
                } else {
                    const preferredIndex = Math.max(index, 0)
                    nextActive = nextOrder[preferredIndex] ?? nextOrder[preferredIndex - 1] ?? null
                }

                return {
                    tabs: nextTabs,
                    tabOrder: nextOrder,
                    activeTabId: nextActive,
                }
            })

            return nextActive
        },

        activateTab: (tabId) => {
            setAndPersist((state) => {
                if (tabId == null) {
                    return { activeTabId: null }
                }

                const exists = state.tabOrder.includes(tabId)
                return { activeTabId: exists ? tabId : null }
            })
        },

        setTabMode: (tabId, mode) => {
            setAndPersist((state) => ({
                tabs: state.tabs.map((tab) =>
                    tab.id === tabId ? withTouched(tab, { mode }) : tab
                ),
            }))
        },

        replaceTabDoc: (tabId, doc) => {
            const nextDoc = cloneValue(doc)

            setAndPersist((state) => ({
                tabs: state.tabs.map((tab) =>
                    tab.id === tabId ? withDerivedTitle(tab, nextDoc) : tab
                ),
            }))
        },

        updateTabDoc: (tabId, updater) => {
            setAndPersist((state) => ({
                tabs: state.tabs.map((tab) => {
                    if (tab.id !== tabId) return tab
                    const nextDoc = cloneValue(updater(cloneValue(tab.doc)))
                    return withDerivedTitle(tab, nextDoc)
                }),
            }))
        },

        patchTabView: (tabId, patch) => {
            setAndPersist((state) => ({
                tabs: state.tabs.map((tab) => {
                    if (tab.id !== tabId) return tab
                    const nextView = {
                        ...(tab.view as Record<string, unknown>),
                        ...patch,
                    }
                    return withTouched(tab, { view: nextView })
                }),
            }))
        },

        setTabSheet: (tabId, sheet) => {
            setAndPersist((state) => ({
                tabs: state.tabs.map((tab) =>
                    tab.id === tabId ? withTouched(tab, { sheet: cloneValue(sheet) }) : tab
                ),
            }))
        },

        hydrateWorkspace: () => {
            if (get().hydrated) return

            const persisted = readWorkspaceSnapshot()
            if (persisted) {
                set({
                    tabs: persisted.tabs,
                    tabOrder: persisted.tabOrder,
                    activeTabId: persisted.activeTabId,
                    hydrated: true,
                })
                return
            }

            const migrated = migrateLegacyChallenge()
            if (migrated) {
                set({
                    tabs: migrated.tabs,
                    tabOrder: migrated.tabOrder,
                    activeTabId: migrated.activeTabId,
                    hydrated: true,
                })
                persistSnapshot(migrated)
                return
            }

            set({ hydrated: true })
        },

        persistWorkspace: () => {
            const state = get()
            persistSnapshot(state)
        },
    }
})

export function findTabById(state: Pick<WorkspaceState, 'tabs'>, tabId: string) {
    return state.tabs.find((tab) => tab.id === tabId)
}

export function getActiveTab(state: Pick<WorkspaceState, 'tabs' | 'activeTabId'>) {
    if (!state.activeTabId) return null
    return state.tabs.find((tab) => tab.id === state.activeTabId) ?? null
}

export type { WorkspaceState }
