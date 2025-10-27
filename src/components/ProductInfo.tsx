import { formatToBRL } from "../utils/helpers";
import type { ProductType } from "../types/types";
import { ShoppingBasket } from "lucide-react";
import { useState } from "react";

type ProductInfoProps = {
  product: ProductType;
  onClose: () => void;
  onAdd?: (product: ProductType) => void;
};

export default function ProductInfo({
  product,
  onClose,
  onAdd,
}: ProductInfoProps) {
  const [text, setText] = useState("");
  const maxChars = 200;
  return (
    <>
      <div className="flex flex-col md:flex-row items-center px-5 10 gap-6 border-b-1 border-b-gray-200 h-70">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-fit h-11/12 object-contain"
          />
        ) : (
          <div className="w-[300px] h-[250px] flex items-center justify-center bg-gray-200">
            <ShoppingBasket className="size-[56px] text-basket" />
          </div>
        )}
        <p className="font-bold text-2xl text-text-color">{product.name}</p>
      </div>
      <div className="px-4 pt-8">
        <div className="flex flex-row justify-between px-1">
          <span className="text-sm text-gray-600/70 font-semibold">
            Observação
          </span>
          <span
            className={`text-sm  ${
              text.length >= maxChars ? "text-red-500" : "text-gray-600/70"
            }`}
          >
            {text.length}/{maxChars}
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          maxLength={maxChars}
          placeholder="Ex: remover alface e tomate"
          className="border border-gray-300 rounded-lg mt-3 pl-2 pt-[10px] text-text-color w-full resize-none overflow-hidden h-12"
        />
      </div>
      <div className="absolute left-0 right-0 bottom-0 flex justify-end bg-white h-20 p-4">
        <button
          className="cart-text touchable bg-money items-center rounded-lg h-full w-1/2 flex px-4"
          onClick={() => {
            onAdd?.(product);
            onClose();
          }}
        >
          Adicionar
        </button>
        <span className="cart-text absolute right-9 bottom-7 pointer-events-none">
          {formatToBRL(product.price)}
        </span>
      </div>
    </>
  );
}
