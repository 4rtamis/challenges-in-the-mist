import { rolesList } from '@/utils/constants'
import { parseToken } from '@/utils/tags'
import type { Challenge } from './model'

export function computeLegendInTheMistChallengeWarnings(
    challenge: Challenge
): string[] {
    const warnings: string[] = []

    const knownRoles = new Set(rolesList.map((role) => role.toLowerCase()))
    const unknownRoles = (challenge.roles ?? []).filter(
        (role) => !knownRoles.has(role.toLowerCase())
    )
    if (unknownRoles.length > 0) {
        warnings.push(`Unknown role(s): ${unknownRoles.join(', ')}.`)
    }

    const invalidTokens: string[] = []
    const limitsFound: string[] = []
    for (const token of challenge.tags_and_statuses ?? []) {
        const parsed = parseToken(token)
        if (!parsed) {
            invalidTokens.push(token)
            continue
        }

        if (parsed.kind === 'limit') {
            limitsFound.push(token)
        }
    }

    if (invalidTokens.length > 0) {
        warnings.push(
            `Some tokens aren't recognized as {!weakness}, {status-<n>} or {tag}: ${invalidTokens.join(', ')}.`
        )
    }

    if (limitsFound.length > 0) {
        warnings.push(
            `Limit-like tokens were found in Tags & Statuses and will be ignored by some tools: ${limitsFound.join(', ')}. Consider moving them to the Limits section.`
        )
    }

    const emptyOnMax = (challenge.limits ?? []).filter(
        (limit) => limit.is_progress && !limit.on_max
    )
    if (emptyOnMax.length > 0) {
        warnings.push(
            `Progress limit(s) without "on_max": ${emptyOnMax.map((limit) => limit.name).join(', ')}.`
        )
    }

    return warnings
}
