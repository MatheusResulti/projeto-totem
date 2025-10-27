import { useOrder } from "../utils/store";
import { productMock } from "../utils/mocks/productMock";
import type { ItemType, ProductType } from "../types/types";

type CartItemProps = {
  item: ItemType;
  index: number;
};

export default function CartItem({ item, index }: CartItemProps) {
  // const { userData } =

  // const { order, setOrder } = useOrder((state) => ({
  //   order: state.order,
  //   setOrder: state.setOrder,
  // }));

  return (
    <div className="w-full flex relative border-b-2 border-gray-300 p-4">
      <img src="/assets/produtos/cheeseburger.png" className="h-30, w-30" />
      <div className="flex flex-col ml-5 text-text-color">
        <span>1x</span>
        <span>Chesse Burger</span>
        <span className="text-gray-500 text-sm">aaaaaaaaaaaa</span>
        <button className="text-red-700 text-start font-semibold touchable ">
          Remover
        </button>
      </div>
      <span className="text-money absolute right-10 font-semibold">
        R$ 6,00
      </span>
    </div>
  );
}
