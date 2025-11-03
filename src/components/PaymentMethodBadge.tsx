interface PaymentMethodProps {
  method: string;
}

export default function PaymentMethodBadge({ method }: PaymentMethodProps) {
  const paymentConfig: Record<string, { icon: string }> = {
    PIX: {
      icon: "/assets/pixIcon.png",
    },
    CARTÃO: {
      icon: "/assets/cardIcon.png",
    },
  };

  const icon = paymentConfig[method.toUpperCase()]?.icon;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-md bg-white`}
    >
      {icon && <img src={icon} alt={method} className="w-5 h-5 " />}
      <p className="font-semibold">{method}</p>
    </div>
  );
}
