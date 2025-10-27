import type { ProductType } from "../types/types";
import { formatToBRL } from "../utils/helpers";

interface Props {
  item: ProductType;
  onSelect?: (product: ProductType) => void;
}
export default function ProductCard({ item, onSelect }: Props) {
  const handleClick = () => {
    onSelect?.(item);
  };
  return (
    <>
      <button
        onClick={handleClick}
        className="bg-white flex flex-col items-center w-full pb-2 rounded-2xl overflow-hidden touchable"
      >
        <div className="w-full h-37.5 flex items-center justify-center object-contain">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="mt-2 flex flex-col items-center font-bold">
          <p>{item.name}</p>
          <p className="text-money">{formatToBRL(item.price)}</p>
        </div>
      </button>
    </>
  );
}
