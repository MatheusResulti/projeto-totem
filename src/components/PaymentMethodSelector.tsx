import { useTotemColor } from "../utils/useTotemColor";

type Method = "pix" | "credito" | "debito";

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
  const { primary } = useTotemColor();
  const selectAndConfirm = (m: Method) => {
    onConfirm?.(m);
    onToggle?.();
  };

  return (
    <>
      <div
        style={{ borderColor: primary }}
        className={[
          "w-fit h-fit self-center rounded-xl border mb-4 overflow-hidden flex flex-col text-text-color origin-bottom transition-all duration-300",
          open
            ? "scale-y-100 opacity-100 translate-y-0"
            : "scale-y-0 opacity-0 translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex flex-col h-full">
          <div
            style={{ backgroundColor: primary }}
            className="w-full p-5 text-center"
          >
            <span className="text-4xl font-extrabold text-white">
              MÉTODO DE PAGAMENTO
            </span>
          </div>
          <div
            style={{ color: primary }}
            className="flex justify-between text-4xl font-bold gap-3 p-3"
          >
            <button
              onClick={() => selectAndConfirm("pix")}
              className="p-3 border-2 border-border-color rounded-xl touchable min-h-25 min-w-50"
            >
              PIX
            </button>
            <button
              onClick={() => selectAndConfirm("debito")}
              className="p-3 border-2 border-border-color rounded-xl touchable min-w-50"
            >
              DÉBITO
            </button>
            <button
              onClick={() => selectAndConfirm("credito")}
              className="p-3 border-2 border-border-color rounded-xl touchable min-w-50"
            >
              CRÉDITO
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
