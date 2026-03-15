import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml'
import {
    toLegendInTheMistChallengeDocument,
    type LegendInTheMistChallenge,
} from './model'
import { LegendInTheMistChallengeSchema } from './schema'
import { computeLegendInTheMistChallengeWarnings } from './warnings'

/** Import and validate. Throws with a readable message on errors. */
export const importFromTOML = (t: string) => importFromTOMLWithWarnings(t)

export function importFromTOMLWithWarnings(tomlText: string): {
    legendInTheMistChallenge: LegendInTheMistChallenge
    warnings: string[]
} {
    const raw = tomlParse(tomlText) // may throw if not TOML
    const parsed = LegendInTheMistChallengeSchema.safeParse(raw)

    if (!parsed.success) {
        // Flatten Zod issues into a friendly message
        const msg = parsed.error.issues
            .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
            .join('\n')
        throw new Error(msg)
    }

    const legendInTheMistChallenge = toLegendInTheMistChallengeDocument(
        parsed.data
    )
    const warnings = computeLegendInTheMistChallengeWarnings(
        legendInTheMistChallenge
    )
    return { legendInTheMistChallenge, warnings }
}

/** Ensure we only export validated, normalized data. */
export function exportToTOML(
    legendInTheMistChallenge: LegendInTheMistChallenge
): string {
    const parsed = LegendInTheMistChallengeSchema.safeParse(
        legendInTheMistChallenge
    )
    if (!parsed.success) {
        const msg = parsed.error.issues
            .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
            .join('\n')
        throw new Error(`Cannot export: data is invalid.\n${msg}`)
    }
    return tomlStringify(parsed.data as any)
}
