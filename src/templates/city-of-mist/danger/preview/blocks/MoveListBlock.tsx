import { renderSystemMarkdownInline } from '@/utils/markdown'
import { ClickableSection } from '../components/Clickable'

type Props = {
    values: string[]
    emptyLabel: string
    ariaLabel: string
    itemAriaLabel: (index: number, value: string) => string
    onAddClick: () => void
    onItemClick: (index: number) => void
}

export default function MoveListBlock({
    values,
    emptyLabel,
    ariaLabel,
    itemAriaLabel,
    onAddClick,
    onItemClick,
}: Props) {
    return (
        <div className="city-danger-section">
            {values.length ? (
                <ul className="city-danger-list city-danger-list--interactive">
                    {values.map((value, index) => (
                        <li key={`${value}-${index}`}>
                            <button
                                type="button"
                                className="city-danger-preview-item"
                                onClick={() => onItemClick(index)}
                                aria-label={itemAriaLabel(index, value)}
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: renderSystemMarkdownInline(
                                            value
                                        ),
                                    }}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <ClickableSection onClick={onAddClick} ariaLabel={ariaLabel}>
                    <div className="city-danger-empty-row">
                        <span className="city-danger-placeholder">
                            {emptyLabel}
                        </span>
                    </div>
                </ClickableSection>
            )}
        </div>
    )
}
