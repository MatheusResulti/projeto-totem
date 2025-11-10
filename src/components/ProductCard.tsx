import type { ProductType } from "../types/types";
import { formatToBRL } from "../utils/helpers";
import { useTotemColor } from "../utils/useTotemColor";

interface Props {
  item: ProductType;
  onSelect?: (product: ProductType) => void;
}
export default function ProductCard({ item, onSelect }: Props) {
  const { primary } = useTotemColor();
  const handleClick = () => {
    onSelect?.(item);
  };
  return (
    <>
      <button
        draggable={false}
        onClick={handleClick}
        className="bg-white flex flex-col items-center w-full pb-2 rounded-2xl overflow-hidden touchable"
      >
        <div className="w-full h-38 flex items-center justify-center object-contain mt-3">
          <img
            src={item.image || "./assets/sem-foto.png"}
            alt={item.name}
            className="h-full rounded-lg"
          />
        </div>
        <div className="mt-2 text-lg flex flex-col items-center font-bold">
          <p>{item.name}</p>
          {item.price && (
            <p style={{ color: primary }}>{formatToBRL(item.price)}</p>
          )}
        </div>
      </button>
    </>
  );
}
