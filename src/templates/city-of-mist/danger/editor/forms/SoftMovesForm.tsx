import MoveListForm from './MoveListForm'
import { useCityOfMistDangerStore } from '../../hooks'

export default function SoftMovesForm({ focusIndex }: { focusIndex?: number }) {
    const {
        cityOfMistDanger,
        addSoftMove,
        updateSoftMoveAt,
        removeSoftMoveAt,
        moveSoftMove,
    } = useCityOfMistDangerStore()

    return (
        <MoveListForm
            values={cityOfMistDanger.soft_moves}
            focusIndex={focusIndex}
            addLabel="Add soft move"
            emptyPlaceholder="Describe a soft move."
            fieldLabel="Soft move"
            defaultValue="Describe a soft move."
            addValue={addSoftMove}
            updateValue={updateSoftMoveAt}
            removeValue={removeSoftMoveAt}
            moveValue={moveSoftMove}
        />
    )
}
