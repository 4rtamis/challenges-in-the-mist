import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import { DangerAppearancePanel } from './editor/DangerAppearancePanel'
import { DangerEditorPanel } from './editor/DangerEditorPanel'
import { DangerImageExportSettings } from './editor/DangerImageExportSettings'
import {
    blankCityOfMistDanger,
    defaultCityOfMistDangerSheetState,
    defaultCityOfMistDangerView,
    type CityOfMistDanger,
    type CityOfMistDangerViewState,
} from './model'
import { dangerSections } from './metadata'
import { DangerPreview } from './preview/DangerPreview'
import { CityOfMistDangerSchema } from './schema'
import { getSampleCityOfMistDanger } from './sample'
import { exportToTOML, importFromTOMLWithWarnings } from './toml'
import { getCityOfMistDangerPreviewWidth } from './hooks'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

function createImageExportAction() {
    return {
        id: 'png',
        label: 'PNG',
        buttonLabel: 'Export PNG',
        description: 'Export the current danger preview as PNG.',
        renderSettings: () => <DangerImageExportSettings />,
        run: async ({
            fileStem,
            getPreviewNode,
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
            view: CityOfMistDangerViewState
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
                    filename: `${fileStem}@${pixelRatio}x.png`,
                })

                toast.success('Exported PNG.')
            } catch (errorAny: any) {
                toast.error(errorAny?.message || 'Failed to export PNG.')
            } finally {
                node.classList.remove('exporting')
            }
        },
    }
}

const dangerTemplate: AnyTemplateDefinition = {
    id: 'city.danger',
    gameId: 'city',
    gameLabel: 'City of Mist',
    label: 'Danger',
    implemented: true,
    schema: CityOfMistDangerSchema,
    createBlank: blankCityOfMistDanger,
    createExample: getSampleCityOfMistDanger,
    createInitialView: () => cloneValue(defaultCityOfMistDangerView),
    createInitialSheet: () => cloneValue(defaultCityOfMistDangerSheetState),
    getTabTitle: (doc: CityOfMistDanger) => doc.name.trim() || 'Danger',
    sections: dangerSections,
    landing: {
        description:
            'Choose how to start this template: blank, example, or import from TOML.',
        exampleLabel: 'Start with example',
        blankLabel: 'Start blank',
        importLabel: 'Import TOML',
    },
    io: {
        importToml: (tomlText: string) => {
            const { cityOfMistDanger, warnings } =
                importFromTOMLWithWarnings(tomlText)
            return {
                doc: cityOfMistDanger,
                warnings,
                previewName: cityOfMistDanger.name || 'Imported Danger',
            }
        },
        exportToml: (doc: CityOfMistDanger) => exportToTOML(doc),
    },
    preview: {
        getRootSelector: (tabId: string) => `[data-preview-root="${tabId}"]`,
        render: () => <DangerPreview />,
    },
    editor: {
        emptyState: 'Click on the preview to edit a specific section.',
        renderPanel: () => <DangerEditorPanel />,
    },
    appearance: {
        getPreviewWidth: (view: CityOfMistDangerViewState) =>
            getCityOfMistDangerPreviewWidth(view),
        renderPanel: () => <DangerAppearancePanel />,
    },
    export: {
        actions: [
            {
                id: 'toml',
                label: 'TOML',
                buttonLabel: 'Export TOML',
                description: 'Export the current danger data as TOML.',
                run: ({ doc, fileStem }: { doc: CityOfMistDanger; fileStem: string }) => {
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
                        toast.error(errorAny?.message || 'Failed to export TOML.')
                    }
                },
            },
            createImageExportAction(),
        ],
    },
}

export default dangerTemplate
