import {
    groupShouldShow,
    shouldShow,
    useLegendInTheMistChallengeStore,
    useLegendInTheMistChallengeViewStore,
    type SectionId,
} from '../../hooks'

export function SectionGate({
    id,
    children,
}: {
    id: SectionId
    children: React.ReactNode
}) {
    const { legendInTheMistChallenge } = useLegendInTheMistChallengeStore()
    const view = useLegendInTheMistChallengeViewStore()
    if (!shouldShow(legendInTheMistChallenge, id, view)) return null
    return <>{children}</>
}

export function SectionGroupGate({
    ids,
    children,
}: {
    ids: SectionId[]
    children: React.ReactNode
}) {
    const { legendInTheMistChallenge } = useLegendInTheMistChallengeStore()
    const view = useLegendInTheMistChallengeViewStore()
    if (!groupShouldShow(legendInTheMistChallenge, ids, view)) return null
    return <>{children}</>
}
