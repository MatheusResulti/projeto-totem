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

    const load = async () => {
      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
      await wait(600);

      if (!isMounted) return;

      setSizes(sizeMock);
      setComplements(complementMock);
      setProductArr(productMock);
      setGroupArr(groupMock);
      setUserData(userMock);

      await wait(400);
      if (isMounted) navigate("/home");
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [
    navigate,
    setComplements,
    setGroupArr,
    setProductArr,
    setSizes,
    setUserData,
  ]);
  return (
    <div className="bg-splash-bg h-screen w-screen flex flex-col items-center justify-center text-white font-semibold">
      <img src="/assets/logo.png" className="h-20 object-contain" />
      <img src="/assets/loading.png" className="h-87.5" />
      <span> {displayedText}|</span>
      <div className="flex flex-row items-center gap-2 mt-3">
        <UseAnimations animation={loading} size={20} strokeColor="white" />
        <p>Carregando</p>
      </div>
    </div>
  );
}
