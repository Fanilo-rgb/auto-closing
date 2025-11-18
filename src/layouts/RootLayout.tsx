import Header from "../components/header/Header.tsx";
import {useModalStore} from "../components/ui/modals/store.ts";
import Modal from "../components/ui/modals/Modal.tsx";
import { AnimatePresence } from "motion/react"
import {Outlet} from "react-router-dom";
import {useProductStore} from "../store/productStore.ts";
import {useEffect} from "react";
import Navbar from "../components/navbar/Navbar.tsx";
import {useNavbarStore} from "../store/tools/navbarStore.ts";

const RootLayout = () => {
  const { show } = useModalStore()

  const navbar = useNavbarStore()

  const { products, getProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) getProducts();
  }, []);

  return (
    <>
      <div className="flex relative h-screen w-screen selection:bg-cyan-200 selection:text-cyan-800">
        <AnimatePresence>
          {navbar.isOpen && (
            <Navbar/>
          )}
        </AnimatePresence>
        <div className="relative flex-1 flex flex-col">
          <Header/>
          <div className="absolute top-11.5 bottom-0 w-full overflow-auto">
            <Outlet/>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {show.value && <Modal />}
      </AnimatePresence>
    </>
  )
}
export default RootLayout
