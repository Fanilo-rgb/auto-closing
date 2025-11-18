import {Ellipsis, Menu, PanelRightClose} from "lucide-react";
import SearchBar from "./SearchBar.tsx";
import Tag from "./Tag.tsx";
import {useState} from "react";
import {useNavbarStore} from "../../store/tools/navbarStore.ts";
import {useLocation, useParams} from "react-router-dom";
import {useHistory} from "../../store/historyStore.ts";
import {timeAgo} from "../../utils/dateUtils.ts";

const Header = () => {

  const { workspaceId } = useParams()
  const location = useLocation()

  const { histories } = useHistory()

  const [isHover, setIsHover] = useState(false)

  const { isOpen, open } = useNavbarStore()

  const isWorkspacePage = location.pathname === `/workspaces/${workspaceId}`

  const lastUpdate = histories.find(h => h.originId === workspaceId && h.event === "update" )?.eventDate || new Date()

  const handleMouseEnter = () => {
    setIsHover(true)
  }

  const handleMouseLeave = () => {
    setIsHover(false)
  }

  const handleClick = () => {
    open()
    setIsHover(false)
  }

  return (
    <div className="relative flex w-full p-1 px-2 gap-2 bg-transparent items-center z-50">
      <div className="flex gap-2 flex-1">
        {!isOpen && (
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className="rounded-lg p-1 bg-transparent text-gray-500 hover:bg-gray-100"
          >
            {isHover ? (<PanelRightClose className="h-5 w-5"/>) : (<Menu className="h-5 w-5"/>)}
          </button>
        )}
        <Tag/>
      </div>

      <div className="flex-2 flex items-center justify-center">
        <SearchBar/>
      </div>

      <div className="flex sm:flex-1 gap-2">
        {isWorkspacePage && <p className="ml-auto hidden lg:block text-gray-400 truncate">Derniere modification : {timeAgo(new Date(lastUpdate))}</p>        }

        <button className={`ml-auto ${isWorkspacePage && "lg:ml-0"} bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 px-2 rounded-lg transition`}>
          <Ellipsis size={18}/>
        </button>
      </div>
    </div>
  )
}
export default Header
