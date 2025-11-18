import { create } from "zustand"
import { persist } from "zustand/middleware"
import { indexedDBStorage } from "./storage/storage"
import type {bv, person, product} from "../types/type.ts"

type BvStore = {
  bvs: bv[]
  addBv: (fileId: string, holder: person, products: product[]) => void
  getBv: (fileId: string) => bv[]
  updateBv: (id: string, newData: bv) => void
  removeBvOnThisFile: (fileId: string) => void
  removeBv: (fileId:string, numberCard: string) => void
  updateBvHolderDetails: (id: string, fileId: string, newData: person) => void
}

type newBvStore = {
  newBv: bv | null
  setNewBv : (newBv: bv | null) => void
}

type store = {
  id: string | null,
  setId : (id :string | null) => void
}

export const useBvToModifyStore = create<store>() ((set) => ({
  id: null,
  setId: (id) => set({ id })
}))

export const useBvStore = create<BvStore>()(
  persist(
    (set, get) => ({
      bvs: [],

      addBv: (fileId, holder, products) => {
        const id = crypto.randomUUID()

        const bv = {
          fileId, holder, products, id
        }

        set((state) => ({bvs: [...state.bvs, bv]}))
      },

      getBv: (fileId) => {
        return get().bvs.filter((bv) => bv.fileId === fileId)
      },

      updateBv: (id, newData) =>
        set((state) => ({
          bvs: state.bvs.map((f) =>
            f.fileId === newData.fileId && f.holder.numberCard === id ? { ...newData } : f
          ),
        })),

      updateBvHolderDetails: (id, fileId, newData) =>
        set((state) => ({
          bvs: state.bvs.map((f) =>
            f.fileId === fileId && f.holder.numberCard === id ? { ...f, holder: newData } : f
          ),
        })),

      removeBvOnThisFile: (fileId) =>
        set((state) => ({
          bvs: state.bvs.filter((bv) => bv.fileId !== fileId),
        })),

      removeBv: (fileId, numberCard) =>
        set((state) => ({
          bvs: state.bvs.filter(
            bv => !(bv.fileId === fileId && bv.holder.numberCard === numberCard)
          )
        })),
    }),
    {
      name: "bvs-db",
      storage: indexedDBStorage,
    }
  )
)

export const useNewBvStore = create<newBvStore>() ((set) => ({
  newBv: null,
  setNewBv: newBv => set({ newBv })
}))
