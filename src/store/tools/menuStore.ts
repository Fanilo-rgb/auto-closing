// store/menuStore.ts
import { create } from "zustand";

interface MenuState {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  openId: null,
  setOpenId: (id) => set({ openId: id }),
}));
