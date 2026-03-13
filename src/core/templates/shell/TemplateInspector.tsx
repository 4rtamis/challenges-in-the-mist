import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { SidebarContent, SidebarFooter } from '@/components/ui/sidebar'
import { useActiveTemplate } from '@/core/workspace/selectors'
import { TemplateExportPanel } from './TemplateExportPanel'

export function TemplateInspector() {
    const activeTemplate = useActiveTemplate()

    if (!activeTemplate || !activeTemplate.implemented) {
        return null
    }

    return (
        // The shared inspector keeps layout and accordions consistent while
        // delegating the actual editor/appearance panels to the template module.
        <div className="flex min-h-0 max-h-[calc(100svh-6rem)] flex-col overflow-hidden rounded-2xl">
            <SidebarContent className="min-h-0 flex-1 px-3 py-2 [scrollbar-width:thin] [scrollbar-color:rgba(100,116,139,0.28)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/35 hover:[&::-webkit-scrollbar-thumb]:bg-border/50">
                <Accordion
                    type="multiple"
                    defaultValue={['editor']}
                    className="w-full"
                >
                    <AccordionItem value="editor">
                        <AccordionTrigger className="py-3 text-sm">
                            Editor
                        </AccordionTrigger>
                        <AccordionContent className="pb-3">
                            <div className="[&_input[data-slot=input]]:text-xs [&_textarea[data-slot=textarea]]:text-xs [&_textarea[data-slot=textarea]]:leading-snug">
                                {activeTemplate.editor.renderPanel()}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </SidebarContent>

            <div className="shrink-0 border-t bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <Accordion type="multiple" defaultValue={[]} className="w-full">
                    <AccordionItem value="appearance">
                        <AccordionTrigger className="py-2 text-sm">
                            General Appearance
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            {activeTemplate.appearance.renderPanel()}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <SidebarFooter className="shrink-0 border-t bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <Accordion
                    type="multiple"
                    defaultValue={['export']}
                    className="w-full"
                >
                    <AccordionItem value="export">
                        <AccordionTrigger className="py-2 text-sm">
                            Export
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            <TemplateExportPanel />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </SidebarFooter>
        </div>
    )
}
