import { useCount } from "../utils/store";
import { useTotemColor } from "../utils/useTotemColor";

export default function QuantityCounter() {
  const { primary } = useTotemColor();
  const { quantity, inc, dec } = useCount();

  const isDisabled = quantity <= 1;

  return (
    <div className="flex w-36 h-12 items-center justify-between rounded-md border border-gray-300 overflow-hidden shadow-sm bg-white">
      <button
        onClick={dec}
        disabled={isDisabled}
        className={`flex-1 h-full flex items-center justify-center text-2xl font-bold transition-colors duration-150 ${
          isDisabled ? "text-gray-400" : "touchable"
        }`}
        style={{
          color: isDisabled ? "#9ca3af" : primary,
        }}
      >
        −
      </button>

      <span className="w-1/3 text-center font-semibold text-2xl select-none">
        {quantity}
      </span>

      <button
        onClick={inc}
        className="flex-1 h-full flex items-center justify-center text-2xl font-bold touchable"
        style={{ color: primary }}
      >
        +
      </button>
    </div>
  );
}
