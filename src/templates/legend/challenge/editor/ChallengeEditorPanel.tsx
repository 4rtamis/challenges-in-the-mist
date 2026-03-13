import BasicForm from './forms/BasicForm'
import LimitsForm from './forms/LimitsForm'
import MetaForm from './forms/MetaForm'
import MightForm from './forms/MightForm'
import SpecialFeaturesForm from './forms/SpecialFeaturesForm'
import TagsStatusesForm from './forms/TagsStatusesForm'
import ThreatsForm from './forms/ThreatsForm'
import { useChallengeSheetStore } from '../hooks'

export function ChallengeEditorPanel() {
    const { open, target } = useChallengeSheetStore()

    if (!open || !target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                Click on the preview to edit a specific section.
            </div>
        )
    }

    switch (target.kind) {
        case 'threats':
            return <ThreatsForm focusIndex={target.index} />
        case 'limits':
            return <LimitsForm focusIndex={target.index} />
        case 'tags':
            return <TagsStatusesForm focusIndex={target.index} />
        case 'mights':
            return <MightForm focusIndex={target.index} />
        case 'special':
            return <SpecialFeaturesForm focusIndex={target.index} />
        case 'basic':
            return <BasicForm />
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
