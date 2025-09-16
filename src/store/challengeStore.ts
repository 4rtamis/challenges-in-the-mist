import { create } from "zustand";

export type MightLevel = "origin" | "adventure" | "greatness";

export type Might = {
  name: string;
  level: MightLevel;
  vulnerability?: string | null;
};

export type Limit = {
  name: string;
  level: number; // 1–6 (book guideline)
  is_immune?: boolean; // immune to this limit type
  is_progress?: boolean; // progress limit (counts up)
  on_max?: string | null; // what happens when maxed (progress outcome)
};

export type Threat = {
  name: string;
  description: string;
  consequences: string[];
};

export type SpecialFeature = { name: string; description: string };

export type MetaInfo = {
  sourcebook?: string;
  chapter?: string;
  page?: number;
  is_official?: boolean;
};

export type Challenge = {
  name: string;
  description: string;
  rating: number; // 1–5
  roles: string[];
  tags_and_statuses: string[]; // "{violent-2}", "{sharp tools}", ...
  mights: Might[];
  limits: Limit[];
  threats: Threat[];
  general_consequences: string[]; // floating consequences (our extension)
  special_features: SpecialFeature[]; // NEW
  meta?: MetaInfo; // NEW
};

type ChallengeStore = {
  challenge: Challenge;
  setChallenge: (update: Partial<Challenge>) => void; // shallow merge
  replaceChallenge: (next: Challenge) => void; // replace wholesale
  resetChallenge: () => void;

  // tags & statuses
  addToken: (token: string) => void;
  removeTokenAt: (index: number) => void;
  replaceTokenAt: (index: number, token: string) => void;
  moveToken: (from: number, to: number) => void;

  // mights
  addMight: (might: Might) => void;
  updateMightAt: (index: number, update: Partial<Might>) => void;
  removeMightAt: (index: number) => void;
  moveMight: (from: number, to: number) => void;

  // limits
  addLimit: (limit: Limit) => void;
  updateLimitAt: (index: number, update: Partial<Limit>) => void;
  removeLimitAt: (index: number) => void;
  moveLimit: (from: number, to: number) => void;

  // threats & consequences
  addThreat: (t: Threat) => void;
  updateThreatAt: (index: number, update: Partial<Threat>) => void;
  removeThreatAt: (index: number) => void;
  moveThreat: (from: number, to: number) => void;
  addConsequence: (threatIndex: number, text: string) => void;
  updateConsequence: (
    threatIndex: number,
    cIndex: number,
    text: string
  ) => void;
  removeConsequence: (threatIndex: number, cIndex: number) => void;
  moveConsequence: (threatIndex: number, from: number, to: number) => void;

  // general consequences
  addGeneralConsequence: (text: string) => void;
  updateGeneralConsequence: (index: number, text: string) => void;
  removeGeneralConsequence: (index: number) => void;
  moveGeneralConsequence: (from: number, to: number) => void;

  // Special features
  addSpecialFeature: (sf: SpecialFeature) => void;
  updateSpecialFeatureAt: (
    index: number,
    update: Partial<SpecialFeature>
  ) => void;
  removeSpecialFeatureAt: (index: number) => void;
  moveSpecialFeature: (from: number, to: number) => void;

  // Meta
  updateMeta: (update: Partial<MetaInfo>) => void;
};

function clamp(n: number, lo: number, hi: number) {
  const x = Math.floor(Number(n) || 0);
  return Math.max(lo, Math.min(hi, x));
}
function strOrNull(v?: string | null) {
  const s = (v ?? "").trim();
  return s ? s : null;
}

/* Default empty challenge */
const defaultChallenge: Challenge = {
  name: "",
  description: "",
  rating: 1,
  roles: [],
  tags_and_statuses: [],
  mights: [],
  limits: [],
  threats: [],
  general_consequences: [],
  special_features: [],
  meta: undefined,
};

export const useChallengeStore = create<ChallengeStore>((set) => ({
  challenge: defaultChallenge,

  setChallenge: (update) =>
    set((s) => ({ challenge: { ...s.challenge, ...update } })),
  replaceChallenge: (next) => set({ challenge: next }),
  resetChallenge: () => set({ challenge: defaultChallenge }),

  // tags & statuses
  addToken: (token) =>
    set((s) => ({
      challenge: {
        ...s.challenge,
        tags_and_statuses: [...s.challenge.tags_and_statuses, token],
      },
    })),
  removeTokenAt: (index) =>
    set((s) => {
      const arr = [...s.challenge.tags_and_statuses];
      arr.splice(index, 1);
      return { challenge: { ...s.challenge, tags_and_statuses: arr } };
    }),
  replaceTokenAt: (index, token) =>
    set((s) => {
      const arr = [...s.challenge.tags_and_statuses];
      arr[index] = token;
      return { challenge: { ...s.challenge, tags_and_statuses: arr } };
    }),
  moveToken: (from, to) =>
    set((s) => {
      const arr = [...s.challenge.tags_and_statuses];
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length)
        return s;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { challenge: { ...s.challenge, tags_and_statuses: arr } };
    }),

  // mights
  addMight: (might) =>
    set((s) => ({
      challenge: {
        ...s.challenge,
        mights: [
          ...s.challenge.mights,
          { ...might, vulnerability: strOrNull(might.vulnerability) },
        ],
      },
    })),
  updateMightAt: (index, update) =>
    set((s) => {
      const arr = [...s.challenge.mights];
      const prev = arr[index];
      if (!prev) return s;
      arr[index] = {
        ...prev,
        ...update,
        vulnerability: strOrNull(
          update.vulnerability ?? prev.vulnerability ?? null
        ),
      };
      return { challenge: { ...s.challenge, mights: arr } };
    }),
  removeMightAt: (index) =>
    set((s) => {
      const arr = [...s.challenge.mights];
      arr.splice(index, 1);
      return { challenge: { ...s.challenge, mights: arr } };
    }),
  moveMight: (from, to) =>
    set((s) => {
      const arr = [...s.challenge.mights];
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length)
        return s;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { challenge: { ...s.challenge, mights: arr } };
    }),

  // limits
  addLimit: (limit) =>
    set((s) => ({
      challenge: {
        ...s.challenge,
        limits: [
          ...s.challenge.limits,
          {
            name: limit.name.trim(),
            level: clamp(limit.level, 1, 6),
            is_immune: !!limit.is_immune,
            is_progress: !!limit.is_progress,
            on_max: strOrNull(limit.on_max),
          },
        ],
      },
    })),
  updateLimitAt: (index, update) =>
    set((s) => {
      const arr = [...s.challenge.limits];
      const prev = arr[index];
      if (!prev) return s;
      arr[index] = {
        ...prev,
        ...update,
        name: (update.name ?? prev.name).trim(),
        level: clamp(update.level ?? prev.level, 1, 6),
        is_immune: !!(update.is_immune ?? prev.is_immune),
        is_progress: !!(update.is_progress ?? prev.is_progress),
        on_max: strOrNull(update.on_max ?? prev.on_max ?? null),
      };
      return { challenge: { ...s.challenge, limits: arr } };
    }),
  removeLimitAt: (index) =>
    set((s) => {
      const arr = [...s.challenge.limits];
      arr.splice(index, 1);
      return { challenge: { ...s.challenge, limits: arr } };
    }),
  moveLimit: (from, to) =>
    set((s) => {
      const arr = [...s.challenge.limits];
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length)
        return s;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { challenge: { ...s.challenge, limits: arr } };
    }),

  // threats & consequences
  addThreat: (t) =>
    set((s) => ({
      challenge: {
        ...s.challenge,
        threats: [
          ...s.challenge.threats,
          {
            name: t.name.trim(),
            description: (t.description ?? "").trim(),
            consequences: [...(t.consequences ?? [])]
              .map((c) => c.trim())
              .filter(Boolean),
          },
        ],
      },
    })),
  updateThreatAt: (index, update) =>
    set((s) => {
      const arr = [...s.challenge.threats];
      const prev = arr[index];
      if (!prev) return s;
      arr[index] = {
        ...prev,
        ...update,
        name: (update.name ?? prev.name).trim(),
        description: (update.description ?? prev.description ?? "").trim(),
        consequences: (update.consequences ?? prev.consequences)
          .map((c) => c.trim())
          .filter(Boolean),
      };
      return { challenge: { ...s.challenge, threats: arr } };
    }),
  removeThreatAt: (index) =>
    set((s) => {
      const arr = [...s.challenge.threats];
      arr.splice(index, 1);
      return { challenge: { ...s.challenge, threats: arr } };
    }),
  moveThreat: (from, to) =>
    set((s) => {
      const arr = [...s.challenge.threats];
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length)
        return s;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { challenge: { ...s.challenge, threats: arr } };
    }),
  addConsequence: (tIdx, text) =>
    set((s) => {
      const arr = [...s.challenge.threats];
      const t = arr[tIdx];
      if (!t) return s;
      t.consequences = [...t.consequences, text.trim()].filter(Boolean);
      return { challenge: { ...s.challenge, threats: arr } };
    }),
  updateConsequence: (tIdx, cIdx, text) =>
    set((s) => {
      const arr = [...s.challenge.threats];
      const t = arr[tIdx];
      if (!t) return s;
      const cs = [...t.consequences];
      if (cIdx < 0 || cIdx >= cs.length) return s;
      cs[cIdx] = text.trim();
      t.consequences = cs.filter(Boolean);
      return { challenge: { ...s.challenge, threats: arr } };
    }),
  removeConsequence: (tIdx, cIdx) =>
    set((s) => {
      const arr = [...s.challenge.threats];
      const t = arr[tIdx];
      if (!t) return s;
      const cs = [...t.consequences];
      cs.splice(cIdx, 1);
      t.consequences = cs;
      return { challenge: { ...s.challenge, threats: arr } };
    }),
  moveConsequence: (tIdx, from, to) =>
    set((s) => {
      const arr = [...s.challenge.threats];
      const t = arr[tIdx];
      if (!t) return s;
      const cs = [...t.consequences];
      if (from < 0 || from >= cs.length || to < 0 || to >= cs.length) return s;
      const [item] = cs.splice(from, 1);
      cs.splice(to, 0, item);
      t.consequences = cs;
      return { challenge: { ...s.challenge, threats: arr } };
    }),

  // general consequences
  addGeneralConsequence: (text) =>
    set((s) => ({
      challenge: {
        ...s.challenge,
        general_consequences: [
          ...s.challenge.general_consequences,
          text.trim(),
        ].filter(Boolean),
      },
    })),
  updateGeneralConsequence: (i, text) =>
    set((s) => {
      const arr = [...s.challenge.general_consequences];
      if (i < 0 || i >= arr.length) return s;
      arr[i] = text.trim();
      return {
        challenge: {
          ...s.challenge,
          general_consequences: arr.filter(Boolean),
        },
      };
    }),
  removeGeneralConsequence: (i) =>
    set((s) => {
      const arr = [...s.challenge.general_consequences];
      arr.splice(i, 1);
      return { challenge: { ...s.challenge, general_consequences: arr } };
    }),
  moveGeneralConsequence: (from, to) =>
    set((s) => {
      const arr = [...s.challenge.general_consequences];
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length)
        return s;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { challenge: { ...s.challenge, general_consequences: arr } };
    }),

  // --- special features ---
  addSpecialFeature: (sf) =>
    set((s) => ({
      challenge: {
        ...s.challenge,
        special_features: [
          ...s.challenge.special_features,
          {
            name: (sf.name ?? "").trim(),
            description: (sf.description ?? "").trim(),
          },
        ],
      },
    })),
  updateSpecialFeatureAt: (index, update) =>
    set((s) => {
      const arr = [...s.challenge.special_features];
      const prev = arr[index];
      if (!prev) return s;
      arr[index] = {
        ...prev,
        ...update,
        name: (update.name ?? prev.name).trim(),
        description: (update.description ?? prev.description ?? "").trim(),
      };
      return { challenge: { ...s.challenge, special_features: arr } };
    }),
  removeSpecialFeatureAt: (index) =>
    set((s) => {
      const arr = [...s.challenge.special_features];
      arr.splice(index, 1);
      return { challenge: { ...s.challenge, special_features: arr } };
    }),
  moveSpecialFeature: (from, to) =>
    set((s) => {
      const arr = [...s.challenge.special_features];
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length)
        return s;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { challenge: { ...s.challenge, special_features: arr } };
    }),

  // --- meta ---
  updateMeta: (update) =>
    set((s) => ({
      challenge: {
        ...s.challenge,
        meta: { ...(s.challenge.meta ?? {}), ...update },
      },
    })),
}));
