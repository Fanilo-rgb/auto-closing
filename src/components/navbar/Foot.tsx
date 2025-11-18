import {useLocation} from "react-router-dom";
import {Info} from "lucide-react";

const Foot = () => {
  const location = useLocation()

  const isMainPage = location.pathname === "/"

  return (
    <div className={`h-10 flex items-center justify-between ${isMainPage? "mb-4 pl-1" : ""} `}>
      Foot
      <button className="utilsBtn">
        <Info size={16}/>
      </button>
    </div>
  )
}
export default Foot
