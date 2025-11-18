import {useApplicationStore} from "../store/applicationStore.ts";
import ApplicantItem from "../components/list/ApplicantItem.tsx";
import {Plus, Upload, UserRound} from "lucide-react";
import {useParams} from "react-router-dom";
import {useApplicationFormStore} from "../store/tools/applicationFormStore.ts";
import FormContainer from "../components/container/FormContainer.tsx";
import ApplicationForm from "../components/ui/form/ApplicationForm.tsx";
import {useMemo} from "react";
import {AnimatePresence} from "motion/react";

const ApplicationPage = () => {
  const form = useApplicationFormStore()
  const { applications } = useApplicationStore()
  const { fileId } = useParams()

  const data = applications.filter(a => a.fileId === fileId)

  const count = useMemo(
    () => data.length,
    [data]
  )

  const arValue = useMemo(
    () => count * 40_000,
    [count]
  )

  return (
    <>
      <div className="flex-1 flex flex-col gap-2">
        {data.length === 0 && (
          <div className="m-4">
            <div className="text-center bg-gray-50 rounded-2xl p-6">
              <h1>Aucune Adhesion</h1>
              <p className="text-sm text-gray-600 mt-2">
                Vous n’avez pas encore ajouté de personnes dans votre fichier.
              </p>
              <div className="mt-4 flex flex-col items-center gap-2">
                <h2 className="font-medium">Importer un fichier existant</h2>
                <label className="flex items-center gap-2 bg-black/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-black/20 transition text-gray-700">
                  <Upload size={16} />
                  <span>Choisir un fichier</span>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
            <div className="relative my-4">
              <span className="text-gray-500 bg-white absolute px-2 top-1/2 left-1/2 -translate-1/2">ou</span>
              <hr/>
            </div>
            <button
              onClick={() => form.open()}
              className="btn w-full flex items-center justify-center gap-2"
            >
              <Plus size={20}/>
              Ajouter une personne
            </button>
          </div>
        )}

        {data.length > 0 && (
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 bg-white/10 backdrop-blur-xs p-2 shadow">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="flex gap-1 items-center text-base">
                  <UserRound size={16}/> :
                  <span className="font-semibold">{count}</span>
                </span>
                <span>
                  Valeur Ar : <span className="font-semibold">{arValue.toLocaleString()} ar</span>
                </span>
              </div>
            </div>
            <div className="p-2">
              <div className="p-1 rounded-lg flex items-center gap-2 w-full bg-gray-50 text-sm">
                <p className="w-8 text-center text-gray-400 font-mono">no.</p>
                <p className="w-19 text-center text-gray-400">carte</p>
                <span className="border h-4 border-gray-300"></span>
                <p className="flex-1 text-gray-400">Details</p>
              </div>
            </div>
            <div className="divide-y divide-gray-300 p-2">
              <AnimatePresence>
                {data.map((d, i) => (
                  <ApplicantItem
                    key={i}
                    index={i}
                    personName={d.consultant.name}
                    personCard={d.consultant.numberCard}
                    phone={d.consultant.phone}
                    cin={d.consultant.cin}
                    upLineCard={d.upLine.numberCard}
                    upLineName={d.upLine.name}
                    sponsorCard={d.sponsor.numberCard}
                    sponsorName={d.sponsor.name}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="flex sticky bottom-0 bg-white/10 backdrop-blur-xs">
              <button
                onClick={() => form.open()}
                className="flex-1 bg-gray-100 text-sm font-semibold cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-black/10 m-2 p-2 rounded-lg transition">
                Ajouter une personne
              </button>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {form.isOpen && (
          <FormContainer>
            <ApplicationForm/>
          </FormContainer>
        )}
      </AnimatePresence>
    </>
  )
}
export default ApplicationPage
