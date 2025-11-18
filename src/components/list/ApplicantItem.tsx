import {ChevronDown, Trash} from "lucide-react";
import {useState} from "react";
import {useModalStore} from "../ui/modals/store.ts";
import {useApplicationToDeleteStore} from "../../store/modification/applicationToDeleteStore.ts";
import ApplicationDetails from "../ui/form/ApplicationDetails.tsx";
import {AnimatePresence, motion} from "motion/react";
import {formatNumber} from "../../utils/formatter.ts";

type Props = {
  index: number
  personCard: string
  personName: string
  phone: string
  cin: string
  upLineCard: string
  upLineName: string
  sponsorCard: string
  sponsorName: string
}

const ApplicantItem = (
  {
    personName, personCard, phone, cin, upLineCard, upLineName, sponsorCard, sponsorName, index
  } : Props) => {

  const [showDetails, setShowDetails] = useState(false)
  const { showModal } = useModalStore()
  const { setData } = useApplicationToDeleteStore()
  const [isOver, setIsOver] = useState(false)

  const handleConfirmationDelete = () => {
    setData({ name: personName, numberCard: personCard })
    showModal(true, "deleteApplication")
  }

  return (
    <motion.div
      initial={{ opacity:0, translateY:-10 }}
      animate={{ opacity:1, translateY:0 }}
      exit={{ opacity:0, translateX:-100 }}
      onMouseEnter={() => setIsOver(true)}
      onMouseLeave={() => setIsOver(false)}
      className={` hover:bg-cyan-100 transition ${showDetails ? "bg-cyan-100" : "bg-white even:bg-gray-50"}`}
    >

      <div className="flex items-center py-2 text-gray-700 gap-2 text-sm">
        <span className="bg-cyan-100 h-6 min-w-10 grid place-items-center rounded-md text-xs">
          {index + 1}
        </span>

        <p>{formatNumber(personCard, [2, 2, 2, 2])}</p>
        <span className="border h-4 border-gray-300"></span>
        <p className="w-18 flex-3 truncate">{personName}</p>

        <span className="hidden sm:block border h-4 border-gray-300"></span>

        <p className="hidden sm:block min-w-22 truncate">{formatNumber(phone, [3, 2, 3, 2])}</p>
        <span className="hidden sm:block border h-4 border-gray-300"></span>
        <p className="hidden sm:block min-w-26 truncate">{formatNumber(cin, [3, 3, 3, 3])}</p>

        <span className="hidden lg:block border h-4 border-gray-300"></span>

        <p className="hidden lg:block">{formatNumber(upLineCard, [2, 2, 2, 2])}</p>
        <span className="hidden lg:block border h-4 border-gray-300"></span>
        <p className="hidden lg:block truncate w-16 flex-2">{upLineName}</p>

        <span className="hidden lg:block border h-4 border-gray-300"></span>

        <p className="hidden lg:block">{formatNumber(sponsorCard, [2, 2, 2, 2])}</p>
        <span className="hidden lg:block border h-4 border-gray-300"></span>
        <p className="hidden lg:block truncate w-16 flex-2">{sponsorName}</p>

        <div className="flex">
          <AnimatePresence>
            {(isOver || showDetails) &&
              <motion.button
                initial={{ minWidth:0, width:0 }}
                animate={{ width:26 }}
                exit={{ width:0, minWidth:0 }}
                onClick={handleConfirmationDelete}
                className="bg-red-100 overflow-hidden hover:bg-red-200 text-red-400 hover-red-700 w-6 h-6 grid place-items-center rounded-lg"
              >
                <Trash size={14}/>
              </motion.button>
            }
          </AnimatePresence>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`mx-2 transition hover:bg-black/10 p-1 rounded-md ${showDetails && "rotate-180"} ${isOver ? "opacity-100" : "opacity-0"}`}
          >
            <ChevronDown size={16}/>
          </button>
        </div>
      </div>

      {showDetails && (
        <ApplicationDetails
          personName={personName}
          personCard={personCard}
          phone={phone}
          cin={cin}
          upLineCard={upLineCard}
          upLineName={upLineName}
          sponsorCard={sponsorCard}
          sponsorName={sponsorName}
          index={index}
        />
      )}
    </motion.div>
  )
}
export default ApplicantItem
