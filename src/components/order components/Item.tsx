import {Banknote, ChevronDown, CircleDollarSign, Package, Pencil, PillBottle, Trash} from "lucide-react";
import {useMemo, useState} from "react";
import type {product} from "../../types/type.ts";
import {useParams} from "react-router-dom";
import {useModalStore} from "../ui/modals/store.ts";
import {formatNumber} from "../../utils/formatter.ts";
import {AnimatePresence, motion} from "motion/react";
import {useFormStore} from "../../store/tools/formStore.ts";
import {useBvToModifyStore} from "../../store/orderStore.ts";

type Props = {
  id: string
  i: number;
  numberCard: string;
  name: string;
  products: product[]
}

const Item = ( data: Props ) => {
  const [showProducts, setShowProducts] = useState(false)
  const [isOver, setIsOver] = useState(false)
  const {fileId} = useParams()
  const { showModal } = useModalStore()
  const form = useFormStore()

  const setId = useBvToModifyStore(state => state.setId)

  const totalBv = useMemo(
    () => data.products.reduce((acc, p) => acc + p.bv * p.quantity, 0),
    [data.products]
  )

  const quantity = useMemo(
    () => data.products.reduce((acc, p) => acc + p.quantity, 0),
    [data.products]
  )

  const handleDeleteBvConfirmation = () => {
    setId(data.id)
    showModal(true, "deleteBv")
  }

  const handleBvToUpdate = () => {
    if (!fileId) return
    // setNewBv({ fileId, holder: { name: data.name, numberCard: data.numberCard }, products: data.products })
    form.setOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity:0, translateY:-10 }}
      animate={{ opacity:1, translateY:0 }}
      exit={{ opacity:0, translateX:-100 }}
      onMouseEnter={() => setIsOver(true)}
      onMouseLeave={() => setIsOver(false)}
      onClick={() => setShowProducts(!showProducts)}
      className={`sticky top-12 py-2  border-gray-300 text-gray-700  hover:bg-cyan-100 transition ${showProducts ? "bg-cyan-100" : "bg-white even:bg-gray-50"} `}
    >
      <div className="flex items-center gap-2 w-full text-sm">
        <span className={`h-6 min-w-9 grid place-items-center rounded-md text-xs ${data.products.length === 0 ? "bg-red-200" : "bg-cyan-100"} `}>
          {data.i + 1}
        </span>
        <p>{formatNumber(data.numberCard, [2, 2, 2, 2])}</p>
        <span className="border h-4 border-gray-300"></span>
        <p className="w-20 sm:w-50 flex-1 truncate">{data.name}</p>

        <div className="flex items-center mr-2">
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <PillBottle className="h-4 w-4" />
              <span className="text-sm w-4 text-center font-medium text-gray-600 select-none">{quantity}</span>
            </div>
            <span className="border h-4 border-gray-300"></span>
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4"/>
              <span className="text-sm w-10 font-medium text-center text-gray-600 select-none">{totalBv}</span>
            </div>
          </div>
          <AnimatePresence>
            {(isOver || showProducts) && (
              <motion.div
                initial={{ width:0 }}
                animate={{ width:63 }}
                exit={{ width:0, opacity:0 }}
                className="flex gap-2 overflow-hidden"
              >
                <button
                  onClick={handleBvToUpdate}
                  className="utilsBtn grid place-items-center bg-transparent hover:bg-gray-300"
                >
                  <Pencil size={16}/>
                </button>
                <button
                  onClick={handleDeleteBvConfirmation}
                  className="utilsBtn grid place-items-center text-red-400 bg-red-100"
                >
                  <Trash size={16}/>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setShowProducts(!showProducts)}
            className={`transition hover:bg-black/10 p-1 rounded-md ${showProducts && "rotate-180"} ${isOver ? "opacity-100" : "opacity-0"}`}
          >
            <ChevronDown size={16}/>
          </button>
        </div>
      </div>
      {showProducts && <ProductList products={data.products}/>}
    </motion.div>
  )
}
export default Item

const ProductList = ({ products }: { products: product[] }) => {
  const enrichedProducts = products
    .map(({ order, quantity }) => {
      const product = products.find((p) => p.order === order);
      if (!product) return null;
      return {
        ...product,
        quantity,
      };
    })
    .filter(Boolean);

  return (
    <div className="mt-4 mx-2 p-2 bg-white shadow-lg rounded-lg divide-y divide-gray-300 space-y-1 text-sm">
      {enrichedProducts.map((prod, index) => (
        <ProductItem
          key={index}
          name={prod!.name}
          quantity={prod!.quantity}
          bv={prod!.bv}
          price={prod!.price}
        />
      ))}
    </div>
  );
};

const ProductItem = (
  {
    name,
    quantity,
    price,
    bv
  } : {
    name: string;
    quantity: number;
    price: number | null;
    bv: number
  }
) => {


  const formatPrice = (value: number) =>
    value.toLocaleString("fr-FR", { minimumFractionDigits: 0 });

  const p = price !== null ? price : bv * 3600

  return (
    <div className="flex items-center gap-2 p-1">
      <p className="select-none truncate flex-1">{name}</p>
      <span className="border border-gray-300 h-4" />

      <div className="flex items-center gap-1 text-gray-700">
        <Package className="w-4 h-4" />
        <span className="text-sm select-none">{quantity}</span>
      </div>

      <span className="border border-gray-300 h-4" />

      <p className="w-20 select-none">bv : {bv * quantity}</p>

      <span className="border border-gray-300 h-4" />

      <div className="flex items-center gap-1 text-gray-700 w-32">
        <Banknote className="w-4 h-4" />
        <span className="text-sm select-none">{formatPrice(p * quantity)} Ar</span>
      </div>
    </div>
  )
}
