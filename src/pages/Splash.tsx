/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import {
  useComplements,
  useGroup,
  useProduct,
  useSizes,
  useUserData,
} from "../utils/store";
import { groupMock } from "../utils/mocks/groupMock";
import { userMock } from "../utils/mocks/userMock";
import { productMock } from "../utils/mocks/productMock";
import { complementMock } from "../utils/mocks/complementMock";
import { sizeMock } from "../utils/mocks/sizeMock";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";

const words = [
  "Aguarde um momento",
  "Buscando dados",
  "Populando informações",
  "Quase lá",
  "Preparando tudo para você",
];

export default function Splash() {
  const setSizes = useSizes((s) => s.setSizes);
  const setComplements = useComplements((s) => s.setComplements);
  const setProductArr = useProduct((s) => s.setProductArr);
  const setGroupArr = useGroup((s) => s.setGroupArr);
  const setUserData = useUserData((s) => s.setUserData);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState("Iniciando");

  const navigate = useNavigate();
  const typingSpeed = 100;

  useEffect(() => {
    let charIndex = 0;
    let typingInterval: ReturnType<typeof setInterval>;
    const typeWord = () => {
      typingInterval = setInterval(() => {
        const currentWord = words[currentWordIndex];
        if (charIndex <= currentWord.length) {
          setDisplayedText(currentWord.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }, 1500);
        }
      }, typingSpeed);
    };
    typeWord();
    return () => clearInterval(typingInterval);
  }, [currentWordIndex]);

  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const go = async (
    pct: number,
    label: string,
    fn: () => void | Promise<void>
  ) => {
    setStepLabel(label);
    await wait(200);
    await fn();
    setProgress(pct);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      setError(null);
      setProgress(0);
      setStepLabel("Iniciando");

      const timeoutId = setTimeout(() => {
        controller.abort();
        if (isMounted)
          setError("Tempo limite excedido. Verifique sua conexão.");
      }, 5000);

      try {
        await go(20, "Carregando tamanhos...", () => setSizes(sizeMock));
        if (!isMounted || controller.signal.aborted) return;

        await go(40, "Carregando complementos...", () =>
          setComplements(complementMock)
        );
        if (!isMounted || controller.signal.aborted) return;

        await go(60, "Carregando produtos...", () =>
          setProductArr(productMock)
        );
        if (!isMounted || controller.signal.aborted) return;

        await go(80, "Carregando grupos...", () => setGroupArr(groupMock));
        if (!isMounted || controller.signal.aborted) return;

        await go(95, "Sincronizando usuário...", async () => {
          setUserData(userMock);
          await wait(150);
        });

        setStepLabel("Finalizando…");
        setProgress(100);
        await wait(250);

        if (isMounted && !controller.signal.aborted) navigate("/home");
      } catch (err: any) {
        if (isMounted) {
          console.error("Erro na sincronização:", err);
          setError("Erro ao sincronizar dados. Tente novamente.");
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    navigate,
    setComplements,
    setGroupArr,
    setProductArr,
    setSizes,
    setUserData,
  ]);

  const handleRetry = () => window.location.reload();

  return (
    <div className="bg-splash-bg h-screen w-screen flex flex-col items-center justify-center text-white font-semibold px-4">
      <img
        src="/assets/logo.png"
        className="h-20 object-contain mb-4"
        alt="Logo"
      />

      {!error ? (
        <div className="flex flex-col items-center gap-4">
          <img
            src="/assets/loading.png"
            className="h-20 object-contain opacity-80"
            alt=""
          />
          <div className="flex flex-col items-center w-[360px] sm:w-[420px]">
            <div className="w-full text-center h-6 whitespace-nowrap overflow-hidden">
              <span className="font-mono">{displayedText}|</span>
            </div>

            <div className="w-full mt-3">
              <ProgressBar value={progress} label={stepLabel} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <UseAnimations animation={loading} size={20} strokeColor="white" />
            <p>Carregando…</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <p className="text-red-300 mb-3">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-primary px-5 py-2 rounded-md font-semibold hover:opacity-85 transition"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
}
