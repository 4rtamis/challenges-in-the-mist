// src/preview/blocks/MetaFooterBlock.tsx
import { useChallengeStore } from "@/store/challengeStore";
import { useSheetStore } from "@/store/sheetStore";
import { Button } from "@/components/ui/button";

export default function MetaFooterBlock() {
  const { challenge } = useChallengeStore();
  const { openSheet } = useSheetStore();
  const m = challenge.meta ?? {};

  const hasAny =
    Boolean(m.sourcebook) ||
    Boolean(m.chapter) ||
    m.page != null ||
    m.is_official != null;

  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="meta-footer text-center flex-1">
        {hasAny ? (
          <>
            {m.sourcebook && (
              <span>
                <strong>{m.sourcebook}</strong>
              </span>
            )}
            {m.chapter && <span> — {m.chapter}</span>}
            {m.page != null && <span> (p.{m.page})</span>}
            {m.is_official != null && (
              <span className="badge">
                {m.is_official ? "Official" : "Unofficial"}
              </span>
            )}
          </>
        ) : (
          <span className="text-xs text-muted-foreground">No meta set.</span>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="ml-3"
        onClick={() => openSheet({ kind: "meta", mode: "edit" })}
        aria-label="Edit meta"
      >
        Meta
      </Button>
    </div>
  );
}
