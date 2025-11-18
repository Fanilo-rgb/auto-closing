import { create } from "zustand";
import { persist } from "zustand/middleware";
import {indexedDBStorage} from "./storage/storage.ts";
import type {application} from "../types/type.ts";

type StoreType = {
  applications: application[];
  addApplication: (applicant: application) => void;
  updateApplication: (id: string, updated: Partial<application>) => void;
  removeApplication: (fileId:string, numberCard: string) => void;
  removeApplicationOnThisFile: (fileId: string) => void;
}

export const useApplicationStore = create<StoreType>()(
  persist(
    (set) => ({
      applications: [],

      updateApplication: (id, updated) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            application.consultant.numberCard === id && application.fileId === updated.fileId
              ? { ...application, ...updated }
              : application
          ),
        })),

      addApplication: (application) =>
        set((state) => ({
          applications: [...state.applications, application]
        })),

      removeApplication: (fileId, numberCard) =>
        set((state) => ({
          applications: state.applications.filter(
            (application) => !(application.fileId === fileId && application.consultant.numberCard === numberCard)
          ),
        })),

      removeApplicationOnThisFile: (fileId) =>
        set(state => ({
          applications: state.applications.filter(application => application.fileId !== fileId)
        })),
    }),
    {
      name: "application-db",
      storage: indexedDBStorage,
    }
  )
);
