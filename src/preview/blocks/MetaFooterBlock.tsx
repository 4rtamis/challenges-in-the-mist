import { useChallengeStore } from "@/store/challengeStore";
import { useSheetStore } from "@/store/sheetStore";
import type { PublicationType } from "@/store/challengeStore";

const TYPE_LABEL: Record<PublicationType, string> = {
  official: "Official",
  third_party: "Third Party",
  cauldron: "Cauldron",
  homebrew: "Homebrew",
};

export default function MetaFooterBlock() {
  const { challenge } = useChallengeStore();
  const { openSheet } = useSheetStore();
  const m = challenge.meta ?? {};

  const hasAny =
    !!m.publication_type ||
    !!m.source ||
    (m.authors && m.authors.length > 0) ||
    m.page != null;

  const typeLabel = m.publication_type
    ? TYPE_LABEL[m.publication_type]
    : undefined;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => openSheet({ kind: "meta", mode: "edit" })}
        className="w-full"
        aria-label="Edit meta"
        title="Edit meta"
      >
        <div className="meta-footer group mx-auto text-center">
          {hasAny ? (
            <div className="inline-flex items-center gap-2 rounded-md px-2 py-1 transition-colors group-hover:bg-black/5">
              {typeLabel && <span className="badge">{typeLabel}</span>}
              {m.source && (
                <span className="font-semibold truncate">{m.source}</span>
              )}
              {m.authors && m.authors.length > 0 && (
                <span className="">by {m.authors.join(", ")}</span>
              )}
              {m.page != null && <span className=""> (p.{m.page})</span>}
            </div>
          ) : (
            <span className="text-xs cursor-pointer text-muted-foreground underline decoration-dotted">
              add attribution (type, source, authors, page)
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
