import { create } from "zustand"

type modalType = "workspaceCreation" | "default" | "fileCreation" | "deleteFile" | "deleteApplication" | "deleteBv" | "modifyFileName" | "deleteWorkspace"

type modalStoreType = {
  show: {
    value: boolean;
    type: modalType;
  };
  showModal: (value: boolean, modalType: modalType) => void;
}

export const useModalStore = create<modalStoreType>()(
  (set) => ({
    show: {
      value: false,
      type: "default",
    },
    showModal: (value, modalType) =>
      set(() => ({
        show: {
          value,
          type: modalType
        }
      })),
  })
)
