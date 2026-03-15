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
import { cn } from '@/utils/cn'
import { getCatalogSources, type CatalogItem } from '@/utils/catalog'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useCityOfMistDangerStore, type PublicationType } from '../../hooks'

const TYPES: { value: PublicationType; label: string }[] = [
    { value: 'official', label: 'Official' },
    { value: 'third_party', label: 'Third Party' },
    { value: 'cauldron', label: 'Cauldron' },
    { value: 'homebrew', label: 'Homebrew' },
]

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
                {value.map((author) => (
                    <span
                        key={author}
                        className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs"
                    >
                        {author}
                        <button
                            type="button"
                            className="opacity-70 hover:opacity-100"
                            aria-label={`Remove ${author}`}
                            onClick={() =>
                                onChange(
                                    value.filter((item) => item !== author)
                                )
                            }
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </span>
                ))}
                <input
                    className="min-w-[10ch] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ',') {
                            event.preventDefault()
                            commitDraft()
                        }
                        if (
                            event.key === 'Backspace' &&
                            !draft &&
                            value.length
                        ) {
                            onChange(value.slice(0, -1))
                        }
                    }}
                    placeholder={value.length ? '' : placeholder}
                />
            </div>
        </div>
    )
}

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

function TypeSegment({
    value,
    onChange,
}: {
    value?: PublicationType
    onChange: (value: PublicationType) => void
}) {
    return (
        <div className="grid grid-cols-2 overflow-hidden rounded-md border sm:inline-grid sm:grid-cols-4">
            {TYPES.map((type) => (
                <Button
                    key={type.value}
                    type="button"
                    variant={value === type.value ? 'default' : 'ghost'}
                    className={cn(
                        'h-8 rounded-none border-none px-2 text-xs',
                        value === type.value ? '' : 'bg-background'
                    )}
                    onClick={() => onChange(type.value)}
                >
                    {type.label}
                </Button>
            ))}
        </div>
    )
}

export default function MetaForm() {
    const { cityOfMistDanger, updateMeta } = useCityOfMistDangerStore()
    const meta = cityOfMistDanger.meta
    const type = meta?.publication_type as PublicationType | undefined
    const authors = useMemo(() => meta?.authors ?? [], [meta?.authors])
    const sourceOptions =
        type === 'official' || type === 'third_party'
            ? getCatalogSources('city-of-mist', type)
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
                        value={meta?.source}
                        onSelect={pickFromCatalog}
                        placeholder={
                            type === 'official'
                                ? 'Select an official book...'
                                : 'Select a third-party source...'
                        }
                    />
                    <div className="text-xs text-muted-foreground">
                        Selecting a source auto-fills authors. You can still
                        edit them below.
                    </div>
                </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px] sm:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="danger-meta-source">
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
                        id="danger-meta-source"
                        className="h-8 px-2 text-sm"
                        value={meta?.source ?? ''}
                        onChange={(event) =>
                            updateMeta({ source: event.target.value })
                        }
                        placeholder={
                            type === 'cauldron'
                                ? 'e.g., Cauldron: Shadows in Brine'
                                : type === 'homebrew'
                                  ? 'e.g., Personal campaign notes'
                                  : 'Override selected source title'
                        }
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="danger-meta-page">
                        Page{' '}
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    </Label>
                    <Input
                        id="danger-meta-page"
                        className="h-8 px-2 text-sm"
                        type="number"
                        min={1}
                        value={meta?.page ?? ''}
                        onChange={(event) =>
                            updateMeta({
                                page: event.target.value
                                    ? Math.max(
                                          1,
                                          Math.floor(+event.target.value)
                                      )
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
                Meta is preserved on import/export and rendered as a small
                footer in the preview.
            </div>
        </div>
    )
}
