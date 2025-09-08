// src/sheets/SectionSheetHost.tsx
import { useMemo } from "react";
import { useSheetStore } from "@/store/sheetStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

// Forms (we’ll start with Threats)
import ThreatsForm from "@/editor/ThreatsForm";
import LimitsForm from "@/editor/LimitsForm";
import TagsStatusesForm from "@/editor/TagsStatusesForm";
import MightForm from "@/editor/MightForm";
import SpecialFeaturesForm from "@/editor/SpecialFeaturesForm";
import BasicForm from "@/editor/BasicForm";
import MetaForm from "@/editor/MetaForm";

export default function SectionSheetHost() {
  const { open, target, closeSheet } = useSheetStore();

  const { title, description, content } = useMemo(() => {
    if (!target)
      return { title: "", description: "", content: null as React.ReactNode };

    switch (target.kind) {
      case "threats":
        return {
          title: "Threats & Consequences",
          description:
            target.mode === "create"
              ? "Add new threat(s) with related consequences."
              : "Edit threats and their consequences.",
          content: <ThreatsForm variant="bare" focusIndex={target.index} />,
        };
      case "limits":
        return {
          title: "Limits",
          description:
            target.mode === "create"
              ? "Add limits the party must overcome. Immunities have no maximum."
              : "Edit limits, immunities, and progress outcomes.",
          content: <LimitsForm focusIndex={target.index} />,
        };
      case "tags":
        return {
          title: "Tags & Statuses",
          description:
            target.mode === "create"
              ? "Add tags, statuses (with optional value), or weakness tags."
              : "Edit, reorder, or remove tags and statuses.",
          content: <TagsStatusesForm focusIndex={target.index} />,
        };
      case "mights":
        return {
          title: "Might",
          description:
            target.mode === "create"
              ? "Add Might entries with their level and optional vulnerability."
              : "Edit, reorder, or remove Might entries.",
          content: <MightForm focusIndex={target.index} />,
        };
      case "special":
        return {
          title: "Special Features",
          description:
            target.mode === "create"
              ? "Add named features with Markdown descriptions."
              : "Edit, reorder, or remove Special Features.",
          content: <SpecialFeaturesForm focusIndex={target.index} />,
        };
      case "basic":
        return {
          title: "Basic Info",
          description: "Name, rating, roles, and a short description.",
          content: <BasicForm />,
        };

      case "meta":
        return {
          title: "Meta",
          description:
            "Attribution and reference info for books/chapters/pages.",
          content: <MetaForm />,
        };
      default:
        return { title: "Editor", description: "", content: null };
    }
  }, [target]);

  return (
    <Sheet open={open} onOpenChange={(o) => (!o ? closeSheet() : undefined)}>
      <SheetContent side="right" className="w-[560px] sm:max-w-none p-0">
        <div className="border-b px-6 py-4">
          <SheetHeader className="text-left">
            <SheetTitle>{title}</SheetTitle>
            {description ? (
              <SheetDescription>{description}</SheetDescription>
            ) : null}
          </SheetHeader>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)] px-6 py-4">
          {content ?? (
            <div className="text-sm text-muted-foreground">
              Select a section in the preview to start editing.
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
