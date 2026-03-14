import { useCityOfMistDangerStore } from '../../hooks'
import { formatSpectrumLabel } from '../../markdown'
import { ClickableSection } from '../components/Clickable'

export default function SpectrumsBlock({ onClick }: { onClick: () => void }) {
    const { cityOfMistDanger } = useCityOfMistDangerStore()

    return (
        <div className="city-danger-section">
            <ClickableSection onClick={onClick} ariaLabel="Edit spectrums">
                <div className="city-danger-spectrums">
                    {cityOfMistDanger.spectrums.length ? (
                        cityOfMistDanger.spectrums.map((spectrum, index) => (
                            <span key={`${spectrum.name}-${index}`}>
                                {index > 0 ? ' / ' : ''}
                                {formatSpectrumLabel(spectrum)}
                            </span>
                        ))
                    ) : (
                        <span className="city-danger-placeholder">
                            add spectrums
                        </span>
                    )}
                </div>
            </ClickableSection>
        </div>
    )
}
