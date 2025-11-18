import {Plus, Upload, UserRound} from "lucide-react";
import Item from "../components/order components/Item.tsx";
import BvForm from "../components/ui/form/BvForm.tsx";
import {useFormStore} from "../store/tools/formStore.ts";
import {useBvStore} from "../store/orderStore.ts";
import {useParams, useSearchParams} from "react-router-dom";
import {useMemo, useState} from "react";
import FormContainer from "../components/container/FormContainer.tsx";
import {AnimatePresence} from "motion/react";
import {useApplicationStore} from "../store/applicationStore.ts";
import {useFileStore} from "../store/fileStore.ts";
import axios from "axios"
import {useProductStore} from "../store/productStore.ts";

const OrderPage = () => {
  const { isOpen, setOpen } = useFormStore()
  const { bvs, addBv } = useBvStore()
  const { applications } = useApplicationStore()
  const { fileId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isDownloading, setIsDownloading] = useState(false);
  const { files } = useFileStore()
  const { products : pds } = useProductStore()

  const [chosenFileName, setFileName] = useState("");

  const sort = searchParams.get("sort") || "default";

  const bvData = bvs.filter(bv => bv.fileId === fileId)
  const applicationData = applications.filter(application => application.fileId === fileId)
  const fileName = files.find(f => f.id === fileId)?.name || "No name found"

  const sortedItem = useMemo(() => {
    let sorted = [...bvData]
    switch (sort) {
      case "card":
        sorted.sort((a, b) => a.holder.numberCard.localeCompare(b.holder.numberCard));
        break;

      case "name":
        sorted.sort((a, b) => a.holder.name.localeCompare(b.holder.name));
        break;

      case "bv":
        sorted.sort((a, b) => {
          const aBv = a.products.reduce((acc, product) => acc + product.bv * product.quantity, 0)
          const bBv = b.products.reduce((acc, product) => acc + product.bv * product.quantity, 0)

          return bBv - aBv
        })
        break;

      default:
        sorted = [...bvData]
    }
    return sorted
  }, [bvData, sort])

  const handleSortChange = (newSort: string) => {
    setSearchParams({ sort: newSort })
  }

  const count = useMemo(
    () => bvData.length,
    [bvData]
  )

  const products = useMemo(
    () => bvData.flatMap(d => d.products),
    [bvData]
  )

  const totalBv = useMemo(
    () => products.reduce((acc, p) => acc + p.bv * p.quantity, 0),
    [products]
  )

  const totalAr = useMemo(
    () => products.reduce((acc, p) => acc + p.price! * p.quantity, 0),
    [products]
  )

  const handleConversion = async () => {
    const fileData = {
      fileName: fileName,
      bvs: bvData.map(bv => ({ name: bv.holder.name, numberCard: bv.holder.numberCard, products: bv.products })),
      applications: applicationData.map(application => ({ consultant: application.consultant, upline: application.upLine, sponsor: application.sponsor }))
    }

    const jsonString = JSON.stringify(fileData, null, 2);
    const file = new File([jsonString], `${fileName}.json`, { type: "application/json" });
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsDownloading(true); // <-- active le mode "en cours"

      const res = await axios.post("http://127.0.0.1:8000/download-closing", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${fileName}.xlsx`);
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error("erreur telechargement :", e)
    } finally {
      setIsDownloading(false); // <-- remet le bouton normal
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier l’extension ou le type MIME
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      console.error("Veuillez importer uniquement un fichier JSON.");
      return;
    }

    setFileName(file.name);

    const lastProductList = [
      {
        "_id": "67ff9e9b97f201aecd8477cf",
        "name": "Cordyceps Plus Capsule",
        "price": 72000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:12:11.658Z",
        "updatedAt": "2025-04-24T14:16:13.512Z",
        "barCode": "-",
        "bv": 20,
        "order": 1
      },
      {
        "_id": "67ffa51a97f201aecd84785f",
        "name": "Spirulina Plus Capsule",
        "price": 75600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:39:54.985Z",
        "updatedAt": "2025-04-24T14:17:53.041Z",
        "barCode": "-",
        "bv": 21,
        "order": 2
      },
      {
        "_id": "67ffa33f97f201aecd847838",
        "name": "Propolis Plus Capsule",
        "price": 97200,
        "quantity": 0,
        "createdAt": "2025-04-16T12:31:59.618Z",
        "updatedAt": "2025-04-24T14:18:10.222Z",
        "barCode": "-",
        "bv": 27,
        "order": 3
      },
      {
        "_id": "67ffa03b97f201aecd8477e4",
        "name": "Ganoderma Plus Capsule",
        "price": 82800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:19:07.300Z",
        "updatedAt": "2025-04-24T14:18:35.520Z",
        "barCode": "-",
        "bv": 23,
        "order": 4
      },
      {
        "_id": "67ff9cf797f201aecd8477b4",
        "name": "Cardio Power Capsule",
        "price": 68400,
        "quantity": 0,
        "createdAt": "2025-04-16T12:05:11.921Z",
        "updatedAt": "2025-04-24T14:18:54.829Z",
        "barCode": "-",
        "bv": 19,
        "order": 5
      },
      {
        "_id": "67ffa4c997f201aecd847856",
        "name": "Soy Power Capsule",
        "price": 64800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:38:33.029Z",
        "updatedAt": "2025-04-24T14:27:04.000Z",
        "barCode": "-",
        "bv": 18,
        "order": 6
      },
      {
        "_id": "67ff872097f201aecd847723",
        "name": "A-Power Capsule",
        "price": 144000,
        "quantity": 0,
        "createdAt": "2025-04-16T10:32:00.600Z",
        "updatedAt": "2025-04-24T14:27:52.537Z",
        "barCode": "-",
        "bv": 40,
        "order": 7
      },
      {
        "_id": "67ffa62397f201aecd847874",
        "name": "Vig Power Capsule",
        "price": 93600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:44:19.482Z",
        "updatedAt": "2025-04-24T14:28:18.131Z",
        "barCode": "-",
        "bv": 26,
        "order": 8
      },
      {
        "_id": "67ffa0b697f201aecd8477f0",
        "name": "Ginseng Rhs Capsule",
        "price": 136800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:21:10.762Z",
        "updatedAt": "2025-04-24T14:28:50.323Z",
        "barCode": "-",
        "bv": 38,
        "order": 9
      },
      {
        "_id": "67ffa32497f201aecd847835",
        "name": "Pro-slim Tea",
        "price": 43200,
        "quantity": 0,
        "createdAt": "2025-04-16T12:31:32.922Z",
        "updatedAt": "2025-04-24T14:29:25.501Z",
        "barCode": "-",
        "bv": 12,
        "order": 10
      },
      {
        "_id": "67ffa19b97f201aecd847808",
        "name": "Kuding Plus Tea",
        "price": 43200,
        "quantity": 0,
        "createdAt": "2025-04-16T12:24:59.415Z",
        "updatedAt": "2025-04-24T14:29:47.969Z",
        "barCode": "-",
        "bv": 12,
        "order": 11
      },
      {
        "_id": "67ffa2f997f201aecd84782f",
        "name": "Pine Pollen Tea",
        "price": 50400,
        "quantity": 0,
        "createdAt": "2025-04-16T12:30:49.659Z",
        "updatedAt": "2025-04-24T14:30:13.332Z",
        "barCode": "-",
        "bv": 14,
        "order": 12
      },
      {
        "_id": "67ffa0f497f201aecd8477f9",
        "name": "Intestine Cleansing Tea",
        "price": 46800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:22:12.401Z",
        "updatedAt": "2025-04-24T14:31:14.776Z",
        "barCode": "-",
        "bv": 13,
        "order": 13
      },
      {
        "_id": "67ff880697f201aecd84772a",
        "name": "Balsam Pear Tea",
        "price": 46800,
        "quantity": 0,
        "createdAt": "2025-04-16T10:35:50.043Z",
        "updatedAt": "2025-04-24T14:31:42.248Z",
        "barCode": "-",
        "bv": 13,
        "order": 14
      },
      {
        "_id": "67ffa1b997f201aecd84780e",
        "name": "Lipid Care Tea",
        "price": 50400,
        "quantity": 0,
        "createdAt": "2025-04-16T12:25:29.408Z",
        "updatedAt": "2025-04-24T14:32:35.700Z",
        "barCode": "-",
        "bv": 14,
        "order": 15
      },
      {
        "_id": "67ff9b7a97f201aecd84778a",
        "name": "Breast Care Tea",
        "price": 54000,
        "quantity": 0,
        "createdAt": "2025-04-16T11:58:50.938Z",
        "updatedAt": "2025-04-18T10:32:17.669Z",
        "barCode": "-",
        "bv": 15,
        "order": 16
      },
      {
        "_id": "67ff9f8097f201aecd8477e1",
        "name": "Ganoderma Coffee",
        "price": 64800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:16:00.533Z",
        "updatedAt": "2025-04-24T14:33:55.893Z",
        "barCode": "-",
        "bv": 18,
        "order": 17
      },
      {
        "_id": "67ffa17697f201aecd847802",
        "name": "Kidney Tonifying Capsule Man",
        "price": 108000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:24:22.056Z",
        "updatedAt": "2025-04-24T14:35:07.541Z",
        "barCode": "-",
        "bv": 30,
        "order": 18
      },
      {
        "_id": "67ffa18a97f201aecd847805",
        "name": "Kidney Tonifying Capsule Women",
        "price": 108000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:24:42.126Z",
        "updatedAt": "2025-04-24T14:35:42.086Z",
        "barCode": "-",
        "bv": 30,
        "order": 19
      },
      {
        "_id": "67ffa36497f201aecd84783e",
        "name": "Protein Powder",
        "price": 126000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:32:36.556Z",
        "updatedAt": "2025-04-24T14:36:27.158Z",
        "barCode": "-",
        "bv": 35,
        "order": 20
      },
      {
        "_id": "67ffa21297f201aecd84781d",
        "name": "Multi-Vitamin Tablet (for children)",
        "price": 30600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:26:58.685Z",
        "updatedAt": "2025-04-24T14:38:36.315Z",
        "barCode": "-",
        "bv": 8.5,
        "order": 21
      },
      {
        "_id": "67ffa1fe97f201aecd84781a",
        "name": "Multi-Vitamin Tablet (for adults)",
        "price": 82800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:26:38.999Z",
        "updatedAt": "2025-04-24T14:39:25.722Z",
        "barCode": "-",
        "bv": 23,
        "order": 22
      },
      {
        "_id": "67ff9bd797f201aecd847790",
        "name": "Chewable Calcium Tablet (for children)",
        "price": 30600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:00:23.799Z",
        "updatedAt": "2025-04-24T14:40:59.259Z",
        "barCode": "-",
        "bv": 8.5,
        "order": 23
      },
      {
        "_id": "67ff9ba097f201aecd84778d",
        "name": "Calcium Softgel (for adults)",
        "price": 79200,
        "quantity": 0,
        "createdAt": "2025-04-16T11:59:28.065Z",
        "updatedAt": "2025-04-24T14:42:33.254Z",
        "barCode": "-",
        "bv": 22,
        "order": 24
      },
      {
        "_id": "67ffa8b097f201aecd847886",
        "name": "Zinc Tablet (for children)",
        "price": 32400,
        "quantity": 0,
        "createdAt": "2025-04-16T12:55:12.768Z",
        "updatedAt": "2025-04-24T14:46:43.853Z",
        "barCode": "-",
        "bv": 9,
        "order": 25
      },
      {
        "_id": "67ffa68097f201aecd847883",
        "name": "Zinc Tablet (for adults)",
        "price": 57600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:45:52.915Z",
        "updatedAt": "2025-04-24T14:47:18.291Z",
        "barCode": "-",
        "bv": 16,
        "order": 26
      },
      {
        "_id": "67ffa1a997f201aecd84780b",
        "name": "Soybean Lecithin Softgel",
        "price": 72000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:25:13.196Z",
        "updatedAt": "2025-04-24T14:48:31.059Z",
        "barCode": "-",
        "bv": 20,
        "order": 27
      },
      {
        "_id": "67ff9eae97f201aecd8477d2",
        "name": "Deep Sea Fish Oil Softgel (omega-3)",
        "price": 90000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:12:30.830Z",
        "updatedAt": "2025-04-24T14:49:31.236Z",
        "barCode": "-",
        "bv": 25,
        "order": 28
      },
      {
        "_id": "67ffa05297f201aecd8477e7",
        "name": "Garlic Oil Softgel",
        "price": 82800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:19:30.131Z",
        "updatedAt": "2025-07-22T08:58:45.797Z",
        "barCode": "-",
        "bv": 22.5,
        "order": 29
      },
      {
        "_id": "67ff9f4497f201aecd8477de",
        "name": "Eye Care Softgel",
        "price": 100800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:15:00.498Z",
        "updatedAt": "2025-04-24T14:51:06.719Z",
        "barCode": "-",
        "bv": 28,
        "order": 30
      },
      {
        "_id": "67ff9d0297f201aecd8477b7",
        "name": "Chitosan Capsule",
        "price": 86400,
        "quantity": 0,
        "createdAt": "2025-04-16T12:05:22.339Z",
        "updatedAt": "2025-04-24T14:52:04.704Z",
        "barCode": "-",
        "bv": 24,
        "order": 31
      },
      {
        "_id": "67ff79a897f201aecd8476c4",
        "name": "Aloe Vera Plus Capsule",
        "price": 75600,
        "quantity": 0,
        "createdAt": "2025-04-16T09:34:32.068Z",
        "updatedAt": "2025-04-24T14:52:23.722Z",
        "barCode": "-",
        "bv": 21,
        "order": 32
      },
      {
        "_id": "67ff9e5f97f201aecd8477c9",
        "name": "Compound Marrow Powder",
        "price": 93600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:11:11.119Z",
        "updatedAt": "2025-04-24T14:53:13.383Z",
        "barCode": "-",
        "bv": 26,
        "order": 33
      },
      {
        "_id": "67ffa07297f201aecd8477ed",
        "name": "Ginko Biloba Capsule",
        "price": 82800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:20:02.315Z",
        "updatedAt": "2025-07-22T08:59:16.864Z",
        "barCode": "-",
        "bv": 22.5,
        "order": 34
      },
      {
        "_id": "680a50c7721f3e5200d6463c",
        "name": "Flask",
        "bv": 70,
        "price": 252000,
        "quantity": 0,
        "barCode": "-",
        "order": 35,
        "createdAt": "2025-04-24T14:55:03.026Z",
        "updatedAt": "2025-04-24T14:55:03.026Z"
      },
      {
        "_id": "67ff9d3397f201aecd8477bd",
        "name": "Clear Lung Tea",
        "price": 50400,
        "quantity": 0,
        "createdAt": "2025-04-16T12:06:11.129Z",
        "updatedAt": "2025-04-24T14:55:31.120Z",
        "barCode": "-",
        "bv": 14,
        "order": 36
      },
      {
        "_id": "67ffa37697f201aecd847841",
        "name": "Royal Jelly Softgel",
        "price": 68400,
        "quantity": 0,
        "createdAt": "2025-04-16T12:32:54.878Z",
        "updatedAt": "2025-04-24T14:56:01.429Z",
        "barCode": "-",
        "bv": 19,
        "order": 37
      },
      {
        "_id": "67ffa0d397f201aecd8477f6",
        "name": "Hepatsure Capsule",
        "price": 93600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:21:39.994Z",
        "updatedAt": "2025-04-24T14:56:40.926Z",
        "barCode": "-",
        "bv": 26,
        "order": 38
      },
      {
        "_id": "67ff809897f201aecd8476dd",
        "name": "Ishine Capsule (Anxiety)",
        "price": 79200,
        "quantity": 0,
        "createdAt": "2025-04-16T10:04:08.540Z",
        "updatedAt": "2025-04-24T14:58:20.856Z",
        "barCode": "-",
        "bv": 22,
        "order": 39
      },
      {
        "_id": "67ffa2e397f201aecd84782c",
        "name": "Parashield Capsule",
        "price": 54000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:30:27.421Z",
        "updatedAt": "2025-04-24T14:59:04.407Z",
        "barCode": "-",
        "bv": 15,
        "order": 40
      },
      {
        "_id": "67ffa40397f201aecd847850",
        "name": "Slimming Capsule",
        "price": 100800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:35:15.460Z",
        "updatedAt": "2025-04-24T15:05:28.516Z",
        "barCode": "-",
        "bv": 28,
        "order": 41
      },
      {
        "_id": "67ffa53f97f201aecd847862",
        "name": "Super Nutrition Powder",
        "price": 165600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:40:31.053Z",
        "updatedAt": "2025-04-24T15:18:58.118Z",
        "barCode": "-",
        "bv": 46,
        "order": 42
      },
      {
        "_id": "67ffa35297f201aecd84783b",
        "name": "Prostacare Capsule",
        "price": 118800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:32:18.776Z",
        "updatedAt": "2025-04-24T15:19:25.048Z",
        "barCode": "-",
        "bv": 33,
        "order": 43
      },
      {
        "_id": "67ff9e7697f201aecd8477cc",
        "name": "CoQ-10 Capsule",
        "price": 97200,
        "quantity": 0,
        "createdAt": "2025-04-16T12:11:34.346Z",
        "updatedAt": "2025-04-24T15:19:54.380Z",
        "barCode": "-",
        "bv": 27,
        "order": 44
      },
      {
        "_id": "67ff9b3097f201aecd847784",
        "name": "Bone Care Plaster",
        "price": 72000,
        "quantity": 0,
        "createdAt": "2025-04-16T11:57:36.699Z",
        "updatedAt": "2025-04-24T15:20:17.634Z",
        "barCode": "-",
        "bv": 20,
        "order": 45
      },
      {
        "_id": "67ffa0c597f201aecd8477f3",
        "name": "Diasure Capsule (Glucobloc)",
        "price": 64800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:21:25.520Z",
        "updatedAt": "2025-04-24T15:21:26.034Z",
        "barCode": "-",
        "bv": 18,
        "order": 46
      },
      {
        "_id": "67ff877c97f201aecd847727",
        "name": "Joint Health Capsule (Arthropower)",
        "price": 100800,
        "quantity": 0,
        "createdAt": "2025-04-16T10:33:32.706Z",
        "updatedAt": "2025-04-24T15:22:20.878Z",
        "barCode": "-",
        "bv": 28,
        "order": 47
      },
      {
        "_id": "67ffa63797f201aecd847877",
        "name": "Vitamine C Tablet",
        "price": 43200,
        "quantity": 0,
        "createdAt": "2025-04-16T12:44:39.178Z",
        "updatedAt": "2025-04-24T15:27:02.851Z",
        "barCode": "-",
        "bv": 12,
        "order": 48
      },
      {
        "_id": "67ffa06397f201aecd8477ea",
        "name": "Digestant Tablet (Gastric Health)",
        "price": 57600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:19:47.255Z",
        "updatedAt": "2025-04-24T15:27:52.567Z",
        "barCode": "-",
        "bv": 16,
        "order": 49
      },
      {
        "_id": "67ff9ec297f201aecd8477d5",
        "name": "Magic Detoxin Pad",
        "price": 72000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:12:50.680Z",
        "updatedAt": "2025-04-24T15:28:40.934Z",
        "barCode": "-",
        "bv": 20,
        "order": 50
      },
      {
        "_id": "67ff9b0a97f201aecd84777e",
        "name": "Blueberry Juice Granules",
        "price": 79200,
        "quantity": 0,
        "createdAt": "2025-04-16T11:56:58.234Z",
        "updatedAt": "2025-04-24T15:29:14.131Z",
        "barCode": "-",
        "bv": 22,
        "order": 51
      },
      {
        "_id": "67ff7ad597f201aecd8476d0",
        "name": "Anti-Aging Capsule",
        "price": 115200,
        "quantity": 0,
        "createdAt": "2025-04-16T09:39:33.840Z",
        "updatedAt": "2025-04-24T15:29:50.105Z",
        "barCode": "-",
        "bv": 32,
        "order": 52
      },
      {
        "_id": "67ff9ad497f201aecd84777a",
        "name": "Blueberry Enzymes Tablet",
        "price": 82800,
        "quantity": 0,
        "createdAt": "2025-04-16T11:56:04.603Z",
        "updatedAt": "2025-04-24T15:30:35.012Z",
        "barCode": "-",
        "bv": 23,
        "order": 53
      },
      {
        "_id": "67ffa2c697f201aecd847826",
        "name": "Hangfang Beauty  Milk Soap (Olive soap)",
        "price": 7200,
        "quantity": 0,
        "createdAt": "2025-04-16T12:29:58.489Z",
        "updatedAt": "2025-04-24T15:31:43.077Z",
        "barCode": "925196004011",
        "bv": 1,
        "order": 54
      },
      {
        "_id": "6802217265d1fd97867120ab",
        "name": "Quick Absorption Blue Sanitary Napkin",
        "bv": 2,
        "price": 10000,
        "quantity": 0,
        "barCode": "-",
        "order": 55,
        "createdAt": "2025-04-18T09:54:58.708Z",
        "updatedAt": "2025-04-24T15:32:25.984Z"
      },
      {
        "_id": "67ffa55697f201aecd847865",
        "name": "Toothpaste",
        "price": 27000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:40:54.670Z",
        "updatedAt": "2025-04-24T15:32:41.371Z",
        "barCode": "-",
        "bv": 7.5,
        "order": 56
      },
      {
        "_id": "67ff979d97f201aecd84776d",
        "name": "Blueberry Series",
        "price": 720000,
        "quantity": 0,
        "createdAt": "2025-04-16T11:42:21.086Z",
        "updatedAt": "2025-04-24T15:33:23.953Z",
        "barCode": "-",
        "bv": 200,
        "order": 57
      },
      {
        "_id": "680a59ee721f3e5200d64691",
        "name": "Uterus Cleansing Pill",
        "bv": 32,
        "price": 115200,
        "quantity": 0,
        "barCode": "-",
        "order": 58,
        "createdAt": "2025-04-24T15:34:06.598Z",
        "updatedAt": "2025-04-24T15:34:06.598Z"
      },
      {
        "_id": "67ffa1d597f201aecd847814",
        "name": "Mala Power",
        "price": 54000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:25:57.625Z",
        "updatedAt": "2025-04-24T15:35:23.546Z",
        "barCode": "-",
        "bv": 15,
        "order": 59
      },
      {
        "_id": "67ff9d2097f201aecd8477ba",
        "name": "Chang Jing Jing (Clear Body)",
        "price": 36000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:05:52.612Z",
        "updatedAt": "2025-04-24T15:37:23.161Z",
        "barCode": "-",
        "bv": 10,
        "order": 60
      },
      {
        "_id": "67ffa67397f201aecd847880",
        "name": "Jiu Qing Qing (Wake)",
        "price": 36000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:45:39.718Z",
        "updatedAt": "2025-04-24T15:38:02.324Z",
        "barCode": "-",
        "bv": 10,
        "order": 61
      },
      {
        "_id": "67ffa4ae97f201aecd847853",
        "name": "Smilife Skin Care Package",
        "price": 266400,
        "quantity": 0,
        "createdAt": "2025-04-16T12:38:06.803Z",
        "updatedAt": "2025-04-24T15:38:28.320Z",
        "barCode": "-",
        "bv": 74,
        "order": 62
      },
      {
        "_id": "67ffa65897f201aecd84787d",
        "name": "Vitamine E",
        "price": 75600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:45:12.455Z",
        "updatedAt": "2025-04-24T15:38:43.267Z",
        "barCode": "-",
        "bv": 21,
        "order": 63
      },
      {
        "_id": "67ffa8de97f201aecd847889",
        "name": "β-Carotene & Lycopene Capsule",
        "price": 79200,
        "quantity": 0,
        "createdAt": "2025-04-16T12:55:58.365Z",
        "updatedAt": "2025-04-24T15:39:59.291Z",
        "barCode": "-",
        "bv": 22,
        "order": 64
      },
      {
        "_id": "67ffa1c997f201aecd847811",
        "name": "Livergen Capsule",
        "price": 100800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:25:45.873Z",
        "updatedAt": "2025-04-24T15:40:31.329Z",
        "barCode": "-",
        "bv": 28,
        "order": 65
      },
      {
        "_id": "67ffa3d697f201aecd847847",
        "name": "SE Tablet (adults)",
        "price": 66600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:34:30.462Z",
        "updatedAt": "2025-04-24T15:41:48.046Z",
        "barCode": "-",
        "bv": 18.5,
        "order": 66
      },
      {
        "_id": "67ffa3e597f201aecd84784a",
        "name": "SE Tablet (children)",
        "price": 30600,
        "quantity": 0,
        "createdAt": "2025-04-16T12:34:45.572Z",
        "updatedAt": "2025-04-24T15:42:37.387Z",
        "barCode": "-",
        "bv": 8.5,
        "order": 67
      },
      {
        "_id": "67ff9b2197f201aecd847781",
        "name": "Blueberry Milk",
        "price": 61200,
        "quantity": 0,
        "createdAt": "2025-04-16T11:57:21.765Z",
        "updatedAt": "2025-04-24T15:43:03.583Z",
        "barCode": "-",
        "bv": 17,
        "order": 68
      },
      {
        "_id": "67ffa10e97f201aecd8477fc",
        "name": "Jinpure Capsule",
        "price": 79200,
        "quantity": 0,
        "createdAt": "2025-04-16T12:22:38.675Z",
        "updatedAt": "2025-04-24T15:43:48.107Z",
        "barCode": "-",
        "bv": 22,
        "order": 69
      },
      {
        "_id": "67ffa12897f201aecd8477ff",
        "name": "Jinpure Tea",
        "price": 46800,
        "quantity": 0,
        "createdAt": "2025-04-16T12:23:04.775Z",
        "updatedAt": "2025-04-24T15:44:04.450Z",
        "barCode": "-",
        "bv": 13,
        "order": 70
      },
      {
        "_id": "67ffa2d797f201aecd847829",
        "name": "Ovary Capsule",
        "price": 86400,
        "quantity": 0,
        "createdAt": "2025-04-16T12:30:15.015Z",
        "updatedAt": "2025-04-24T15:44:35.152Z",
        "barCode": "-",
        "bv": 24,
        "order": 71
      },
      {
        "_id": "67ff9ed397f201aecd8477d8",
        "name": "Energy Drink",
        "price": 36000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:13:07.010Z",
        "updatedAt": "2025-04-24T15:45:01.226Z",
        "barCode": "-",
        "bv": 10,
        "order": 72
      },
      {
        "_id": "67ff9ee097f201aecd8477db",
        "name": "Energy Tea",
        "price": 54000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:13:20.211Z",
        "updatedAt": "2025-04-24T15:45:19.355Z",
        "barCode": "-",
        "bv": 15,
        "order": 73
      },
      {
        "_id": "67ffa23c97f201aecd847823",
        "name": "Engrais (Nutriplant)",
        "price": 108000,
        "quantity": 0,
        "createdAt": "2025-04-16T12:27:40.092Z",
        "updatedAt": "2025-04-24T15:46:16.232Z",
        "barCode": "-",
        "bv": 30,
        "order": 74
      },
      {
        "_id": "680a5ce6721f3e5200d646cc",
        "name": "Slimming Machine",
        "bv": 70,
        "price": 252000,
        "quantity": 0,
        "barCode": "-",
        "order": 75,
        "createdAt": "2025-04-24T15:46:46.761Z",
        "updatedAt": "2025-04-24T15:46:46.761Z"
      },
      {
        "_id": "680a5e1e721f3e5200d646f1",
        "name": "Knee Protector",
        "bv": 45,
        "price": 162000,
        "quantity": 0,
        "barCode": "-",
        "order": 76,
        "createdAt": "2025-04-24T15:51:58.711Z",
        "updatedAt": "2025-04-24T15:51:58.711Z"
      },
      {
        "_id": "680a5e50721f3e5200d646f4",
        "name": "Infrared Machine",
        "bv": 70,
        "price": 252000,
        "quantity": 0,
        "barCode": "-",
        "order": 77,
        "createdAt": "2025-04-24T15:52:48.332Z",
        "updatedAt": "2025-04-24T15:52:48.332Z"
      },
      {
        "_id": "680a5e70721f3e5200d646f7",
        "name": "Compound Calcium Adult",
        "bv": 22,
        "price": 79200,
        "quantity": 0,
        "barCode": "-",
        "order": 78,
        "createdAt": "2025-04-24T15:53:20.533Z",
        "updatedAt": "2025-04-24T15:53:35.603Z"
      },
      {
        "_id": "680a5ea8721f3e5200d646fd",
        "name": "Compound Calcium Children",
        "bv": 20,
        "price": 72000,
        "quantity": 0,
        "barCode": "-",
        "order": 79,
        "createdAt": "2025-04-24T15:54:16.899Z",
        "updatedAt": "2025-04-24T15:54:16.899Z"
      },
      {
        "_id": "680a5f02721f3e5200d64700",
        "name": "Eva Spray Women",
        "bv": 17,
        "price": 61200,
        "quantity": 0,
        "barCode": "-",
        "order": 80,
        "createdAt": "2025-04-24T15:55:46.982Z",
        "updatedAt": "2025-04-24T15:55:46.982Z"
      },
      {
        "_id": "680a5f1f721f3e5200d64703",
        "name": "Gold Spray Men",
        "bv": 18,
        "price": 64800,
        "quantity": 0,
        "barCode": "-",
        "order": 81,
        "createdAt": "2025-04-24T15:56:15.592Z",
        "updatedAt": "2025-04-24T15:56:15.592Z"
      },
      {
        "_id": "680a5f52721f3e5200d64706",
        "name": "Meal Cellulose Tablets",
        "bv": 26,
        "price": 93600,
        "quantity": 0,
        "barCode": "-",
        "order": 82,
        "createdAt": "2025-04-24T15:57:06.498Z",
        "updatedAt": "2025-04-24T15:57:06.498Z"
      },
      {
        "_id": "680a5f82721f3e5200d64709",
        "name": "Anti Addiction Capsule",
        "bv": 35,
        "price": 126000,
        "quantity": 0,
        "barCode": "-",
        "order": 83,
        "createdAt": "2025-04-24T15:57:55.002Z",
        "updatedAt": "2025-04-24T15:57:55.002Z"
      },
      {
        "_id": "680a6017721f3e5200d6470c",
        "name": "Blood Cleanse Capsule",
        "bv": 18,
        "price": 64800,
        "quantity": 0,
        "barCode": "-",
        "order": 84,
        "createdAt": "2025-04-24T16:00:23.036Z",
        "updatedAt": "2025-04-24T16:00:23.036Z"
      },
      {
        "_id": "680a6035721f3e5200d6470f",
        "name": "Tourmaline Soap",
        "bv": 1,
        "price": 7200,
        "quantity": 0,
        "barCode": "-",
        "order": 85,
        "createdAt": "2025-04-24T16:00:53.286Z",
        "updatedAt": "2025-07-22T09:04:46.748Z"
      },
      {
        "_id": "680a6088721f3e5200d64712",
        "name": "Compound Calcium Vert",
        "bv": 22,
        "price": 79200,
        "quantity": 0,
        "barCode": "-",
        "order": 86,
        "createdAt": "2025-04-24T16:02:16.139Z",
        "updatedAt": "2025-04-24T16:02:16.139Z"
      },
      {
        "_id": "680a609e721f3e5200d64715",
        "name": "NMN",
        "bv": 60,
        "price": 216000,
        "quantity": 0,
        "barCode": "-",
        "order": 87,
        "createdAt": "2025-04-24T16:02:38.596Z",
        "updatedAt": "2025-04-24T16:02:38.596Z"
      },
      {
        "_id": "680a60ba721f3e5200d64718",
        "name": "VD",
        "bv": 23,
        "price": 82800,
        "quantity": 0,
        "barCode": "-",
        "order": 88,
        "createdAt": "2025-04-24T16:03:06.154Z",
        "updatedAt": "2025-04-24T16:03:06.154Z"
      },
      {
        "_id": "680a60e7721f3e5200d6471b",
        "name": "Bitter Buckwheat Tea",
        "bv": 12,
        "price": 43200,
        "quantity": 0,
        "barCode": "-",
        "order": 89,
        "createdAt": "2025-04-24T16:03:51.494Z",
        "updatedAt": "2025-04-24T16:03:51.494Z"
      },
      {
        "_id": "680a611f721f3e5200d64721",
        "name": "Brain Care Capsule",
        "bv": 28,
        "price": 100800,
        "quantity": 0,
        "barCode": "-",
        "order": 90,
        "createdAt": "2025-04-24T16:04:47.952Z",
        "updatedAt": "2025-04-24T16:04:47.952Z"
      },
      {
        "_id": "680a61a9721f3e5200d64727",
        "name": "Probiotic",
        "bv": 12,
        "price": 43200,
        "quantity": 0,
        "barCode": "-",
        "order": 91,
        "createdAt": "2025-04-24T16:07:05.693Z",
        "updatedAt": "2025-04-24T16:07:05.693Z"
      },
      {
        "_id": "680a6241721f3e5200d6472a",
        "name": "Pressure Spray",
        "bv": 10,
        "price": 36000,
        "quantity": 0,
        "barCode": "-",
        "order": 92,
        "createdAt": "2025-04-24T16:09:37.767Z",
        "updatedAt": "2025-04-24T16:09:37.767Z"
      },
      {
        "_id": "680a6274721f3e5200d64730",
        "name": "Blueberry Concentrate",
        "bv": 85,
        "price": 306000,
        "quantity": 0,
        "barCode": "-",
        "order": 93,
        "createdAt": "2025-04-24T16:10:28.065Z",
        "updatedAt": "2025-04-24T16:10:28.065Z"
      },
      {
        "_id": "680a633b721f3e5200d64737",
        "name": "See",
        "bv": 10,
        "price": 36000,
        "quantity": 0,
        "barCode": "-",
        "order": 94,
        "createdAt": "2025-04-24T16:13:47.722Z",
        "updatedAt": "2025-04-24T16:13:47.722Z"
      },
      {
        "_id": "680a63b7721f3e5200d6473a",
        "name": "Energy Stone Pendant",
        "bv": 55,
        "price": 198000,
        "quantity": 0,
        "barCode": "-",
        "order": 95,
        "createdAt": "2025-04-24T16:15:51.256Z",
        "updatedAt": "2025-04-24T16:15:51.256Z"
      },
      {
        "_id": "680a668c721f3e5200d6473d",
        "name": "Blueberry Slimming Body",
        "bv": 42,
        "price": 151200,
        "quantity": 0,
        "barCode": "-",
        "order": 96,
        "createdAt": "2025-04-24T16:27:56.119Z",
        "updatedAt": "2025-04-24T16:27:56.119Z"
      },
      {
        "_id": "680a66c2721f3e5200d64740",
        "name": "Keratin Shampoo - Smilife",
        "bv": 10,
        "price": 36000,
        "quantity": 0,
        "barCode": "-",
        "order": 97,
        "createdAt": "2025-04-24T16:28:50.777Z",
        "updatedAt": "2025-04-24T16:28:50.777Z"
      },
      {
        "_id": "680a66e1721f3e5200d64743",
        "name": "Honey Hand Cream - Smilife",
        "bv": 5,
        "price": 18000,
        "quantity": 0,
        "barCode": "-",
        "order": 98,
        "createdAt": "2025-04-24T16:29:21.770Z",
        "updatedAt": "2025-04-24T16:29:21.770Z"
      },
      {
        "_id": "680a670c721f3e5200d64746",
        "name": "Cleanser Facial - Smilife",
        "bv": 20,
        "price": 72000,
        "quantity": 0,
        "barCode": "-",
        "order": 99,
        "createdAt": "2025-04-24T16:30:04.239Z",
        "updatedAt": "2025-04-24T16:30:04.239Z"
      },
      {
        "_id": "680a674d721f3e5200d64749",
        "name": "Lotion Facial - Smilife",
        "bv": 20,
        "price": 72000,
        "quantity": 0,
        "barCode": "-",
        "order": 100,
        "createdAt": "2025-04-24T16:31:09.668Z",
        "updatedAt": "2025-04-24T16:31:09.668Z"
      },
      {
        "_id": "680a6768721f3e5200d6474c",
        "name": "Toner Facial - Smilife",
        "bv": 20,
        "price": 72000,
        "quantity": 0,
        "barCode": "-",
        "order": 101,
        "createdAt": "2025-04-24T16:31:36.466Z",
        "updatedAt": "2025-04-24T16:31:36.466Z"
      },
      {
        "_id": "680a67bf721f3e5200d6474f",
        "name": "Moisturizer Facial - Smilife",
        "bv": 20,
        "price": 72000,
        "quantity": 0,
        "barCode": "-",
        "order": 102,
        "createdAt": "2025-04-24T16:33:03.720Z",
        "updatedAt": "2025-04-24T16:33:03.720Z"
      },
      {
        "_id": "680a683e721f3e5200d64752",
        "name": "Essence Facial - Smilife",
        "bv": 20,
        "price": 72000,
        "quantity": 0,
        "barCode": "-",
        "order": 103,
        "createdAt": "2025-04-24T16:35:10.498Z",
        "updatedAt": "2025-04-24T16:35:10.498Z"
      },
      {
        "_id": "680a687a721f3e5200d64755",
        "name": "Eye Cream - Smilife",
        "bv": 20,
        "price": 72000,
        "quantity": 0,
        "barCode": "-",
        "order": 104,
        "createdAt": "2025-04-24T16:36:10.924Z",
        "updatedAt": "2025-04-24T16:36:10.924Z"
      },
      {
        "_id": "680a6894721f3e5200d64758",
        "name": "Enzymes",
        "bv": 25,
        "price": 90000,
        "quantity": 0,
        "barCode": "-",
        "order": 105,
        "createdAt": "2025-04-24T16:36:36.450Z",
        "updatedAt": "2025-04-24T16:36:36.450Z"
      },
      {
        "_id": "680a68a8721f3e5200d6475b",
        "name": "Blueberry Wine",
        "bv": 40,
        "price": 144000,
        "quantity": 0,
        "barCode": "-",
        "order": 106,
        "createdAt": "2025-04-24T16:36:56.979Z",
        "updatedAt": "2025-04-24T16:36:56.979Z"
      },
      {
        "_id": "684d2965bf698796e42ce12b",
        "name": "Vitamine D3",
        "bv": 23,
        "price": 82800,
        "quantity": 0,
        "barCode": "-",
        "order": 107,
        "createdAt": "2025-06-14T07:48:53.493Z",
        "updatedAt": "2025-06-14T07:48:53.493Z"
      }
    ]

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const jsonData: { name:string; number_card: string; items: { name: string, quantity: number }[]}[] = JSON.parse(content);

        const filteredData = jsonData.map(dist => ({
          name: dist.name,
          numberCard: dist.number_card,
          products: dist.items.map(product => {
            const prod = lastProductList.find(p => p.name === product.name)

            return { order: prod!.order, quantity: product.quantity }
          })
        }))

        const dataWithExactProduct = filteredData.map(d => ({
          ...d,
          products: d.products.map(p => {
            const pd = pds.find(f => f.order === p.order)

            if (!pd) return {
              ...p,
              name: "",
              bv: 0,
              price: 0,
              quantity: 0
            }

            return {
              ...p,
              name: pd.name,
              bv: pd.bv,
              price: pd.price,
              quantity: p.quantity
            }
          })
        }))
        console.log(dataWithExactProduct)

        if (!fileId) return

        dataWithExactProduct.forEach(bvData => {
          addBv(fileId, { name: bvData.name, numberCard: bvData.numberCard }, bvData.products)
        })

      } catch (err) {
        console.error("Erreur lors du parsing JSON :", err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="flex-1 flex flex-col gap-2">
        {bvData.length === 0 && (
          <div className="m-4">
            <div className="text-center bg-gray-50 rounded-2xl p-6">
              <h1>Aucun BV</h1>
              <p className="text-sm text-gray-600 mt-2">
                Vous n’avez pas encore ajouté de personnes dans votre fichier.
              </p>
              <div className="mt-4 flex flex-col items-center gap-2">
                <h2 className="font-medium">Importer un fichier existant</h2>
                <label className="flex items-center gap-2 bg-black/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-black/20 transition text-gray-700">
                  <Upload size={16} />
                  <span>{chosenFileName || "Choisir un fichier"}</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            <div className="relative my-4">
              <span className="text-gray-500 bg-white absolute px-2 top-1/2 left-1/2 -translate-1/2">ou</span>
              <hr/>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="btn w-full flex items-center justify-center gap-2"
            >
              <Plus size={20}/>
              Ajouter une personne
            </button>
          </div>
        )}

        {bvData.length > 0 && (
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 bg-white/10 backdrop-blur-xs p-2 shadow">
              <div className="relative flex items-center gap-2 text-gray-700">
                <span className="flex gap-1 items-center text-base">
                  <UserRound size={16}/> :
                  <span className="font-semibold">{count}</span>
                </span>
                <span>
                  Total BV : <span className="font-semibold">{totalBv} $</span>
                </span>
                <span>
                  Total Ar : <span className="font-semibold">{totalAr.toLocaleString()} ar</span>
                </span>
                <button
                  onClick={handleConversion}
                  disabled={isDownloading} // <-- désactive pendant le download
                  className={`absolute px-4 py-1 rounded-lg right-2 ${
                    isDownloading ? "bg-gray-400 cursor-not-allowed" : "bg-slate-500 text-white"
                  }`}
                >
                  {isDownloading ? "En train de télécharger..." : "Convertir"}
                </button>
              </div>
            </div>
            <div className="m-2 flex flex-col">
              <div className="p-1 rounded-lg flex items-center gap-2 w-full bg-gray-50 text-sm">
                <div
                  onClick={() => handleSortChange("default")}
                  className="w-8 cursor-pointer"
                >
                  <p
                    className={`rounded-sm text-center text-gray-400 font-mono ${sort === "default" && "bg-cyan-200"} `}
                  >
                    no.
                  </p>
                </div>

                <div
                  onClick={() => handleSortChange("card")}
                  className="w-18 cursor-pointer"
                >
                  <p className={`rounded-sm text-center text-gray-400 ${sort === "card" && "bg-cyan-200 "}`}>
                    carte
                  </p>
                </div>

                <span className="border h-4 border-gray-300"></span>

                <div
                  onClick={() => handleSortChange("name")}
                  className="flex-1 cursor-pointer"
                >
                  <p className={`rounded-sm pl-2 text-gray-400 ${sort === "name" && "bg-cyan-200"}`}>
                    Nom complet
                  </p>
                </div>
                <span className="border h-4 border-gray-300"></span>
                <div
                  onClick={() => handleSortChange("bv")}
                  className="w-23 cursor-pointer"
                >
                  <p className={`rounded-sm pl-9 text-gray-400 ${sort === "bv" && "bg-cyan-200"} `}>
                    bv
                  </p>
                </div>
              </div>

              <div className="mt-2 mb-6 divide-gray-300 divide-y">
                <AnimatePresence>
                  {sortedItem.map((d, index) => (
                    <Item
                      key={d.id}
                      id={d.id}
                      i={index}
                      numberCard={d.holder.numberCard}
                      name={d.holder.name}
                      products={d.products}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex sticky bottom-0 bg-white/10 backdrop-blur-xs">
              <button
                onClick={() => setOpen(true)}
                className="flex-1 bg-gray-100 text-sm font-semibold cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-black/10 m-2 p-2 rounded-lg transition">
                Ajouter une personne
              </button>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <FormContainer>
            <BvForm/>
          </FormContainer>
        )}
      </AnimatePresence>
    </>
  );
};
export default OrderPage;
