/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useUserData, useOrder } from "../utils/store.ts";
import { formatToBRL } from "../utils/helpers.ts";
import CartItem from "../components/CartItem.tsx";
import PaymentMethodSelector from "../components/PaymentMethodSelector.tsx";
import { useState } from "react";
import { useTotemColor } from "../utils/useTotemColor.ts";

export default function Cart() {
  const navigate = useNavigate();
  const { primary } = useTotemColor();
  const userData = useUserData((state) => state.userData);
  const { itens, total } = useOrder((s) => s.order);
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="flex flex-col h-svh overflow-hidden">
      <div className="px-4 pt-4 pb-6 flex flex-row items-center justify-between border-b border-border-color">
        <div className="flex flex-row items-center text-text-color">
          <img
            src={
              userData?.cfgTotem?.dsImgLogo &&
              userData.cfgTotem?.dsImgLogo.length
                ? userData.cfgTotem?.dsImgLogo
                : "/assets/icon.png"
            }
            alt="Logo do estabelecimento"
            className="size-32 rounded-xl"
          />
          <div className="pl-4">
            <span>Seu pedido em</span>
            <h1 className="font-bold text-2xl">
              {userData?.empresa?.dsFantasia &&
              userData.empresa?.dsFantasia.length
                ? userData.empresa?.dsFantasia
                : "Restaurante Teste"}
            </h1>
          </div>
        </div>
        <button
          onClick={() => navigate("/menu")}
          style={{
            borderColor: primary,
            color: primary,
          }}
          className="border-3 rounded-full h-11 w-35 font-semibold touchable"
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
        onToggle={() => setShowSelector(false)}
      />

      <div className="sticky bottom-1 flex border-t border-border-color w-full px-4 py-3 gap-2">
        <div
          style={{ color: primary }}
          className="w-1/2 flex items-center justify-center"
        >
          <span className="text-3xl font-bold">
            Total: {formatToBRL(total)}
          </span>
        </div>
        <button
          onClick={() => setShowSelector((v) => !v)}
          style={{
            backgroundColor: primary,
          }}
          className="rounded-2xl touchable flex flex-col justify-center items-center cart-text font-bold text-xl h-20 w-full p-4 shadow-md active:scale-95 transition"
        >
          <span className="text-2xl tracking-wider">Fazer pagamento</span>
        </button>
      </div>
    </div>
  );
}
