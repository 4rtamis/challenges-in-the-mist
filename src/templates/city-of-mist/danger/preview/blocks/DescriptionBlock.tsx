import { renderLitmMarkdown } from '@/utils/markdown'
import { useCityOfMistDangerStore } from '../../hooks'
import { ClickableSection } from '../components/Clickable'

export default function DescriptionBlock({ onClick }: { onClick: () => void }) {
    const { cityOfMistDanger } = useCityOfMistDangerStore()

    return (
        <div className="city-danger-section">
            <ClickableSection onClick={onClick} ariaLabel="Edit description">
                <div className="city-danger-description">
                    {cityOfMistDanger.description ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: renderLitmMarkdown(
                                    cityOfMistDanger.description
                                ),
                            }}
                        />
                    ) : (
                        <span className="city-danger-placeholder">
                            add a short description
                        </span>
                    )}
                </div>
            </ClickableSection>
        </div>
    )
}
