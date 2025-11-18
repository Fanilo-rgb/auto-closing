import type {JSX} from 'react';
import {X} from "lucide-react";
import {useModalStore} from "./store.ts";
import {useLocation, useNavigate} from "react-router-dom";
import { motion } from 'motion/react';

type Props = {
  title: string;
  component: JSX.Element
}

const ModalBody = ({component, title}: Props) => {
  const { showModal } = useModalStore()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  const navigate = useNavigate()

  const handleClick = () => {
    const isDeleteModal = !!queryParams.get("delete")
    if (isDeleteModal) navigate(-1)
    showModal(false, "default")
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="bg-white shadow-md rounded-2xl p-2 w-full sm:w-sm md:w-lg -translate-y-12"
    >
      <div className="flex justify-between pb-2 border-b border-gray-300 mb-2">
        <h1>{title}</h1>
        <button
          className="bg-gray-100 h-8 w-8 grid place-items-center rounded-full text-gray-700 hover:bg-gray-300 transition"
          onClick={handleClick}
        >
          <X className="h-5 w-5"/>
        </button>
      </div>
      {component}
    </motion.div>
  )
}
export default ModalBody
