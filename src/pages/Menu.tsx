import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import MenuSideBar from "../components/MenuSideBar";
import type { ProductType } from "../types/types";
import ProductInfo from "../components/ProductInfo";
import { useGroup, useProduct } from "../utils/store";

export default function Menu() {
  const navigate = useNavigate();

  const GroupArr = useGroup((s) => s.groupArr);
  const ProductArr = useProduct((s) => s.productArr);
  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const closeModalTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  const filteredProducts = ProductArr.filter(
    (p) => p.groupId === selectedGroup
  );

  const handleToggleProductModal = (isOpen: boolean) => {
    if (isOpen) {
      if (closeModalTimeoutRef.current) {
        clearTimeout(closeModalTimeoutRef.current);
        closeModalTimeoutRef.current = undefined;
      }
    } else {
      closeModalTimeoutRef.current = window.setTimeout(() => {
        setSelectedProduct(null);
        closeModalTimeoutRef.current = undefined;
      }, 250);
    }

    setIsProductModalOpen(isOpen);
  };

  useEffect(() => {
    return () => {
      if (closeModalTimeoutRef.current) {
        clearTimeout(closeModalTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectProduct = (product: ProductType) => {
    setSelectedProduct(product);
    handleToggleProductModal(true);
  };

  return (
    <div className="h-dvh flex flex-col text-text-color">
      <div className="bg-[url(/assets/defaultCapa.png)] bg-cover bg-center bg-no-repeat h-40 flex justify-end px-2 py-2">
        <button
          onClick={() => navigate("/home")}
          className="bg-error text-sm font-semibold border-2 border-white rounded-lg text-white p-1 h-9 touchable"
        >
          Cancelar
        </button>
      </div>
      <div className="flex-1 min-h-0 w-dvw flex">
        <div className="w-1/4 h-full p-5 flex flex-col gap-2">
          <MenuSideBar
            selectedGroup={selectedGroup}
            onSelectGroup={setSelectedGroup}
          />
        </div>
        <div className="bg-gray-200 relative flex-1 p-5 flex flex-col min-h-0">
          <h1 className="font-bold text-xl">
            {GroupArr.find((g) => g.id === selectedGroup)?.name}
          </h1>
          <div className="flex-1 min-h-0 overflow-auto pb-24">
            <div className="grid grid-cols-2 gap-5 pt-2">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  item={product}
                  onSelect={handleSelectProduct}
                />
              ))}
            </div>
          </div>
          <div className="absolute left-0 right-0 bottom-0 bg-white h-20 p-4">
            <button
              onClick={() => navigate("/src/pages/Cart.tsx")}
              className="bg-money rounded-lg flex items-center justify-between overflow-hidden cart-text text-start w-full h-full px-5 touchable"
            >
              Carrinho
              <p className="cart-text">R$6,00</p>
            </button>
          </div>
        </div>
      </div>
      {selectedProduct ? (
        <ProductModal
          openModal={isProductModalOpen}
          setOpenModal={handleToggleProductModal}
          showCloseButton
          size="auto"
          maxWidthClassName="w-full max-w-3xl"
          maxHeightClassName="max-h-[90vh]"
        >
          <ProductInfo
            product={selectedProduct}
            onClose={() => handleToggleProductModal(false)}
            onAdd={(p) => {
              alert("Adicionado ao carrinho");
            }}
          />
        </ProductModal>
      ) : null}
    </div>
  );
}
