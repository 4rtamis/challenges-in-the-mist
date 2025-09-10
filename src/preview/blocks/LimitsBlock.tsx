// src/preview/blocks/LimitsBlock.tsx
import { useChallengeStore } from "@/store/challengeStore";
import { useSheetStore } from "@/store/sheetStore";
import { SectionHeader } from "../components/SectionHeader";
import { ClickableSection } from "../components/Clickable";

export default function LimitsBlock() {
  const { challenge } = useChallengeStore();
  const { openSheet } = useSheetStore();

  return (
    <div className="space-y-2">
      <SectionHeader
        title="Limits"
        onClick={() => openSheet({ kind: "limits", mode: "create" })}
      />
      <div className="flex flex-col items-center gap-0.5">
        {challenge.limits.length ? (
          challenge.limits.map((l, i) => (
            <ClickableSection
              key={`${l.name}-${i}`}
              onClick={() =>
                openSheet({ kind: "limits", index: i, mode: "edit" })
              }
              ariaLabel={`Edit limit ${l.name}`}
            >
              <div className="limit-row w-[80%] mx-auto">
                <div className="limit-name">{(l.name || "").toUpperCase()}</div>
                <div className="limit-shield">
                  {!l.is_immune && (
                    <div className="limit-shield__num" data-value={l.level}>
                      {Math.max(1, Math.min(6, Math.floor(l.level || 1)))}
                    </div>
                  )}
                </div>
              </div>
            </ClickableSection>
          ))
        ) : (
          <button
            type="button"
            className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
            onClick={() => openSheet({ kind: "limits", mode: "create" })}
          >
            add limits
          </button>
        )}
      </div>
    </div>
  );
}
