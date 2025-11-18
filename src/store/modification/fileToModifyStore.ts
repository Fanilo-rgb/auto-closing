import { create } from "zustand"
import type {file} from "../../types/type.ts";

type store = {
  file: file | null
  setFile: (newData: file | null) => void
}

export const useFileToModifyStore = create<store>() ((set) => ({
  file: null,

  setFile: (newData) => set({ file: newData })
}))