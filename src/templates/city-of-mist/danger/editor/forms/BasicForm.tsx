import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCityOfMistDangerStore } from '../../hooks'

export default function BasicForm() {
    const { cityOfMistDanger, setCityOfMistDanger } = useCityOfMistDangerStore()
    const rating = Math.max(
        0,
        Math.min(5, Math.floor(cityOfMistDanger.rating || 0))
    )

    return (
        <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="danger-name">Danger name</Label>
                    <Input
                        id="danger-name"
                        className="h-8 px-2 text-sm"
                        value={cityOfMistDanger.name}
                        onChange={(event) =>
                            setCityOfMistDanger({ name: event.target.value })
                        }
                        placeholder="e.g., The Red Room"
                    />
                </div>

                <div className="grid w-[88px] gap-1">
                    <Label htmlFor="danger-rating">Level (0-5)</Label>
                    <Input
                        id="danger-rating"
                        className="h-8 px-2 text-sm"
                        type="number"
                        min={0}
                        max={5}
                        value={rating}
                        onChange={(event) =>
                            setCityOfMistDanger({
                                rating: Math.max(
                                    0,
                                    Math.min(
                                        5,
                                        Math.floor(
                                            Number(event.target.value) || 0
                                        )
                                    )
                                ),
                            })
                        }
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="danger-description">Description</Label>
                <Textarea
                    id="danger-description"
                    rows={4}
                    className="px-2 py-1 text-sm"
                    value={cityOfMistDanger.description}
                    onChange={(event) =>
                        setCityOfMistDanger({ description: event.target.value })
                    }
                    placeholder="Describe the danger and how it threatens the crew."
                />
                <p className="text-xs text-muted-foreground">
                    Supports Markdown.
                </p>
            </div>
        </div>
    )
}
