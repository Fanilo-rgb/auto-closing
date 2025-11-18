import { Plus } from "lucide-react";
import React, { useState } from "react";

const DistForm = () => {
  const [numberCard, setNumberCard] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ numberCard?: string; name?: string }>(
    {}
  );

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // seulement chiffres
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/(\d{2})(?=\d)/g, "$1 "); // ajout des espaces
    setNumberCard(value);
  };

  const handleSubmit = () => {
    const newErrors: { numberCard?: string; name?: string } = {};
    const rawNumber = numberCard.replace(/\s/g, ""); // sans espaces

    if (!name.trim()) {
      newErrors.name = "Le nom est obligatoire.";
    }

    if (rawNumber.length !== 8) {
      newErrors.numberCard = "Le N° Carte doit contenir exactement 8 chiffres.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.warn("⚠️ Formulaire invalide :", newErrors);
      return;
    }

    console.log({
      numberCard: rawNumber,
      name,
    });

    setNumberCard("");
    setName("");
    setErrors({});
  };

  const clearError = (field: "numberCard" | "name") => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <div className="sticky top-0 bg-black/10 flex items-start p-2 backdrop-blur-xs gap-2 text-gray-700">
      <div className="relative flex flex-col">
        <input
          value={numberCard}
          onChange={handleNumberChange}
          onFocus={() => clearError("numberCard")}
          className={`font-mono w-32 text-center tracking-wider outline-2 focus:outline-gray-500 bg-white p-2 rounded-lg transition ${
            errors.numberCard ? "outline-red-300" : "outline-transparent"
          }`}
          placeholder="N° Carte"
          maxLength={11}
        />
        {errors.numberCard && (
          <span className="absolute bg-amber-50 top-full mt-2 left-0 text-xs rounded-md p-2 w-40 border-2 border-red-300 text-red-500">
            {errors.numberCard}
          </span>
        )}
      </div>

      <div className="relative flex flex-col flex-1">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => clearError("name")}
          className={`outline-2 focus:outline-gray-500 bg-white p-2 rounded-lg pl-2 transition ${
            errors.name ? "outline-red-300" : "outline-transparent"
          }`}
          placeholder="Nom complet"
        />
        {errors.name && (
          <span className="absolute bg-amber-50 top-full mt-2 right-0 text-xs rounded-md p-2 border-2 border-red-300 text-red-500">
            {errors.name}
          </span>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-white h-8 w-8 rounded-lg grid place-items-center hover:bg-gray-100 transition mt-1"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
export default DistForm;
