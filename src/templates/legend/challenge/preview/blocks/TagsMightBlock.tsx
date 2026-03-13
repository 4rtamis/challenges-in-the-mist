// src/preview/blocks/TagsMightBlock.tsx
import { useLegendInTheMistChallengeSheetStore, useLegendInTheMistChallengeStore } from '../../hooks'
import { renderLitmInline } from '@/utils/markdown'
import { ClickableSection } from '../components/Clickable'
import { SectionGate } from '../components/SectionGate'
import { SectionHeader } from '../components/SectionHeader'

export default function TagsMightBlock() {
    const { legendInTheMistChallenge } = useLegendInTheMistChallengeStore()
    const { openSheet } = useLegendInTheMistChallengeSheetStore()

    return (
        <div className="space-y-0.5">
            <SectionHeader
                title="Tags & Statuses"
                onClick={() => openSheet({ kind: 'tags', mode: 'create' })}
            />

            <div className="flex flex-col items-center gap-2">
                {/* Tags / Statuses */}
                <SectionGate id="tagsStatuses">
                    <div className="tags-line text-center">
                        {legendInTheMistChallenge.tags_and_statuses.length ? (
                            <div className="flex flex-col flex-wrap justify-center">
                                {legendInTheMistChallenge.tags_and_statuses.map((t, i) => (
                                    <ClickableSection
                                        key={`${t}-${i}`}
                                        onClick={() =>
                                            openSheet({
                                                kind: 'tags',
                                                index: i,
                                                mode: 'edit',
                                            })
                                        }
                                        ariaLabel="Edit tag/status"
                                        overlayClassName=""
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: renderLitmInline(t),
                                            }}
                                        />
                                    </ClickableSection>
                                ))}
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                                onClick={() =>
                                    openSheet({ kind: 'tags', mode: 'create' })
                                }
                            >
                                add tags or statuses
                            </button>
                        )}
                    </div>
                </SectionGate>

                {/* Might */}
                <SectionGate id="might">
                    <div className="space-y-0.5 text-center">
                        {legendInTheMistChallenge.mights.length ? (
                            legendInTheMistChallenge.mights.map((m, idx) => (
                                <ClickableSection
                                    key={`${m.name}-${idx}`}
                                    onClick={() =>
                                        openSheet({
                                            kind: 'mights',
                                            index: idx,
                                            mode: 'edit',
                                        })
                                    }
                                    ariaLabel={`Edit might ${m.name}`}
                                >
                                    <div className="might-row justify-center">
                                        <span>
                                            {m.level === 'origin' ? (
                                                <span
                                                    className="ico ico-might-origin mr-1"
                                                    aria-hidden
                                                />
                                            ) : m.level === 'adventure' ? (
                                                <span
                                                    className="ico ico-might-adventure mr-1"
                                                    aria-hidden
                                                />
                                            ) : (
                                                <span
                                                    className="ico ico-might-greatness mr-1"
                                                    aria-hidden
                                                />
                                            )}
                                            {m.name}{' '}
                                            {m.vulnerability && (
                                                <span>({m.vulnerability})</span>
                                            )}
                                        </span>
                                    </div>
                                </ClickableSection>
                            ))
                        ) : (
                            <button
                                type="button"
                                className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                                onClick={() =>
                                    openSheet({
                                        kind: 'mights',
                                        mode: 'create',
                                    })
                                }
                            >
                                add might
                            </button>
                        )}
                    </div>
                </SectionGate>
            </div>
        </div>
    )
}
