import { asset } from "../../utils/asset";

interface PaymentMethodProps {
  method: string;
}

function canon(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase();
}

export default function PaymentMethodBadge({ method }: PaymentMethodProps) {
  const cardIcon = asset("/assets/cardIcon.png");
  const pixIcon = asset("/assets/pixIcon.png");
  const paymentConfig: Record<string, { icon: string; label?: string }> = {
    PIX: { icon: pixIcon },
    CARTAO: { icon: cardIcon, label: "CARTÃO" },
    CARTAO_CREDITO: { icon: cardIcon, label: "CARTÃO" },
    CARTAO_DEBITO: { icon: cardIcon, label: "CARTÃO" },
  };

  const key = (() => {
    const s = canon(method);
    if (s.includes("PIX")) return "PIX";
    if (s.includes("CREDITO")) return "CARTAO_CREDITO";
    if (s.includes("DEBITO")) return "CARTAO_DEBITO";
    if (s.includes("CARTAO")) return "CARTAO";
    return "";
  })();

  if (!key) return null;

  const cfg = paymentConfig[key];

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-md bg-white">
      <img src={cfg.icon} alt={method} className="w-5 h-5" />
      <p className="font-semibold">{cfg.label ?? method}</p>
    </div>
  );
}
