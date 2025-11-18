import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { workspace } from "../types/type.ts";
import {indexedDBStorage} from "./storage/storage.ts";

type storeType = {
  workspaces: workspace[];
  getWorkspaceName: (workspaceId: string | undefined) => string ;
  addWorkspace: (name: string, color: string) => string;
  removeWorkspace: (id: string) => void;
  resetWorkspaces: () => void;
};

export const useWorkspaceStore = create<storeType>()(
  persist(
    (set, get) => ({
      workspaces: [],

      getWorkspaceName: (workspaceId) => {
        if (!workspaceId) return ""
        const workspace = get().workspaces.find((w) => w.id === workspaceId)
        return workspace ? workspace.name : ""
      },

      addWorkspace: (name, color) => {
        const id = crypto.randomUUID()

        set((state) => ({
          workspaces: [
            ...state.workspaces,
            {id , name, color},
          ],
        }))

        return id
      },

      removeWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((ws) => ws.id !== id),
        })),

      resetWorkspaces: () => set({ workspaces: [] }),
    }),
    {
      name: "workspace-db",
      storage: indexedDBStorage,
    }
  )
);
