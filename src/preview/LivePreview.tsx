import { SectionGate, SectionGroupGate } from "./components/SectionGate";
import { useUIStore } from "@/store/uiStore";
import BasicBlock from "./blocks/BasicBlock";
import LimitsBlock from "./blocks/LimitsBlock";
import SpecialFeaturesBlock from "./blocks/SpecialFeaturesBlock";
import TagsMightBlock from "./blocks/TagsMightBlock";
import ThreatsBlock from "./blocks/ThreatsBlock";
import MetaFooterBlock from "./blocks/MetaFooterBlock";
import "./challengeTheme.css";
import { cn } from "@/lib/utils";

export default function LivePreview() {
  const ui = useUIStore();
  const zoom = ui.zoom;
  const bg = ui.background;

  return (
    <div>
      <div
        className={cn(
          "challenge-sheet",
          bg === "parchment"
            ? "bg-parchment"
            : bg === "plain"
              ? "bg-plain"
              : "bg-transparent"
        )}
        style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
      >
        <div className="challenge-sheet__inner">
          <BasicBlock />

          {/* MAIN GRID */}
          <div className="sheet-grid mt-4">
            {/* LEFT COLUMN */}
            <div className="space-y-4 pr-4">
              <LimitsBlock />

              <SectionGroupGate ids={["tagsStatuses", "might"]}>
                <TagsMightBlock />
              </SectionGroupGate>

              <SectionGate id="specialFeatures">
                <SpecialFeaturesBlock />
              </SectionGate>
            </div>

            {/* VERTICAL DIVIDER */}
            <div className="sheet-divider" />

            {/* RIGHT COLUMN */}
            <div className="pl-4">
              <ThreatsBlock />
            </div>
          </div>
        </div>
      </div>

      {/* Meta footer + pill */}
      <SectionGate id="meta">
        <MetaFooterBlock />
      </SectionGate>
    </div>
  );
}
