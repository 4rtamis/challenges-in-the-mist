// src/preview/blocks/SpecialFeaturesBlock.tsx
import { useChallengeStore } from '@/store/challengeStore'
import { useSheetStore } from '@/store/sheetStore'
import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../components/Clickable'
import { SectionHeader } from '../components/SectionHeader'

export default function SpecialFeaturesBlock() {
    const { challenge } = useChallengeStore()
    const { openSheet } = useSheetStore()

    return (
        <div className="space-y-0.5">
            <SectionHeader
                title="Special Features"
                onClick={() => openSheet({ kind: 'special', mode: 'create' })}
            />
            <div className="flex flex-col items-center gap-1">
                {challenge.special_features.length ? (
                    challenge.special_features.map((sf, i) => (
                        <ClickableSection
                            key={`${sf.name}-${i}`}
                            onClick={() =>
                                openSheet({
                                    kind: 'special',
                                    index: i,
                                    mode: 'edit',
                                })
                            }
                            ariaLabel={`Edit feature ${sf.name}`}
                        >
                            <div className="mx-auto">
                                <div className="feature-name">{sf.name}</div>
                                {sf.description && (
                                    <div
                                        className="feature-body"
                                        dangerouslySetInnerHTML={{
                                            __html: renderLitmMarkdown(
                                                sf.description
                                            ),
                                        }}
                                    />
                                )}
                            </div>
                        </ClickableSection>
                    ))
                ) : (
                    <button
                        type="button"
                        className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                        onClick={() =>
                            openSheet({ kind: 'special', mode: 'create' })
                        }
                    >
                        add special features
                    </button>
                )}
            </div>
        </div>
    )
}
