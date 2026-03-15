import { renderSystemMarkdownInline } from '@/utils/markdown'
import { useCityOfMistDangerStore } from '../../hooks'
import {
    ClickableSection,
    handleClickableKeyDown,
} from '../components/Clickable'

export default function CustomMovesBlock({
    onAddClick,
    onItemClick,
}: {
    onAddClick: () => void
    onItemClick: (index: number) => void
}) {
    const { cityOfMistDanger } = useCityOfMistDangerStore()

    return (
        <div className="city-danger-section">
            {cityOfMistDanger.custom_moves.length ? (
                <ul className="city-danger-list city-danger-list--interactive">
                    {cityOfMistDanger.custom_moves.map((customMove, index) => (
                        <li
                            key={`${customMove.name}-${index}`}
                            className="city-danger-preview-item city-danger-preview-item--list-row"
                            onClick={() => onItemClick(index)}
                            onKeyDown={(event) =>
                                handleClickableKeyDown(event, () =>
                                    onItemClick(index)
                                )
                            }
                            role="button"
                            tabIndex={0}
                            aria-label={`Edit custom move ${customMove.name}`}
                        >
                            <span className="font-bold">{customMove.name}</span>
                            <span>: </span>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: renderSystemMarkdownInline(
                                        customMove.description
                                    ),
                                }}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <ClickableSection
                    onClick={onAddClick}
                    ariaLabel="Edit custom moves"
                >
                    <div className="city-danger-empty-row">
                        <span className="city-danger-placeholder">
                            add custom moves
                        </span>
                    </div>
                </ClickableSection>
            )}
        </div>
    )
}
