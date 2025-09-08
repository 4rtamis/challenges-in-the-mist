// src/store/editModalStore.ts
import { create } from "zustand";

export type EditTarget =
  | { kind: "basic" }
  | { kind: "meta" }
  | { kind: "limit"; index?: number; mode: "create" | "edit" }
  | { kind: "token"; index?: number; mode: "create" | "edit" }
  | { kind: "might"; index?: number; mode: "create" | "edit" }
  | { kind: "special"; index?: number; mode: "create" | "edit" }
  | { kind: "threat"; tIdx?: number; mode: "create" | "edit" }
  | {
      kind: "consequence";
      tIdx: number;
      cIdx?: number;
      mode: "create" | "edit";
    }
  | { kind: "general-consequence"; idx?: number; mode: "create" | "edit" };

type ModalState = {
  target: EditTarget | null;
  open: boolean;
  openModal: (t: EditTarget) => void;
  closeModal: () => void;
};

export const useEditModal = create<ModalState>((set) => ({
  target: null,
  open: false,
  openModal: (t) => set({ target: t, open: true }),
  closeModal: () => set({ open: false, target: null }),
}));
