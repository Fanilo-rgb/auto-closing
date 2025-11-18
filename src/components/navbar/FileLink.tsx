import {useState} from 'react'
import {Ellipsis, FileIcon} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";

type Props = {
  link: string
  name: string
}

const FileLink = ({link, name}: Props) => {
  const location = useLocation()
  const navigate = useNavigate()

  const [isHover, setIsHover] = useState(false)

  const active = location.pathname === link

  const handleClick = () => {
    navigate(link)
  }

  const iconStyle = `${active ? "text-gray-800" : "text-gray-500"} w-4 min-w-4`

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="relative cursor-pointer"
    >
      <div
        onClick={handleClick}
        className={`${active ? `${isHover ? "bg-black/20" : "bg-black/10"}` : `${isHover ? "bg-black/10" : "bg-transparent"}`} flex gap-2 p-1.5 rounded-xl items-center transition`}
      >
        <FileIcon className="ml-7 w-4 min-w-4 text-gray-500"/>
        <p className={`font-semibold ${active ? "text-gray-700" : "text-gray-600"} truncate mr-8 text-sm transition`}>{name}</p>
      </div>
      <button
        className={`${active ? "hover:bg-black/20" : "hover:bg-black/10"} transition absolute top-1.5 right-1.5 px-1 rounded-lg`}
      >
        <Ellipsis className={iconStyle}/>
      </button>
    </div>
  )
}
export default FileLink
