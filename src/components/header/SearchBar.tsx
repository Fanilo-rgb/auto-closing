import {AnimatePresence, motion} from "motion/react"
import {File, History, Pencil, Search} from "lucide-react";
import React, {useState} from "react";
import {useWorkspaceStore} from "../../store/workspaceStore.ts";
import {useFileStore} from "../../store/fileStore.ts";
import {useHistory} from "../../store/historyStore.ts";
import {useNavigate} from "react-router-dom";
import {timeAgo} from "../../utils/dateUtils.ts";
import type {event, itemType} from "../../types/type.ts";

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const navigate = useNavigate()

  const { workspaces, getWorkspaceName } = useWorkspaceStore()
  const { files } = useFileStore()
  const { histories, addToHistory } = useHistory()

  const colorMap: Record<string, string> = {
    red: "bg-gradient-to-br from-rose-300 to-red-400 shadow-red-500",
    blue: "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-blue-500",
    green: "bg-gradient-to-br from-lime-300 to-green-400 shadow-green-500",
    yellow: "bg-gradient-to-br from-amber-200 to-yellow-400 shadow-yellow-500",
    purple: "bg-gradient-to-br from-indigo-300 to-purple-500 shadow-purple-500",
    gray: "bg-gradient-to-br from-gray-300 to-gray-400 shadow-gray-500",
    cyan: "bg-gradient-to-br from-emerald-300 to-cyan-400 shadow-cyan-500",
    pink: "bg-gradient-to-br from-rose-400 to-pink-400 shadow-pink-500",
    orange: "bg-gradient-to-br from-red-300 to-orange-400 shadow-orange-500"
  };

  const workspaceResultsData = {
    title: "Workspaces",
    items: histories
      .filter(h => h.type === "workspace")
      .map(h => workspaces.find(w => w.id === h.originId && h.event === "update"))
      .filter(w => w !== undefined)
      .filter(w => {
        const q = query.toLowerCase().trim()

        const isFoundByName = w.name.toLowerCase().includes(q)
        const isFoundByColor = w.color.toLowerCase().includes(q)
        if (isFoundByName || isFoundByColor) return w
      })
      .slice(0, 5)
      .map(w => ({ ...w, link: `/workspaces/${w.id}`, color: colorMap[w.color] })),
  }

  const fileResultsData = {
    title: "Fichiers",
    items: histories
      .filter(h => h.type === "file")
      .map(h => files.find(f => f.id === h.originId && h.event === "update"))
      .filter(f => f !== undefined)
      .filter(f => {
        const q = query.toLowerCase()
        const isFoundByName = f.name.toLowerCase().includes(q)
        if (isFoundByName) return f
      })
      .slice(0, 5)
      .map(f => ({ ...f, link: `/workspaces/${f.workspaceId}/${f.id}/orders` })),
  }

  const workspaceLists = (
    <div className="cursor-pointer">
      <h2 className="pl-2 py-2 select-none">{workspaceResultsData.title}</h2>
      {workspaceResultsData.items.map(item => (
        <div
          key={item.id}
          className="flex gap-2 p-2 pr-2 hover:bg-black/10 rounded-xl transition items-center"
          onClick={() => handleClick(item.id ,item.name, item.link, "open", "workspace")}
        >
          <div className={`h-7 min-w-7 rounded-md ${item.color} shadow`} />
          <motion.p
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            className="truncate text-sm"
          >{item.name}</motion.p>
        </div>
      ))}
    </div>
  )

  const fileLists = (
    <div className="cursor-pointer">
      <h2 className="pl-2 py-2 select-none">{fileResultsData.title}</h2>
      {fileResultsData.items.map(item => (
        <div
          key={item.id}
          className="flex gap-2 p-2 pr-2 hover:bg-black/10 rounded-xl transition items-center"
          onClick={() => handleClick(item.id , item.name, item.link, "open", "file")}
        >
          <div className="h-7 min-w-7 bg-white/50 text-gray-700 rounded-md grid place-items-center">
            <File size={14} />
          </div>
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
          >
            <p className="truncate text-sm">{item.name}</p>
            <p className="truncate text-xs text-gray-500">{getWorkspaceName(item.workspaceId)}</p>
          </motion.div>
        </div>
      ))}
    </div>
  )

  const historyLists = (
    <div className="cursor-pointer">
      <h2 className="pl-2 py-2 select-none">Historique des recherches</h2>
      {histories
        .sort((a, b) => {
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        })
        .slice(0, 5)
        .map(item => (
        <div
          key={item.eventDate.toString()}
          className="flex gap-2 p-2 pr-2 hover:bg-black/10 rounded-xl transition items-center"
          onClick={() => handleClick(item.originId ,item.name, item.link, "open", "file")}
        >
          <div className="h-7 min-w-7 bg-white/50 text-gray-700 rounded-md grid place-items-center">
            {item.event === "open" ? <History size={14} /> : <Pencil size={14} />}
          </div>
          <motion.p
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            className="truncate text-sm flex-1"
          >{item.name}</motion.p>
          <p className="text-xs text-gray-500">{timeAgo(new Date(item.eventDate))}</p>
        </div>
      ))}
    </div>
  )

  const handleClick = (id: string, name: string, link: string, event: event, type: itemType, ) => {
    addToHistory(id , name, link, event, type)
    navigate(link)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value)
    setIsTyping(value !== "")
  }

  return (
    <motion.div
      initial={{ maxWidth: "5rem" }}
      animate={{ maxWidth: "28rem" }}
      transition={{
        duration: 1,
        ease: "anticipate"
      }}
      className="relative flex-1"
    >
      <div className={`flex px-2 py-1 border-2 gap-2 rounded-lg items-center text-gray-700 bg-white ${isTyping ? "border-cyan-300" : "border-gray-300"}`}>
        <input
          onChange={handleSearch}
          onClick={() => setIsTyping(true)}
          onBlur={() => setTimeout(() => setIsTyping(false), 200)}
          value={query}
          placeholder="Search ..."
          className='outline-none text-sm flex-1'
        />
        <span className="h-4 border border-gray-500"></span>
        <Search className="h-4 w-4"/>
      </div>
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ translateY: -10, opacity:0 }}
            animate={{ translateY: 0, opacity:1 }}
            exit={{ translateY: -10, opacity:0 }}
            className="absolute h-fit mt-2 w-full sm:w-md left-1/2 -translate-x-1/2 shadow-md rounded-2xl p-1 bg-white/20 backdrop-blur-md z-20 max-h-96 overflow-auto"
          >
            {query === "" && histories.length > 0 && historyLists}

            {workspaceResultsData.items.length > 0 && workspaceLists}

            {fileResultsData.items.length > 0 && fileLists}

            {workspaceResultsData.items.length === 0 && fileResultsData.items.length === 0 && (
              <div className="p-4 grid place-items-center ">
                <h2>No item found ...😅</h2>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SearchBar