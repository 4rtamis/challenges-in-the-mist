import {
    groupShouldShow,
    shouldShow,
    useChallengeStore,
    useChallengeViewStore,
    type SectionId,
} from '../../hooks'

export function SectionGate({
    id,
    children,
}: {
    id: SectionId
    children: React.ReactNode
}) {
    const { challenge } = useChallengeStore()
    const view = useChallengeViewStore()
    if (!shouldShow(challenge, id, view)) return null
    return <>{children}</>
}

export function SectionGroupGate({
    ids,
    children,
}: {
    ids: SectionId[]
    children: React.ReactNode
}) {
    const { challenge } = useChallengeStore()
    const view = useChallengeViewStore()
    if (!groupShouldShow(challenge, ids, view)) return null
    return <>{children}</>
}
