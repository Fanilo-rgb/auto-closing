import {useModalStore} from "../ui/modals/store.ts";
//import {useParams} from "react-router-dom";
//import {useBvStore, useBvToModifyStore} from "../../store/orderStore.ts";

const DeleteBv = () => {
  //const { id, setId } = useBvToModifyStore()
  const { showModal } = useModalStore()
  //const { fileId } = useParams()
  //const { removeBv } = useBvStore()

  const onCancel = () => {
    //setBv(null)
    showModal(false, "default")
  }
  const onConfirm = () => {
    //if (!fileId || !data) return
    //removeBv(fileId, data.holder.numberCard)
    showModal(false, "default")
  }

  //const totalBv = data?.products.reduce((acc, product) => acc + product.bv * product.quantity, 0)

  return (
    <div className="">
      <p className="text-sm text-center text-gray-500 mb-6">
        Êtes-vous sûr de vouloir <span className="font-semibold text-gray-900">supprimer</span> le bv de
        <br/>
        {/*
          {data?.holder.name} {data?.holder.numberCard} avec un total de {totalBv} $
        */}
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
export default DeleteBv
