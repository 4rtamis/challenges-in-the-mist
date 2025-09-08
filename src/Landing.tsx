// src/App.tsx
import React from "react";

/**
 * Tools in the Mist — Minimal / Alchemy-inspired Landing (single file)
 * - Dark neutral palette, glass cards, precise spacing
 * - No external assets; subtle noise + gradients are pure CSS
 * - Tailwind 4+ friendly; self-contained <style> for tokens & motion
 *
 * Update the hrefs to your real routes when ready.
 */

export default function App() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--ink)]">
      <StyleBlock />

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[color:var(--line)]/30 bg-[color:var(--bg)]/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <a
            href="/"
            className="font-semibold tracking-[.08em] uppercase text-[color:var(--ink-soft)]"
          >
            Tools in the Mist
          </a>
          <nav className="flex items-center gap-6 text-sm text-[color:var(--muted)]">
            <a className="nav" href="/challenges">
              Challenges
            </a>
            <a className="nav" href="/brumes">
              Brumes
            </a>
            <a className="nav" href="/typst">
              Typst
            </a>
            <a
              className="opacity-60 pointer-events-none"
              aria-disabled
              href="/character-builder"
            >
              Character
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <BackgroundFX />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[color:var(--headline)]">
              Tools in the Mist
            </h1>
            <p className="mt-4 text-lg text-[color:var(--muted)]">
              A minimal toolkit for <em>Legend in the Mist</em> GMs—focused,
              elegant, and consistent. Prepare fast. Export clean. Share a
              single TOML across apps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/challenges" className="btn btn-primary">
                Open Challenges
              </a>
              <a href="/brumes" className="btn">
                Install Brumes
              </a>
              <a href="/typst" className="btn">
                Typst Template
              </a>
            </div>
          </div>

          {/* Glass spotlight panel */}
          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            <div className="glass p-6 border border-[color:var(--line)]/30 rounded-xl">
              <HeaderLabel>Why this toolkit</HeaderLabel>
              <ul className="mt-4 space-y-2 text-sm text-[color:var(--muted)]">
                <li>• One TOML spec: Brumes ↔ Typst ↔ future tools</li>
                <li>• Live preview mirrors print output</li>
                <li>• Minimal UI, strong typography, no clutter</li>
              </ul>
            </div>
            <div className="glass p-6 border border-[color:var(--line)]/30 rounded-xl">
              <HeaderLabel>What you’ll make</HeaderLabel>
              <div className="mt-4 rounded-lg border border-[color:var(--line)]/20 bg-[color:var(--panel)] p-4">
                <div className="text-sm text-[color:var(--muted)]">
                  Clean challenge profiles with tokens like{" "}
                  <code>{`{tag}`}</code>, <code>{`{status-3}`}</code>,{" "}
                  <code>{`{!weakness}`}</code>, and limits{" "}
                  <code>{`{risk:4}`}</code>—styled consistently everywhere.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-6">
          <HeaderLabel>Toolkit</HeaderLabel>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ToolCard
              title="Challenges in the Mist"
              body="Craft, preview, and export challenge profiles (.toml / .png)."
              href="/challenges"
              tag="Web App"
            />
            <ToolCard
              title="Brumes for Obsidian"
              body="Legend in the Mist structure, theme, and preview inside Obsidian."
              href="/brumes"
              tag="Plugin"
            />
            <ToolCard
              title="Typst Template"
              body="Print-ready stat blocks that match your table’s tone."
              href="/typst"
              tag="Template"
            />
            <ToolCard
              title="Character Builder"
              body="Upcoming tool using the same TOML schema."
              href="/character-builder"
              tag="Soon"
              disabled
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 border-t border-[color:var(--line)]/20">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-[color:var(--muted)] flex items-center justify-between">
          <span>© {new Date().getFullYear()} Tools in the Mist</span>
          <div className="flex items-center gap-4">
            <a className="nav" href="/github">
              GitHub
            </a>
            <a className="nav" href="/discord">
              Discord
            </a>
            <a className="nav" href="/newsletter">
              Newsletter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ——— Styles & tokens ——— */

function StyleBlock() {
  return (
    <style>{`
:root{
  /* Minimal neutral theme */
  --bg: #0f1216;                /* page background */
  --panel: #0b0d11;             /* glass panel fill */
  --headline: #eef2f7;          /* main headings */
  --ink: #e7ebf2;               /* body text (slightly dimmer than white) */
  --muted: #a2acbd;             /* secondary text */
  --ink-soft:#d6deea;
  --line: #2a3240;              /* borders */
  --accent: #8ab4ff;            /* subtle blue accent (adjust freely) */
}

/* subtle radial glow + noise */
section.relative > .fx{
  position:absolute; inset:0; pointer-events:none;
}
.fx::before{
  content:""; position:absolute; inset:-20%;
  background:
    radial-gradient(60% 40% at 20% 10%, rgba(138,180,255,.08), transparent 50%),
    radial-gradient(55% 35% at 80% 20%, rgba(170,255,195,.06), transparent 60%),
    radial-gradient(65% 60% at 50% -10%, rgba(255,255,255,.04), transparent 70%);
  filter: blur(18px);
}
.fx::after{
  content:""; position:absolute; inset:0;
  opacity:.08; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0 0 .3 0 0'/></feComponentTransfer></filter>\
<rect width='100%' height='100%' filter='url(%23n)' fill='transparent'/></svg>");
  background-size: 240px 240px;
}

/* navigation link */
.nav{ position:relative; text-decoration:none; }
.nav::after{
  content:""; position:absolute; left:0; right:0; bottom:-6px; height:1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  transform: scaleX(0); transform-origin:left; transition: transform .18s ease;
}
.nav:hover::after{ transform: scaleX(1); }

/* header label */
.label{
  font-size:.72rem; letter-spacing:.18em; text-transform:uppercase;
  color: var(--muted);
}

/* glass card */
.glass{
  background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  box-shadow: 0 10px 30px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.06);
}

/* buttons */
.btn{
  display:inline-flex; align-items:center; gap:.5rem;
  padding:.6rem 1rem; border-radius:.6rem; border:1px solid var(--line);
  background: rgba(255,255,255,.03);
  color: var(--ink); transition: transform .12s ease, background-color .12s ease, border-color .12s ease;
}
.btn:hover{ transform: translateY(-1px); border-color: color-mix(in oklab, var(--accent) 40%, var(--line)); background: rgba(255,255,255,.06); }
.btn-primary{
  border-color: color-mix(in oklab, var(--accent) 40%, var(--line));
  background: linear-gradient(180deg, color-mix(in oklab, var(--accent) 22%, #000), transparent);
}

/* tool cards */
.tool{
  border-radius: 14px; border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}
.tool:hover{
  transform: translateY(-2px);
  border-color: color-mix(in oklab, var(--accent) 35%, var(--line));
  box-shadow: 0 16px 40px rgba(0,0,0,.28);
}
    `}</style>
  );
}

/* BG effects wrapper */
function BackgroundFX() {
  return <div className="fx" aria-hidden />;
}

/* small components */

function HeaderLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="label"> {children} </span>
      <span className="h-px flex-1 bg-[color:var(--line)]/30" />
    </div>
  );
}

function ToolCard({
  title,
  body,
  tag,
  href,
  disabled,
}: {
  title: string;
  body: string;
  tag: string;
  href?: string;
  disabled?: boolean;
}) {
  const Wrap: any = disabled ? "div" : "a";
  const props = disabled ? {} : { href };
  return (
    <Wrap
      {...props}
      aria-disabled={disabled}
      className={`tool p-5 block ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <div className="text-xs tracking-[.16em] uppercase text-[color:var(--muted)]">
        {tag}
      </div>
      <div className="mt-1 text-lg font-semibold text-[color:var(--headline)]">
        {title}
      </div>
      <p className="mt-1 text-[color:var(--muted)]">{body}</p>
      {!disabled && (
        <div className="mt-3 text-sm text-[color:var(--ink-soft)]">Open →</div>
      )}
    </Wrap>
  );
}
