import { useCount } from "../utils/store";

export default function QuantityCounter() {
  const { quantity, inc, dec } = useCount();

  return (
    <div className="flex w-36 h-12 items-center justify-between rounded-md border border-gray-300 overflow-hidden shadow-sm bg-white">
      <button
        onClick={dec}
        className={`flex-1 h-full flex items-center justify-center text-2xl font-bold transition-colors ${
          quantity <= 1 ? "text-gray-400" : "text-money hover:bg-money/10"
        }`}
        disabled={quantity <= 1}
      >
        −
      </button>

      <span className="w-1/3 text-center font-semibold text-2xl select-none">
        {quantity}
      </span>

      <button
        onClick={inc}
        className="flex-1 h-full flex items-center justify-center text-2xl font-bold text-money hover:bg-money/10 transition-colors"
      >
        +
      </button>
    </div>
  );
}
