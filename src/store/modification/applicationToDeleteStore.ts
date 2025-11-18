import { create } from "zustand"

type person = {
  name: string;
  numberCard: string;
}

type store = {
  data: person | null
  setData: (person: person | null) => void
}

export const useApplicationToDeleteStore = create<store>() ((set) => ({
  data: null,

  setData: (person) => set( { data: person } )
}))
