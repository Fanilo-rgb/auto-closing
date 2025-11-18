import { motion } from 'motion/react'
import React from 'react'

type Props = {
  children: React.ReactNode
  top: string
}

const OptionMenuContainer = ({children, top}: Props) => {
  return (
    <motion.div
      initial={{ opacity:0, width:100, scaleY:0, translateY:-10 }}
      animate={{ opacity:1, width:208, scaleY:1, translateY:0 }}
      exit={{ opacity:0, translateY: -10 }}
      transition={{ ease: [0, 0.71, 0.2, 1.01] }}
      className={`absolute bg-white shadow-lg border border-gray-300 right-0 ${top} z-10 p-2 w-52 rounded-xl text-sm`}
    >
      {children}
    </motion.div>
  )
}
export default OptionMenuContainer
