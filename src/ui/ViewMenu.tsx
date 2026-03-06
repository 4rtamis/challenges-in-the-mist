import { useActiveTemplate } from '@/core/workspace/selectors'
import type { ReactNode } from 'react'
import {
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
    useUIStore,
    type SectionId,
} from '@/store/uiStore'
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

export default function ViewMenu({
    children,
    disabled = false,
}: {
    children: ReactNode
    disabled?: boolean
}) {
    const template = useActiveTemplate()

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

    if (disabled || !template || !template.implemented) {
        return <>{children}</>
    }

    const sectionItems = template.viewConfig.sectionItems as Array<{
        id: SectionId
        label: string
    }>

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>View</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                    checked={autoHideEmpty}
                    onCheckedChange={(value) => setAutoHideEmpty(!!value)}
                >
                    Auto-hide empty sections
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Show sections</DropdownMenuLabel>
                {sectionItems.map((section) => (
                    <DropdownMenuCheckboxItem
                        key={section.id}
                        checked={!hidden[section.id]}
                        onCheckedChange={() => toggleHidden(section.id)}
                    >
                        {section.label}
                    </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Zoom</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {template.viewConfig.zoomOptions.map((zoom) => (
                            <DropdownMenuItem
                                key={zoom}
                                onClick={() => setZoom(zoom)}
                            >
                                {Math.round(zoom * 100)}%
                            </DropdownMenuItem>
                        ))}
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
                            onChange={(event) =>
                                setPreviewWidth(Number(event.target.value))
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
                            onValueChange={(value) => setBackground(value as any)}
                        >
                            {template.viewConfig.backgroundOptions.map(
                                (option) => (
                                    <DropdownMenuRadioItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </DropdownMenuRadioItem>
                                )
                            )}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetViewPrefs}>Reset view</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
