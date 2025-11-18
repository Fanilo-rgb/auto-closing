import { motion } from 'motion/react'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Wrapper = ({children} : Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed grid place-items-center top-0 bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xs p-4 selection:bg-cyan-200 selection:text-cyan-800 z-50"
    >
      {children}
    </motion.div>
  )
}
export default Wrapper
