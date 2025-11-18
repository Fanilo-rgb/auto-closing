import Wrapper from "./Wrapper.tsx";
import {useModalStore} from "./store.ts";
import ModalBody from "./ModalBody.tsx";
import WorkspaceCreationForm from "../form/WorkspaceCreationForm.tsx";
import FileCreationForm from "../form/FileCreationForm.tsx";
import DeleteFile from "../../delete/deleteFile.tsx";
import DeleteApplication from "../../delete/deleteApplication.tsx";
import DeleteBv from "../../delete/deleteBv.tsx";
import FileUpdateForm from "../form/FileUpdateForm.tsx";
import DeleteWorkspace from "../../delete/deleteWorkspace.tsx";

const Modal = () => {
  const { show } = useModalStore()

  return (
    <Wrapper>
      {show.type === "workspaceCreation" && (
        <ModalBody
          title="Creer un workspace"
          component={<WorkspaceCreationForm/>}
        />
      )}
      {show.type === "fileCreation" && (
        <ModalBody
          title="Creer un fichier"
          component={<FileCreationForm/>}
        />
      )}
      {show.type === "deleteFile" && (
        <ModalBody
          title="Supprimer le fichier"
          component={<DeleteFile/>}
        />
      )}
      {show.type === "deleteApplication" && (
        <ModalBody
          title="Supprimer un adhesion"
          component={<DeleteApplication/>}
        />
      )}

      {show.type === "deleteBv" && (
        <ModalBody
          title="Supprimer un Bv"
          component={<DeleteBv/>}
        />
      )}

      {show.type === "modifyFileName" && (
        <ModalBody
          title="Modifier le nom du fichier"
          component={<FileUpdateForm/>}
        />
      )}

      {show.type === "deleteWorkspace" && (
        <ModalBody
          title="Supprimer un workspace"
          component={<DeleteWorkspace/>}
        />
      )}

      {show.type === "default" && (
        <div>
          default
        </div>
      )}
    </Wrapper>
  )
}

export default Modal
