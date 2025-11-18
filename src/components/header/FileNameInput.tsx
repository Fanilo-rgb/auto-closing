import {useEffect, useRef, useState} from "react";
import {useFileStore} from "../../store/fileStore.ts";

type fileNameComponentProps = {
  name: string;
  id: string | undefined
}

const FileNameInput = ({ name, id }: fileNameComponentProps) => {
  const [fileName, setFileName] = useState(name)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState(0)
  const { updateFile, files } = useFileStore.getState()

  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth)
    }
  }, [fileName])

  const handleSave = () => {
    if (fileName.trim() === "") setFileName(name)

    const file = files.find(f => f.id === id)

    if (!file) return

    if (fileName.trim() !== "" && id) {
      updateFile(id, { ...file, name: fileName})
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
      (e.target as HTMLInputElement).blur();
    }

    if (e.key === "Escape") {
      setFileName(name);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="relative inline-block">
      <span
        ref={spanRef}
        className="absolute opacity-0 whitespace-pre font-medium text-base px-1 -z-10"
      >
        {fileName}
      </span>
      <input
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        type="text"
        style={{ width }}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="outline-2 outline-transparent px-1 rounded font-medium text-gray-700 hover:bg-gray-100 text-base z-20 focus:outline-gray-400"
      />
    </div>
  )
}

export default FileNameInput
