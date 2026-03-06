import { useActiveTab, useActiveTemplate } from '@/core/workspace/selectors'
import { useWorkspaceStore } from '@/core/workspace/store'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FilePlus2, Stars } from 'lucide-react'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export default function NewDialog({ open, onOpenChange }: Props) {
    const activeTab = useActiveTab()
    const activeTemplate = useActiveTemplate()

    const replaceTabDoc = useWorkspaceStore((s) => s.replaceTabDoc)
    const setTabMode = useWorkspaceStore((s) => s.setTabMode)

    const [choice, setChoice] = useState<'blank' | 'sample'>('blank')

    function close() {
        onOpenChange(false)
        setTimeout(() => setChoice('blank'), 150)
    }

    function onCreate() {
        if (!activeTab || !activeTemplate) return

        if (choice === 'blank') {
            replaceTabDoc(activeTab.id, activeTemplate.createBlank())
            setTabMode(activeTab.id, 'editing')
            toast.success(`Blank ${activeTemplate.label.toLowerCase()} created.`)
        } else {
            replaceTabDoc(activeTab.id, activeTemplate.createSample())
            setTabMode(activeTab.id, 'editing')
            toast.success(`Sample ${activeTemplate.label.toLowerCase()} loaded.`)
        }

        close()
    }

    const templateLabel = activeTemplate?.label || 'Template'

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => (value ? onOpenChange(true) : close())}
        >
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle>New {templateLabel}</DialogTitle>
                    <DialogDescription>
                        Start fresh or load a sample in the current tab.
                    </DialogDescription>
                </DialogHeader>

                <RadioGroup
                    value={choice}
                    onValueChange={(value) =>
                        setChoice(value as 'blank' | 'sample')
                    }
                    className="space-y-3"
                >
                    <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted/40">
                        <RadioGroupItem value="blank" id="new-blank" />
                        <div className="grid gap-1">
                            <Label
                                htmlFor="new-blank"
                                className="flex items-center gap-2"
                            >
                                <FilePlus2 className="h-4 w-4" />
                                Blank {templateLabel.toLowerCase()}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Start with an empty document.
                            </p>
                        </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted/40">
                        <RadioGroupItem value="sample" id="new-sample" />
                        <div className="grid w-full gap-1">
                            <Label
                                htmlFor="new-sample"
                                className="flex items-center gap-2"
                            >
                                <Stars className="h-4 w-4" />
                                Sample {templateLabel.toLowerCase()}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Start from a rich sample to edit right away.
                            </p>
                        </div>
                    </label>
                </RadioGroup>

                <DialogFooter>
                    <Button variant="secondary" onClick={close}>
                        Cancel
                    </Button>
                    <Button onClick={onCreate} disabled={!activeTab || !activeTemplate}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
