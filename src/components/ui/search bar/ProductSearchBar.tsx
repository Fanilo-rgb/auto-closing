import {X} from "lucide-react";
import React, {useState} from "react";
import {useProductStore} from "../../../store/productStore.ts";
import type {product} from "../../../types/type.ts";
import {useNewBvStore} from "../../../store/orderStore.ts";
import illustration from "../../../assets/illustrations/undraw_choose.svg"

const ProductSearchBar = () => {
  const [query, setQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const {products} = useProductStore()
  const { newBv, setNewBv } = useNewBvStore()

  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      String(p.bv).includes(query)
    );
  });

  const productList = filteredProducts.slice(0, 5);

  if (!newBv?.holder.name || !newBv?.holder.numberCard) return(
    <div className="h-full flex flex-col gap-10 justify-center items-center text-gray-700 p-2 rounded-lg text-sm">
      <img src={illustration} alt="une image d'une personne qui choisi parmis les box" className="w-50"/>
      <p className="text-center">
        Veuillez completer le numero de la carte et le nom de la personne 🤗
      </p>
    </div>
  )

  const addProduct = (p: product) => {

    const existingIndex = newBv.products.findIndex((x) => x.name === p.name);

    if (existingIndex !== -1) {
      const newProducts = [...newBv.products];
      newProducts[existingIndex] = {
        ...newProducts[existingIndex],
        quantity: newProducts[existingIndex].quantity + 1,
      };
      setNewBv({ ...newBv, products: newProducts });
    } else {
      setNewBv({
        ...newBv,
        products: [...newBv.products, { ...p, quantity: 1 }],
      });
    }

    setQuery("");
    setIsTyping(false);
    setSelectedIndex(-1);
  };

  const handleResetQuery = () => {
    setQuery("");
    setIsTyping(false);
    setSelectedIndex(-1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(e.target.value.length > 0);
    setSelectedIndex(-1);
  };

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isTyping) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < productList.length - 1 ? prev + 1 : 0
      );
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : productList.length - 1
      );
    }
    if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      addProduct(productList[selectedIndex]);
    }
  };

  return (
    <div className="w-full flex items-center gap-2">
      <div className="relative w-full">
        <div className="flex gap-2">
          <input
            className="flex-1"
            type="text"
            placeholder="recherche ..."
            onChange={handleSearch}
            onKeyDown={handleSearchKey}
            value={query}
            onBlur={() => {
              setTimeout(() => {
                setQuery("")
                setIsTyping(false)
              }, 100)
            }}
          />
          <div
            className="cursor-pointer border w-8 grid place-items-center rounded-lg hover:bg-red-100 hover:border-red-500 transition text-gray-500 hover:text-red-500"
            onClick={handleResetQuery}
          >
            <X size={18} />
          </div>
        </div>

        {isTyping && (
          <ul className="absolute bg-white z-50 shadow-lg w-full mt-2 rounded-lg overflow-hidden">
            {productList.map((p, i) => (
              <li
                key={p.name}
                className={`flex cursor-pointer py-1 px-2 ${
                  selectedIndex === i ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
                onClick={() => addProduct(p)}
              >
                <span className="flex-1">{p.name}</span>
                <span>{p.bv}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
export default ProductSearchBar
