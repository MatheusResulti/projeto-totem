/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder, useUserData } from "../../utils/store";
import { ChevronLeft } from "lucide-react";
import { formatToBRL } from "../../utils/helpers";
import { useTotemColor } from "../../utils/useTotemColor";
import { asset } from "../../utils/asset";
import loadingAnimation from "react-useanimations/lib/loading";

import type { ResultiPayType } from "../../types/types";
import toast from "react-hot-toast";
import { Api } from "../../api/Api";
import { ResultiApi } from "../../api/ResultiApi";
import { BadgeCheck } from "lucide-react";
import UseAnimations from "react-useanimations";

export default function PixPayment() {
  const navigate = useNavigate();
  const icon = asset("/assets/icon.png");
  const rPay = asset("/assets/rPay.png");
  const userData = useUserData((s) => s.userData);
  const order = useOrder((s) => s.order);
  const setOrder = useOrder((s) => s.setOrder);
  const { primary } = useTotemColor();

  const [isPaid, setIsPaid] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pixItem, setPixItem] = useState<any>();
  const [pixData, setPixData] = useState<ResultiPayType | null>(null);
  const homeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHomeTimeout = () => {
    if (homeTimeoutRef.current) {
      clearTimeout(homeTimeoutRef.current);
      homeTimeoutRef.current = null;
    }
  };

  const sendOrder = async (pixI?: any, pixD?: any) => {
    let data: any = null;
    data = {
      ...order,
      tpOrigemPed: 8,
      pagamento: [
        {
          cdDocumento: pixI.cdDocumento,
          tpDocumento: pixI.tpDocumento,
          valor: order.total,
          resultipay: {
            idpk: pixD.fmp_idpk,
          },
        },
      ],
    };

    await Api.post(`atendimento`, data)
      .then(async (res: any) => {
        if (res.error) {
          toast.error(res.error);
          return;
        }

        const receiptPayload = {
          company: {
            name: userData?.empresa?.dsFantasia ?? "",
            document: userData?.empresa?.nrCnpj ?? "",
            address: [
              userData?.empresa?.dsEndereco,
              userData?.empresa?.dsBairro,
            ]
              .filter(Boolean)
              .join(" - "),
          },
          order: {
            total: order.total,
            label: order.dsRotulo,
            code: res?.cdPedido ?? res?.data?.cdPedido ?? "",
            items: order.itens.map((item) => ({
              name: item.dsProduto ?? `Produto ${item.produto_id}`,
              quantity: item.quantidade,
              unitPrice: item.valor_unitario,
              total: item.valor_unitario * item.quantidade,
              observation: item.observacao,
              additionals:
                item.adicionais?.map((adicional) => adicional.name) ?? [],
            })),
          },
          payment: {
            document: pixI?.cdDocumento,
            type: pixI?.tpDocumento,
            pix: {
              id: pixD?.fmp_idpk,
              description: pixD?.fmp_descricao,
              key: pixD?.fmp_chave,
              qrCode: pixD?.fmp_link_qrcode,
            },
          },
          timestamp: new Date().toISOString(),
        };

        window.electronAPI?.printReceipt?.(receiptPayload);

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
        clearHomeTimeout();
        homeTimeoutRef.current = setTimeout(() => {
          navigate("/home");
        }, 10000);
      })
      .catch(() => {
        toast.error(
          "Algo deu errado com seu pedido! Verifique sua conexão e tente novamente."
        );
      });
  };

  const createPix = async () => {
    const formas: any[] =
      (userData as any)?.formasPgto ?? (userData as any)?.FormasPgto ?? [];

    const item = formas.length ? formas[0] : null;

    if (!item) {
      toast.error("Nenhuma forma de pagamento PIX configurada.");
      return;
    }

    setIsLoading(true);
    setPixItem(item);

    const data = {
      fmp_descricao: `TOTEM`,
      fmp_valor: order.total,
    };

    ResultiApi.post(
      `${item.resultipay.host}/api/v1/Pix/Instantaneo`,
      item.resultipay.hash,
      data
    )
      .then((res: any) => {
        if (res.error) {
          toast.error(res.error);
          setIsLoading(false);
          return;
        }
        const data: ResultiPayType =
          res.registros?.[0] ?? res.data?.registros?.[0];
        if (!data) {
          toast.error("Erro ao gerar PIX.");
          setIsLoading(false);
          return;
        }
        setPixData(data);
        setIsLoading(false);
        loop(data, item);
      })
      .catch(() => {
        toast.error(
          "Algo deu errado! Verifique sua conexão e tente novamente."
        );
        setIsLoading(false);
      });
  };

  const handleQrCodeDelete = () => {
    ResultiApi.delete(
      `${pixItem.resultipay.host}/api/v1/Pix/Remover/${pixData?.fmp_idpk}`,
      pixItem.resultipay.hash
    );
  };

  const cancelOrder = () => {
    if (!pixItem || !pixData) {
      navigate(-1);
      return;
    }

    setLoadingPix(true);
    ResultiApi.delete(
      `${pixItem.resultipay.host}/api/v1/Pix/Remover/${pixData.fmp_idpk}`,
      pixItem.resultipay.hash
    )
      .then((res: any) => {
        if (res.error) {
          toast.error(res.error);
          setIsLoading(false);
          setIsPaid(false);
          setLoadingPix(false);
          return;
        }
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
        setIsLoading(false);
        setLoadingPix(false);
        setIsPaid(false);
        navigate("/home");
        toast.success("Pedido cancelado com sucesso!");
      })
      .catch(() => {
        toast.error(
          "Algo deu errado! Verifique sua conexão e tente novamente."
        );
        setIsLoading(false);
        setIsPaid(false);
        setLoadingPix(false);
      });
  };

  const loop = (pixD: any, pixI: any) => {
    setTimeout(async () => {
      if (isPaid) return;

      try {
        const liquidadoResponse = await ResultiApi.get(
          `${pixI.resultipay.host}/api/v1/Pix/Instantaneo?&where=fmp_idpk=${pixD.fmp_idpk}&status=["Liquidado"]&fmp_idpk=${pixD.fmp_idpk}`,
          pixI.resultipay.hash
        );

        if (
          liquidadoResponse.registros.length &&
          liquidadoResponse.registros[0].fmp_status === "Liquidado"
        ) {
          sendOrder(pixI, pixD);
          setIsPaid(true);
          return;
        } else {
          const pendenteResponse = await ResultiApi.get(
            `${pixI.resultipay.host}/api/v1/Pix/Instantaneo?&where=fmp_idpk=${pixD.fmp_idpk}&status=["Aguardando"]&fmp_idpk=${pixD.fmp_idpk}`,
            pixI.resultipay.hash
          );
          if (
            pendenteResponse.registros.length &&
            pendenteResponse.registros[0].fmp_status === "Aguardando"
          ) {
            loop(pixD, pixI);
          } else {
            return;
          }
        }
      } catch (error: any) {
        toast.error(`Rede desconectada! ${error.message}`);
        loop(pixD, pixI);
      }
    }, 8000);
  };

  useEffect(() => {
    createPix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      clearHomeTimeout();
    };
  }, []);

  return (
    <div className="h-svh items-center justify-center flex flex-col gap-3 text-text-color">
      <img
        src={
          userData?.cfgTotem?.dsImgLogo && userData.cfgTotem?.dsImgLogo.length
            ? userData.cfgTotem?.dsImgLogo
            : icon
        }
        alt="Logo do estabelecimento"
        className="size-40 object-contain rounded-xl"
      />
      {isPaid ? (
        <>
          <span style={{ color: primary }} className="text-3xl font-extrabold">
            PIX pago!
          </span>
          <span className="text-text-color font-bold text-2xl">
            Retire sua notinha e aguarde seu pedido.
          </span>
          <div style={{ backgroundColor: primary }} className="p-5 rounded-xl">
            <BadgeCheck size={220} color={"#FFF"} />
          </div>
          <button
            style={{ color: primary }}
            className="h-15 flex justify-center items-center border-2 rounded-xl touchable font-bold px-5"
            onClick={() => {
              clearHomeTimeout();
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
              navigate("/menu");
              setLoadingPix(false);
              setPixData(null);
              setPixItem(null);
            }}
          >
            Fazer outro pedido
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              navigate("/cart");
              handleQrCodeDelete();
            }}
            className="touchable absolute top-1 left-1"
          >
            <ChevronLeft
              size={50}
              strokeWidth={3}
              className="text-text-color"
            />
          </button>
          {isLoading ? (
            <>
              <UseAnimations
                animation={loadingAnimation}
                size={122}
                strokeColor={primary}
                style={{ color: primary }}
              />
              <span style={{ color: primary }} className="font-bold text-3xl">
                Gerando PIX...
              </span>
              <span className="font-semibold text-2xl">
                Aguarde um instante
              </span>
            </>
          ) : (
            <>
              <span style={{ color: primary }} className="font-bold text-3xl">
                Seu PIX está pronto!
              </span>
              <span className="font-semibold text-2xl">
                Para continuar, leia o QrCode
              </span>
              <img
                src={pixData?.fmp_link_qrcode}
                alt="qrcode"
                className="h-70 opacity-90 border-2 rounded-lg border-border-color"
              />
            </>
          )}

          <div className="flex flex-col w-120 border border-border-color text-xl p-4 gap-3">
            <div className="flex flex-row gap-2">
              <span style={{ color: primary }} className="font-semibold ">
                Empresa:
              </span>
              <span>{userData?.empresa?.dsFantasia}</span>
            </div>
            <div className="flex flex-row gap-2">
              <span style={{ color: primary }} className="font-semibold">
                Valor do pedido:
              </span>
              <span>{formatToBRL(order.total)}</span>
            </div>
            <button
              onClick={cancelOrder}
              className="w-full h-12 border-2 border-error text-error font-semibold rounded-lg touchable"
              disabled={loadingPix}
            >
              {loadingPix ? "Cancelando..." : "Cancelar"}
            </button>
          </div>
        </>
      )}
      <span className="text-xl text-gray-500">
        Pagamento disponibilizado por
      </span>
      <img src={rPay} className="w-75 " />
    </div>
  );
}
