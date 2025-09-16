// src/preview/blocks/ThreatsBlock.tsx
import { useChallengeStore } from "@/store/challengeStore";
import { useSheetStore } from "@/store/sheetStore";
import { renderLitmMarkdown } from "@/utils/markdown";
import { SectionHeader } from "../components/SectionHeader";
import { ClickableSection } from "../components/Clickable";

export default function ThreatsBlock() {
  const { challenge } = useChallengeStore();
  const { openSheet } = useSheetStore();

  return (
    <div>
      <SectionHeader
        align="left"
        title="Threats & Consequences"
        onClick={() => openSheet({ kind: "threats", mode: "create" })}
      />
      <div className="threat-section space-y-2 mt-2">
        {challenge.threats.length ? (
          challenge.threats.map((t, ti) => (
            <ClickableSection
              key={`${t.name}-${ti}`}
              onClick={() =>
                openSheet({ kind: "threats", index: ti, mode: "edit" })
              }
              ariaLabel={`Edit threat ${t.name}`}
            >
              <div className="threat-card">
                <div className="threat-header">
                  <span className="threat-pill">{t.name || ""}</span>
                  {t.description && (
                    <span
                      className="threat-desc"
                      dangerouslySetInnerHTML={{
                        __html: renderLitmMarkdown(t.description),
                      }}
                    />
                  )}
                </div>

                <div className="mt-1">
                  {t.consequences.map((c, ci) => (
                    <div key={ci} className="conseq-row">
                      <div className="">
                        <span className="ico ico-conseq" aria-hidden />
                      </div>
                      <div
                        className="conseq-text"
                        dangerouslySetInnerHTML={{
                          __html: renderLitmMarkdown(c),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </ClickableSection>
          ))
        ) : (
          <button
            type="button"
            className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
            onClick={() => openSheet({ kind: "threats", mode: "create" })}
          >
            add threats & consequences
          </button>
        )}
      </div>
    </div>
  );
}
