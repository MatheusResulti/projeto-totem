/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useOrder, useUserData } from "../utils/store";
import { ChevronLeft } from "lucide-react";
// import { useState } from "react";
// import type { ResultiPayType } from "../types/types";
// import toast from "react-hot-toast";
// import { Api } from "../api/Api";
// import { ResultiApi } from "../api/ResultiApi";
import { formatToBRL } from "../utils/helpers";
import { useTotemColor } from "../utils/useTotemColor";
<<<<<<< HEAD

export default function PixPayment() {
  const navigate = useNavigate();
  const icon = "/assets/icon.png";
  const qrcode = "/assets/qrcode.png";
  const rPay = "/assets/rPay.png";
=======
import { asset } from "../utils/asset";

export default function PixPayment() {
  const navigate = useNavigate();
  const icon = asset("/assets/icon.png");
  const qrcode = asset("/assets/qrcode.png");
  const rPay = asset("/assets/rPay.png");
>>>>>>> 189e5da (alterações feitas para o exe)
  const userData = useUserData((s) => s.userData);
  // const [isPaid, setIsPaid] = useState(false);
  // const [loadingPix, setLoadingPix] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [pixItem, setPixItem] = useState<any>();
  // const [pixData, setPixData] = useState<ResultiPayType | null>();
  const order = useOrder((s) => s.order);
  // const setOrder = useOrder((s) => s.setOrder);
  const { primary } = useTotemColor();

  // const sendOrder = async (pixI?: any, pixD?: any) => {
  //   let data: any = null;
  //   data = {
  //     ...order,
  //     tpOrigemPed: 8,
  //     pagamento: [
  //       {
  //         cdDocumento: pixI.cdDocumento,
  //         tpDocumento: pixI.tpDocumento,
  //         valor: order.total,
  //         resultipay: {
  //           idpk: pixD.fmp_idpk,
  //         },
  //       },
  //     ],
  //   };

  //   await Api.post(`atendimento`, data)
  //     .then(async (res: any) => {
  //       if (res.error) {
  //         toast.error(res.error);
  //         return;
  //       }
  //       //   await createBytes(res.impressao).then(() => {
  //       //     setOrder({
  //       //       cdEmpresa: 1,
  //       //       tpAtendimento: 2,
  //       //       dsAtendimento: "TOTEM",
  //       //       tpLocal: 1,
  //       //       cdUsuario: 0,
  //       //       dsRotulo: "",
  //       //       total: 0,
  //       //       itens: [],
  //       //     });
  //       //     setTimeout(() => {
  //       //       navigate("/home");
  //       //     }, 5000);
  //       //   });
  //     })
  //     .catch(() => {
  //       toast.error(
  //         "Algo deu errado com seu pedido! Verifique sua conexão e tente novamente."
  //       );
  //     });
  // };

  // const createPix = async () => {
  //   const item = userData?.FormasPgto.length ? userData?.FormasPgto[0] : [];
  //   setLoading(true);
  //   setPixItem(item);
  //   const data = {
  //     fmp_descricao: `TOTEM`,
  //     fmp_valor: order.total,
  //   };

  //   ResultiApi.post(
  //     `${item.resultipay.host}/api/v1/Pix/Instantaneo`,
  //     item.resultipay.hash,
  //     data
  //   )
  //     .then((res: any) => {
  //       if (res.error) {
  //         toast.error(res.error);
  //         setLoading(false);
  //         return;
  //       }
  //       const data: ResultiPayType = res.registros[0];
  //       setPixData(data);
  //       setLoading(false);
  //       loop(data, item);
  //     })
  //     .catch(() => {
  //       toast.error(
  //         "Algo deu errado! Verifique sua conexão e tente novamente."
  //       );
  //       setLoading(false);
  //       return;
  //     });
  // };

  // const cancelOrder = () => {
  //   setLoadingPix(true);
  //   ResultiApi.delete(
  //     `${pixItem.resultipay.host}/api/v1/Pix/Remover/${pixData?.fmp_idpk}`,
  //     pixItem.resultipay.hash
  //   )
  //     .then((res: any) => {
  //       if (res.error) {
  //         toast.error(res.error);
  //         setLoading(false);
  //         setIsPaid(false);
  //         setLoadingPix(false);

  //         return;
  //       }
  //       setOrder({
  //         cdEmpresa: 1,
  //         tpAtendimento: 2,
  //         dsAtendimento: "TOTEM",
  //         tpLocal: 1,
  //         cdUsuario: 0,
  //         dsRotulo: "",
  //         total: 0,
  //         itens: [],
  //       });
  //       setLoading(false);
  //       setLoadingPix(false);
  //       setIsPaid(false);
  //       navigate("/home");
  //       toast.success("Pedido cancelado com sucesso!");
  //     })
  //     .catch(() => {
  //       toast.error(
  //         "Algo deu errado! Verifique sua conexão e tente novamente."
  //       );
  //       setLoading(false);
  //       setIsPaid(false);
  //       setLoadingPix(false);
  //     });
  // };

  // const createBytes = async (impressao: any) => {
  //   try {
  //     const connection = new InMemory();
  //     const printer = await Printer.CONNECT("Sunmi-T2s", connection);
  //     const capability = Model.EXPAND(Model.FIND("Sunmi-T2s"));
  //     const { feed } = capability;

  //     await Promise.all(
  //       impressao.map(async (item: any) => {
  //         if (item.text && item.text.length) {
  //           if (item.bold) {
  //             await printer.writeln(item.text + "\n", Style.Bold);
  //           } else {
  //             await printer.writeln(item.text + "\n", 0);
  //           }
  //         }
  //         if (item.line) {
  //           await printer.writeln("--------------------------------\n");
  //         }
  //         if (item.doubleLine) {
  //           await printer.writeln("================================\n");
  //         }
  //         if (item.emptyLine) {
  //           await printer.feed(1);
  //         }
  //       })
  //     );
  //     const lastItem = impressao[impressao.length - 1];
  //     if (lastItem?.cutt) {
  //       await printer.feed(0);
  //       await printer.cutter();
  //       const status =
  //         await NativeModuleTectToySunmiSDK.impressora.ObterStatus();
  //       if (status.status === "OK") {
  //         await NativeModuleTectToySunmiSDK.impressora.ImprimirRAW(
  //           ConvertBufferToBytes(connection.buffer()),
  //           0
  //         );
  //       }
  //     }
  //   } catch (error: Error | any) {
  //     toast.error("Algo deu errado na sua impressão!", error.message);
  //   }
  // };

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
      <span style={{ color: primary }} className="font-bold text-3xl">
        Seu PIX está pronto!
      </span>
      <span className="font-semibold text-2xl">
        Para continuar, leia o QrCode
      </span>
      <img
        src={qrcode}
        alt="qrcode"
        className="h-1/5 opacity-90 border-2 rounded-lg border-border-color"
      />
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
          onClick={() => navigate(-1)}
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
