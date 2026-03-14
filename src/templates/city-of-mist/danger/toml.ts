import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml'
import { CityOfMistDangerSchema } from './schema'
import {
    toCityOfMistDangerDocument,
    type CityOfMistDanger,
} from './model'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistDanger: CityOfMistDanger
    warnings: string[]
} {
    const raw = tomlParse(tomlText)
    const parsed = CityOfMistDangerSchema.safeParse(raw)

    if (!parsed.success) {
        const msg = parsed.error.issues
            .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
            .join('\n')
        throw new Error(msg)
    }

    return {
        cityOfMistDanger: toCityOfMistDangerDocument(parsed.data),
        warnings: [],
    }
}

export function exportToTOML(cityOfMistDanger: CityOfMistDanger): string {
    const parsed = CityOfMistDangerSchema.safeParse(cityOfMistDanger)
    if (!parsed.success) {
        const msg = parsed.error.issues
            .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
            .join('\n')
        throw new Error(`Cannot export: data is invalid.\n${msg}`)
    }

    return tomlStringify(parsed.data as any)
}
