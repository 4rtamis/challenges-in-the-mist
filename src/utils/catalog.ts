export type CatalogItem = {
    id: string
    title: string
    authors: string[]
}

export const OFFICIAL_SOURCES: CatalogItem[] = [
    {
        id: 'core-hero',
        title: 'Legend in the Mist - Core Book Volume I - The Hero',
        authors: ['Son of Oak'],
    },
    {
        id: 'core-narrator',
        title: 'Legend in the Mist - Core Book Volume II - The Narrator',
        authors: ['Son of Oak'],
    },
    {
        id: 'setting-hearts-of-ravensdale-the-dales',
        title: 'Hearts of Ravensdale - Setting Book 1 - The Dales',
        authors: ['Son of Oak'],
    },
]

export const THIRD_PARTY_SOURCES: CatalogItem[] = [
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
]
