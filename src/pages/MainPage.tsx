import { BriefcaseBusiness } from "lucide-react";
import WorkspaceCard from "../components/ui/card/WorkspaceCard.tsx";
import {useWorkspaceStore} from "../store/workspaceStore.ts";
import { Helmet } from "react-helmet"
import {useModalStore} from "../components/ui/modals/store.ts";
import {useNavbarStore} from "../store/tools/navbarStore.ts";
import PageHeader from "../components/ui/PageHeader.tsx";

const MainPage = () => {
  const { workspaces } = useWorkspaceStore()
  const { showModal } = useModalStore()

  const navbar = useNavbarStore()

  return (
    <>
      <Helmet>
        <title>Home | Auto-close</title>
      </Helmet>

      <div className={`h-full w-full ${navbar.isOpen ? "md:w-full md:max-w-xl lg:w-full lg:max-w-4xl" : "md:w-2xl lg:w-4xl"} p-5 m-auto`}>
        <PageHeader
          name="Espace de travail Auto-close"
          type="workspace"
          contentLength={workspaces.length}
          icon={BriefcaseBusiness}
        />

        <div className="py-4 px-2">
          <div className={`grid ${navbar.isOpen ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}  lg:grid-cols-4 gap-4`}>
            {workspaces && workspaces.map((workspace, index) => {
              const link = `/workspaces/${workspace.id}`
              return(
                <WorkspaceCard key={workspace.id} index={index} id={workspace.id} name={workspace.name} color={workspace.color} link={link}/>
              )
            })}
            <button
              onClick={() => showModal(true, "workspaceCreation")}
              className="bg-black/10 h-26 grid place-items-center border-2 border-transparent text-gray-600 cursor-pointer text-sm rounded-xl hover:border-gray-300 transition">
              Créer un workspace
            </button>
          </div>
        </div>
      </div>
    </>

  )
}

export default MainPage
