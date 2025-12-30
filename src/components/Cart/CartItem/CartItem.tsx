/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import type { ItemType } from "../../../types/types";
import { formatToBRL } from "../../../utils/helpers";
import { useOrder, useProduct } from "../../../utils/store";

type CartItemProps = {
  item: ItemType;
  index: number;
};

export default function CartItem({ item, index }: CartItemProps) {
  const navigate = useNavigate();
  const products = useProduct((s) => s.productArr);
  const productData = products.find((p) => p.id === item.produto_id);
  const order = useOrder((s) => s.order);
  const setOrder = useOrder((s) => s.setOrder);
  const adicionaisFiltrados = (item.adicionais ?? []).filter((a) => a?.name);

  const removeItem = () => {
    const itemObj = { ...item, delete: true };
    const itensArr = [...order.itens];
    itensArr[index] = itemObj;
    const newItems = itensArr.filter((i: any) => i.delete !== true);

    const adicionaisTotal =
      item.adicionais?.reduce(
        (acc: number, adic: any) => acc + (adic.valor || 0),
        0
      ) || 0;

    const itemTotal = (item.valor_unitario + adicionaisTotal) * item.quantidade;
    const newTotal = order.total - itemTotal;

    setOrder({ ...order, itens: newItems, total: Math.max(newTotal, 0) });
    if (!newItems.length) {
      navigate("/menu");
    }
  };

  return (
    <div className="w-full flex relative border-b border-border-color p-4 items-center">
      <img
        src={productData?.image}
        className="w-20 h-fit rounded-lg object-contain"
      />

      <div className="flex flex-col ml-5 text-text-color justify-center gap-1 flex-1 min-w-0 pr-28">
        <div className="flex flex-row gap-2">
          <span className="text-gray-500">{item.quantidade}x</span>
          <span className="font-semibold">{item.dsProduto}</span>
        </div>

        <div className="flex flex-col text-text-color justify-center gap-1 min-w-0">
          {adicionaisFiltrados.length > 0 && (
            <ul className="text-xs text-gray-500 space-y-0.5">
              {adicionaisFiltrados.map((a, i) => (
                <li
                  key={`${a.adicional_id ?? a.name}-${i}`}
                  className="flex items-center gap-1"
                >
                  {a.name}
                </li>
              ))}
            </ul>
          )}

          <span className="text-gray-500 text-sm truncate block">
            {item.observacao}
          </span>
        </div>

        <button
          onClick={removeItem}
          className="w-fit text-error text-start font-semibold touchable"
        >
          Remover
        </button>
      </div>

      <span
        className="text-lg text-text-color absolute right-10 font-semibold"
      >
        {formatToBRL(item.price)}
      </span>
    </div>
  );
}
