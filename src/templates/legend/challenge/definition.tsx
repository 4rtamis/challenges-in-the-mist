import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { ChallengeAppearancePanel } from './editor/ChallengeAppearancePanel'
import { ChallengeEditorPanel } from './editor/ChallengeEditorPanel'
import { ChallengeImageExportSettings } from './editor/ChallengeImageExportSettings'
import {
    blankChallenge,
    defaultChallengeSheetState,
    defaultChallengeView,
    type Challenge,
    type ChallengeViewState,
} from './model'
import { challengeSections } from './metadata'
import { ChallengePreview } from './preview/ChallengePreview'
import { ChallengeSchema } from './schema'
import { getSampleChallenge } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'
import { getChallengePreviewWidth } from './hooks'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function createImageExportAction(format: 'png' | 'svg') {
    return {
        id: format,
        label: format.toUpperCase(),
        buttonLabel: `Export ${format.toUpperCase()}`,
        description: `Export the current challenge preview as ${format.toUpperCase()}.`,
        renderSettings: () => <ChallengeImageExportSettings />,
        run: async ({
            fileStem,
            getPreviewNode,
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
            view: ChallengeViewState
        }) => {
            const node = getPreviewNode()
            if (!node) {
                toast.error('Preview not found. Make sure the preview is visible.')
                return
            }

            node.classList.add('exporting')
            try {
                const pixelRatio = Number(view.exportPrefs.scale) || 1
                const snap: CaptureResult = await snapdom(node, {
                    scale: pixelRatio,
                    embedFonts: true,
                    backgroundColor: view.exportPrefs.transparent
                        ? 'transparent'
                        : undefined,
                })

                await snap.download({
                    filename:
                        format === 'png'
                            ? `${fileStem}@${pixelRatio}x`
                            : `${fileStem}@${pixelRatio}x.svg`,
                    format,
                })

                toast.success(`Exported ${format.toUpperCase()}.`)
            } catch (errorAny: any) {
                toast.error(
                    errorAny?.message ||
                        `Failed to export ${format.toUpperCase()}.`
                )
            } finally {
                node.classList.remove('exporting')
            }
        },
    }
}

const challengeTemplate: AnyTemplateDefinition = {
    id: 'legend.challenge',
    gameId: 'legend',
    gameLabel: 'Legend in the Mist',
    label: 'Challenge',
    implemented: true,
    schema: ChallengeSchema,
    createBlank: blankChallenge,
    createExample: getSampleChallenge,
    createInitialView: () => cloneValue(defaultChallengeView),
    createInitialSheet: () => cloneValue(defaultChallengeSheetState),
    getTabTitle: (doc: Challenge) => doc.name.trim() || 'Challenge',
    sections: challengeSections,
    landing: {
        description:
            'Choose how to start this template: blank, example, or import from TOML.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (tomlText: string) => {
            const { challenge, warnings } = importFromTOMLWithWarnings(tomlText)
            return {
                doc: challenge,
                warnings,
                previewName: challenge.name || 'Imported Challenge',
            }
        },
        exportToml: (doc: Challenge) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <ChallengePreview />,
    },
    editor: {
        emptyState: 'Click on the preview to edit a specific section.',
        renderPanel: () => <ChallengeEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: ChallengeViewState) =>
            getChallengePreviewWidth(view),
        renderPanel: () => <ChallengeAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current challenge data as TOML.',
                run: ({ doc, fileStem }: { doc: Challenge; fileStem: string }) => {
                    try {
                        const toml = exportToTOML(doc)
                        const blob = new Blob([toml], {
                            type: 'text/plain;charset=utf-8',
                        })
                        const url = URL.createObjectURL(blob)
                        const anchor = document.createElement('a')
                        anchor.href = url
                        anchor.download = `${fileStem}.toml`
                        document.body.appendChild(anchor)
                        anchor.click()
                        anchor.remove()
                        URL.revokeObjectURL(url)
                        toast.success('Exported TOML.')
                    } catch (errorAny: any) {
                        toast.error(
                            errorAny?.message || 'Failed to export TOML.'
                        )
                    }
                },
            },
            createImageExportAction('png'),
            createImageExportAction('svg'),
        ],
    },
}

export default challengeTemplate
