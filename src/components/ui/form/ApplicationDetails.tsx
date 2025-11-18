import {UserPlus, Users} from "lucide-react"
import {useEffect, useState } from "react"
import {useApplicationStore} from "../../../store/applicationStore.ts";
import {useParams} from "react-router-dom";
import type {application} from "../../../types/type.ts";
import {useBvStore} from "../../../store/orderStore.ts";

type Props = {
  index: number
  personCard: string
  personName: string
  phone: string
  cin: string
  upLineCard: string
  upLineName: string
  sponsorCard: string
  sponsorName: string
}

const ApplicationDetails = (
  {
    personName, personCard, phone, cin, upLineCard, upLineName, sponsorCard, sponsorName
  }: Props) => {
  const initialData = {
    personName,
    personCard,
    phone,
    cin,
    upLineCard,
    upLineName,
    sponsorCard,
    sponsorName,
  };

  const [formData, setFormData] = useState(initialData);
  const [isChanged, setIsChanged] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { updateApplication } = useApplicationStore()
  const { updateBvHolderDetails } = useBvStore()
  const { fileId } = useParams()

  useEffect(() => {
    setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialData));
  }, [formData]);

  const validate = (field: keyof typeof formData, value: string) => {
    let error = "";

    if (["personCard", "uplineCard", "sponsorCard"].includes(field)) {
      if (!/^\d{8}$/.test(value)) error = "Doit contenir exactement 8 chiffres.";
    }

    if (field === "cin" && value && !/^\d{12}$/.test(value)) {
      error = "Doit contenir exactement 12 chiffres.";
    }

    if (field === "phone" && value && !/^\d+$/.test(value)) {
      error = "Doit contenir uniquement des chiffres.";
    }

    if (
      ["personName", "uplineName", "sponsorName"].includes(field) &&
      !value.trim()
    ) {
      error = "Ce champ est obligatoire.";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    if (
      ["personCard", "uplineCard", "sponsorCard"].includes(field) &&
      !/^\d{0,8}$/.test(value)
    )
      return;

    if (field === "cin" && !/^\d{0,12}$/.test(value)) return;
    if (field === "phone" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [field]: value }));
    validate(field, value);
  };

  const handleSave = () => {
    let hasError = false;
    Object.entries(formData).forEach(([key, value]) => {
      validate(key as keyof typeof formData, value);
      if (errors[key]) hasError = true;
    });

    if (Object.values(errors).some((err) => err !== "")) return;

    if (!fileId) return

    const updated: application = {
      fileId: fileId,
      consultant : {
        name: formData.personName,
        numberCard: formData.personCard,
        phone: formData.phone,
        cin: formData.cin
      },
      upLine: {
        name: formData.upLineName,
        numberCard: formData.upLineCard,
      },
      sponsor: {
        name: formData.sponsorName,
        numberCard: formData.sponsorCard
      }
    }

    updateApplication(initialData.personCard, updated)
    updateBvHolderDetails(initialData.personCard, fileId, { numberCard: updated.consultant.numberCard, name: updated.consultant.name })
    setIsChanged(false)
  };

  const handleCancel = () => {
    setFormData(initialData);
    setErrors({});
  };

  const inputClass =
    "text-sm text-gray-600 hover:bg-white/80 outline-gray-700 focus:px-2 rounded-md border border-gray-300 px-1";

  const buttonClass = (enabled: boolean, color: string) =>
    `px-4 py-1 rounded-lg font-semibold transition text-sm ${
      enabled
        ? `${color} text-white hover:opacity-90 cursor-pointer`
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }`;

  const ErrorText = ({ message }: { message?: string }) =>
    message ? <p className="text-xs text-red-500 mt-1">{message}</p> : null;

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex flex-col md:flex-row gap-4">
        <div className={`flex-1 p-2 rounded-lg bg-white`}>
          <div className="flex items-center gap-2 pb-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Nouveau</h2>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex gap-2">
                <input
                  className={`${inputClass} font-mono w-20`}
                  value={formData.personCard}
                  onChange={(e) => handleChange("personCard", e.target.value)}
                />
                <span className="border h-4 border-gray-300"></span>
                <input
                  className={`${inputClass} flex-1 font-mono`}
                  value={formData.personName}
                  onChange={(e) => handleChange("personName", e.target.value)}
                />
              </div>
              <ErrorText message={errors.personCard || errors.personName} />
            </div>

            <div>
              <input
                className={inputClass}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="phone"
              />
              <ErrorText message={errors.phone} />
            </div>

            <div>
              <input
                className={inputClass}
                value={formData.cin}
                onChange={(e) => handleChange("cin", e.target.value)}
                placeholder="cin"
              />
              <ErrorText message={errors.cin} />
            </div>
          </div>
        </div>

        <div className={`flex-1 p-2 rounded-lg bg-white `}>
          <div className="flex items-center gap-2 pb-2">
            <Users className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">Upline</h2>
          </div>
          <div>
            <div className="flex gap-2">
              <input
                className={`${inputClass} font-mono w-20`}
                value={formData.upLineCard}
                onChange={(e) => handleChange("upLineCard", e.target.value)}
              />
              <span className="border h-4 border-gray-300"></span>
              <input
                className={`${inputClass} flex-1`}
                value={formData.upLineName}
                onChange={(e) => handleChange("upLineName", e.target.value)}
              />
            </div>
            <ErrorText message={errors.uplineCard || errors.uplineName} />
          </div>
        </div>

        <div className={`flex-1 p-2 rounded-lg bg-white`}>
          <div className="flex items-center gap-2 pb-2">
            <Users className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">Placement</h2>
          </div>
          <div>
            <div className="flex gap-2">
              <input
                className={`${inputClass} font-mono w-20`}
                value={formData.sponsorCard}
                onChange={(e) => handleChange("sponsorCard", e.target.value)}
              />
              <span className="border h-4 border-gray-300"></span>
              <input
                className={`${inputClass} flex-1`}
                value={formData.sponsorName}
                onChange={(e) => handleChange("sponsorName", e.target.value)}
              />
            </div>
            <ErrorText message={errors.sponsorCard || errors.sponsorName} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={handleCancel}
          disabled={!isChanged}
          className={buttonClass(isChanged, "bg-red-400")}
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={!isChanged || Object.values(errors).some((e) => e)}
          className={buttonClass(
            isChanged && !Object.values(errors).some((e) => e),
            "bg-gray-800"
          )}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetails
