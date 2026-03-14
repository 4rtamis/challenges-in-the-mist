import { type PublicationType, useCityOfMistDangerStore } from '../../hooks'
import { ClickableSection } from '../components/Clickable'

const TYPE_LABEL: Record<PublicationType, string> = {
    official: 'Official',
    third_party: 'Third Party',
    cauldron: 'Cauldron',
    homebrew: 'Homebrew',
}

export default function MetaFooterBlock({ onClick }: { onClick: () => void }) {
    const { cityOfMistDanger } = useCityOfMistDangerStore()
    const meta = cityOfMistDanger.meta
    const hasMeta =
        !!meta?.publication_type ||
        !!meta?.source ||
        (meta?.authors != null && meta.authors.length > 0) ||
        meta?.page != null

    return (
        <div className="city-danger-meta-wrap">
            <ClickableSection onClick={onClick} ariaLabel="Edit metadata">
                <div className="city-danger-meta">
                    {hasMeta ? (
                        <div className="city-danger-meta__content">
                            {meta?.publication_type ? (
                                <span className="city-danger-meta__badge">
                                    {TYPE_LABEL[meta.publication_type]}
                                </span>
                            ) : null}
                            {meta?.source ? (
                                <span className="font-semibold">
                                    {meta.source}
                                </span>
                            ) : null}
                            {meta?.authors && meta.authors.length > 0 ? (
                                <span>by {meta.authors.join(', ')}</span>
                            ) : null}
                            {meta?.page != null ? (
                                <span>(p.{meta.page})</span>
                            ) : null}
                        </div>
                    ) : (
                        <span className="city-danger-placeholder city-danger-placeholder--meta">
                            add attribution
                        </span>
                    )}
                </div>
            </ClickableSection>
        </div>
    )
}
