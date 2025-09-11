// src/preview/blocks/LimitsBlock.tsx
import { useChallengeStore } from "@/store/challengeStore";
import { useSheetStore } from "@/store/sheetStore";
import { SectionHeader } from "../components/SectionHeader";
import { ClickableSection } from "../components/Clickable";
import { renderLitmMarkdown } from "@/utils/markdown";

export default function LimitsBlock() {
  const { challenge } = useChallengeStore();
  const { openSheet } = useSheetStore();

  return (
    <div className="space-y-0.5">
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
              <div className="limit-row mx-auto relative">
                <div className="limit-name">{(l.name || "").toUpperCase()}</div>

                <div className="limit-shield flex items-center">
                  {!l.is_immune ? (
                    <div className="limit-shield__num" data-value={l.level}>
                      {Math.max(1, Math.min(6, Math.floor(l.level || 1)))}
                    </div>
                  ) : (
                    <div className="limit-shield__num">~</div>
                  )}
                </div>

                {l.is_progress && (
                  <img
                    src="/assets/images/progress-limit-arrow.svg"
                    alt=""
                    aria-hidden="true"
                    className="limit-progress__arrow"
                  />
                )}
              </div>

              {l.is_progress && (
                <div className="limit-progress">
                  {l.on_max && l.on_max.trim() ? (
                    <div
                      className="limit-progress__text"
                      dangerouslySetInnerHTML={{
                        __html: renderLitmMarkdown(l.on_max),
                      }}
                    />
                  ) : (
                    <div className="limit-progress__text opacity-70 italic">
                      add progress outcome
                    </div>
                  )}
                </div>
              )}
            </ClickableSection>
          ))
        ) : (
          <button
            type="button"
            className="text-xs underline cursor-pointer decoration-dotted opacity-80 hover:opacity-100"
            onClick={() => openSheet({ kind: "limits", mode: "create" })}
          >
            add limits
          </button>
        )}
      </div>
    </div>
  );
}
