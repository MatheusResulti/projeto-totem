type Method = "pix" | "cartao";

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
          "w-fit h-fit self-center justify-center rounded-xl border border-secondary mb-4 overflow-hidden flex flex-col text-text-color origin-bottom transition-all duration-300",
          open
            ? "scale-y-100 opacity-100 translate-y-0"
            : "scale-y-0 opacity-0 translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex flex-col h-full">
          <div className="bg-secondary w-full p-5">
            <span className="text-4xl font-extrabold text-white">
              MÉTODO DE PAGAMENTO
            </span>
          </div>
          <div className="flex justify-between text-4xl text-secondary font-bold gap-3 p-3">
            <button
              onClick={() => selectAndConfirm("pix")}
              className="p-3 border-2 border-border-color rounded-xl touchable min-h-25 min-w-50"
            >
              PIX
            </button>
            <button
              onClick={() => selectAndConfirm("cartao")}
              className="p-3 border-2 border-border-color rounded-xl touchable min-w-50"
            >
              CARTÃO
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
