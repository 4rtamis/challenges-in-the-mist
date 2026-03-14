import type { Background, SectionId } from './model'

export const dangerSections: Array<{ id: SectionId; label: string }> = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'spectrums', label: 'Spectrums' },
    { id: 'customMoves', label: 'Custom Moves' },
    { id: 'hardMoves', label: 'Hard Moves' },
    { id: 'softMoves', label: 'Soft Moves' },
    { id: 'meta', label: 'Meta footer' },
]

export const dangerBackgroundOptions: Array<{
    value: Background
    label: string
    color: string
}> = [
    { value: 'bg0', label: 'Rose', color: 'hsl(0 17% 82%)' },
    { value: 'bg1', label: 'Cream', color: 'hsl(42 38% 91%)' },
    { value: 'bg2', label: 'Paper', color: 'hsl(42 38% 95%)' },
    { value: 'bg3', label: 'Ochre', color: 'hsl(43 38% 82%)' },
    { value: 'bg4', label: 'Sand', color: 'hsl(31 38% 88%)' },
    { value: 'bg5', label: 'Lemon', color: 'hsl(57 38% 82%)' },
    { value: 'bg6', label: 'Sage', color: 'hsl(78 14% 85%)' },
    { value: 'bg7', label: 'Clay', color: 'hsl(26 15% 82%)' },
]
