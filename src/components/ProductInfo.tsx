/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatToBRL } from "../utils/helpers";
import type { ProductType } from "../types/types";
import { ShoppingBasket } from "lucide-react";
import { useState } from "react";
import SizeSelector from "./SizeSelector";
import { useComplements, useOrder, useSizes } from "../utils/store";
import ComplementSelector from "./ComplementSelector";
import toast from "react-hot-toast";
import QuantityCounter from "./QuantityCounter";

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
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedComplements, setSelectedComplements] = useState<number[]>([]);
  const maxChars = 200;
  const sizes = useSizes((s) => s.sizes);
  const complements = useComplements((s) => s.complements);
  // const { order, setOrder } = useOrder((state: any) => ({
  //   order: state.order,
  //   setOrder: state.setOrder,
  // }));
  //   const [sizesData, setSizesData] = useState([
  //   ...sizes.filter((item: any) => item.productId === product.id),
  // ]);
  //   const [complementsData, setComplementsData] = useState([
  //   ...complements.filter((item: any) => item.mergedId === product.id),
  // ]);

  const toggleComplement = (id: number) => {
    setSelectedComplements((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  //   const [itemData, setItemData] = useState({
  //   ...product,
  //   value: sizesData.length ? 0 : product.price,
  // });

  //   const selectComplement = (item: any, i: number) => {
  //   let data = [...complementsData];
  //   let comp = { ...item, selected: !item.selected };

  //   if (comp.selected) {
  //     setItemData({ ...itemData, value: itemData.value + comp.value });
  //   } else {
  //     setItemData({ ...itemData, value: itemData.value - comp.value });
  //   }
  //   data[i] = comp;
  //   setComplementsData([...data]);
  // };

  //   const selectSize = (item: any, i: number) => {
  //   setSelectedSize({ ...item });
  //   let compValue: number = 0;
  //   complementsData.map((c: any) => {
  //     if (c.selected) {
  //       return (compValue = compValue + c.value);
  //     }
  //   });
  //   setItemData({ ...itemData, value: item.value + compValue });
  // };

  return (
    <div className="flex flex-col max-h-[80vh]">
      <div className="flex flex-col md:flex-row items-center px-5 10 gap-6 border-b-1 border-b-gray-200 h-70 ">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-50 h-50 rounded-lg object-contain"
          />
        ) : (
          <div className="flex items-center justify-center w-50 h-50 rounded-lg bg-gray-200">
            <ShoppingBasket className="size-[56px] text-basket" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-bold text-2xl text-text-color mb-2">
            {product.name}
          </span>
          <span className="text-md font-light">{product.description}</span>
        </div>
      </div>
      <div className="px-4 pt-8 overflow-y-scroll">
        <div className="mb-3">
          <span className="text-sm text-text-color font-semibold ml-1">
            Qual o tamanho da sua fome?
          </span>
        </div>
        {sizes.map((size: any) => (
          <SizeSelector
            key={size.id}
            id={size.id}
            selected={selectedSize === size.id}
            onSelect={setSelectedSize}
            name={size.name}
          />
        ))}
        <div className="mb-3 mt-4">
          <span className="text-sm text-text-color font-semibold ml-1">
            Adicionais
          </span>
        </div>
        {complements.map((complement: any) => (
          <ComplementSelector
            key={complement.id}
            id={complement.id}
            selected={selectedComplements.includes(complement.id)}
            onSelect={toggleComplement}
            name={complement.name}
          />
        ))}
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
      <div className="absolute left-0 right-0 bottom-0 flex justify-between items-center h-20 p-4">
        <QuantityCounter />
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
    </div>
  );
}
