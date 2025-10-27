import { userMock } from "../utils/mocks/userMock";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TotemConfigModal from "../components/TotemConfigModal";
import { RefreshCcw, LogOut, Lock, Eye } from "lucide-react";
import PaymentMethodBadge from "../components/PaymentMethodBadge";

export default function Home() {
  const paymentMethods = userMock.FormasPgto;
  const navigate = useNavigate();
  const [secretCounter, setSecretCounter] = useState(0);
  // const [modalVisible, setModalVisible] = useState(false)
  // const [modalValidate, setModalValidate] = useState(false);
  // const [password, setPassword] = useState("")
  const [modalConf, setModalConf] = useState(false);

  // const validateGoBack = async () => {

  // }

  const secretFunction = async () => {
    if (secretCounter >= 10) {
      setModalConf(true);
      return;
    }
    setSecretCounter(secretCounter + 1);
  };

  return (
    <div
      className="flex flex-col h-screen w-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${
          userMock?.home || "/assets/defaultHomeImage.png"
        })`,
      }}
    >
      <div className="text-text-color flex-col items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden flex h-dvh w-dvw">
        <div className="flex h-full w-full place-content-center">
          <div className="flex flex-col items-center justify-center gap-10 w-full">
            <img
              src={
                userMock?.logo && userMock.logo.length
                  ? userMock.logo
                  : "/assets/logo.png"
              }
              className="max-w-1/5"
            />
            <button
              onClick={() => navigate("/src/pages/Menu.tsx")}
              className="text-3xl text-white font-bold bg-green-600/95 rounded-md w-9/10 h-20 touchable"
            >
              FAÇA SEU PEDIDO
            </button>
            <div className="flex gap-3 justify-center">
              {paymentMethods.map((method) => (
                <PaymentMethodBadge key={method} method={method} />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 w-full flex items-center justify-center h-14 px-6">
          <span className="text-sm font-semibold text-white flex items-center gap-3 mt-1">
            Um produto disponibilizado por
          </span>
          <img
            src="/assets/logo.png"
            alt="Logo Restaurante"
            className="h-6 w-auto object-contain ml-3"
          />
          <button onClick={() => secretFunction()}>
            <img
              src="/assets/resultiLogo.png"
              alt="Logo Resulti"
              className="h-8 w-auto object-contain translate-y-[2px] ml-3"
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
                onClick={() => navigate("/src/pages/Splash.tsx")}
                className="bg-error rounded-lg flex items-center justify-center h-16 text-white font-bold gap-2 active:opacity-30 transition-opacity duration-200"
              >
                <RefreshCcw />
                Sincronizar
              </button>
              <button className="bg-success rounded-lg flex items-center justify-center h-16 text-white font-bold gap-2 active:opacity-30 transition-opacity duration-200">
                <LogOut />
                Voltar para o login
              </button>
              <div className="relative flex flex-col items-center w-full mt-2">
                <span className="self-start mb-2 font-medium">
                  Informe a contra senha
                </span>
                <div className="w-full flex items-center">
                  <input
                    type="password"
                    placeholder="Digite sua senha"
                    className="w-full border-2 text-sm text-text-color border-gray-300/80 rounded-lg pl-10 pr-10 py-4"
                  />
                  <button className="absolute right-3 text-gray-600">
                    <Eye className="w-5 h-5" />
                  </button>
                  <Lock className="absolute left-3 text-secondary w-5 h-5" />
                </div>
              </div>
              <button className="bg-secondary rounded-lg py-3 text-white font-bold touchable">
                Confirmar
              </button>
            </div>
          </TotemConfigModal>
        )}
      </div>
    </div>
  );
}

// const [isDark, setIsDark] = useState(false)
{
  /* <img src="/public/assets/defaultHomeImage.png" className="min-h-screen"/> */
}
{
  /* <button
          className="p-2 m-4 border rounded"
          onClick={() => setIsDark(!isDark)}
        >
          Trocar fundo
        </button> */
}
