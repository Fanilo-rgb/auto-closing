import {useNewBvStore} from "../../store/orderStore.ts";
import { AnimatePresence, motion } from 'motion/react';
import {useState} from "react";
import {Trash} from "lucide-react";

const ProductList = () => {
  const [isHover, setIsHover] = useState(-1)

  const { newBv, setNewBv } = useNewBvStore()

  if (!newBv) return null

  const handleQuantityChange = (index: number, value: string) => {
    const newProducts = [...newBv.products];
    newProducts[index].quantity = Number(value);
    setNewBv({ ...newBv, products: newProducts });
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...newBv.products];
    newProducts.splice(index, 1);
    setNewBv({ ...newBv, products: newProducts });
  };

  return (
    <div className="absolute top-0 bottom-0 w-full overflow-auto">
      <AnimatePresence>
        {newBv.products.length > 0 ? (
          newBv.products.map((item, i) => (
            <motion.div
              initial={{ opacity:0, translateY:-10 }}
              animate={{ opacity:1, translateY:0 }}
              exit={{ opacity:0, translateX:-100 }}
              onMouseEnter={() => setIsHover(i)}
              onMouseLeave={() => setIsHover(-1)}
              key={i}
              className="flex text-gray-700 py-2 hover:bg-gray-100 rounded-lg px-2"
            >
              <div className="flex-1 truncate pr-2">{item.name}</div>
              <input
                className="border w-12 text-center rounded-md mr-2"
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(i, e.target.value)}
              />
              <AnimatePresence>
                {isHover === i && (
                  <motion.button
                    initial={{ width:0, minWidth:0 }}
                    animate={{ width:26 }}
                    exit={{ width:0, minWidth:0 }}
                    type="button"
                    onClick={() => handleRemoveProduct(i)}
                    className="utilsBtn grid place-items-center text-red-400 bg-red-100 overflow-hidden"
                  >
                    <Trash size={16} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-center py-4"
          >
            Il n&apos;y a pas encore de bv
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
export default ProductList
