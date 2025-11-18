import { create } from "zustand"

type store = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

export const useFormStore = create<store>() ((set) => ({
  isOpen: false,
  setOpen: (value) => set(({ isOpen: value }))
}))