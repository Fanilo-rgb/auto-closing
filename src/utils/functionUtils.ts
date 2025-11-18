import {useFileStore} from "../store/fileStore.ts";
import {useFileToModifyStore} from "../store/modification/fileToModifyStore.ts";
import {useBvStore, useNewBvStore} from "../store/orderStore.ts";
import {useApplicationStore} from "../store/applicationStore.ts";
import {useHistory} from "../store/historyStore.ts";
import {useWorkspaceStore} from "../store/workspaceStore.ts";
import {useWorkspaceToModifyStore} from "../store/modification/workspaceToModifyStore.ts";
import type {person, product} from "../types/type.ts";

export const getWorkspaceFromFileId = (fileId: string) => {
  const file = useFileStore.getState().files.find(f => f.id === fileId)
  return useWorkspaceStore.getState().workspaces.find(w => w.id === file?.workspaceId)
}

export const deleteFile = (fileId: string) => {
  const removeFile = useFileStore.getState().removeFile
  const setFile = useFileToModifyStore.getState().setFile
  const removeBv = useBvStore.getState().removeBvOnThisFile
  const removeApplication = useApplicationStore.getState().removeApplicationOnThisFile
  const remove = useHistory.getState().remove

  const workspace = getWorkspaceFromFileId(fileId)

  const addToHistory = useHistory.getState().addToHistory

  removeFile(fileId)
  removeBv(fileId)
  removeApplication(fileId)
  remove(fileId)
  setFile(null)

  if (workspace) addToHistory(workspace.id, workspace.name, `/workspaces/${workspace.id}`, "update", "workspace")

}

export const deleteWorkspace = (workspaceId: string) => {
  const files = useFileStore.getState().files
  const remove = useHistory.getState().remove
  const removeWorkspace = useWorkspaceStore.getState().removeWorkspace
  const setWorkspace = useWorkspaceToModifyStore.getState().setWorkspace

  const filesId = files.filter(f => f.workspaceId === workspaceId).map(f => f.id)

  filesId.forEach(id => deleteFile(id))

  remove(workspaceId)
  removeWorkspace(workspaceId)
  setWorkspace(null)
}

export const createWorkspace = (data: {name: string, color: string}) => {
  const addWorkspace = useWorkspaceStore.getState().addWorkspace
  const addToHistory = useHistory.getState().addToHistory

  const id = addWorkspace(data.name, data.color)

  const link = `/workspaces/${id}`

  addToHistory(id, data.name, link, "update", "workspace")

  return link
}

export const addNewBv = (fileId: string, holder: person, products: product[]) => {
  const setNewBv = useNewBvStore.getState().setNewBv
  const addBv = useBvStore.getState().addBv

  const personCard = holder.numberCard.replace(/\s/g, "")

  const isValid =
    holder.name.trim().length > 0 &&
    /^\d{8}$/.test(personCard.trim());

  if (!isValid || !fileId) return

  addBv(fileId, holder, products)

  setNewBv(null)
}
