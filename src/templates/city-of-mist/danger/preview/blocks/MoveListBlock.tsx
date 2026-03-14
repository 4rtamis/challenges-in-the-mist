import { renderDangerMarkdownInline } from '../../markdown'
import { ClickableSection } from '../components/Clickable'

type Props = {
    values: string[]
    emptyLabel: string
    ariaLabel: string
    onClick: () => void
}

export default function MoveListBlock({
    values,
    emptyLabel,
    ariaLabel,
    onClick,
}: Props) {
    return (
        <div className="city-danger-section">
            <ClickableSection onClick={onClick} ariaLabel={ariaLabel}>
                {values.length ? (
                    <ul className="city-danger-list">
                        {values.map((value, index) => (
                            <li key={`${value}-${index}`}>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: renderDangerMarkdownInline(
                                            value
                                        ),
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="city-danger-empty-row">
                        <span className="city-danger-placeholder">
                            {emptyLabel}
                        </span>
                    </div>
                )}
            </ClickableSection>
        </div>
    )
}
