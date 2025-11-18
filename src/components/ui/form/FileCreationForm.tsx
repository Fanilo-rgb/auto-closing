import {type FormEvent, useState} from "react";
import {useFileStore} from "../../../store/fileStore.ts";
import {useParams} from "react-router-dom";
import {useModalStore} from "../modals/store.ts";
import {useHistory} from "../../../store/historyStore.ts";
import {useWorkspaceStore} from "../../../store/workspaceStore.ts";

const FileCreationForm = () => {
  const [fileName, setFileName] = useState("")

  const {addFile} = useFileStore()
  const { showModal } = useModalStore()
  const { addToHistory } = useHistory()
  const { getWorkspaceName } = useWorkspaceStore()

  const {workspaceId} = useParams()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!fileName) {
      console.error("A file name is required")
      return
    }

    if (!workspaceId) {
      console.error("Error finding workspaces")
      return
    }
    const id = addFile(fileName, workspaceId)

    const link = `/workspaces/${workspaceId}/${id}/orders`

    addToHistory(id, fileName, link, "update", "file")
    addToHistory(workspaceId, getWorkspaceName(workspaceId), `/workspaces/${workspaceId}`, "update", "workspace")

    showModal(false, "default")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={(e) => setFileName(e.target.value)}
        type='text'
        placeholder="Nom du fichier"
        value={fileName}
      />
      <input type="submit" value="Creer"/>
    </form>
  )
}
export default FileCreationForm
