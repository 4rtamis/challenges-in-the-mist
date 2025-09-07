import { parseToken } from "../utils/tags";

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function splitTokens(tokens: string[]) {
  const statuses: { raw: string; name: string; tier: number }[] = [];
  const tags: { raw: string; name: string }[] = [];
  tokens.forEach((t) => {
    const p = parseToken(t);
    if (!p) return;
    if (p.kind === "status")
      statuses.push({ raw: t, name: p.name, tier: p.tier });
    else tags.push({ raw: t, name: p.name });
  });
  return { statuses, tags };
}

export function ratingDots(rating: number) {
  const r = Math.max(1, Math.min(5, Math.floor(rating || 1)));
  return Array.from({ length: 5 }, (_, i) => i < r);
}

export function fmtLevel(n: number | undefined, immune?: boolean) {
  if (immune) return "—";
  const x = Math.max(1, Math.min(6, Math.floor(n || 1)));
  return String(x);
}
