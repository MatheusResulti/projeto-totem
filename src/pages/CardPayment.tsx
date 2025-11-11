import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrder, useUserData } from "../utils/store";
import { useTotemColor } from "../utils/useTotemColor";
import { formatToBRL } from "../utils/helpers";
<<<<<<< HEAD
=======
import { asset } from "../utils/asset";
>>>>>>> 189e5da (alterações feitas para o exe)

type Tipo = "credito" | "debito";

export default function CardPayment() {
<<<<<<< HEAD
  const icon = "/assets/icon.png";
  const rPay = "/assets/rPay.png";
=======
  const icon = asset("/assets/icon.png");
  const rPay = asset("/assets/rPay.png");
>>>>>>> 189e5da (alterações feitas para o exe)
  const { primary } = useTotemColor();
  const order = useOrder((s) => s.order);
  const userData = useUserData((s) => s.userData);
  const navigate = useNavigate();
  const { tipo } = useParams<{ tipo: Tipo }>();
  const isCredito = tipo === "credito";

  return (
    <div className="h-svh items-center justify-center flex flex-col gap-3 text-text-color">
      <button
        onClick={() => navigate("/cart")}
        className="touchable absolute top-1 left-1"
      >
        <ChevronLeft size={50} strokeWidth={3} className="text-text-color" />
      </button>
      <img
        src={
          userData?.cfgTotem?.dsImgLogo && userData.cfgTotem?.dsImgLogo.length
            ? userData.cfgTotem?.dsImgLogo
            : icon
        }
        alt="Logo do estabelecimento"
        className="size-40 object-contain rounded-xl"
      />
      <div className="">
        {isCredito ? (
          <span style={{ color: primary }} className="font-bold text-3xl">
            Pagamento - Crédito
          </span>
        ) : (
          <span style={{ color: primary }} className="font-bold text-3xl">
            Pagamento - Débito
          </span>
        )}
      </div>
      <span className="font-semibold text-2xl">
        Confira o pagamento na maquininha.
      </span>
      <div className="flex flex-col w-120 border border-border-color text-xl p-4 gap-3">
        <div className="flex flex-row gap-2">
          {" "}
          <span style={{ color: primary }} className="font-semibold ">
            Empresa:{" "}
          </span>
          <span className="">{userData?.empresa?.dsFantasia}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span style={{ color: primary }} className="font-semibold">
            Valor do pedido:
          </span>
          <span>{formatToBRL(order.total)}</span>
        </div>
        <button
          // onClick={() => cancelOrder()}
          className="w-full h-12 border-2 border-error text-error font-semibold rounded-lg touchable"
        >
          Cancelar
        </button>
      </div>
      <span className="text-xl text-gray-500">
        Pagamento disponibilizado por
      </span>
      <img src={rPay} className="w-75 " />
    </div>
  );
}
