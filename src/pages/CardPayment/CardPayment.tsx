/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadgeCheck, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOrder, useUserData } from "../../utils/store";
import { useTotemColor } from "../../utils/useTotemColor";
import { formatToBRL } from "../../utils/helpers";
import { asset } from "../../utils/asset";
import toast from "react-hot-toast";
import UseAnimations from "react-useanimations";
import loadingAnimation from "react-useanimations/lib/loading";
import { Api } from "../../api/Api";
import { ResultiApi } from "../../api/ResultiApi";

type Tipo = "credito" | "debito";

const CARD_DATA_KEY = "cardPayment:data";
const CARD_METHOD_KEY = "cardPayment:method";
const CARD_PAID_KEY = "cardPayment:paid";
let pendingHomeTimeout: ReturnType<typeof setTimeout> | null = null;

const generateHash = (length = 40) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (v) => chars[v % chars.length]).join("");
};

export default function CardPayment() {
  const icon = asset("/assets/icon.png");
  const rPay = asset("/assets/rPay.png");
  const { primary } = useTotemColor();
  const order = useOrder((s) => s.order);
  const setOrder = useOrder((s) => s.setOrder);
  const userData = useUserData((s) => s.userData);
  const location = useLocation();
  const navigate = useNavigate();
  const { tipo } = useParams<{ tipo: Tipo }>();
  const isCredito = tipo === "credito";
  const [cardMethod, setCardMethod] = useState<any>(null);
  const [cardData, setCardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCard, setLoadingCard] = useState(false);
  const [removingPayment, setRemovingPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const hashRef = useRef<string | null>(null);
  const hasRequestedCardRef = useRef(false);

  const clearHomeTimeout = () => {
    if (pendingHomeTimeout) {
      clearTimeout(pendingHomeTimeout);
      pendingHomeTimeout = null;
    }
  };

  const clearCardSession = () => {
    sessionStorage.removeItem(CARD_DATA_KEY);
    sessionStorage.removeItem(CARD_METHOD_KEY);
  };

  const clearPaidFlag = () => {
    sessionStorage.removeItem(CARD_PAID_KEY);
  };

  const resolveMethod = () => {
    const formas: any[] =
      (userData as any)?.formasPgto ?? (userData as any)?.FormasPgto ?? [];
    if (!Array.isArray(formas) || !formas.length) return null;

    const match = formas.find((f: any) => {
      const doc = (f.dsDocumento ?? f.dsReduzida ?? "").toLowerCase();
      const tp = Number(f.tpDocumento);
      if (isCredito)
        return tp === 3 || doc.includes("credito") || doc.includes("crédito");
      return tp === 2 || doc.includes("debito") || doc.includes("débito");
    });

    return match ?? formas[0];
  };

  const sendOrder = async (cardInfo?: any, methodInfo?: any) => {
    if (!cardInfo || !methodInfo) return;
    if (!hashRef.current) {
      hashRef.current = generateHash(40);
    }
    const hash = hashRef.current;

    const data = {
      cdEmpresa: order.cdEmpresa ?? 1,
      tpAtendimento: order.tpAtendimento ?? 2,
      dsAtendimento: order.dsAtendimento ?? "TOTEM",
      tpLocal: order.tpLocal ?? 1,
      cdUsuario: order.cdUsuario ?? userData?.cdUsuario ?? 0,
      cdAtendente: order.cdAtendente ?? userData?.cdAtendente ?? 0,
      dsRotulo: order.dsRotulo ?? "",
      total: order.total ?? 0,
      vlAcrescimo: order.vlAcrescimo ?? 0,
      dsHash: hash,
      tpOrigemPed: 8,
      itens: order.itens.map((item: any) => ({
        dsProduto: item.dsProduto,
        tamanho_id: item.tamanho_id ?? "",
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        observacao: item.observacao ?? "",
        tpProduto: item.tpProduto ?? "",
        adicionais: item.adicionais ?? [],
      })),
      pagamento: [
        {
          cdDocumento: methodInfo.cdDocumento,
          tpDocumento: methodInfo.tpDocumento,
          valor: order.total,
          resultipay: {
            idpk: cardInfo.fmc_idpk,
          },
        },
      ],
    };

    await Api.post(`atendimento`, data)
      .then((res: any) => {
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
            logoUrl:
              userData?.cfgTotem?.dsImgLogo &&
              userData.cfgTotem.dsImgLogo.length
                ? userData.cfgTotem.dsImgLogo
                : undefined,
          },
          data: {
            impressao:
              res?.data?.impressao ||
              res?.impressao ||
              res?.data?.data?.impressao ||
              [],
          },
        };

        window.electronAPI?.printReceipt?.(receiptPayload);

        sessionStorage.setItem(CARD_PAID_KEY, "1");

        clearCardSession();
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
        pendingHomeTimeout = setTimeout(() => {
          clearPaidFlag();
          navigate("/home");
        }, 10000);
      })
      .catch(() => {
        toast.error(
          "Algo deu errado com seu pedido! Verifique sua conexão e tente novamente."
        );
      });
  };

  const loopValidation = (paymentItem: any, methodItem: any) => {
    setTimeout(async () => {
      if (isPaid) return;
      try {
        const empresaId =
          methodItem?.dispositivo?.credenciais?.cdEmpresa ??
          methodItem?.resultipay?.cdEmpresa ??
          "";
        const res = await ResultiApi.get(
          `${methodItem?.resultipay?.host}/api/v1/Cartao/Consultar?empresa_idpk=${empresaId}&fmc_idpk=${paymentItem?.fmc_idpk}&status=["Aprovada","Em andamento","Aguardando"]`,
          methodItem?.resultipay?.hash
        );

        const registro = res?.registros?.find(
          (item: any) => item.fmc_idpk === paymentItem?.fmc_idpk
        );
        const status = registro?.fmc_status ?? registro?.status;

        if (status === "Aprovada") {
          setCardData(registro);
          sessionStorage.setItem(CARD_DATA_KEY, JSON.stringify(registro));
          setIsPaid(true);
          await sendOrder(registro, methodItem);
          return;
        }

        if (status === "Em andamento" || status === "Aguardando") {
          loopValidation(paymentItem, methodItem);
          return;
        }
      } catch {
        toast.error("Erro ao validar o pagamento! Tente novamente.");
        loopValidation(paymentItem, methodItem);
      }
    }, 8000);
  };

  const createPayment = async () => {
    if (isLoading) return;

    if (!order.total || order.total <= 0) {
      toast.error("Valor do pedido inválido para gerar pagamento.");
      navigate(-1);
      return;
    }

    const method = resolveMethod();
    if (!method?.resultipay?.host || !method?.resultipay?.hash) {
      toast.error("Forma de pagamento não configurada para cartão.");
      navigate(-1);
      return;
    }

    setCardMethod(method);
    sessionStorage.setItem(CARD_METHOD_KEY, JSON.stringify(method));
    setIsLoading(true);

    const empresaId =
      method?.dispositivo?.credenciais?.cdEmpresa ??
      method?.resultipay?.cdEmpresa ??
      "";

    try {
      const res = await ResultiApi.get(
        `${method.resultipay.host}/api/v1/Cartao/Consultar?empresa_idpk=${empresaId}&status=["Aguardando"]`,
        method.resultipay.hash
      );
      const pending = res?.registros?.[0];
      if (pending) {
        if (pending.fmc_status === "Aprovada") {
          setCardData(pending);
          sessionStorage.setItem(CARD_DATA_KEY, JSON.stringify(pending));
          setIsPaid(true);
          setIsLoading(false);
          await sendOrder(pending, method);
          return;
        }
        await ResultiApi.delete(
          `${method.resultipay.host}/api/v1/Cartao/Remover/${pending.fmc_idpk}?empresa_idpk=${empresaId}`,
          method.resultipay.hash
        );
      }
    } catch (e: any) {
      toast.error(
        e?.message ?? "Erro ao validar pagamentos pendentes. Tente novamente."
      );
    }

    const payload = {
      fmc_financeiro_conta_idpk:
        method.dispositivo?.credenciais?.cdFinanceiroConta,
      fmc_financeiro_banco_pos_idpk:
        method.dispositivo?.credenciais?.cdDispositivo,
      fmc_tipo: isCredito ? 2 : 1,
      fmc_descricao: `Venda (${method.dsDocumento ?? "Cartão"}) - Valor: ${order.total}`,
      fmc_valor: order.total,
    };

    ResultiApi.post(
      `${method.resultipay.host}/api/v1/Cartao/Inserir?empresa_idpk=${empresaId}`,
      method.resultipay.hash,
      payload
    )
      .then((res: any) => {
        if (res?.error) {
          toast.error(res.error);
          setIsLoading(false);
          return;
        }
        const data = res?.registros?.[0] ?? res?.data?.registros?.[0];
        if (!data) {
          toast.error("Erro ao tentar processar o pagamento!");
          setIsLoading(false);
          return;
        }
        setCardData(data);
        sessionStorage.setItem(CARD_DATA_KEY, JSON.stringify(data));
        setIsLoading(false);
        loopValidation(data, method);
      })
      .catch(() => {
        toast.error("Erro ao tentar processar o pagamento!");
        setIsLoading(false);
        navigate(-1);
      });
  };

  const cancelOrder = async () => {
    if (!cardMethod || !cardData) {
      navigate(-1);
      return;
    }

    setLoadingCard(true);
    const empresaId =
      cardMethod?.dispositivo?.credenciais?.cdEmpresa ??
      cardMethod?.resultipay?.cdEmpresa ??
      "";

    ResultiApi.delete(
      `${cardMethod.resultipay.host}/api/v1/Cartao/Remover/${cardData.fmc_idpk}?empresa_idpk=${empresaId}`,
      cardMethod.resultipay.hash
    )
      .then((res: any) => {
        if (res?.error) {
          toast.error(res.error);
          setLoadingCard(false);
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
        setLoadingCard(false);
        setIsPaid(false);
        setCardData(null);
        clearCardSession();
        clearPaidFlag();
        navigate("/home");
        toast.success("Pedido cancelado com sucesso!");
      })
      .catch(() => {
        toast.error("Erro ao tentar cancelar! Tente novamente!");
        setLoadingCard(false);
      });
  };

  const removePaymentAndGoBack = async () => {
    if (removingPayment) return;
    if (!cardMethod || !cardData) {
      navigate("/cart");
      return;
    }

    setRemovingPayment(true);
    const empresaId =
      cardMethod?.dispositivo?.credenciais?.cdEmpresa ??
      cardMethod?.resultipay?.cdEmpresa ??
      "";

    ResultiApi.delete(
      `${cardMethod.resultipay.host}/api/v1/Cartao/Remover/${cardData.fmc_idpk}?empresa_idpk=${empresaId}`,
      cardMethod.resultipay.hash
    )
      .then(() => {
        clearCardSession();
        clearPaidFlag();
        setCardData(null);
        setIsPaid(false);
        navigate("/cart");
      })
      .catch(() => {
        toast.error("Erro ao tentar remover o pagamento! Tente novamente.");
      })
      .finally(() => {
        setRemovingPayment(false);
      });
  };

  useEffect(() => {
    const wasPaid = sessionStorage.getItem(CARD_PAID_KEY);
    if (wasPaid === "1") {
      setIsPaid(true);
      setIsLoading(false);
      return;
    }

    const storedCard = sessionStorage.getItem(CARD_DATA_KEY);
    const storedMethod = sessionStorage.getItem(CARD_METHOD_KEY);

    if (storedCard && storedMethod) {
      try {
        const parsedCard = JSON.parse(storedCard);
        const parsedMethod = JSON.parse(storedMethod);
        setCardData(parsedCard);
        setCardMethod(parsedMethod);
        setIsLoading(false);
        loopValidation(parsedCard, parsedMethod);
        return;
      } catch {
        clearCardSession();
      }
    }

    if (hasRequestedCardRef.current) return;
    hasRequestedCardRef.current = true;

    createPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sessionStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      clearHomeTimeout();
    };
  }, []);

  return (
    <div className="h-svh items-center justify-center flex flex-col gap-3 bg-background-color text-text-color">
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
          <span className="text-3xl font-extrabold">Pagamento aprovado!</span>
          <span className="text-text-color font-bold text-2xl text-center">
            Retire sua notinha e aguarde seu pedido.
          </span>
          <div style={{ backgroundColor: primary }} className="p-5 rounded-xl">
            <BadgeCheck size={220} color={"#FFF"} />
          </div>
          <button
            className="h-15 flex justify-center items-center border-2 rounded-xl touchable font-bold px-5"
            onClick={() => {
              clearHomeTimeout();
              clearCardSession();
              clearPaidFlag();
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
              setCardData(null);
            }}
          >
            Fazer outro pedido
          </button>
        </>
      ) : (
        <>
          <button
            onClick={removePaymentAndGoBack}
            className="touchable absolute top-1 left-1"
            disabled={removingPayment}
          >
            <ChevronLeft
              size={50}
              strokeWidth={3}
              className="text-text-color"
            />
          </button>
          <div className="">
            {isCredito ? (
              <span className="font-bold text-3xl">Pagamento - Crédito</span>
            ) : (
              <span className="font-bold text-3xl">Pagamento - Débito</span>
            )}
          </div>
          {isLoading ? (
            <>
              <UseAnimations
                animation={loadingAnimation}
                size={122}
                strokeColor={primary}
              />
              <span className="font-bold text-3xl">Processando...</span>
              <span className="font-semibold text-2xl text-center">
                Aguarde a maquininha finalizar
              </span>
            </>
          ) : (
            <span className="font-semibold text-2xl text-center">
              Confira o pagamento na maquininha.
            </span>
          )}
          <div className="flex flex-col w-120 border border-border-color text-xl p-4 gap-3">
            <div className="flex flex-row gap-2">
              <span className="font-semibold ">Empresa:</span>
              <span className="">{userData?.empresa?.dsFantasia}</span>
            </div>
            <div className="flex flex-row gap-2">
              <span className="font-semibold">Valor do pedido:</span>
              <span>{formatToBRL(order.total)}</span>
            </div>
            <button
              onClick={() => cancelOrder()}
              className="w-full h-12 bg-error font-semibold rounded-lg touchable"
              disabled={loadingCard}
            >
              {loadingCard ? "Cancelando..." : "Cancelar"}
            </button>
          </div>
          <span className="text-xl text-gray-500">
            Pagamento disponibilizado por
          </span>
          <img src={rPay} className="w-75 " />
        </>
      )}
    </div>
  );
}
