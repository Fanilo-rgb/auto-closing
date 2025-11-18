import {type FormEvent, useState} from "react";
import {useModalStore} from "../modals/store.ts";
import ColorSelector from "../card/ColorSelector.tsx";
import {useNavigate} from "react-router-dom";
import {createWorkspace} from "../../../utils/functionUtils.ts";

const WorkspaceCreationForm = () => {
  const colors = [
    { color: "red", className: "bg-gradient-to-br from-rose-300 to-red-400 shadow-red-500" },
    { color: "blue", className: "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-blue-500" },
    { color: "green", className: "bg-gradient-to-br from-lime-300 to-green-400 shadow-green-500" },
    { color: "yellow", className: "bg-gradient-to-br from-amber-200 to-yellow-400 shadow-yellow-500" },
    { color: "purple", className: "bg-gradient-to-br from-indigo-300 to-purple-500 shadow-purple-500" },
    { color: "gray", className: "bg-gradient-to-br from-gray-300 to-gray-400 shadow-gray-500" },
    { color: "cyan", className: "bg-gradient-to-br from-emerald-300 to-cyan-400 shadow-cyan-500" },
    { color: "pink", className: "bg-gradient-to-br from-rose-400 to-pink-400 shadow-pink-500" },
    { color: "orange", className: "bg-gradient-to-br from-red-300 to-orange-400 shadow-orange-500" }
  ]

  const {showModal} = useModalStore()

  const navigate = useNavigate()

  const [name, setName] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return alert("Veuillez entrer un nom de workspace");

    const link = createWorkspace({ name :name.trim(), color: color.trim() || "gray"})

    setName("");
    setColor("");
    showModal(false, "default")

    navigate(link)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom du workspace"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p className="pl-1 text-gray-400 text-sm font-semibold">Choisissez une couleur</p>
      <div className="grid grid-cols-9 gap-2">
        {colors.map(c => (
          <ColorSelector
            key={c.color}
            value={c.color}
            selectedColor={color}
            setColor={setColor}
            className={c.className}
          />
        ))}
      </div>

      <input
        type="submit"
        value="Créer"
      />
    </form>
  );
};

export default WorkspaceCreationForm;
