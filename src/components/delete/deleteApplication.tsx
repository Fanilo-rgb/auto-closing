import {useApplicationToDeleteStore} from "../../store/modification/applicationToDeleteStore.ts";
import {useParams} from "react-router-dom";
import {useModalStore} from "../ui/modals/store.ts";
import {useApplicationStore} from "../../store/applicationStore.ts";

const DeleteApplication = () => {
  const { data, setData } = useApplicationToDeleteStore()
  const { fileId } = useParams()
  const { showModal } = useModalStore()
  const { removeApplication } = useApplicationStore()

  const onConfirm = () => {
    if (!fileId || !data) return
    removeApplication(fileId, data.numberCard)
    showModal(false, "default")
  }

  const onCancel = () => {
    showModal(false, "default")
    setData(null)
  }

  return (
    <div className="">
      <p className="text-sm text-center text-gray-500 mb-6">
        Êtes-vous sûr de vouloir <span className="font-semibold text-gray-900">supprimer</span> l'adhesion de
        <br/>
        {data?.numberCard} {data?.name} de ce fichier ?
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
export default DeleteApplication
