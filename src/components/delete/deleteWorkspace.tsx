import {useModalStore} from "../ui/modals/store.ts";
import {useWorkspaceToModifyStore} from "../../store/modification/workspaceToModifyStore.ts";
import {deleteWorkspace} from "../../utils/functionUtils.ts";

const DeleteWorkspace = () => {

  const { showModal } = useModalStore()
  const { workspace, setWorkspace } = useWorkspaceToModifyStore()

  const onCancel = () => {
    setWorkspace(null)
    showModal(false, "default")
  }

  const onConfirm = () => {
    if (!workspace) return

    deleteWorkspace(workspace.id)

    showModal(false, "default")
  }

  return (
    <div>
      <p className="text-sm text-center text-gray-500 mb-6">
        Êtes-vous sûr de vouloir <span className="font-semibold text-gray-900">supprimer</span> le workspace {workspace?.name} ?
        <br/>
        Cette action est irréversible.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 transition"
        >
          Non, annuler
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 transition"
        >
          Oui, supprimer
        </button>
      </div>
    </div>
  );
}
export default DeleteWorkspace
