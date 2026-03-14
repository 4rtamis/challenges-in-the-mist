import MoveListForm from './MoveListForm'
import { useCityOfMistDangerStore } from '../../hooks'

export default function HardMovesForm({ focusIndex }: { focusIndex?: number }) {
    const {
        cityOfMistDanger,
        addHardMove,
        updateHardMoveAt,
        removeHardMoveAt,
        moveHardMove,
    } = useCityOfMistDangerStore()

    return (
        <MoveListForm
            values={cityOfMistDanger.hard_moves}
            focusIndex={focusIndex}
            addLabel="Add hard move"
            emptyPlaceholder="Describe a hard move."
            fieldLabel="Hard move"
            defaultValue="Describe a hard move."
            addValue={addHardMove}
            updateValue={updateHardMoveAt}
            removeValue={removeHardMoveAt}
            moveValue={moveHardMove}
        />
    )
}
