import { useState } from "react";
import { useChallengeStore } from "../store/challengeStore";
import { renderLitmMarkdown, renderLitmInline } from "../utils/markdown";
import { scrollToSection } from "./format";
import { CrossIcon, ShieldIcon, MightIcon } from "./icons";
import "./challengeTheme.css"; // <-- add this

import ImportExportBar from "../editor/ImportExportBar";
import { Edit3 } from "lucide-react";

export default function LivePreview() {
  const { challenge, setChallenge } = useChallengeStore();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(challenge.name);

  const rating = Math.max(1, Math.min(5, Math.floor(challenge.rating || 1)));

  function saveName() {
    setChallenge({ name: nameDraft.trim() });
    setEditingName(false);
  }

  return (
    <>
      <div className="challenge-sheet">
        <div className="challenge-sheet__inner">
          {/* NAME + RATING */}
          <div className="grid grid-cols-2 gap-[7pt] items-center justify-items-center">
            <div className="min-w-0">
              {editingName ? (
                <input
                  className="challenge-name bg-transparent border-b border-[color:var(--litm-soft-brown)] outline-none px-1"
                  value={nameDraft}
                  autoFocus
                  onChange={(e) => setNameDraft(e.target.value)}
                  onBlur={saveName}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="challenge-name truncate">
                    {(challenge.name || "Untitled Challenge").toUpperCase()}
                  </h2>
                  <button
                    className="opacity-70 hover:opacity-100"
                    title="Edit name"
                    onClick={() => {
                      setNameDraft(challenge.name);
                      setEditingName(true);
                    }}
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="challenge-rating">
              {Array.from({ length: rating }).map((_, i) => (
                <span key={i} className="ico ico-cross" aria-hidden />
              ))}
            </div>
          </div>

          <div style={{ marginTop: "-10pt" }} />

          {/* ROLES */}
          <div className="text-center challenge-roles">
            {challenge.roles.length ? (
              challenge.roles.join(", ")
            ) : (
              <button
                className="underline decoration-dotted opacity-80 hover:opacity-100"
                onClick={() => scrollToSection("section-basic")}
              >
                add roles
              </button>
            )}
          </div>

          {/* DESCRIPTION (centered, 77% width) */}
          <div className="flex justify-center mt-2">
            <div
              className="challenge-desc text-center"
              style={{ width: "77%" }}
            >
              {challenge.description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderLitmMarkdown(challenge.description),
                  }}
                />
              ) : (
                <button
                  className="underline decoration-dotted opacity-80 hover:opacity-100"
                  onClick={() => scrollToSection("section-basic")}
                >
                  add a short description
                </button>
              )}
            </div>
          </div>

          {/* MAIN GRID: left column | vertical divider | right column */}
          <div className="sheet-grid mt-2">
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              {/* LIMITS */}
              <SectionHeader align="center" title="Limits" />
              <div className="flex flex-col items-center gap-3">
                {challenge.limits.length ? (
                  challenge.limits.map((l, i) => (
                    <div key={`${l.name}-${i}`} className="limit-row w-[80%]">
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
                  ))
                ) : (
                  <button
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
                    onClick={() => scrollToSection("section-limits")}
                  >
                    add limits
                  </button>
                )}
              </div>

              {/* SPECIAL FEATURES */}
              <SectionHeader align="center" title="Special Features" />
              <div className="flex flex-col items-center gap-3">
                {challenge.special_features.length ? (
                  challenge.special_features.map((sf, i) => (
                    <div key={`${sf.name}-${i}`} className="w-[80%]">
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
                  ))
                ) : (
                  <button
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
                    onClick={() => scrollToSection("section-features")}
                  >
                    add special features
                  </button>
                )}
              </div>

              {/* TAGS & STATUSES + MIGHT */}
              <SectionHeader align="center" title="Tags & Statuses" />
              <div className="flex flex-col items-center gap-2">
                <div className="tags-line w-[80%] text-center">
                  {challenge.tags_and_statuses.length ? (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {challenge.tags_and_statuses.map((t, i) => (
                        <span
                          key={`${t}-${i}`}
                          dangerouslySetInnerHTML={{
                            __html: renderLitmInline(t),
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <button
                      className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
                      onClick={() => scrollToSection("section-tags")}
                    >
                      add tags or statuses
                    </button>
                  )}
                </div>

                {/* Might list under tags */}
                <div className="w-[80%] space-y-1 text-center">
                  {challenge.mights.length ? (
                    challenge.mights.map((m, idx) => (
                      <div
                        key={`${m.name}-${idx}`}
                        className="might-row justify-center"
                      >
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
                    ))
                  ) : (
                    <button
                      className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
                      onClick={() => scrollToSection("section-might")}
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
              <SectionHeader align="left" title="Threats and Consequences" />
              <div className="mt-[-5pt]" />
              <div className="space-y-3">
                {challenge.threats.length ? (
                  challenge.threats.map((t, ti) => (
                    <div key={`${t.name}-${ti}`} className="threat-card">
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
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100"
                    onClick={() => scrollToSection("section-threats")}
                  >
                    add threats & consequences
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {challenge.meta &&
        (challenge.meta.sourcebook ||
          challenge.meta.chapter ||
          challenge.meta.page != null ||
          challenge.meta.is_official != null) && (
          <div className="meta-footer mt-2 text-center">
            {challenge.meta.sourcebook && (
              <span>
                <strong>{challenge.meta.sourcebook}</strong>
              </span>
            )}
            {challenge.meta.chapter && <span> — {challenge.meta.chapter}</span>}
            {challenge.meta.page != null && (
              <span> (p.{challenge.meta.page})</span>
            )}
            {challenge.meta.is_official != null && (
              <span className="badge">
                {challenge.meta.is_official ? "Official" : "Unofficial"}
              </span>
            )}
          </div>
        )}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Export or import a Challenge as <code>.toml</code>.
        </div>
        <ImportExportBar />
      </div>
    </>
  );
}

/* ---------- Small helper for section headers ---------- */
type SectionHeaderProps = {
  title: string;
  align?: "center" | "left";
};

function SectionHeader({ title, align = "center" }: SectionHeaderProps) {
  if (align === "center") {
    return (
      <div className="section--center mt-[15pt] mb-[8pt]">
        <div className="section-line" />
        <div className="section-title">{title}</div>
        <div className="section-line" />
      </div>
    );
  }
  return (
    <div className="section--left mt-[15pt] mb-[8pt]">
      <div className="section-title">{title}</div>
      <div className="section-line" />
    </div>
  );
}
