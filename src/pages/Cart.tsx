/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useUserData, useOrder } from "../utils/store.ts";
import { formatToBRL } from "../utils/helpers.ts";
import CartItem from "../components/CartItem.tsx";
import PaymentMethodSelector from "../components/PaymentMethodSelector.tsx";
import { useState } from "react";

export default function Cart() {
  const navigate = useNavigate();
  const UserData = useUserData((state) => state.userData);
  const { itens, total } = useOrder((s) => s.order);
  const qtd = itens.reduce((acc, it) => acc + (it.quantidade ?? 1), 0);
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="flex flex-col h-svh overflow-hidden">
      <div className="px-4 pt-4 pb-6 flex flex-row items-center justify-between border-b border-gray-300">
        <div className="flex flex-row items-center text-text-color">
          <img
            src={
              UserData?.logo && UserData.logo.length
                ? UserData.logo
                : "/assets/icon.png"
            }
            alt="Logo do estabelecimento"
            className="size-32"
          />
          <div className="pl-4">
            <span>Seu pedido em</span>
            <h1 className="font-bold text-2xl">
              {UserData?.nmUsuario && UserData.nmUsuario.length
                ? UserData.nmUsuario
                : "Restaurante Teste"}
            </h1>
          </div>
        </div>
        <button
          onClick={() => navigate("/menu")}
          className="border-3 border-money rounded-full h-11 w-35 text-money font-semibold touchable"
        >
          Ver cardápio
        </button>
      </div>
      <div className="flex-1 overflow-y-auto h-[calc(100vh-12rem)]">
        {itens.map((item: any, i: number) => (
          <CartItem key={i} index={i} item={item} />
        ))}
      </div>
      <PaymentMethodSelector
        open={showSelector}
        onConfirm={(m) => console.log("Selecionado:", m)}
      />
      <button
        onClick={() => setShowSelector((v) => !v)}
        className=" rounded-2xl touchable sticky bottom-0 flex justify-center items-center bg-money cart-text text-xl h-20 p-4 mx-5"
      >
        Fazer pagamento Total: {formatToBRL(total)}
      </button>
    </div>
  );
}
