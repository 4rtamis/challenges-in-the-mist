import { useLegendInTheMistChallengeSheetStore, useLegendInTheMistChallengeStore } from '../../hooks'
import { renderLitmMarkdown } from '@/utils/markdown'
import '../challengeTheme.css'
import { ClickableSection } from '../components/Clickable'
import { SectionGate } from '../components/SectionGate'

export default function BasicBlock() {
    const { legendInTheMistChallenge } = useLegendInTheMistChallengeStore()
    const { openSheet } = useLegendInTheMistChallengeSheetStore()

    const rating = Math.max(1, Math.min(5, Math.floor(legendInTheMistChallenge.rating || 1)))

    return (
        <>
            {/* Name + Rating */}
            <ClickableSection
                onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
                ariaLabel="Edit basic info"
            >
                <h2 className="challenge-name uppercase text-center">
                    <span>{legendInTheMistChallenge.name || 'Untitled Challenge'}</span>
                    <span className="challenge-rating align-middle ml-[7pt]">
                        {Array.from({ length: rating }).map((_, i) => (
                            <span
                                key={i}
                                className="ico ico-cross"
                                aria-hidden
                            />
                        ))}
                    </span>
                </h2>
            </ClickableSection>

            {/* Roles + Description */}
            <SectionGate id="rolesDesc">
                <ClickableSection
                    onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
                    ariaLabel="Edit roles"
                >
                    <div className="text-center challenge-roles">
                        {legendInTheMistChallenge.roles.length ? (
                            legendInTheMistChallenge.roles.join(', ')
                        ) : (
                            <span className="underline decoration-dotted cursor-pointer">
                                add roles
                            </span>
                        )}
                    </div>
                </ClickableSection>
                <ClickableSection
                    onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
                    ariaLabel="Edit description"
                >
                    <div className="flex justify-center my-2">
                        <div
                            className="challenge-desc text-center"
                            style={{ width: '77%' }}
                        >
                            {legendInTheMistChallenge.description ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: renderLitmMarkdown(
                                            legendInTheMistChallenge.description
                                        ),
                                    }}
                                />
                            ) : (
                                <span className="underline decoration-dotted cursor-pointer">
                                    add a short description
                                </span>
                            )}
                        </div>
                    </div>
                </ClickableSection>
            </SectionGate>
        </>
    )
}
