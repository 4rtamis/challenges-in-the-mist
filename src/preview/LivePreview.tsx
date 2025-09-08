// src/preview/LivePreview.tsx
import BasicBlock from "./blocks/BasicBlock";
import LimitsBlock from "./blocks/LimitsBlock";
import SpecialFeaturesBlock from "./blocks/SpecialFeaturesBlock";
import TagsMightBlock from "./blocks/TagsMightBlock";
import ThreatsBlock from "./blocks/ThreatsBlock";
import MetaFooterBlock from "./blocks/MetaFooterBlock"; // <-- add
import "./challengeTheme.css";

export default function LivePreview() {
  return (
    <>
      <div className="challenge-sheet">
        <div className="challenge-sheet__inner">
          <BasicBlock />

          {/* MAIN GRID */}
          <div className="sheet-grid mt-2">
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              <LimitsBlock />
              <SpecialFeaturesBlock />
              <TagsMightBlock />
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
      <MetaFooterBlock />
    </>
  );
}
