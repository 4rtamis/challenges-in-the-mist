import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml'
import { ChallengeSchema, computeWarnings } from '../schema/challengeSchema'
import type { Challenge } from '../store/challengeStore'

/** Import and validate. Throws with a readable message on errors. */
export const importFromTOML = (t: string) => importFromTOMLWithWarnings(t)

export function importFromTOMLWithWarnings(tomlText: string): {
    challenge: Challenge
    warnings: string[]
} {
    const raw = tomlParse(tomlText) // may throw if not TOML
    const parsed = ChallengeSchema.safeParse(raw) // shape + normalization

    if (!parsed.success) {
        // Flatten Zod issues into a friendly message
        const msg = parsed.error.issues
            .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
            .join('\n')
        throw new Error(msg)
    }

    const challenge = parsed.data
    const warnings = computeWarnings(challenge)
    return { challenge, warnings }
}

/** Ensure we only export validated, normalized data. */
export function exportToTOML(ch: Challenge): string {
    const parsed = ChallengeSchema.safeParse(ch)
    if (!parsed.success) {
        const msg = parsed.error.issues
            .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
            .join('\n')
        throw new Error(`Cannot export: data is invalid.\n${msg}`)
    }
    return tomlStringify(parsed.data as any)
}
