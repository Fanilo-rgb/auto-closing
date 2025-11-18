// storage/storage.ts
import { get, set, del } from "idb-keyval"
import type { PersistStorage } from "zustand/middleware"

// Ici on crée un storage compatible avec persist de Zustand
export const indexedDBStorage: PersistStorage<any> = {
  getItem: async (name) => {
    const value = await get(name)
    if (!value) return null
    return JSON.parse(value)
  },
  setItem: async (name, value) => {
    await set(name, JSON.stringify(value))
  },
  removeItem: async (name) => {
    await del(name)
  },
}
