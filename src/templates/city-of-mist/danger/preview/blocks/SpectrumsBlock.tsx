import { useCityOfMistDangerStore } from '../../hooks'
import { formatSpectrumLabel } from '../../markdown'
import { ClickableSection } from '../components/Clickable'

export default function SpectrumsBlock({
    onAddClick,
    onItemClick,
}: {
    onAddClick: () => void
    onItemClick: (index: number) => void
}) {
    const { cityOfMistDanger } = useCityOfMistDangerStore()

    return (
        <div className="city-danger-section">
            {cityOfMistDanger.spectrums.length ? (
                <div className="city-danger-spectrums">
                    {cityOfMistDanger.spectrums.map((spectrum, index) => (
                        <span key={`${spectrum.name}-${index}`}>
                            {index > 0 ? ' / ' : ''}
                            <button
                                type="button"
                                className="city-danger-preview-item city-danger-preview-item--inline"
                                onClick={() => onItemClick(index)}
                                aria-label={`Edit spectrum ${spectrum.name}`}
                            >
                                {formatSpectrumLabel(spectrum)}
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <ClickableSection
                    onClick={onAddClick}
                    ariaLabel="Edit spectrums"
                >
                    <div className="city-danger-spectrums">
                        <span className="city-danger-placeholder">
                            add spectrums
                        </span>
                    </div>
                </ClickableSection>
            )}
        </div>
    )
}
