import {create} from "zustand"
import {persist} from "zustand/middleware"
import type {file} from "../types/type.ts"
import {indexedDBStorage} from "./storage/storage.ts";

type storeType = {
  files: file[];
  getFileName: (fileId: string | undefined) => string;
  addFile: (name: string, workspaceId: string) => string;
  removeFile: (id: string) => void;
  updateFile: (id: string, newData: file) => void;
}

export const useFileStore = create<storeType>()(
  persist(
    (set, get) => ({
      files: [],

      getFileName: (fileId) => {
        if (!fileId) return ""
        const file = get().files.find(f => f.id === fileId)
        return file ? file.name : ""
      },

      addFile: (name, workspaceId) => {
        const now = new Date()
        const id = crypto.randomUUID()

        set((state) => ({
          files: [
            ...state.files,
            {
              id,
              name,
              workspaceId,
              createdAt: now,
              lastOpenedAt: null,
              modifiedAt: now
            }
          ]
        }))

        return id
      },

      removeFile: (id) => {
        set((state) => ({
          files: state.files.filter((ws) => ws.id !== id),
        }))
      },

      updateFile: (id, newData) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id ? { ...f, ...newData } : f
          ),
        })),
    }),
    {
      name: "file-db",
      storage: indexedDBStorage,
    }
  )
)
