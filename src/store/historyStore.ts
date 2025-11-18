import {create} from "zustand"
import { persist } from "zustand/middleware";
import {indexedDBStorage} from "./storage/storage.ts";
import type {history, event, itemType} from "../types/type.ts";

type StoreType = {
  histories: history[]
  addToHistory: (originId: string, name: string, link: string, event: event, type: itemType) => void
  remove: (originId: string) => void
  resetHistory: () => void
}

export const useHistory = create<StoreType>() (
  persist(
    (set, get) => ({
      histories: [],

      addToHistory: (originId, name, link, event = "open", type) => {
        const { histories } = get()
        const newData = { originId, name, link, event, type, eventDate: new Date() }

        const exists = histories.some(h => h.originId === originId && h.event === event)

        set(state => ({
          histories: exists
            ? state.histories.map(h =>
              h.originId === originId && h.event === event ? { ...h, ...newData } : h
            )
            : [...state.histories, newData]
        }))
      },

      remove: (originId) =>
        set(state => ({
          histories: state.histories.filter(h => h.originId !== originId)
        })),

      resetHistory: () => set({ histories: [] })
    }),
    {
      name: "history-db",
      storage: indexedDBStorage
    }
  )
)
