import {useLocation, useNavigate} from "react-router-dom";
import type {history} from "../../types/type.ts";
import {ChevronRight, Folder} from "lucide-react";
import {useState} from "react";
import {useFileStore} from "../../store/fileStore.ts";
import {useHistory} from "../../store/historyStore.ts";
import FileLink from "./FileLink.tsx";

type Props = history

const WorkspaceLink = ({originId , name, link}: Props) => {
  const [isHover, setIsHover] = useState(false)
  const [showList, setShowList] = useState(false)

  const [items, setItems] = useState<history[]>([])

  const fs = useFileStore(state => state.files )
  const hs = useHistory(state => state.histories)

  const location = useLocation()
  const navigate = useNavigate()

  const active = location.pathname === link

  const handleClick = () => {
    navigate(link)
  }

  const handleChevronClick = () => {
    setShowList(!showList)

    const files = fs.filter(f => f.workspaceId === originId)
    const list = hs
      .filter(h => files.find(f => f.id === h.originId))
      .map(h => ({ ...h, eventDate: new Date(h.eventDate) }))
      .sort((a, b) => {
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      })

    setItems(list)

  }

  const iconStyle = `${active ? "text-gray-800" : "text-gray-500"} w-4 min-w-4`

  return (
    <>
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative cursor-pointer"
      >
        <div
          onClick={handleClick}
          className={`${active ? `${isHover ? "bg-black/20" : "bg-black/10"}` : `${isHover ? "bg-black/10" : "bg-transparent"}`} flex gap-2 p-2 rounded-xl items-center transition`}
        >
          <p className={`font-semibold ${active ? "text-gray-700" : "text-gray-600"} truncate text-sm transition pl-7`}>{name}</p>
        </div>
        <button
          onClick={handleChevronClick}
          className={`${active ? "hover:bg-black/20" : "hover:bg-black/10"} ${showList && "rotate-90"} transition absolute top-1.5 left-1.5 px-1 rounded-lg`}
        >
          {isHover || showList ? <ChevronRight className={iconStyle}/> : <Folder className={iconStyle}/>}
        </button>
      </div>
      {showList &&
        <div className="my-1">
          {items.length > 0 && items.map(item => (
            <FileLink key={item.originId} link={item.link} name={item.name}/>
          ))}

          {items.length === 0 &&
            <div className="text-sm text-gray-400 font-semibold text-center">
              No file found 😥
            </div>
          }
        </div>
      }
    </>
  )
}
export default WorkspaceLink
