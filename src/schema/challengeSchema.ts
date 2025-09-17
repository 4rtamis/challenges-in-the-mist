import { z } from "zod";
import type { Challenge } from "../store/challengeStore";
import { parseToken } from "../utils/tags";
import { rolesList } from "../utils/constants";

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, Math.floor(n)));
const toNull = (s?: string | null) => {
  const t = (s ?? "").trim();
  return t ? t : null;
};

const MightSchema = z.object({
  name: z.string().trim().min(1, "Might name is required"),
  level: z.enum(["adventure", "greatness"]).default("adventure"),
  vulnerability: z.string().nullable().optional().transform(toNull),
});

const LimitSchema = z
  .object({
    name: z.string().trim().min(1, "Limit name is required"),
    level: z.coerce.number().int().min(1).max(6).default(1),
    is_immune: z.boolean().optional().default(false),
    is_progress: z.boolean().optional().default(false),
    on_max: z.string().nullable().optional().transform(toNull),
  })
  .transform((l) => ({
    ...l,
    level: clamp(l.level, 1, 6),
  }));

const ThreatSchema = z.object({
  name: z.string().trim().min(1, "Threat name is required"),
  description: z.string().optional().default(""),
  consequences: z.array(z.string()).default([]),
});

const SpecialFeatureSchema = z.object({
  name: z.string().trim().min(1, "Special feature name is required"),
  description: z.string().optional().default(""),
});

const PublicationTypeEnum = z.enum([
  "official",
  "third_party",
  "cauldron",
  "homebrew",
]);

const MetaSchema = z.object({
  publication_type: PublicationTypeEnum.optional(),
  source: z.string().trim().min(1, "Source cannot be empty").optional(),
  source_id: z.string().trim().min(1).optional(),
  authors: z
    .preprocess(
      // Treat null/undefined as "not provided"
      (v) => (v == null ? undefined : v),
      z.array(z.string().trim().min(1)).default([])
    )
    .optional(),
  page: z.coerce.number().int().min(1).optional(),
});

export const ChallengeSchema = z
  .object({
    name: z.string().trim().default(""),
    description: z.string().default(""),
    rating: z.coerce.number().int().min(1).max(5).default(1),
    roles: z.array(z.string()).default([]),
    tags_and_statuses: z.array(z.string()).default([]),
    mights: z.array(MightSchema).default([]),
    limits: z.array(LimitSchema).default([]),
    threats: z.array(ThreatSchema).default([]),
    general_consequences: z.array(z.string()).default([]),
    special_features: z.array(SpecialFeatureSchema).default([]),
    meta: MetaSchema.optional(),
  })
  .transform((c) => ({
    ...c,
    rating: clamp(c.rating, 1, 5),
  })) satisfies z.ZodType<Challenge>;

/** Soft checks that should not fail import but are useful to surface. */
export function computeWarnings(ch: Challenge): string[] {
  const warnings: string[] = [];

  // Roles not in the known list (book page 110)
  const known = new Set(rolesList.map((r) => r.toLowerCase()));
  const unknownRoles = (ch.roles || []).filter(
    (r) => !known.has(r.toLowerCase())
  );
  if (unknownRoles.length) {
    warnings.push(`Unknown role(s): ${unknownRoles.join(", ")}.`);
  }

  // tokens
  const bad: string[] = [];
  const limitsFound: string[] = [];
  for (const t of ch.tags_and_statuses || []) {
    const p = parseToken(t);
    if (!p) bad.push(t);
    else if (p.kind === "limit") limitsFound.push(t);
  }
  if (bad.length) {
    warnings.push(
      `Some tokens aren't recognized as {!weakness}, {status-<n>} or {tag}: ${bad.join(", ")}.`
    );
  }
  if (limitsFound.length) {
    warnings.push(
      `Limit-like tokens were found in Tags & Statuses and will be ignored by some tools: ${limitsFound.join(", ")}. Consider moving them to the Limits section.`
    );
  }

  // progress limits without on_max (unchanged)
  const emptyOnMax = (ch.limits || []).filter(
    (l) => l.is_progress && !l.on_max
  );
  if (emptyOnMax.length) {
    warnings.push(
      `Progress limit(s) without "on_max": ${emptyOnMax.map((l) => l.name).join(", ")}.`
    );
  }

  return warnings;
}
