// src/preview/LivePreview.tsx
import { useChallengeStore } from "../store/challengeStore";
import { useUiStore, type SectionKey } from "@/store/uiStore";
import { useSidebar } from "@/components/ui/sidebar";
import { renderLitmMarkdown, renderLitmInline } from "../utils/markdown";
import "./challengeTheme.css";

type SectionHeaderProps = {
  title: string;
  align?: "center" | "left";
  onClick?: () => void;
};

export default function LivePreview() {
  const { challenge } = useChallengeStore();
  const { setActive } = useUiStore();
  const { setOpen } = useSidebar();

  const rating = Math.max(1, Math.min(5, Math.floor(challenge.rating || 1)));

  // Helper: open sidebar on the exact section (optionally with index/subIndex)
  function go(
    kind: SectionKey | "threats" | "tags" | "limits" | "mights" | "special",
    index?: number,
    subIndex?: number
  ) {
    setActive(
      index != null
        ? subIndex != null
          ? { kind: kind as any, index, subIndex }
          : { kind: kind as any, index }
        : { kind: kind as any }
    );
    setOpen(true);
  }

  return (
    <div className="challenge-sheet">
      <div className="challenge-sheet__inner">
        {/* NAME + RATING (clickable to edit "basic") */}
        <button
          type="button"
          className="grid grid-cols-2 gap-[7pt] items-center justify-items-center w-full text-left group"
          onClick={() => go("basic")}
          title="Edit name, rating, roles & description"
          aria-label="Edit basic info"
        >
          <div className="min-w-0">
            <h2 className="challenge-name truncate group-hover:opacity-90">
              {(challenge.name || "Untitled Challenge").toUpperCase()}
            </h2>
          </div>
          <div className="challenge-rating">
            {Array.from({ length: rating }).map((_, i) => (
              <span key={i} className="ico ico-cross" aria-hidden />
            ))}
          </div>
        </button>

        <div style={{ marginTop: "-10pt" }} />

        {/* ROLES (clickable to edit "basic") */}
        <button
          type="button"
          className="text-center challenge-roles w-full group"
          onClick={() => go("basic")}
          title="Edit roles"
          aria-label="Edit roles"
        >
          <span className="group-hover:opacity-90">
            {challenge.roles.length ? (
              challenge.roles.join(", ")
            ) : (
              <span className="underline decoration-dotted">add roles</span>
            )}
          </span>
        </button>

        {/* DESCRIPTION (centered, 77% width) (clickable to edit "basic") */}
        <div className="flex justify-center mt-2">
          <button
            type="button"
            className="challenge-desc text-center group"
            style={{ width: "77%" }}
            onClick={() => go("basic")}
            title="Edit description"
            aria-label="Edit description"
          >
            <div className="group-hover:opacity-90">
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
          </button>
        </div>

        {/* MAIN GRID: left column | vertical divider | right column */}
        <div className="sheet-grid mt-2">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* LIMITS */}
            <SectionHeader
              align="center"
              title="Limits"
              onClick={() => go("limits")}
            />
            <div className="flex flex-col items-center gap-3">
              {challenge.limits.length ? (
                challenge.limits.map((l, i) => (
                  <div key={`${l.name}-${i}`} className="relative w-[80%]">
                    {/* Overlay button to open editor at this item */}
                    <button
                      type="button"
                      className="absolute inset-0 z-10 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]/50"
                      onClick={() => go("limits", i)}
                      title={`Edit limit: ${l.name}`}
                      aria-label={`Edit limit ${l.name}`}
                    />
                    <div className="limit-row">
                      <div className="limit-name">
                        {(l.name || "").toUpperCase()}
                      </div>
                      <div className="limit-shield">
                        {!l.is_immune && (
                          <div className="limit-shield__num">
                            {Math.max(1, Math.min(6, Math.floor(l.level || 1)))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <button
                  type="button"
                  className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
                  onClick={() => go("limits")}
                >
                  add limits
                </button>
              )}
            </div>

            {/* SPECIAL FEATURES */}
            <SectionHeader
              align="center"
              title="Special Features"
              onClick={() => go("special")}
            />
            <div className="flex flex-col items-center gap-3">
              {challenge.special_features.length ? (
                challenge.special_features.map((sf, i) => (
                  <div key={`${sf.name}-${i}`} className="relative w-[80%]">
                    <button
                      type="button"
                      className="absolute inset-0 z-10 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]/50"
                      onClick={() => go("special", i)}
                      title={`Edit feature: ${sf.name}`}
                      aria-label={`Edit feature ${sf.name}`}
                    />
                    <div>
                      <div className="feature-name">{sf.name}</div>
                      {sf.description && (
                        <div
                          className="feature-body"
                          dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(sf.description),
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <button
                  type="button"
                  className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
                  onClick={() => go("special")}
                >
                  add special features
                </button>
              )}
            </div>

            {/* TAGS & STATUSES + MIGHT */}
            <SectionHeader
              align="center"
              title="Tags & Statuses"
              onClick={() => go("tags")}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="tags-line w-[80%] text-center">
                {challenge.tags_and_statuses.length ? (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {challenge.tags_and_statuses.map((t, i) => (
                      <span key={`${t}-${i}`} className="relative">
                        <button
                          type="button"
                          className="absolute inset-0 z-10 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]/50"
                          onClick={() => go("tags", i)}
                          title="Edit tag/status"
                          aria-label="Edit tag/status"
                        />
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLitmInline(t),
                          }}
                        />
                      </span>
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
                    onClick={() => go("tags")}
                  >
                    add tags or statuses
                  </button>
                )}
              </div>

              {/* Might list under tags */}
              <div className="w-[80%] space-y-1 text-center">
                {challenge.mights.length ? (
                  challenge.mights.map((m, idx) => (
                    <div key={`${m.name}-${idx}`} className="relative">
                      <button
                        type="button"
                        className="absolute inset-0 z-10 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]/50"
                        onClick={() => go("mights", idx)}
                        title={`Edit might: ${m.name}`}
                        aria-label={`Edit might ${m.name}`}
                      />
                      <div className="might-row justify-center">
                        <span className="inline-flex items-center">
                          {m.level === "adventure" ? (
                            <span
                              className="ico ico-might-adventure"
                              aria-hidden
                            />
                          ) : (
                            <span
                              className="ico ico-might-greatness"
                              aria-hidden
                            />
                          )}
                        </span>
                        <span>{m.name}</span>
                        {m.vulnerability && (
                          <span>&nbsp;({m.vulnerability})</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
                    onClick={() => go("mights")}
                  >
                    add might
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* VERTICAL DIVIDER */}
          <div className="sheet-divider" />

          {/* RIGHT COLUMN */}
          <div className="pl-4">
            <SectionHeader
              align="left"
              title="Threats and Consequences"
              onClick={() => go("threats")}
            />
            <div className="mt-[-5pt]" />
            <div className="space-y-3">
              {challenge.threats.length ? (
                challenge.threats.map((t, ti) => (
                  <div key={`${t.name}-${ti}`} className="relative threat-card">
                    <button
                      type="button"
                      className="absolute inset-0 z-10 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]/50"
                      onClick={() => go("threats", ti)}
                      title={`Edit threat: ${t.name}`}
                      aria-label={`Edit threat ${t.name}`}
                    />
                    <div className="flex items-center gap-3">
                      <div className="threat-pill">
                        {(t.name || "").toUpperCase()}
                      </div>
                      {t.description && (
                        <div
                          className="threat-desc"
                          dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(t.description),
                          }}
                        />
                      )}
                    </div>

                    <div className="mt-1 space-y-1">
                      {t.consequences.map((c, ci) => (
                        <div key={ci} className="conseq-row">
                          <div className="pt-[2px]">
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
                ))
              ) : (
                <button
                  type="button"
                  className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
                  onClick={() => go("threats")}
                >
                  add threats & consequences
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* META footer (clickable to edit meta) */}
      {challenge.meta &&
        (challenge.meta.sourcebook ||
          challenge.meta.chapter ||
          challenge.meta.page != null ||
          challenge.meta.is_official != null) && (
          <button
            type="button"
            className="meta-footer mt-2 text-center w-full group"
            onClick={() => go("meta")}
            title="Edit meta"
            aria-label="Edit meta"
          >
            <span className="group-hover:opacity-90">
              {challenge.meta.sourcebook && (
                <span>
                  <strong>{challenge.meta.sourcebook}</strong>
                </span>
              )}
              {challenge.meta.chapter && (
                <span> — {challenge.meta.chapter}</span>
              )}
              {challenge.meta.page != null && (
                <span> (p.{challenge.meta.page})</span>
              )}
              {challenge.meta.is_official != null && (
                <span className="badge">
                  {challenge.meta.is_official ? "Official" : "Unofficial"}
                </span>
              )}
            </span>
          </button>
        )}
    </div>
  );
}

/* ---------- Small helper for section headers (clickable) ---------- */
function SectionHeader({
  title,
  align = "center",
  onClick,
}: SectionHeaderProps) {
  if (align === "center") {
    return (
      <button
        type="button"
        className="section--center mt-[15pt] mb-[8pt] w-full group"
        onClick={onClick}
        title={`Edit ${title}`}
        aria-label={`Edit ${title}`}
      >
        <div className="section-line" />
        <div className="section-title group-hover:opacity-90">{title}</div>
        <div className="section-line" />
      </button>
    );
  }
  return (
    <button
      type="button"
      className="section--left mt-[15pt] mb-[8pt] w-full text-left group"
      onClick={onClick}
      title={`Edit ${title}`}
      aria-label={`Edit ${title}`}
    >
      <div className="section-title group-hover:opacity-90">{title}</div>
      <div className="section-line" />
    </button>
  );
}
