import { formatToBRL } from "../../utils/helpers";
import { useTotemColor } from "../../utils/useTotemColor";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AditionalItemProps = {
  item: any;
  i: number;
  action?: any;
  selected?: boolean;
};

export default function AditionalItem({
  item,
  i,
  action,
  selected = false,
}: AditionalItemProps) {
  const { primary } = useTotemColor();

  return (
    <button
      onClick={() => action(item, i)}
      className="w-full h-14 px-2 py-4 border-b border-gray-800 flex items-center justify-between touchable"
    >
      <span className="text-text-color font-medium">
        {item.name}
        {item.price !== 0 && (
          <>
            {" - "}
            <span className="font-light text-text-color">
              {formatToBRL(item.price)}
            </span>
          </>
        )}
      </span>
      <div
        className={`w-5 h-5 rounded-full touchable`}
        style={{
          backgroundColor: selected
            ? (primary ?? "var(--color-secondary)")
            : "#d1d5db",
        }}
      ></div>
    </button>
  );
}
