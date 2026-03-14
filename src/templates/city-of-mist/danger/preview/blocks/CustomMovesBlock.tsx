import { useCityOfMistDangerStore } from '../../hooks'
import { renderDangerMarkdownInline } from '../../markdown'
import { ClickableSection } from '../components/Clickable'

export default function CustomMovesBlock({ onClick }: { onClick: () => void }) {
    const { cityOfMistDanger } = useCityOfMistDangerStore()

    return (
        <div className="city-danger-section">
            <ClickableSection onClick={onClick} ariaLabel="Edit custom moves">
                {cityOfMistDanger.custom_moves.length ? (
                    <ul className="city-danger-list">
                        {cityOfMistDanger.custom_moves.map(
                            (customMove, index) => (
                                <li key={`${customMove.name}-${index}`}>
                                    <span className="font-bold">
                                        {customMove.name}
                                    </span>
                                    <span>: </span>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: renderDangerMarkdownInline(
                                                customMove.description
                                            ),
                                        }}
                                    />
                                </li>
                            )
                        )}
                    </ul>
                ) : (
                    <div className="city-danger-empty-row">
                        <span className="city-danger-placeholder">
                            add custom moves
                        </span>
                    </div>
                )}
            </ClickableSection>
        </div>
    )
}
