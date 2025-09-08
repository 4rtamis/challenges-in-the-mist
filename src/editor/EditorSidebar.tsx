// src/editor/EditorSidebar.tsx
import { useMemo, useState, useEffect } from "react";
import { useUiStore } from "@/store/uiStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// Your forms
import BasicInfoForm from "@/editor/BasicInfoForm";
import MetaForm from "@/editor/MetaForm";
import LimitsForm from "@/editor/LimitsForm";
import TagsStatusesForm from "@/editor/TagsStatusesForm";
import MightForm from "@/editor/MightForm";
import SpecialFeaturesForm from "@/editor/SpecialFeaturesForm";
import ThreatsForm from "@/editor/ThreatsForm";

export default function EditorSidebar() {
  const { active, setActive } = useUiStore();
  const [focusIndex, setFocusIndex] = useState<number | undefined>(undefined);

  // Map active section → accordion key + optional focus index
  const currentKey = useMemo(() => {
    if (!active) return undefined;
    if (active.kind === "basic") return "basic";
    if (active.kind === "meta") return "meta";
    if (active.kind === "limits") return "limits";
    if (active.kind === "tags") return "tags";
    if (active.kind === "mights") return "mights";
    if (active.kind === "special") return "special";
    if (active.kind === "threats") return "threats";
    return undefined;
  }, [active]);

  useEffect(() => {
    if (!active) return;
    // capture row focus if provided
    setFocusIndex(active.index);
    // clear the index after first use so forms don't retrigger
    const t = setTimeout(() => setFocusIndex(undefined), 0);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Editor</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-10rem)] px-2 py-3">
          <Accordion
            type="single"
            collapsible
            value={currentKey}
            onValueChange={(key) =>
              setActive(key ? { kind: key as any } : null)
            }
          >
            <AccordionItem value="basic">
              <AccordionTrigger>Basic Info</AccordionTrigger>
              <AccordionContent className="px-2 pb-3">
                <BasicInfoForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="meta">
              <AccordionTrigger>Meta</AccordionTrigger>
              <AccordionContent className="px-2 pb-3">
                <MetaForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="limits">
              <AccordionTrigger>Limits</AccordionTrigger>
              <AccordionContent className="px-2 pb-3">
                {/* Optional focusIndex support (see tiny patch below) */}
                <LimitsForm /* focusIndex={focusIndex} */ />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tags">
              <AccordionTrigger>Tags & Statuses</AccordionTrigger>
              <AccordionContent className="px-2 pb-3">
                {/* <TagsStatusesForm focusIndex={focusIndex} /> */}
                <TagsStatusesForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mights">
              <AccordionTrigger>Might</AccordionTrigger>
              <AccordionContent className="px-2 pb-3">
                <MightForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="special">
              <AccordionTrigger>Special Features</AccordionTrigger>
              <AccordionContent className="px-2 pb-3">
                <SpecialFeaturesForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="threats">
              <AccordionTrigger>Threats & Consequences</AccordionTrigger>
              <AccordionContent className="px-2 pb-3">
                {/* <ThreatsForm focusIndex={focusIndex} /> */}
                <ThreatsForm />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
