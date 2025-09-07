// src/preview/icons.tsx
export function CrossIcon({ size = 17 }: { size?: number }) {
  // a simple cross “X” to echo your cross.svg
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M5 5 L19 19 M19 5 L5 19"
        stroke="var(--litm-soft-brown)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShieldIcon({ size = 22 }: { size?: number }) {
  // stylized shield (indigo-ish in Typst; we’ll use brownish tones)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2 L19 5 V11c0 5-3.5 8-7 9-3.5-1-7-4-7-9V5l7-3z"
        fill="var(--litm-brick-red)"
        stroke="var(--litm-light-brick-red)"
        strokeWidth="1"
      />
    </svg>
  );
}

export function MightIcon({
  level = "adventure",
  size = 13,
}: {
  level: "adventure" | "greatness";
  size?: number;
}) {
  // Two variants; you can swap paths later for your actual assets
  const fill =
    level === "adventure"
      ? "var(--litm-pastel-green)"
      : "var(--litm-pastel-yellow)";
  const stroke = "var(--litm-dark-brown)";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {level === "adventure" ? (
        <path
          d="M12 3l4 8h-8l4-8zm0 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
        />
      ) : (
        <path
          d="M12 2l6 6-6 6-6-6 6-6zm0 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
        />
      )}
    </svg>
  );
}
