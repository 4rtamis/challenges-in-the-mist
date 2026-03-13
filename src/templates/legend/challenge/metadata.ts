import type { SectionId } from './model'

export const challengeSections: Array<{ id: SectionId; label: string }> = [
    { id: 'rolesDesc', label: 'Roles & Description' },
    { id: 'limits', label: 'Limits' },
    { id: 'tagsStatuses', label: 'Tags & Statuses' },
    { id: 'might', label: 'Might' },
    { id: 'specialFeatures', label: 'Special Features' },
    { id: 'threats', label: 'Threats' },
    { id: 'generalConsequences', label: 'General Consequences' },
    { id: 'meta', label: 'Meta footer' },
]

export const challengeZoomOptions = [0.75, 1, 1.25, 1.5]

export const challengeBackgroundOptions = [
    { value: 'parchment', label: 'Parchment' },
    { value: 'plain', label: 'Plain' },
    { value: 'transparent', label: 'Transparent' },
] as const
