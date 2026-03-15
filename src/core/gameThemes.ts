import type { GameId } from './templates/types'

export const EDITOR_TOKEN_SCOPE_CLASS = 'mist-markdown-scope'

export type GameThemeDefinition = {
    id: GameId
    backgroundMode: 'cover' | 'contain-bottom' | 'neutral'
    backgroundImage: string | null
    tokenScopeClassName: typeof EDITOR_TOKEN_SCOPE_CLASS
}

export const gameThemeRegistry: Record<GameId, GameThemeDefinition> = {
    city: {
        id: 'city',
        backgroundMode: 'cover',
        backgroundImage: '/assets/images/com-bg.webp',
        tokenScopeClassName: EDITOR_TOKEN_SCOPE_CLASS,
    },
    legend: {
        id: 'legend',
        backgroundMode: 'contain-bottom',
        backgroundImage: '/assets/images/litm-bg.webp',
        tokenScopeClassName: EDITOR_TOKEN_SCOPE_CLASS,
    },
    otherscape: {
        id: 'otherscape',
        backgroundMode: 'neutral',
        backgroundImage: null,
        tokenScopeClassName: EDITOR_TOKEN_SCOPE_CLASS,
    },
}

export function getGameTheme(gameId: GameId) {
    return gameThemeRegistry[gameId]
}
