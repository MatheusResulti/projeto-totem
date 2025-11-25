import ProductCard from "../../components/ProductCard/ProductCard";
import ProductModal from "../../components/ProductModal/ProductModal";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import MenuSideBar from "../../components/MenuSideBar/MenuSideBar";
import type { ProductType } from "../../types/types";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import {
  useGroup,
  useOrder,
  useProduct,
  useCount,
  useUserData,
} from "../../utils/store";
import { formatToBRL } from "../../utils/helpers";
import { useTotemColor } from "../../utils/useTotemColor";
import { ShoppingCart } from "lucide-react";
import { asset } from "../../utils/asset";

export default function Menu() {
  const navigate = useNavigate();
  const defaultCapa = asset("/assets/defaultCapa.png");

  const { primary } = useTotemColor();
  const userData = useUserData((s) => s.userData);
  const GroupArr = useGroup((s) => s.groupArr);
  const ProductArr = useProduct((s) => s.productArr);
  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const order = useOrder((s) => s.order);
  const setOrder = useOrder((s) => s.setOrder);
  const { setQuantity } = useCount();
  const closeModalTimeoutRef = useRef<number | null>(null);

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

  useEffect(() => {
    const id = closeModalTimeoutRef.current;
    return () => {
      if (id !== null) clearTimeout(id);
    };
  }, []);

  const handleToggleProductModal = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => setSelectedProduct(null), 250);
    }
    setIsProductModalOpen(isOpen);
  };

  const handleSelectProduct = (product: ProductType) => {
    setSelectedProduct(product);
    handleToggleProductModal(true);
  };

  const handleCancel = () => {
    setOrder({
      cdEmpresa: 1,
      tpAtendimento: 2,
      dsAtendimento: "TOTEM",
      tpLocal: 1,
      cdUsuario: 0,
      dsRotulo: "",
      total: 0,
      itens: [],
    });
    setQuantity(1);
    setSelectedProduct(null);
    setIsProductModalOpen(false);
    navigate("/home");
  };

  function CartTotal() {
    const { total } = useOrder((s) => s.order);
    return (
      <div className="text-xl flex flex-row gap-4">
        <span>Total: {formatToBRL(total)}</span>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col text-text-color">
      <div
        style={{
          backgroundImage: `url(${userData?.capa || defaultCapa})`,
        }}
        className="bg-cover bg-center bg-no-repeat h-40 flex justify-end px-2 py-2"
      >
        <button
          onClick={handleCancel}
          className="bg-error text-2xl font-semibold border-2 border-white rounded-lg text-white p-2 h-15 touchable contain-content"
        >
          Cancelar
        </button>
      </div>
      <div className="flex-1 min-h-0 w-dvw flex bg-card-color">
        <div className="w-1/4 h-full p-5 flex flex-col gap-2">
          <MenuSideBar
            selectedGroup={selectedGroup}
            onSelectGroup={setSelectedGroup}
          />
        </div>
        <div className="bg-background-color relative flex-1 p-5 flex flex-col min-h-0">
          <h1 className="font-bold text-2xl">
            {GroupArr.find((g) => g.id === selectedGroup)?.name}
          </h1>
          <div className="flex-1 min-h-0 overflow-auto pb-24 scrollbar-none">
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
          <div className="absolute left-0 right-0 bottom-0 bg-background-color h-25 p-4">
            <button
              disabled={!order.itens.length}
              onClick={() => navigate("/cart")}
              style={{ backgroundColor: primary }}
              className={`rounded-2xl flex items-center justify-between text-white text-xl font-semibold w-full h-full px-6 py-4 touchable
                ${!order.itens.length ? "opacity-60" : ""}`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={28} />
                <div className="flex flex-col items-start">
                  <span>Carrinho</span>
                  {order.itens.length > 0 && (
                    <span className="text-sm opacity-90">
                      {order.itens.length} item(s)
                    </span>
                  )}
                </div>
              </div>

              {order.itens.length > 0 && <CartTotal />}
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
            setModalVisible={setIsProductModalOpen}
          />
        </ProductModal>
      ) : null}
    </div>
  );
}
