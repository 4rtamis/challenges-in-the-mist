import { useMemo, useState } from 'react'
import {
    useLegendInTheMistChallengeStore,
    type PublicationType,
} from '../../hooks'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { getCatalogSources, type CatalogItem } from '@/utils/catalog'
import { Check, ChevronsUpDown, X } from 'lucide-react'

const TYPES: { value: PublicationType; label: string }[] = [
    { value: 'official', label: 'Official' },
    { value: 'third_party', label: 'Third Party' },
    { value: 'cauldron', label: 'Cauldron' },
    { value: 'homebrew', label: 'Homebrew' },
]

/* ---------- Authors chips input ---------- */
function AuthorsInput({
    value,
    onChange,
    placeholder = 'Add author and press Enter',
}: {
    value: string[]
    onChange: (next: string[]) => void
    placeholder?: string
}) {
    const [draft, setDraft] = useState('')

    function commitDraft() {
        const name = draft.trim()
        if (!name) return
        if (!value.includes(name)) onChange([...value, name])
        setDraft('')
    }

    return (
        <div className="rounded-md border px-2 py-1">
            <div className="flex flex-wrap gap-1">
                {value.map((a) => (
                    <span
                        key={a}
                        className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs"
                    >
                        {a}
                        <button
                            type="button"
                            className="opacity-70 hover:opacity-100"
                            aria-label={`Remove ${a}`}
                            onClick={() =>
                                onChange(value.filter((x) => x !== a))
                            }
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </span>
                ))}
                <input
                    className="min-w-[10ch] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault()
                            commitDraft()
                        }
                        if (e.key === 'Backspace' && !draft && value.length) {
                            onChange(value.slice(0, -1))
                        }
                    }}
                    placeholder={value.length ? '' : placeholder}
                />
            </div>
        </div>
    )
}

/* ---------- Combobox for sources (Official / Third Party) ---------- */
function SourceCombobox({
    items,
    value,
    onSelect,
    placeholder,
}: {
    items: CatalogItem[]
    value?: string
    onSelect: (item: CatalogItem) => void
    placeholder: string
}) {
    const [open, setOpen] = useState(false)
    const current = items.find((item) => item.title === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-8 w-full justify-between px-2 text-sm"
                >
                    {current ? current.title : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search source..." />
                    <CommandEmpty>No match.</CommandEmpty>
                    <CommandGroup>
                        {items.map((item) => (
                            <CommandItem
                                key={item.id}
                                value={item.title}
                                onSelect={() => {
                                    onSelect(item)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        current?.id === item.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                                {item.title}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

/* ---------- Publication type segmented buttons ---------- */
function TypeSegment({
    value,
    onChange,
}: {
    value?: PublicationType
    onChange: (v: PublicationType) => void
}) {
    return (
        <div className="grid grid-cols-2 overflow-hidden rounded-md border sm:inline-grid sm:grid-cols-4">
            {TYPES.map((t) => (
                <Button
                    key={t.value}
                    type="button"
                    variant={value === t.value ? 'default' : 'ghost'}
                    className={cn(
                        'h-8 rounded-none border-none px-2 text-xs',
                        value === t.value ? '' : 'bg-background'
                    )}
                    onClick={() => onChange(t.value)}
                >
                    {t.label}
                </Button>
            ))}
        </div>
    )
}

/* ---------- Main MetaForm ---------- */
export default function MetaForm() {
    const { legendInTheMistChallenge, updateMeta } =
        useLegendInTheMistChallengeStore()
    const m = legendInTheMistChallenge.meta

    const type = m?.publication_type as PublicationType | undefined
    const authors = useMemo(() => m?.authors ?? [], [m?.authors])
    const sourceOptions =
        type === 'official' || type === 'third_party'
            ? getCatalogSources('legend-in-the-mist', type)
            : []

    function setType(next: PublicationType) {
        updateMeta({
            publication_type: next,
            source: '',
            authors: [],
        })
    }

    function pickFromCatalog(item: CatalogItem) {
        updateMeta({
            source: item.title,
            authors: item.authors,
        })
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>Publication type</Label>
                <TypeSegment value={type} onChange={setType} />
            </div>

            {sourceOptions.length > 0 ? (
                <div className="grid gap-1">
                    <Label>Source</Label>
                    <SourceCombobox
                        items={sourceOptions}
                        value={m?.source}
                        onSelect={pickFromCatalog}
                        placeholder={
                            type === 'official'
                                ? 'Select an official book...'
                                : 'Select a third-party source...'
                        }
                    />
                    <div className="text-xs text-muted-foreground">
                        Selecting a source auto-fills authors. You can still
                        edit below.
                    </div>
                </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px] sm:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="meta-source">
                        {type === 'cauldron'
                            ? 'Cauldron product title'
                            : type === 'homebrew'
                              ? 'Homebrew title / location'
                              : 'Source title'}{' '}
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    </Label>
                    <Input
                        id="meta-source"
                        className="h-8 px-2 text-sm"
                        value={m?.source ?? ''}
                        onChange={(e) => updateMeta({ source: e.target.value })}
                        placeholder={
                            type === 'cauldron'
                                ? 'e.g., Cauldron: Shadows in Brine'
                                : type === 'homebrew'
                                  ? 'e.g., Personal blog, campaign doc...'
                                  : 'Override selected source title'
                        }
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="meta-page">
                        Page{' '}
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    </Label>
                    <Input
                        id="meta-page"
                        className="h-8 px-2 text-sm"
                        type="number"
                        min={1}
                        value={m?.page ?? ''}
                        onChange={(e) =>
                            updateMeta({
                                page: e.target.value
                                    ? Math.max(1, Math.floor(+e.target.value))
                                    : undefined,
                            })
                        }
                        placeholder="142"
                    />
                </div>
            </div>

            <div className="grid gap-1">
                <Label>Authors</Label>
                <AuthorsInput
                    value={authors}
                    onChange={(next) => updateMeta({ authors: next })}
                    placeholder="Add author..."
                />
            </div>

            <div className="text-xs text-muted-foreground">
                Meta helps attribution & search and is preserved on
                import/export.
            </div>
        </div>
    )
}
