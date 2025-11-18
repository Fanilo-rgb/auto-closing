import {useState} from 'react'
import {useModalStore} from "../modals/store.ts";
import {useFileToModifyStore} from "../../../store/modification/fileToModifyStore.ts";
import {useFileStore} from "../../../store/fileStore.ts";
import {useHistory} from "../../../store/historyStore.ts";
import {useWorkspaceStore} from "../../../store/workspaceStore.ts";

const FileUpdateForm = () => {
  const { file, setFile } = useFileToModifyStore()
  const { updateFile } = useFileStore()
  const { addToHistory } = useHistory()

  const { workspaces } = useWorkspaceStore()

  const [fileName, setFileName] = useState(file?.name || "")

  const { showModal } = useModalStore()

  const onCancel = () => {

    if (!fileName) {
      console.error("A file name is required")
      return
    }

    setFile(null)

    showModal(false, "default")
  }

  const onSave = () => {
    if (!fileName) {
      console.error("A file name is required")
      return
    }

    if (!file) return

    updateFile(file.id, { ...file, name: fileName })

    const workspace = workspaces.find(w => w.id === file.workspaceId)

    if (!workspace) return

    addToHistory(file.id, fileName, `/workspaces/${file.workspaceId}/${file.id}/orders`, "update", "file")
    addToHistory(workspace.id, workspace.name, `/workspaces/${workspace.id}`, "update", "workspace")

    showModal(false, "default")
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        className="text-gray-700 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
        onChange={(e) => setFileName(e.target.value)}
        type='text'
        placeholder="Nom du fichier"
        value={fileName}
      />
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 p-1 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Annuler
        </button>
        <button
          onClick={onSave}
          className="flex-1 bg-gray-800 p-1 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}
export default FileUpdateForm
