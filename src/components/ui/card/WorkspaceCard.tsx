import type { workspace } from "../../../types/type.ts";
import {useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {Archive, Ellipsis, Pencil, Share, Trash} from "lucide-react";
import OptionMenuContainer from "../menu/OptionMenuContainer.tsx";
import {useNavigate} from "react-router-dom";
import {useWorkspaceStore} from "../../../store/workspaceStore.ts";
import {useWorkspaceToModifyStore} from "../../../store/modification/workspaceToModifyStore.ts";
import {useModalStore} from "../modals/store.ts";

type Props = workspace & {
  link: string;
  index: number;
}

const WorkspaceCard = (data: Props) => {
  const [isHover, setIsHover] = useState(false)
  const [showOption, setShowOption] = useState(false)

  const { workspaces } = useWorkspaceStore()
  const { setWorkspace } = useWorkspaceToModifyStore()
  const { showModal } = useModalStore()

  const navigate = useNavigate()

  const colorMap: Record<string, string> = {
    red: "bg-gradient-to-br from-rose-300 to-red-400",
    blue: "bg-gradient-to-br from-cyan-400 to-blue-500",
    green: "bg-gradient-to-br from-lime-300 to-green-400",
    yellow: "bg-gradient-to-br from-amber-200 to-yellow-400",
    purple: "bg-gradient-to-br from-indigo-300 to-purple-500",
    gray: "bg-gradient-to-br from-gray-300 to-gray-400",
    cyan: "bg-gradient-to-br from-emerald-300 to-cyan-400",
    pink: "bg-gradient-to-br from-rose-400 to-pink-400",
    orange: "bg-gradient-to-br from-red-300 to-orange-400"
  };

  const shadowMap: Record<string, string> = {
    red: "shadow-red-300",
    blue: "shadow-blue-300",
    green: "shadow-green-300",
    yellow: "shadow-yellow-300",
    purple: "shadow-purple-300",
    gray: "shadow-gray-300",
    cyan: "shadow-cyan-300",
    pink: "shadow-pink-300",
    orange: "shadow-orange-300"
  };

  const borderMap: Record<string, string> = {
    red: "border-red-200",
    blue: "border-blue-200",
    green: "border-green-200",
    yellow: "border-yellow-200",
    purple: "border-purple-200",
    gray: "border-gray-200",
    cyan: "border-cyan-200",
    pink: "border-pink-200",
    orange: "border-orange-200"
  };

  const color = data.color && colorMap[data.color] ? colorMap[data.color] : "bg-white";
  const shadow = data.color && shadowMap[data.color] ? shadowMap[data.color] : ""
  const border = data.color && borderMap[data.color] ? borderMap[data.color] : "border-gray-200"

  const handleClick = () => {
    navigate(data.link)
  }

  const handleConfirmationDelete = () => {
    const workspace = workspaces.find(w => w.id === data.id)

    if (!workspace) return

    setWorkspace(workspace)
    showModal(true, "deleteWorkspace")
  }

  return (
    <motion.div
      initial={{ translateY: -10, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ delay: data.index * 0.1 }}
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        onClick={handleClick}
      >
        <div className={`h-26 flex flex-col border rounded-xl overflow-hidden ${isHover && "-translate-y-1 shadow-md"} transition ${shadow} ${border}`}>
          <div className={`flex-1 ${color} transition-colors`} />
          <div className={`p-2 ${isHover && "pr-12"} text-sm text-gray-700 truncate`}>
            {data.name}
          </div>
        </div>
      </div>
      <button
        onClick={() => setShowOption(!showOption)}
        onBlur={() =>  setTimeout(() => setShowOption(false), 100) }
        className={`${isHover ? "opacity-100" : "opacity-0"} absolute bottom-2.5 right-1.5 bg-transparent hover:bg-gray-200 p-1 rounded-lg transition text-gray-500`}
      >
        <Ellipsis size={16}/>
      </button>
      <AnimatePresence>
        {showOption && (
          <OptionMenuContainer top="top-26">
            <button
              className="optionMenuBtn"
            >
              Modifier
              <Pencil size={14}/>
            </button>
            <button className="optionMenuBtn">
              Partager
              <Share size={14}/>
            </button>
            <hr className="my-1 border-gray-200"/>
            <button className="optionMenuBtn">
              Archiver
              <Archive size={14}/>
            </button>
            <button
              onClick={handleConfirmationDelete}
              className="optionMenuBtn text-red-400 hover:bg-red-100"
            >
              Supprimer
              <Trash size={14}/>
            </button>
          </OptionMenuContainer>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default WorkspaceCard;
