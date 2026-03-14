import { useCityOfMistDangerSheetStore } from '../hooks'
import BasicForm from './forms/BasicForm'
import CustomMovesForm from './forms/CustomMovesForm'
import HardMovesForm from './forms/HardMovesForm'
import MetaForm from './forms/MetaForm'
import SoftMovesForm from './forms/SoftMovesForm'
import SpectrumsForm from './forms/SpectrumsForm'

export function DangerEditorPanel() {
    const { open, target } = useCityOfMistDangerSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                Click on the preview to edit a specific section.
            </div>
        )
    }

    switch (target.kind) {
        case 'basic':
            return <BasicForm />
        case 'spectrums':
            return <SpectrumsForm focusIndex={target.index} />
        case 'customMoves':
            return <CustomMovesForm focusIndex={target.index} />
        case 'hardMoves':
            return <HardMovesForm focusIndex={target.index} />
        case 'softMoves':
            return <SoftMovesForm focusIndex={target.index} />
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
