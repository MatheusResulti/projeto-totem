/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserData } from "../../utils/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TotemConfigModal from "../../components/TotemConfigModal/TotemConfigModal";
import { RefreshCcw, LogOut, Lock, Eye, EyeOff } from "lucide-react";
import PaymentMethodBadge from "../../components/PaymentMethodBadge/PaymentMethodBadge";
import toast from "react-hot-toast";
import { asset } from "../../utils/asset";

export default function Home() {
  const navigate = useNavigate();
  const defaultHomeImage = asset("/assets/defaultHomeImage");
  const logo = asset("/assets/logo.png");
  const resultiLogo = asset("/assets/resultiLogo.png");

  const userData = useUserData((s) => s.userData);
  const setUserData = useUserData((s) => s.setUserData);
  const [modalValidate, setModalValidate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [secretCounter, setSecretCounter] = useState(0);
  const [modalConf, setModalConf] = useState(false);

  const rawMethods =
    (userData as any)?.FormasPgto ?? (userData as any)?.formasPgto ?? [];

  const paymentMethods: string[] = Array.isArray(rawMethods)
    ? Array.from(
        new Set(
          rawMethods.map((m: any) => {
            const doc = (m.dsDocumento ?? m.dsReduzida ?? "")
              .trim()
              .toUpperCase();
            if (doc.includes("CARTÃO")) return "CARTÃO";
            return doc;
          })
        )
      )
    : [];

  const secretFunction = async () => {
    if (secretCounter >= 10) {
      setModalConf(true);
      return;
    }
    setSecretCounter(secretCounter + 1);
  };

  const validateGoBack = async () => {
    if (password !== "1222") {
      toast.error("Senha incorreta. Tente novamente.");
      return;
    }
    await localStorage.removeItem("user");
    setUserData({
      cdUsuario: 0,
      cdOperador: 0,
      dsSenha: "",
      dsLogin: "",
      nmUsuario: "",
      cdEmpmobile: 0,
      tpCalculoVendaItem: 0,
      prAcrescimoVenda: 0,
      tpVisualizacaoMesa: "",
      cdAtendente: 0,
      inBloqueado: "",
      tpPapel: 0,
      modelo: "",
      FormasPgto: [],
      logo: "",
      capa: "",
      home: "",
      configMode: false,
    });
    navigate("/login");
  };

  useEffect(() => {
    sessionStorage.setItem("timeExceededOpens", "0");
  }, []);

  return (
    <div
      className="flex flex-col h-screen w-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${
          userData?.cfgTotem?.dsImgCapa || defaultHomeImage
        })`,
      }}
    >
      <div className="text-text-color flex-col items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden flex h-dvh w-dvw">
        <div className="flex h-full w-full place-content-center">
          <div className="flex flex-col items-center justify-center gap-10 w-full">
            <img
              src={
                userData?.cfgTotem?.dsImgLogo &&
                userData.cfgTotem?.dsImgLogo.length
                  ? userData.cfgTotem?.dsImgLogo
                  : logo
              }
              className="max-w-1/5 rounded-xl"
            />
            <button
              onClick={() => navigate("/menu")}
              style={{
                backgroundColor:
                  userData?.cfgTotem?.cdCorPrimaria || "var(--color-secondary)",
              }}
              className="text-3xl text-white font-bold rounded-md w-9/10 h-20 touchable"
            >
              FAÇA SEU PEDIDO
            </button>
            <div className="flex gap-3 justify-center">
              {paymentMethods.map((label, i) => (
                <PaymentMethodBadge key={`${label}-${i}`} method={label} />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 w-full flex items-center justify-center h-15 px-6">
          <span className="text-sm font-semibold text-white flex items-center gap-3 mt-1">
            Um produto disponibilizado por
          </span>
          <img
            src={logo}
            alt="Logo ControlChef"
            className="h-6 w-auto object-contain ml-3"
          />
          <button onClick={() => secretFunction()}>
            <img
              src={resultiLogo}
              alt="Logo Resulti"
              className="h-9 w-auto object-contain translate-y-0.5 ml-3"
            />
          </button>
        </div>
        {modalConf && (
          <TotemConfigModal
            openModal={modalConf}
            setOpenModal={setModalConf}
            title="Configurações do Totem"
            closeOnBackdrop
          >
            <div className="w-full flex flex-col gap-3 pt-7">
              <button
                onClick={() => navigate("/")}
                className="bg-error rounded-lg flex items-center justify-center h-16 text-white font-bold gap-2 active:opacity-30 transition-opacity duration-200"
              >
                <RefreshCcw />
                Sincronizar
              </button>
              <button
                onClick={() => setModalValidate(!modalValidate)}
                className="bg-success rounded-lg flex items-center justify-center h-16 text-white font-bold gap-2 active:opacity-30 transition-opacity duration-200"
              >
                <LogOut />
                Voltar para o login
              </button>
              {modalValidate ? (
                <>
                  <div className="relative flex flex-col items-center w-full mt-2">
                    <span className="self-start mb-2 font-medium">
                      Informe a contra senha
                    </span>
                    <div className="w-full flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-2 text-sm text-text-color border-gray-300/80 rounded-lg pl-10 pr-10 py-4"
                        data-enter-target="#confirm-print-password"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-gray-600 touchable"
                      >
                        {showPassword ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                      <Lock className="absolute left-3 text-secondary w-5 h-5" />
                    </div>
                  </div>
                  <button
                    id="confirm-print-password"
                    onClick={() => validateGoBack()}
                    className="bg-secondary rounded-lg py-3 text-white font-bold touchable"
                  >
                    Confirmar
                  </button>
                </>
              ) : null}
            </div>
          </TotemConfigModal>
        )}
      </div>
    </div>
  );
}
