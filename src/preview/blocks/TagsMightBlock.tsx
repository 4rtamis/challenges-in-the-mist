// src/preview/blocks/TagsMightBlock.tsx
import { useChallengeStore } from "@/store/challengeStore";
import { useSheetStore } from "@/store/sheetStore";
import { renderLitmInline } from "@/utils/markdown";
import { SectionHeader } from "../components/SectionHeader";
import { ClickableSection } from "../components/Clickable";

export default function TagsMightBlock() {
  const { challenge } = useChallengeStore();
  const { openSheet } = useSheetStore();

  return (
    <div className="space-y-2">
      <SectionHeader
        title="Tags & Statuses"
        onClick={() => openSheet({ kind: "tags", mode: "create" })}
      />

      <div className="flex flex-col items-center gap-2">
        {/* Tags / Statuses */}
        <div className="tags-line w-[80%] text-center">
          {challenge.tags_and_statuses.length ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {challenge.tags_and_statuses.map((t, i) => (
                <ClickableSection
                  key={`${t}-${i}`}
                  onClick={() =>
                    openSheet({ kind: "tags", index: i, mode: "edit" })
                  }
                  ariaLabel="Edit tag/status"
                  overlayClassName="rounded-sm"
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: renderLitmInline(t),
                    }}
                  />
                </ClickableSection>
              ))}
            </div>
          ) : (
            <button
              type="button"
              className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
              onClick={() => openSheet({ kind: "tags", mode: "create" })}
            >
              add tags or statuses
            </button>
          )}
        </div>

        {/* Might */}
        <div className="w-[80%] space-y-1 text-center">
          {challenge.mights.length ? (
            challenge.mights.map((m, idx) => (
              <ClickableSection
                key={`${m.name}-${idx}`}
                onClick={() =>
                  openSheet({ kind: "mights", index: idx, mode: "edit" })
                }
                ariaLabel={`Edit might ${m.name}`}
              >
                <div className="might-row justify-center">
                  <span className="inline-flex items-center">
                    {m.level === "adventure" ? (
                      <span className="ico ico-might-adventure" aria-hidden />
                    ) : (
                      <span className="ico ico-might-greatness" aria-hidden />
                    )}
                  </span>
                  <span>{m.name}</span>
                  {m.vulnerability && <span>&nbsp;({m.vulnerability})</span>}
                </div>
              </ClickableSection>
            ))
          ) : (
            <button
              type="button"
              className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
              onClick={() => openSheet({ kind: "mights", mode: "create" })}
            >
              add might
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
