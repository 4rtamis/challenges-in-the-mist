// src/preview/blocks/BasicBlock.tsx
import { useChallengeStore } from "@/store/challengeStore";
import { renderLitmMarkdown } from "@/utils/markdown";
import { useSheetStore } from "@/store/sheetStore";
import { ClickableSection } from "../components/Clickable";
import "../../preview/challengeTheme.css";

export default function BasicBlock() {
  const { challenge } = useChallengeStore();
  const { openSheet } = useSheetStore();

  const rating = Math.max(1, Math.min(5, Math.floor(challenge.rating || 1)));

  return (
    <>
      {/* Name + Rating */}
      <ClickableSection
        onClick={() => openSheet({ kind: "basic", mode: "edit" })}
        ariaLabel="Edit basic info"
      >
        <div className="flex flex-row gap-[7pt] items-center justify-center">
          <div className="min-w-0">
            <h2 className="challenge-name truncate uppercase">
              {challenge.name || "Untitled Challenge"}
            </h2>
          </div>
          <div className="challenge-rating">
            {Array.from({ length: rating }).map((_, i) => (
              <span key={i} className="ico ico-cross" aria-hidden />
            ))}
          </div>
        </div>
      </ClickableSection>

      {/* Roles + Description */}
      <ClickableSection
        onClick={() => openSheet({ kind: "basic", mode: "edit" })}
        ariaLabel="Edit roles and description"
      >
        <div className="text-center challenge-roles">
          {challenge.roles.length ? (
            challenge.roles.join(", ")
          ) : (
            <span className="underline decoration-dotted">add roles</span>
          )}
        </div>

        <div className="flex justify-center my-2">
          <div className="challenge-desc text-center" style={{ width: "77%" }}>
            {challenge.description ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: renderLitmMarkdown(challenge.description),
                }}
              />
            ) : (
              <span className="underline decoration-dotted">
                add a short description
              </span>
            )}
          </div>
        </div>
      </ClickableSection>
    </>
  );
}
