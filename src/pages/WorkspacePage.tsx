import { useParams } from "react-router-dom";
import {FileIcon, Inbox} from "lucide-react";
import FileCard from "../components/ui/card/FileCard.tsx";
import { Helmet } from "react-helmet";
import { useModalStore } from "../components/ui/modals/store.ts";
import {useWorkspaceStore} from "../store/workspaceStore.ts";
import PageHeader from "../components/ui/PageHeader.tsx";
import {useFileStore} from "../store/fileStore.ts";
import {useMemo} from "react";

const WorkspacePage = () => {
  const { workspaceId } = useParams();
  const { showModal } = useModalStore();
  const workspaceName = useWorkspaceStore((state) => state.getWorkspaceName(workspaceId))

  const fs = useFileStore(state => state.files )
  
  const files = useMemo(
    () => fs.filter(f => f.workspaceId === workspaceId),
    [fs, workspaceId]
  )

  const { workspaces } = useWorkspaceStore()
  const workspaceColor = workspaces.find(w => w.id === workspaceId)?.color || "gray"

  return (
    <>
      <Helmet>
        <title>{workspaceName} | Auto-close</title>
      </Helmet>

      <div className="h-full p-5">
        <div className="w-full md:w-lg md:m-auto">
          <PageHeader
            color={workspaceColor}
            name={workspaceName}
            type="file"
            contentLength={files.length}
            icon={FileIcon}
          />
          <div className="flex flex-col gap-2 py-2">
            {files.length > 0 ? (
              files.map((file) => (
                <FileCard
                  key={file.id}
                  id={file.id}
                  name={file.name}
                  link={`/workspaces/${workspaceId}/${file.id}/orders`}
                />
              ))
            ) : (
              <div className="bg-gray-50 text-gray-400 flex flex-col gap-2 items-center p-2 rounded-lg select-none">
                <Inbox />
                Il n'y a pas de fichier
              </div>
            )}

            <button
              onClick={() => showModal(true, "fileCreation")}
              className="sticky bottom-2 bg-gray-100 text-sm font-semibold cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-black/10 hover:backdrop-blur-xs p-2 rounded-lg transition"
            >
              Ajouter un fichier
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkspacePage;
