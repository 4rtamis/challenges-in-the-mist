import { renderSystemMarkdownInline } from '@/utils/markdown'
import {
    ClickableSection,
    handleClickableKeyDown,
} from '../components/Clickable'

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
                        <li
                            key={`${value}-${index}`}
                            className="city-danger-preview-item city-danger-preview-item--list-row"
                            onClick={() => onItemClick(index)}
                            onKeyDown={(event) =>
                                handleClickableKeyDown(event, () =>
                                    onItemClick(index)
                                )
                            }
                            role="button"
                            tabIndex={0}
                            aria-label={itemAriaLabel(index, value)}
                        >
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: renderSystemMarkdownInline(value),
                                }}
                            />
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
