import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
    useUIStore,
    type SectionId,
} from '@/store/uiStore'

export default function ViewMenu({ children }: { children: React.ReactNode }) {
    const {
        hidden,
        toggleHidden,
        autoHideEmpty,
        setAutoHideEmpty,
        setZoom,
        previewWidth,
        setPreviewWidth,
        background,
        setBackground,
        resetViewPrefs,
    } = useUIStore()

    const sectionItems: { id: SectionId; label: string }[] = [
        { id: 'rolesDesc', label: 'Roles & Description' },
        { id: 'tagsStatuses', label: 'Tags & Statuses' },
        { id: 'might', label: 'Might' },
        { id: 'specialFeatures', label: 'Special Features' },
        { id: 'meta', label: 'Meta footer' },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>View</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                    checked={autoHideEmpty}
                    onCheckedChange={(v) => setAutoHideEmpty(!!v)}
                >
                    Auto-hide empty sections
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Show sections</DropdownMenuLabel>
                {sectionItems.map((s) => (
                    <DropdownMenuCheckboxItem
                        key={s.id}
                        checked={!hidden[s.id]}
                        onCheckedChange={() => toggleHidden(s.id)}
                    >
                        {s.label}
                    </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Zoom</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setZoom(0.75)}>
                            75%
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setZoom(1)}>
                            100%
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setZoom(1.25)}>
                            125%
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setZoom(1.5)}>
                            150%
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Preview width</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-64 p-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{PREVIEW_WIDTH_MIN}px</span>
                            <span className="font-medium text-foreground">
                                {previewWidth}px
                            </span>
                            <span>{PREVIEW_WIDTH_MAX}px</span>
                        </div>
                        <input
                            type="range"
                            min={PREVIEW_WIDTH_MIN}
                            max={PREVIEW_WIDTH_MAX}
                            step={10}
                            value={previewWidth}
                            onChange={(e) =>
                                setPreviewWidth(Number(e.target.value))
                            }
                            className="mt-2 w-full accent-primary"
                            aria-label="Preview width"
                        />
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Background</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                            value={background}
                            onValueChange={(v) => setBackground(v as any)}
                        >
                            <DropdownMenuRadioItem value="parchment">
                                Parchment
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="plain">
                                Plain
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="transparent">
                                Transparent
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetViewPrefs}>
                    Reset view
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
