import type { ProductType } from "../../types/types";
import { asset } from "../../utils/asset";
import { formatToBRL } from "../../utils/helpers";

interface Props {
  item: ProductType;
  onSelect?: (product: ProductType) => void;
}
export default function ProductCard({ item, onSelect }: Props) {
  const semFoto = asset("/assets/sem-foto.png");
  const handleClick = () => {
    onSelect?.(item);
  };
  return (
    <>
      <button
        draggable={false}
        onClick={handleClick}
        className="bg-card-color flex flex-col items-center w-full pb-2 rounded-lg overflow-hidden touchable gap-2"
      >
        <div className="w-full h-40 flex items-center justify-center">
          <img
            src={item.image || semFoto}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-md font-semibold">{item.name}</p>
          {item.price && (
            <p className="font-medium text-sm">{formatToBRL(item.price)}</p>
          )}
        </div>
      </button>
    </>
  );
}
