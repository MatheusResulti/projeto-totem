/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useUserData } from "../utils/store.ts";
import CartItem from "../components/CartItem.tsx";
import { useOrder } from "../utils/store.ts";
import type { ItemType } from "../types/types.ts";
import { ShoppingBasket } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();

  const UserData = useUserData((state) => state.userData);

  // const { order } = useOrder((state) => ({
  //   order: state.order,
  // }));

  return (
    <>
      <div className="px-4 pt-4 pb-6 flex flex-row items-center justify-between border-b-1 border-gray-300">
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
      <div>
        {/* {order.itens.length
          ? order.itens.map((item: any, i: number) => ( */}
        <CartItem />
        {/* //   ))
          // : null} */}
      </div>
      <div className="absolute left-0 right-0 bottom-0 bg-white h-20 p-4">
        <button
          onClick={() => navigate("/payment")}
          className="bg-money rounded-lg flex items-center justify-between overflow-hidden cart-text text-start w-full h-full px-5 touchable"
        >
          Fazer pagamento
          <p className="cart-text">R$6,00</p>
        </button>
      </div>
    </>
  );
}
