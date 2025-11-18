import { create } from "zustand"
import type {workspace} from "../../types/type.ts";

type store = {
  workspace: workspace | null
  setWorkspace: (newData: workspace | null) => void
}

export const useWorkspaceToModifyStore = create<store>() ((set) => ({
  workspace: null,

  setWorkspace: (newData) => set({ workspace: newData })
}))
