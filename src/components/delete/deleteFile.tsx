import {useModalStore} from "../ui/modals/store.ts";
import {useFileToModifyStore} from "../../store/modification/fileToModifyStore.ts";
import {deleteFile} from "../../utils/functionUtils.ts";

const DeleteFile = () => {
  const {showModal} = useModalStore()
  const { setFile, file } = useFileToModifyStore()

  const onCancel = () => {
    setFile(null)
    showModal(false, "default")
  }
  const onConfirm = () => {
    if (!file) return

    deleteFile(file.id)

    showModal(false, "default")
  }

  return (
    <div>
      <p className="text-sm text-center text-gray-500 mb-6">
        Êtes-vous sûr de vouloir <span className="font-semibold text-gray-900">supprimer</span> le fichier {file?.name} ?
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
};

export default DeleteFile;
