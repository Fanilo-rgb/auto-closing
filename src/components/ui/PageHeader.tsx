import {FolderKanban} from "lucide-react";
import {motion} from "motion/react";
import type {itemType} from "../../types/type.ts";
import React from "react";

type Props = {
  color?: string
  name: string
  type: itemType
  contentLength: number
  icon: React.ComponentType,
}

const PageHeader = ({ color = "gray", name, type, contentLength, icon: Icon }: Props) => {
  const text = type === "workspace" ? "Vos wokspaces" : "Vos fichiers"

  const colorMap: Record<string, string> = {
    red: "bg-gradient-to-br from-rose-300 to-red-400 shadow-red-500 text-red-800",
    blue: "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-blue-500 text-blue-800",
    green: "bg-gradient-to-br from-lime-300 to-green-400 shadow-green-500 text-green-800",
    yellow: "bg-gradient-to-br from-amber-200 to-yellow-400 shadow-yellow-500 text-yellow-800",
    purple: "bg-gradient-to-br from-indigo-300 to-purple-500 shadow-purple-500 text-purple-800",
    gray: "bg-gradient-to-br from-gray-300 to-gray-400 shadow-gray-500 text-gray-800",
    cyan: "bg-gradient-to-br from-emerald-300 to-cyan-400 shadow-cyan-500 text-cyan-800",
    pink: "bg-gradient-to-br from-rose-400 to-pink-400 shadow-pink-500 text-pink-800",
    orange: "bg-gradient-to-br from-red-300 to-orange-400 shadow-orange-500 text-orange-800"
  };

  const background = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-4 sticky top-0 z-20 py-4 px-2 border-b border-gray-300 bg-white/10 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        <div className={`bg-gradient-to-b shadow-md ${background} p-4 rounded-xl`}>
          <Icon/>
        </div>
        <motion.h1
          initial={{ translateY: -10 }}
          animate={{ translateY: 0 }}
          className="truncate"
        >
          {name}
        </motion.h1>
      </div>
      {contentLength > 0 && (
        <div className="flex items-center gap-2">
          <FolderKanban className="text-gray-400"/>
          <h3 className="text-base text-gray-500 font-semibold">{text}</h3>
          <span className="text-xs bg-gray-100 py-1 px-2 grid place-items-center rounded-lg font-bold text-gray-700">
          # {contentLength}
        </span>
        </div>
      )}
    </motion.div>
  )
}
export default PageHeader
