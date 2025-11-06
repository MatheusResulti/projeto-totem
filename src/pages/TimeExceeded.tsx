import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCount, useOrder } from "../utils/store";

export default function TimeExceeded() {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  const [openCount, setOpenCount] = useState(() => {
    const saved = sessionStorage.getItem("timeExceededOpens");
    return saved ? parseInt(saved, 10) : 0;
  });

  const setOrder = useOrder((s) => s.setOrder);
  const { setQuantity } = useCount();

  const resetOrderAndGoHome = useCallback(() => {
    setOrder({
      cdEmpresa: 1,
      tpAtendimento: 2,
      dsAtendimento: "TOTEM",
      tpLocal: 1,
      cdUsuario: 0,
      dsRotulo: "",
      total: 0,
      itens: [],
    });
    setQuantity(1);
    sessionStorage.setItem("timeExceededOpens", "0");
    navigate("/home");
  }, [navigate, setOrder, setQuantity]);

  useEffect(() => {
    const next = openCount + 1;
    setOpenCount(next);
    sessionStorage.setItem("timeExceededOpens", String(next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (openCount >= 3) {
      resetOrderAndGoHome();
    }
  }, [openCount, resetOrderAndGoHome]);

  useEffect(() => {
    if (openCount >= 3) return;

    setCount(10);
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resetOrderAndGoHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [openCount, resetOrderAndGoHome]);

  const handleReturn = () => {
    if (openCount < 3) {
      navigate(-1);
    } else {
      resetOrderAndGoHome();
    }
  };

  return (
    <div
      onClick={handleReturn}
      className="h-svh flex flex-col items-center justify-center gap-12 text-center text-text-color select-none bg-white"
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="#ef4444"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={(2 * Math.PI * 90 * (10 - count)) / 10}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="text-6xl font-extrabold text-error animate-pulse">
          {count}
        </span>
      </div>

      <div>
        <span className="block text-4xl font-extrabold text-error mb-4">
          O pedido será cancelado!
        </span>

        <span className="block text-2xl font-semibold text-gray-700">
          Toque na tela para retornar.
        </span>
      </div>
    </div>
  );
}
