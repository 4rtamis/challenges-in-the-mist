// src/store/sheetStore.ts
import { create } from "zustand";

export type SheetTarget =
  | { kind: "basic"; mode?: "edit" }
  | { kind: "meta"; mode?: "edit" }
  | { kind: "limits"; mode?: "create" | "edit"; index?: number }
  | { kind: "tags"; mode?: "create" | "edit"; index?: number }
  | { kind: "mights"; mode?: "create" | "edit"; index?: number }
  | { kind: "special"; mode?: "create" | "edit"; index?: number }
  | { kind: "threats"; mode?: "create" | "edit"; index?: number };

type State = {
  open: boolean;
  target: SheetTarget | null;
  openSheet: (t: SheetTarget) => void;
  closeSheet: () => void;
};

export const useSheetStore = create<State>((set) => ({
  open: false,
  target: null,
  openSheet: (t) => set({ open: true, target: t }),
  closeSheet: () => set({ open: false, target: null }),
}));
