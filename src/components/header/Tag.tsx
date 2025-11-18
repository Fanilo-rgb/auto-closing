import {useParams} from "react-router-dom";
import { useWorkspaceStore } from "../../store/workspaceStore";

const Tag = () => {
  const { workspaceId } = useParams();
  const workspaceName = useWorkspaceStore((state) => state.getWorkspaceName(workspaceId))

  if (!workspaceId) return null;

  return (
    <div className="hidden sm:flex gap-2 text-sm items-center">
      <div className="max-w-46 lg:max-w-60 xl:max-w-80 text-gray-600 cursor-pointer transition bg-transparent hover:bg-gray-100 px-2 rounded-sm truncate">
        {workspaceName}
      </div>
    </div>
  );
};

export default Tag
