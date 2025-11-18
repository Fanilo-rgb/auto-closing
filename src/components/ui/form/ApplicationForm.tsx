import React, {useMemo, useState} from "react"
import {useParams} from "react-router-dom";
import {useApplicationStore} from "../../../store/applicationStore.ts";
import {useApplicationFormStore} from "../../../store/tools/applicationFormStore.ts";
import useMediaQuery from "../../../hooks/useMediaQuery.tsx"
import type { bv } from "../../../types/type.ts"
import {useBvStore} from "../../../store/orderStore.ts";
import {Clipboard} from "lucide-react";
import {formatCin, formatNumberCard, formatPhone} from "../../../utils/formatter.ts";

const ApplicationForm = () => {
  const { fileId } = useParams()
  const [person, setPerson] = useState({ numberCard: "", name: "", phone: "", cin: "" })
  const [upLine, setUpLine] = useState({ numberCard: "", name: "" })
  const [placement, setPlacement] = useState({ numberCard: "", name: "" })
  const [suggestion, setSuggestion] = useState<{ name: string;numberCard: string } | null>(null)
  const [placementSuggestion, setPlacementSuggestion] = useState<{ name: string; numberCard: string } | null>(null)
  const { addApplication, applications } = useApplicationStore()
  const { addBv, bvs } = useBvStore()
  const form = useApplicationFormStore()
  const isSmallScreen = useMediaQuery("sm")
  const isMidScreen = useMediaQuery("md")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const personCard = person.numberCard.replace(/\s/g, "")
    const upLineCard = upLine.numberCard.replace(/\s/g, "")
    const placementCard = placement.numberCard.replace(/\s/g, "")

    if (!personCard || !person.name || !upLineCard || !upLine.name || !placementCard || !placement.name) {
      alert("Tous les champs doivent être remplis")
      return
    }

    if (personCard === upLineCard || personCard === placementCard) {
      alert("Le numéro de carte de la nouvelle personne doit être différent de celui de l'upline et du placement")
      return
    }

    if (!fileId) return

    const data = {
      fileId: fileId,
      consultant: { numberCard: personCard, name: person.name, phone: person.phone.replace(/\s/g, ""), cin: person.cin.replace(/\s/g, "")},
      upLine: { name: upLine.name, numberCard: upLineCard },
      sponsor: { name: placement.name, numberCard: placementCard }
    }

    const bv: bv = {
      fileId: data.fileId,
      holder: {
        name: data.consultant.name,
        numberCard: data.consultant.numberCard,
      },
      products: []
    }

    addApplication(data)
    addBv(bv)

    if (!isSmallScreen || !isMidScreen ) form.close()

    setPerson({ numberCard: "", name: "", phone: "", cin: "" })
    setUpLine({ numberCard: "", name: "" })
    setPlacement({ numberCard: "", name: "" })
  }

  const allUsers = useMemo(() => {
    const tab1 = bvs.map(bv => ({
      name: bv.holder.name,
      numberCard: bv.holder.numberCard
    }))

    const tab2 = applications.map(application => ({
      name: application.consultant.name,
      numberCard: application.consultant.numberCard
    }))

    const tab3 = applications.map(application => ({
      name: application.upLine.name,
      numberCard: application.upLine.numberCard
    }))

    const tab4 = applications.map(application => ({
      name: application.sponsor.name,
      numberCard: application.sponsor.numberCard
    }))

    const allTab = [...tab1, ...tab2, ...tab3, ...tab4]
    return Array.from(
      new Map(allTab.map(person => [person.numberCard, person])).values()
    )
  }, [bvs, applications])

  const handleUpLineChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
    const input = e.target.value

    setUpLine({ ...upLine, numberCard: formatNumberCard(input) })

    if (input.length > 0) {
      const match = allUsers.find((u) =>
        u.numberCard.startsWith(input.replace(/\s/g, ""))
      )
      setSuggestion(match && match.numberCard !== input ? match : null)
    } else {
      setSuggestion(null)
    }
  }

  const handlePlacementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value

    setPlacement({ ...placement, numberCard: formatNumberCard(input) })

    if (input.length > 0) {
      const match = allUsers.find((u) =>
        u.numberCard.startsWith(input.replace(/\s/g, ""))
      )
      setPlacementSuggestion(match && match.numberCard !== input ? match : null)
    } else {
      setPlacementSuggestion(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>)=> {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault()
      setUpLine({ name: suggestion.name, numberCard: formatNumberCard(suggestion.numberCard) })
      setSuggestion(null)
    }
  }

  const handlePlacementKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && placementSuggestion) {
      e.preventDefault()
      setPlacement({
        name: placementSuggestion.name,
        numberCard: formatNumberCard(placementSuggestion.numberCard)
      })
      setPlacementSuggestion(null)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-2 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-center text-lg">Nouvelle personne</h2>
        <input
          type="text"
          value={person.numberCard}
          onChange={(e) => setPerson({ ...person, numberCard: formatNumberCard(e.target.value) })}
          placeholder="Numero carte"
        />
        <input
          type="text"
          value={person.name}
          onChange={(e) => setPerson({ ...person, name: e.target.value })}
          placeholder="Nom complet"
        />
        <input
          type="text"
          value={person.phone}
          onChange={(e) => setPerson({ ...person, phone: formatPhone(e.target.value) })}
          placeholder="Phone (xxx xx xxx xx)"
        />
        <input
          type="text"
          value={person.cin}
          onChange={(e) => setPerson({ ...person, cin: formatCin(e.target.value) })}
          placeholder="CIN (xxx xxx xxx xxx)"
        />
      </div>

      <hr />

      <div className="flex flex-col gap-2">
        <div className="relative">
          <h2 className="text-center text-lg">Up line</h2>
          <div
            onClick={() => {
              setPlacement({ ...placement, numberCard: upLine.numberCard, name: upLine.name })
            }}
            className="cursor-pointer absolute top-0 right-2 bg-gray-200 hover:bg-gray-300 p-1 text-gray-700 rounded-lg"
          >
            <Clipboard size={18}/>
          </div>
        </div>
        <div className="relative w-full">
          <input
            type="text"
            disabled
            className="absolute top-0 left-0 w-full pointer-events-none text-gray-400"
            value={formatNumberCard(suggestion?.numberCard || "")}
          />

          <input
            type="text"
            value={upLine.numberCard}
            onChange={handleUpLineChange}
            onKeyDown={handleKeyDown}
            placeholder="Numero carte"
            className="w-full relative"
          />
        </div>

        <input
          type="text"
          value={upLine.name}
          onChange={(e) => setUpLine({ ...upLine, name: e.target.value })}
          placeholder={suggestion && suggestion.name || "Nom complet" }
        />
      </div>

      <hr />

      <div className="flex flex-col gap-2">
        <h2 className="text-center text-lg">Placement</h2>

        <div className="relative w-full">
          <input
            type="text"
            disabled
            className="absolute top-0 left-0 w-full pointer-events-none text-gray-400"
            value={formatNumberCard(placementSuggestion?.numberCard || "")}
          />

          <input
            type="text"
            value={placement.numberCard}
            onChange={handlePlacementChange}
            onKeyDown={handlePlacementKeyDown}
            placeholder="Numero carte"
            className="w-full relative"
          />
        </div>

        <input
          type="text"
          value={placement.name}
          onChange={(e) => setPlacement({ ...placement, name: e.target.value })}
          placeholder={placementSuggestion?.name || "Nom complet"}
        />
      </div>

      <button
        type="submit"
        className="hover:bg-gray-700 bg-gray-800 text-white p-1 rounded-lg transition"
      >
        Enregistrer
      </button>
    </form>
  )
}

export default ApplicationForm
