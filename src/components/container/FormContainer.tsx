import {X} from "lucide-react";
import {useFormStore} from "../../store/tools/formStore.ts";
import React from "react";
import useMediaQuery from "../../hooks/useMediaQuery.tsx"
import {useApplicationFormStore} from "../../store/tools/applicationFormStore.ts";
import { motion } from "motion/react";
import {useBvUpdatingFormStore} from "../../store/tools/updateBvForm.ts";
import {useNewBvStore} from "../../store/orderStore.ts";

type Props = {
  children: React.ReactNode
}

const FormContainer = ({children}: Props) => {
  const { setOpen } = useFormStore()
  const form = useApplicationFormStore()
  const updateForm = useBvUpdatingFormStore()
  const isSmallScreen = useMediaQuery("sm")
  const isMidScreen = useMediaQuery("md")

  const { setNewBv } = useNewBvStore()

  const handleClose = () => {
    form.close()
    setOpen(false)
    updateForm.close()

    setNewBv(null)
  }

  return (
    <>
      {(!isSmallScreen || !isMidScreen ) && (
        <motion.div
          initial={{ bottom: -100, opacity:0, scale: 0.9 }}
          animate={{ bottom: 0, opacity:1, scale:1 }}
          exit={{ bottom: -200, opacity:0, scale:0.95 }}
          transition={{
            duration: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="fixed bottom-0 top-10 bg-white w-full flex flex-col rounded-t-2xl overflow-hidden border-t border-gray-300"
        >
          <div className="bg-white/10 backdrop-blur-xs p-2 border-b-1 border-gray-300 flex items-center justify-between gap-2 text-gray-700">
            <h2 className="font-semibold">Formulaire</h2>
            <button
              onClick={handleClose}
              className="bg-transparend p-1 rounded-lg hover:bg-gray-100 transition">
              <X size={16}/>
            </button>
          </div>
          <div className="flex flex-1 border-l-1 border-gray-300">
            {children}
          </div>
        </motion.div>
      )}

      {isMidScreen && (
        <motion.div
          initial={{ minWidth:0, width:0, opacity: 0 }}
          animate={{ minWidth:384, width: 384, opacity:1 }}
          exit={{ minWidth:0, width:0, opacity:0 }}
          transition={{ duration:0.3 }}
          className="sticky top-0 min-w-sm w-sm flex flex-col"
        >
          <div className="bg-white/10 backdrop-blur-xs p-2 border-b-1 border-gray-300 flex items-center justify-between gap-2 text-gray-700">
            <h2 className="font-semibold">Formulaire</h2>
            <button
              onClick={handleClose}
              className="bg-transparend p-1 rounded-lg hover:bg-gray-100 transition">
              <X size={16}/>
            </button>
          </div>
          <div className="flex flex-1 border-l-1 border-gray-300">
            {children}
          </div>
        </motion.div>
      )}
    </>

  )
}
export default FormContainer
