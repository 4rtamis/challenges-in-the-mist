// src/store/uiStore.ts
import { create } from "zustand";

export type SectionKey =
  | "basic"
  | "meta"
  | "limits"
  | "tags"
  | "mights"
  | "special"
  | "threats";

export type ActiveSection =
  | { kind: SectionKey }
  | { kind: "limits"; index?: number }
  | { kind: "tags"; index?: number }
  | { kind: "threats"; index?: number; subIndex?: number };

type UiState = {
  active: ActiveSection | null;
  setActive: (s: ActiveSection | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  active: null,
  setActive: (s) => set({ active: s }),
}));
