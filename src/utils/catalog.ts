export type CatalogItem = {
    id: string
    title: string
    authors: string[]
}

export type CatalogSystem = 'city-of-mist' | 'legend-in-the-mist' | 'otherscape'

export type CatalogBySystem = Record<
    CatalogSystem,
    {
        official: CatalogItem[]
        third_party: CatalogItem[]
    }
>

export const SOURCE_CATALOG: CatalogBySystem = {
    'city-of-mist': {
        official: [
            {
                id: 'com-player-guide',
                title: "City of Mist: Player's Guide",
                authors: ['Son of Oak'],
            },
            {
                id: 'com-mc-toolkit',
                title: 'City of Mist: MC Toolkit',
                authors: ['Son of Oak'],
            },
            {
                id: 'com-shadows-showdowns',
                title: 'City of Mist: Shadows & Showdowns',
                authors: ['Son of Oak'],
            },
            {
                id: 'com-local-legends',
                title: 'City of Mist: Local Legends',
                authors: ['Son of Oak'],
            },
            {
                id: 'com-nights-of-payne-town',
                title: 'City of Mist: Nights of Payne Town',
                authors: ['Son of Oak'],
            },
        ],
        third_party: [],
    },
    'legend-in-the-mist': {
        official: [
            {
                id: 'litm-core-hero',
                title: 'Legend in the Mist - Core Book Volume I - The Hero',
                authors: ['Son of Oak'],
            },
            {
                id: 'litm-core-narrator',
                title: 'Legend in the Mist - Core Book Volume II - The Narrator',
                authors: ['Son of Oak'],
            },
            {
                id: 'litm-hearts-of-ravensdale-dales',
                title: 'Hearts of Ravensdale - Setting Book 1 - The Dales',
                authors: ['Son of Oak'],
            },
        ],
        third_party: [
            {
                id: 'zamanora-core',
                title: 'Zamanora - Ballad of the Witch - Core Book',
                authors: ['Eren Chronicles'],
            },
            {
                id: 'zamanora-monsters-and-fables',
                title: 'Zamanora - Ballad of the Witch - Monsters & Fables',
                authors: ['Eren Chronicles'],
            },
            {
                id: 'beyond-the-woods-wanderer-s-handbook',
                title: "Beyond the Woods - Wanderer's Handbook",
                authors: ['Old Oak Games'],
            },
            {
                id: 'beyond-the-woods-lorekeeper-s-guide',
                title: "Beyond the Woods - Lorekeeper's Guide",
                authors: ['Old Oak Games'],
            },
        ],
    },
    otherscape: {
        official: [
            {
                id: 'otherscape-core',
                title: ':Otherscape',
                authors: ['Son of Oak'],
            },
        ],
        third_party: [],
    },
}

export function getCatalogSources(
    system: CatalogSystem,
    type: 'official' | 'third_party'
): CatalogItem[] {
    return SOURCE_CATALOG[system][type]
}
