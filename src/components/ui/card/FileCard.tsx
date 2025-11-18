import {useNavigate} from "react-router-dom";
import {Archive, CircleDollarSign, Ellipsis, Info, Pencil, Share, Trash, UsersRound} from "lucide-react";
import {useMemo, useRef, useState} from "react";
import {useModalStore} from "../modals/store.ts";
import {useBvStore} from "../../../store/orderStore.ts";
import {useApplicationStore} from "../../../store/applicationStore.ts";
import {AnimatePresence, motion} from "motion/react";
import {useFileToModifyStore} from "../../../store/modification/fileToModifyStore.ts";
import OptionMenuContainer from "../menu/OptionMenuContainer.tsx";
import {useFileStore} from "../../../store/fileStore.ts";

type Props = {
  id: string;
  name: string;
  link: string;
};

const FileCard = ({ id, name, link }: Props) => {
  const [isOver, setIsOver] = useState(false)
  const { showModal } = useModalStore()
  const { bvs } = useBvStore()
  const { applications } = useApplicationStore()
  const { setFile } = useFileToModifyStore()
  const [showOption, setShowOption] = useState(false)
  const { files, updateFile } = useFileStore()
  const navigate = useNavigate()

  const timerRef = useRef<number | null>(null);

  const handleMouseDown = () => {
    timerRef.current = window.setTimeout(() => {
      alert("Clic prolongé détecté !");
    }, 800);
  };

  const handleMouseUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsOver(false)
  };

  const handleConfirmationDelete = () => {
    const f = files.find(f => f.id === id)
    if (!f) return;
    setFile(f)
    showModal(true, "deleteFile")
  }

  const handleFileUpdateConfirmation = () => {
    const f = files.find(f => f.id === id)
    if (!f) return;
    setFile(f)
    showModal(true, "modifyFileName")
  }

  const totalBv = useMemo(
    () => bvs.filter(bv => bv.fileId === id).flatMap(bv => bv.products).reduce((acc, p) => acc + p.bv * p.quantity, 0),
    [bvs, id]
  )

  const count = useMemo(
    () => applications.filter(a => a.fileId === id).length,
    [applications, id]
  )

  const handleFileClicked = () => {
    const file = files.find(f => f.id === id)

    if (!file) return

    navigate(link)
    updateFile(id, { ...file, lastOpenedAt: new Date() })
  }

  return (
    <motion.div
      initial={{ opacity:0, translateY: -10 }}
      animate={{ opacity:1, translateY: 0 }}
      onMouseEnter={() => setIsOver(true)}
      onMouseLeave={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className="relative flex items-center justify-between p-4 border border-gray-200 rounded-2xl outline-2 outline-transparent hover:outline-gray-300 transition bg-white"
    >
      <div onClick={handleFileClicked} className="flex-1 truncate mr-4 cursor-pointer">
        <p className="truncate text-base font-semibold text-gray-800 hover:text-blue-600 hover:underline">
          {name}
        </p>
      </div>
      <div className="text-sm text-gray-500 flex">
        <div className="flex gap-2 pr-2">
          <div className="flex items-center gap-2 cursor-default">
            <CircleDollarSign className="h-4 w-4"/>
            <span className="text-sm font-medium text-gray-600 w-12 text-center">{totalBv.toLocaleString()}</span>
          </div>

          <span className="border border-gray-500 transition mr-2"></span>

          <div className="flex items-center gap-2 cursor-default">
            <UsersRound className="h-4 w-4"/>
            <span className="text-sm font-medium text-gray-600 w-10 text-center">{count}</span>
          </div>
        </div>

        <button
          onClick={() => setShowOption(!showOption)}
          onBlur={() =>  setTimeout(() => setShowOption(false), 100) }
          className={`utilsBtn bg-transparent hover:bg-gray-200 ${isOver ? "opacity-100" : "opacity-0"} `}
        >
          <Ellipsis className="h-4"/>
        </button>
        <AnimatePresence>
          {showOption && (
            <OptionMenuContainer top="top-16">
              <button className="optionMenuBtn bg-gray-800 text-white hover:bg-gray-700 transition">
                Convertir
              </button>
              <button
                onClick={handleFileUpdateConfirmation}
                className="optionMenuBtn"
              >
                Renommer
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
              <hr className="my-1 border-gray-200"/>
              <button className="optionMenuBtn">
                Info
                <Info size={14}/>
              </button>
            </OptionMenuContainer>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FileCard;
