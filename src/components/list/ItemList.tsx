import { useProductStore } from "../../store/productStore.ts";
import { Trash } from "lucide-react";
import { useMemo, useState } from "react";
import type { product } from "../../types/type.ts";
import { motion } from "motion/react";

const ItemList = () => {
  const { products } = useProductStore();

  const prod = useMemo(
    () =>
      products
        .filter((p) => p.quantity > 0)
        .map((p) => ({ ...p, price: p.price ? p.price : p.bv * 3600 })),
    [products]
  );

  const list = useMemo(
    () => prod.map((p) => <Item key={p.order} product={p} />),
    [prod]
  );

  const totalAr = useMemo(
    () => prod.reduce((acc, p) => acc + (p.price ?? 0) * p.quantity, 0),
    [prod]
  );

  const totalBv = useMemo(
    () => prod.reduce((acc, p) => acc + p.bv * p.quantity, 0),
    [prod]
  );

  return (
    <motion.div
      initial={{ scaleY: 0, opacity:0 }}
      animate={{ scaleY: 1, opacity:1 }}
      exit={{ scaleY:0, opacity: 0 }}
      className="h-fit max-h-96 w-xs shadow-md rounded-xl p-2 bg-white absolute right-full mr-2 top-0"
    >
      <h1 className="text-center pb-1">Produit dans la liste</h1>
      <hr className="mb-1" />
      {list.length === 0 && (
        <p className="text-center text-gray-500">Votre liste est vide</p>
      )}
      {list}
      <hr className="my-1" />
      <div className="flex p-1 font-semibold justify-between">
        <p>{totalAr.toLocaleString()} ar</p>
        <p className="w-14 text-center bg-gray-100 rounded">{totalBv} bv</p>
      </div>
    </motion.div>
  );
};
export default ItemList;

type itemProps = {
  product: product;
};

const Item = ({ product }: itemProps) => {
  const [isHover, setIsHover] = useState(false);
  const { products, setProduct } = useProductStore();

  const handleDelete = () => {
    const p = products.find((p) => p.name === product.name);
    if (!p) return;
    setProduct({ ...p, quantity: 0 });
  };

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="flex gap-2 items-center"
    >
      <div className="text-sm flex-1 bg-transparent hover:bg-gray-100 p-1 rounded-lg flex gap-2">
        <div className="flex-1">
          <p className="truncate max-w-38">{product.name}</p>
        </div>
        <span className="border my-1 border-gray-300" />
        <p className="w-6 text-center">{product.quantity}</p>
        <span className="border my-1 border-gray-300" />
        <p className="w-12 text-center">{product.bv * product.quantity} bv</p>
      </div>
      {isHover && (
        <button
          onClick={handleDelete}
          className="utilsBtn grid place-items-center bg-red-100 text-red-400"
        >
          <Trash size={16} />
        </button>
      )}
    </div>
  );
};
