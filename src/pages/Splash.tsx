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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
      setError(null);

      const timeout = setTimeout(() => {
        controller.abort();
        if (isMounted)
          setError("Tempo limite excedido. Verifique sua conexão.");
      }, 5000);

      try {
        await wait(800);
        if (!isMounted || controller.signal.aborted) return;

        setSizes(sizeMock);
        setComplements(complementMock);
        setProductArr(productMock);
        setGroupArr(groupMock);
        setUserData(userMock);

        await wait(500);
        if (isMounted) navigate("/home");
      } catch (err: any) {
        if (!isMounted) {
          console.error("Erro na sincronização:", err);
          setError("Erro ao sincronizar dados. Tente novamente.");
        }
      } finally {
        clearTimeout(timeout);
      }
    };

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    navigate,
    setComplements,
    setGroupArr,
    setProductArr,
    setSizes,
    setUserData,
  ]);

  const handleRetry = () => {
    window.location.reload();
  };
  return (
    <div className="bg-splash-bg h-screen w-screen flex flex-col items-center justify-center text-white font-semibold">
      <img src="/assets/logo.png" className="h-20 object-contain mb-4" />

      {!error ? (
        <>
          <img src="/assets/loading.png" className="h-24 object-contain" />
          <span>{displayedText}|</span>
          <div className="flex flex-row items-center gap-2 mt-3">
            <UseAnimations animation={loading} size={20} strokeColor="white" />
            <p>Carregando</p>
          </div>
        </>
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
