import React, {useEffect, useMemo, useRef} from "react";
import PersonInput from "./PersonInput.tsx";
import ProductList from "../../list/ProductList.tsx";
import ProductSearchBar from "../search bar/ProductSearchBar.tsx";
import {useNewBvStore} from "../../../store/orderStore.ts";
import {useParams} from "react-router-dom";
import useMediaQuery from "../../../hooks/useMediaQuery.tsx";
import {useFormStore} from "../../../store/tools/formStore.ts";
import {AnimatePresence, motion} from "motion/react";
import {addNewBv} from "../../../utils/functionUtils.ts";

const BvForm = () => {
  const { newBv, setNewBv } = useNewBvStore()

  const { fileId } = useParams()
  const { setOpen } = useFormStore()

  const initialDataRef = useRef<string | null>(null)

  useEffect(() => {
    if (newBv) {
      initialDataRef.current = JSON.stringify(newBv)
    }
  }, [newBv])

  const hasChanged = useMemo(() => {
    if (!newBv || !initialDataRef.current) return false
    return JSON.stringify(newBv) !== initialDataRef.current
  }, [newBv])

  const totalBv = useMemo(
    () => newBv?.products.reduce((acc, product) => acc + product.bv * product.quantity, 0),
    [newBv]
  )

  const isSmallScreen = useMediaQuery("sm")
  const isMidScreen = useMediaQuery("md")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileId || !newBv) return

    addNewBv(fileId, newBv.holder, newBv.products)

    if (!isSmallScreen || !isMidScreen ) setOpen(false)
  };

  const handleCancel = () => {
    setNewBv(null)
    setOpen(false)
  }

  return (
    <form
      className="w-full h-full p-2 flex flex-col"
    >
      <PersonInput />
      <hr />

      <ProductSearchBar />

      <div className="relative flex-1">
        <ProductList />
      </div>

      <AnimatePresence>
        { newBv && newBv.products.length > 0 && (
          <motion.div
            initial={{ translateY: 10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 10, opacity: 0 }}
          >
            <p>Total bv : <span className="font-bold">{totalBv} $</span> </p>
          </motion.div>
        ) }
      </AnimatePresence>

      <div className="flex w-full gap-2">
        { hasChanged && (
          <motion.button
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            onClick={handleCancel}
            className="flex-1 hover:bg-gray-300 bg-gray-200 text-gray-700 p-1 rounded-lg transition">
            Annuler
          </motion.button>
        )}
        <button
          onClick={handleSubmit}
          className="flex-1 hover:bg-gray-900 bg-gray-800 text-white p-1 rounded-lg transition">
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default BvForm;
