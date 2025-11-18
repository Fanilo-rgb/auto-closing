import {Link, Outlet, useLocation, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useFileStore} from "../store/fileStore.ts";
import {useWorkspaceStore} from "../store/workspaceStore.ts";
import {ClipboardList, Wallet} from "lucide-react";
import { motion } from "motion/react";

const WorkspaceLayout = () => {
  const {workspaceId, fileId} = useParams()
  const location = useLocation()

  const workspaceName = useWorkspaceStore(state => state.getWorkspaceName(workspaceId))
  const fileName = useFileStore(state => state.getFileName(fileId))

  const orderLink = `/workspaces/${workspaceId}/${fileId}/orders`
  const applicationLink = `/workspaces/${workspaceId}/${fileId}/applications`

  return (
    <>
      <Helmet>
        <title>{fileName} - {workspaceName}</title>
      </Helmet>

      <div className="h-full flex overflow-hidden">
        <div className="relative flex-1">
          <div className="flex flex-col h-full">
            <div className="relative flex-1">
              <div className="absolute top-0 bottom-0 left-0 right-0">
                <div className="relative h-full overflow-y-auto flex">
                  <Outlet/>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, translateY: 100 }}
              animate={{ opacity:1, translateY: 0 }}
              className="m-2 sm:m-4 flex border rounded-2xl overflow-hidden border-gray-300 divide-x divide-gray-300 text-sm text-gray-700"
            >
              <Link to={orderLink} className={`flex items-center justify-center gap-2 flex-1 p-2 ${location.pathname === orderLink ? "bg-blue-50 border-b-2 border-b-blue-500" : "hover:bg-blue-50"}`}>
                <Wallet size={20}/>
                Order summary
              </Link>
              <Link to={applicationLink} className={`flex items-center justify-center gap-2 flex-1 p-2 ${location.pathname === applicationLink ? "bg-blue-50 border-b-2 border-b-blue-500" : "hover:bg-blue-50"}`}>
                <ClipboardList size={20}/>
                Application summary
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkspaceLayout
