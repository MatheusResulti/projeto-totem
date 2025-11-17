/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTotemColor } from "../../utils/useTotemColor";

type Method = "pix" | "credito" | "debito";

type Props = {
  open?: boolean;
  onClose?: (value?: any) => void;
  onConfirm?: (m: Method) => void;
};

export default function PaymentMethodSelector({
  open = false,
  onClose,
  onConfirm,
}: Props) {
  const navigate = useNavigate();
  const { primary } = useTotemColor();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const selectAndGo = (m: Method) => {
    onConfirm?.(m);
    onClose?.();
    if (m === "pix") navigate("/pagamento/pix");
    else navigate(`/pagamento/cartao/${m}`);
  };

  return (
    <div
      ref={wrapperRef}
      style={{ borderColor: primary }}
      className={
        "w-full h-fit self-center rounded-xl border mb-4 overflow-hidden flex flex-col text-text-color bg-white"
      }
    >
      <div className="flex flex-col h-full w-full">
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
            onClick={() => selectAndGo("pix")}
            className="payment-button touchable w-full"
          >
            PIX
          </button>
          <button
            onClick={() => selectAndGo("credito")}
            className="payment-button touchable w-full"
          >
            CRÉDITO
          </button>
          <button
            onClick={() => selectAndGo("debito")}
            className="payment-button touchable w-full"
          >
            DÉBITO
          </button>
        </div>
      </div>
    </div>
  );
}
