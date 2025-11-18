import { CircleDollarSign } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useProductStore } from "../../../store/productStore.ts";
import type {product} from "../../../types/type.ts";
import {AnimatePresence, motion} from "motion/react";

type Props = {
  product: product
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

const ProductCard = ({ product, setQuery }: Props) => {
  const { products, setProduct } = useProductStore();
  const [isKeyDown, setIsKeyDown] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (product.quantity >= 1) setClicked(true);
  }, [product.quantity]);

  const handleClicked = () => {
    const newClicked = !clicked;
    setClicked(newClicked);

    const p = products.find(p => p.name === product.name)
    if (!p) return
    setProduct({ ...p, quantity: newClicked ? 1 : 0 });

    setQuery("");
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={() => {}}
      className="flex gap-2 outline-none"
    >
      <div
        onClick={handleClicked}
        className={`
          cursor-pointer hover:bg-gray-50 flex-1
          outline-2 border-1 h-10 rounded-lg border-gray-300 flex items-center justify-between py-1 px-2 transition
          ${clicked ? "outline-cyan-200" : "outline-transparent"}
        `}
      >
        <p className="truncate text-sm text-gray-600">{product.name}</p>
        <div className="flex items-center gap-2 text-gray-700">
          <CircleDollarSign className="h-4 w-4" />
          <span className="text-sm min-w-8 text-center font-medium text-gray-600 select-none">
            {product.bv}
          </span>
        </div>
      </div>
      <AnimatePresence>
        {clicked && (
          <motion.input
            initial={{ scale:0, width:0 }}
            animate={{ scale:1, width:48 }}
            exit={{ width:0 }}
            type="number"
            value={product.quantity}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!isNaN(value)) {
                setProduct({ ...product, quantity: value });
              }
              setIsKeyDown(true)
              setTimeout(() => setIsKeyDown(false), 300)
            }}
            className={`
            ${isKeyDown ? "outline-cyan-200" : "outline-transparent"}
            outline-2
            w-12 border rounded-lg border-gray-300 text-center text-gray-700 transition
          `}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductCard;
