import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCityOfMistDangerViewStore } from '../hooks'

export function DangerImageExportSettings() {
    const { exportPrefs, setExportPrefs } = useCityOfMistDangerViewStore()

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Image scale
                </p>
                <RadioGroup
                    value={String(exportPrefs.scale)}
                    onValueChange={(value) =>
                        setExportPrefs({ scale: Number(value) as 1 | 2 | 3 })
                    }
                    className="flex items-center gap-3"
                >
                    <label className="flex cursor-pointer items-center gap-1.5">
                        <RadioGroupItem value="1" id="danger-export-scale-1" />
                        <span className="text-xs">1x</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-1.5">
                        <RadioGroupItem value="2" id="danger-export-scale-2" />
                        <span className="text-xs">2x</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-1.5">
                        <RadioGroupItem value="3" id="danger-export-scale-3" />
                        <span className="text-xs">3x</span>
                    </label>
                </RadioGroup>
            </div>
        </div>
    )
}
