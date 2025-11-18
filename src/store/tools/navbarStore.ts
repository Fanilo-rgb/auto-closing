import { create } from "zustand"

type navbarPreferences = "fixed" | "hidden"

type store = {
  isOpen: boolean
  preference: navbarPreferences
  open: () => void
  close: () => void
  setPreference: (display: navbarPreferences) => void
}

export const useNavbarStore = create<store>() ((set) => ({
  isOpen: false,
  preference: "fixed",
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setPreference: (display) => set({ preference: display })
}))
