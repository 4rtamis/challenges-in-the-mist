import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCityOfMistDangerStore } from '../../hooks'

export default function BasicForm() {
    const { cityOfMistDanger, setCityOfMistDanger } = useCityOfMistDangerStore()
    const rating = Math.max(0, Math.min(5, Math.floor(cityOfMistDanger.rating || 0)))

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="danger-name">Danger name</Label>
                <Input
                    id="danger-name"
                    value={cityOfMistDanger.name}
                    onChange={(event) =>
                        setCityOfMistDanger({ name: event.target.value })
                    }
                    placeholder="Danger name"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="danger-rating">Level</Label>
                <Input
                    id="danger-rating"
                    type="number"
                    min={0}
                    max={5}
                    value={rating}
                    onChange={(event) =>
                        setCityOfMistDanger({
                            rating: Math.max(
                                0,
                                Math.min(5, Math.floor(Number(event.target.value) || 0))
                            ),
                        })
                    }
                />
                <div className="text-sm text-muted-foreground">
                    {rating > 0 ? '★'.repeat(rating) : 'No stars'}
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="danger-description">
                    Description{' '}
                    <span className="font-normal text-muted-foreground">
                        (supports Markdown)
                    </span>
                </Label>
                <Textarea
                    id="danger-description"
                    rows={8}
                    value={cityOfMistDanger.description}
                    onChange={(event) =>
                        setCityOfMistDanger({ description: event.target.value })
                    }
                    placeholder="Describe the danger and how it threatens the crew."
                />
            </div>
        </div>
    )
}
