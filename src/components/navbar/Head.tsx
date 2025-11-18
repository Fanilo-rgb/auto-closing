import {PanelLeftClose} from "lucide-react";
import {useNavbarStore} from "../../store/tools/navbarStore.ts";

const Head = () => {
  const {isOpen, close} = useNavbarStore()

  const handleClick = () => {
    close()
  }

  return (
    <div className="h-8 py-1 pl-1 flex items-center">
      <div className="flex-1">
        <p className="font-bold uppercase truncate">Auto-close</p>
      </div>
      {isOpen && (
        <button
          onClick={handleClick}
          className="rounded-lg p-1 bg-transparent text-gray-500 hover:bg-gray-100"
        >
          <PanelLeftClose className="h-5 w-5"/>
        </button>
      )}
    </div>
  )
}
export default Head
