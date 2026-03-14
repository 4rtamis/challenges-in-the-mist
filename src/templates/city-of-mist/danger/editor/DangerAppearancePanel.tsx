import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { dangerBackgroundOptions } from '../metadata'
import {
    COLUMN_HEIGHT_MAX,
    COLUMN_HEIGHT_MIN,
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
} from '../model'
import { useCityOfMistDangerViewStore } from '../hooks'

export function DangerAppearancePanel() {
    const {
        previewWidth,
        setPreviewWidth,
        background,
        setBackground,
        columnCount,
        setColumnCount,
        titlePlacement,
        setTitlePlacement,
        columnHeight,
        setColumnHeight,
        showSeparators,
        setShowSeparators,
        resetViewPrefs,
    } = useCityOfMistDangerViewStore()

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="danger-preview-width" className="text-xs">
                        Preview width
                    </Label>
                    <span className="text-xs font-medium">{previewWidth}px</span>
                </div>
                <input
                    id="danger-preview-width"
                    type="range"
                    min={PREVIEW_WIDTH_MIN}
                    max={PREVIEW_WIDTH_MAX}
                    step={10}
                    value={previewWidth}
                    onChange={(event) =>
                        setPreviewWidth(Number(event.target.value))
                    }
                    className="w-full accent-primary"
                    aria-label="Preview width"
                />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{PREVIEW_WIDTH_MIN}px</span>
                    <span>{PREVIEW_WIDTH_MAX}px</span>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Background
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    {dangerBackgroundOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={cn(
                                'h-7 w-7 rounded-full border-2 transition-transform hover:scale-105',
                                background === option.value
                                    ? 'border-foreground'
                                    : 'border-border'
                            )}
                            style={{ backgroundColor: option.color }}
                            onClick={() => setBackground(option.value)}
                            aria-label={`Use ${option.label} background`}
                            title={option.label}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Layout
                </p>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant={columnCount === 1 ? 'default' : 'outline'}
                        onClick={() => setColumnCount(1)}
                    >
                        One column
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={columnCount === 2 ? 'default' : 'outline'}
                        onClick={() => setColumnCount(2)}
                    >
                        Two columns
                    </Button>
                </div>
            </div>

            {columnCount === 2 ? (
                <>
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Title placement
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    titlePlacement === 'outside'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setTitlePlacement('outside')}
                            >
                                Outside columns
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    titlePlacement === 'inside'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setTitlePlacement('inside')}
                            >
                                Inside columns
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <Label htmlFor="danger-column-height" className="text-xs">
                                Block height
                            </Label>
                            <span className="text-xs font-medium">{columnHeight}px</span>
                        </div>
                        <input
                            id="danger-column-height"
                            type="range"
                            min={COLUMN_HEIGHT_MIN}
                            max={COLUMN_HEIGHT_MAX}
                            step={10}
                            value={columnHeight}
                            onChange={(event) =>
                                setColumnHeight(Number(event.target.value))
                            }
                            className="w-full accent-primary"
                            aria-label="Block height"
                        />
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{COLUMN_HEIGHT_MIN}px</span>
                            <span>{COLUMN_HEIGHT_MAX}px</span>
                        </div>
                    </div>
                </>
            ) : null}

            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="danger-separators" className="text-xs">
                    Show separators
                </Label>
                <Switch
                    id="danger-separators"
                    checked={showSeparators}
                    onCheckedChange={(value) => setShowSeparators(!!value)}
                />
            </div>

            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 w-full text-xs"
                onClick={resetViewPrefs}
            >
                Reset view
            </Button>
        </div>
    )
}
