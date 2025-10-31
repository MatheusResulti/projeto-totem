type Method = "pix" | "debito" | "credito";

type Props = {
  open?: boolean;
  onToggle?: () => void;
  onConfirm?: (m: Method) => void;
};

export default function PaymentMethodSelector({
  open = false,
  onToggle,
  onConfirm,
}: Props) {
  const selectAndConfirm = (m: Method) => {
    onConfirm?.(m);
    onToggle?.();
  };

  return (
    <>
      <div
        className={[
          "w-2/3 h-1/4 self-center items-center justify-center rounded-xl border border-gray-200 mb-4 shadow-lg overflow-hidden  flex flex-col  text-text-color origin-bottom transition-all duration-300",
          open
            ? "scale-y-100 opacity-100 translate-y-0"
            : "scale-y-0 opacity-0 translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex flex-col gap-10">
          <span className="text-3xl font-bold text-gray-700">
            Escolha o método de pagamento
          </span>

          <div className="flex justify-between text-2xl font-semibold">
            <button
              onClick={() => selectAndConfirm("pix")}
              className="p-3 border rounded-xl touchable min-h-20 min-w-40"
            >
              PIX
            </button>
            <button
              onClick={() => selectAndConfirm("debito")}
              className="p-3 border rounded-xl touchable min-w-40"
            >
              Débito
            </button>
            <button
              onClick={() => selectAndConfirm("credito")}
              className="p-3 border rounded-xl touchable min-w-40"
            >
              Crédito
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
