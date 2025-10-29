export default function QuantityCounter() {
  return (
    <div className="w-25 h-10 flex flex-row rounded-sm items-center justify-between ml-3 mb-3 gap-3 border-3">
      <button className="w-full h-full flex items-center justify-center touchable">
        -
      </button>
      <span className="font-semibold text-2xl">1</span>
      <button className="w-full h-full flex items-center justify-center touchable bg-red-500">
        +
      </button>
    </div>
  );
}
