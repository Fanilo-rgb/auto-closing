import { create } from "zustand"

type store = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useApplicationFormStore = create<store>() ((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
