import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCount, useOrder } from "../../utils/store";
import { X } from "lucide-react";

export default function TimeExceeded() {
  const navigate = useNavigate();
  const [count, setCount] = useState(30);

  const [openCount, setOpenCount] = useState(() => {
    const saved = sessionStorage.getItem("timeExceededOpens");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isCancelling, setIsCancelling] = useState(false);

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
    sessionStorage.removeItem("lastRoute");
    navigate("/home");
  }, [navigate, setOrder, setQuantity]);

  useEffect(() => {
    const next = openCount + 1;
    setOpenCount(next);
    sessionStorage.setItem("timeExceededOpens", String(next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (openCount >= 5) {
      setIsCancelling(true);
      const t = setTimeout(() => {
        resetOrderAndGoHome();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [openCount, resetOrderAndGoHome]);

  useEffect(() => {
    if (openCount >= 5 || isCancelling) return;

    setCount(30); // 🔹 antes 10
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [openCount, isCancelling]);

  useEffect(() => {
    if (openCount >= 5 || isCancelling) return;

    if (count === 0) {
      const t = setTimeout(() => {
        resetOrderAndGoHome();
      }, 1000);

      return () => clearTimeout(t);
    }
  }, [count, openCount, isCancelling, resetOrderAndGoHome]);

  const handleReturn = () => {
    if (isCancelling) return;

    if (openCount < 5) {
      const lastRoute = sessionStorage.getItem("lastRoute");
      if (lastRoute) {
        sessionStorage.removeItem("lastRoute");
        navigate(lastRoute);
      } else {
        if (window.history.length > 2) navigate(-1);
        else navigate("/home");
      }
    } else {
      setIsCancelling(true);
    }
  };

  if (isCancelling) {
    return (
      <div
        onClick={handleReturn}
        className="h-svh flex flex-col items-center justify-center gap-6 text-center text-text-color select-none bg-white"
      >
        <div className="w-28 h-28 rounded-full border-8 border-red-500/20 flex items-center justify-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-3xl font-extrabold">
            <X />
          </div>
        </div>
        <div>
          <span className="block text-4xl font-extrabold text-error mb-2">
            Pedido cancelado!
          </span>
          <span className="block text-lg text-gray-600">
            Redirecionando para a tela inicial…
          </span>
        </div>
      </div>
    );
  }

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
            strokeDashoffset={(2 * Math.PI * 90 * (30 - count)) / 30}
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
          Você ainda está aí?
        </span>

        <span className="block text-2xl font-semibold text-gray-700">
          Toque na tela para continuar.
        </span>
        {openCount === 4 && (
          <span className="block text-xl font-semibold text-error">
            Uma tentativa restante!
          </span>
        )}
      </div>
    </div>
  );
}
