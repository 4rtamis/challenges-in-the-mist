import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from 'lucide-react'

export function TemplateGroup() {
    return (
        <Collapsible className="rounded-md data-[state=open]:bg-muted">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="group w-full">
                    Product details
                    <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
                <div>
                    This panel can be expanded or collapsed to reveal additional
                    content.
                </div>
                <Button size="xs">Learn More</Button>
            </CollapsibleContent>
        </Collapsible>
    )
}
