import { useCityOfMistDangerStore } from '../../hooks'
import { ClickableSection } from '../components/Clickable'

export default function BasicBlock({ onClick }: { onClick: () => void }) {
    const { cityOfMistDanger } = useCityOfMistDangerStore()
    const rating = Math.max(
        0,
        Math.min(5, Math.floor(cityOfMistDanger.rating || 0))
    )

    return (
        <div className="city-danger-section city-danger-section--title">
            <ClickableSection onClick={onClick} ariaLabel="Edit basic info">
                <div className="city-danger-title-row">
                    <h2 className="city-danger-title">
                        {cityOfMistDanger.name || 'Untitled Danger'}
                    </h2>
                    <span
                        className="city-danger-stars"
                        aria-label={`Danger rating ${rating}`}
                    >
                        {Array.from({ length: rating }).map((_, index) => (
                            <span key={index} aria-hidden className="text-2xl">
                                ★
                            </span>
                        ))}
                    </span>
                </div>
            </ClickableSection>
        </div>
    )
}
