import React from 'react'
import {useNavbarStore} from "../../store/tools/navbarStore.ts";
import {useLocation, useParams} from "react-router-dom";
import { motion } from 'motion/react';
import {useWorkspaceStore} from "../../store/workspaceStore.ts";

type Props = {
  children: React.ReactNode
}

const NavbarContainer = ({children}: Props) => {

  const location = useLocation()
  const preference = useNavbarStore(state => state.preference)
  const { workspaceId } = useParams()
  const workspaces = useWorkspaceStore(state => state.workspaces)

  const isMainPage = location.pathname === "/"

  const variants = preference === "fixed" && isMainPage
    ? {
      hidden: { width: 0, opacity: 0, paddingLeft: 0, paddingRight: 0 },
      visible: { width: "18rem", opacity: 1, paddingLeft: "1rem", paddingRight: "1rem"}
    }
    : {
      hidden: { width: 0, opacity: 0, padding: 0 },
      visible: { width: "15rem", opacity: 1, padding: "0.5rem"}
    }

  const colorFound = workspaces.find(w => w.id === workspaceId)?.color || "gray"

  const colorMap: Record<string, string> = {
    red: "bg-red-100 border-red-300",
    blue: "bg-blue-50 border-blue-300",
    green: "bg-green-100 border-green-500",
    yellow: "bg-yellow-100 border-yellow-300",
    purple: "bg-purple-100 border-purple-400",
    gray: "bg-gray-50 border-gray-300",
    cyan: "bg-cyan-50 border-cyan-300",
    pink: "bg-rose-50 border-pink-500",
    orange: "bg-orange-100 border-orange-300"
  };

  const color = colorMap[colorFound]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      className={`
      ${ preference === "fixed" && isMainPage 
        ? "w-2xs pt-2 px-4 border-transparent" 
        : `border-x w-60 p-2 ${color}`
      }
      flex flex-col justify-between 
      transition
    `}>
      {children}
    </motion.div>
  )
}
export default NavbarContainer
