import { formatToBRL } from "../utils/helpers";

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
  return (
    <button
      onClick={() => action(item, i)}
      className="w-full h-14 p-3 border-b-1 border-border-color flex items-center justify-between touchable"
    >
      <span className="text-gray-800 font-medium">
        {item.name}
        {item.price && (
          <>
            {" - "}
            <span className="text-money font-semibold">
              {formatToBRL(item.price)}
            </span>
          </>
        )}
      </span>
      <div
        className={`w-5 h-5 rounded-full border border-border-color bg-gray-300 touchable
          ${selected ? "bg-money" : "bg-gray-300"}
        `}
      ></div>
    </button>
  );
}
