import { useCityOfMistDangerStore } from '../../hooks'
import { renderSystemMarkdownInline } from '@/utils/markdown'
import { ClickableSection } from '../components/Clickable'

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
                        <li key={`${customMove.name}-${index}`}>
                            <button
                                type="button"
                                className="city-danger-preview-item"
                                onClick={() => onItemClick(index)}
                                aria-label={`Edit custom move ${customMove.name}`}
                            >
                                <span className="font-bold">
                                    {customMove.name}
                                </span>
                                <span>: </span>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: renderSystemMarkdownInline(
                                            customMove.description
                                        ),
                                    }}
                                />
                            </button>
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
