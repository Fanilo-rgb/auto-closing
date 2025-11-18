import type {history} from "../../types/type.ts";
import {useState} from "react";
import WorkspaceLink from "./WorkspaceLink.tsx";
import {AnimatePresence, motion} from "motion/react";

type Props = {
  title: string
  items: history[]
}

const LinkContainer = ({title, items}: Props) => {
  const [showList, setShowList] = useState(true)

  const handleClick = () => {
    setShowList(!showList)
  }

  return (
    <div className="w-full flex flex-col">
      <button
        onClick={handleClick}
        className="p-2 text-start text-xs font-semibold text-gray-400 hover:text-gray-600 hover:bg-black/10 rounded-xl transition"
      >
        {title}
      </button>
      <AnimatePresence>
        {showList &&
          <motion.div
            initial={{ opacity: 0.5, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            className="flex flex-col"
          >
            <div className="mt-1 flex flex-col">
              {items.length > 0 && (
                items.map((item) =>
                  <WorkspaceLink key={item.originId} originId={item.originId} name={item.name} link={item.link} type={item.type} eventDate={item.eventDate} event={item.event}/>
                )
              )}

              {items.length === 0 && (
                <button className="btn text-sm">
                  Creer une feuille
                </button>
              )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}
export default LinkContainer
