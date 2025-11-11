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
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { Api } from "../api/Api";
<<<<<<< HEAD
=======
import { asset } from "../utils/asset";
>>>>>>> 189e5da (alterações feitas para o exe)

const words = [
  "Aguarde um momento",
  "Buscando dados",
  "Populando informações",
  "Quase lá",
  "Preparando tudo para você",
];

export default function Splash() {
<<<<<<< HEAD
  const loadingImg = "/assets/loading.png";
  const logo = "/assets/logo.png";
=======
  const loadingImg = asset("/assets/loading.png");
  const logo = asset("/assets/logo.png");
>>>>>>> 189e5da (alterações feitas para o exe)
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

    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const route = localStorage.getItem("route");
    const door = localStorage.getItem("door");

    if (!userStr || !token || !route || !door) {
      navigate("/login");
      return () => {};
    }

    try {
      const user = JSON.parse(userStr);
      setUserData(user);
    } catch {
      navigate("/login");
      return () => {};
    }

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
        await go(20, "Carregando tamanhos...", async () => {
          const ctrl = new AbortController();
          const to = setTimeout(() => ctrl.abort(), 15000);
          try {
            const papel = String(
              useUserData.getState().userData?.tpPapel ??
                localStorage.getItem("tpPapel") ??
                "8"
            );

            const res = await Api.get(`tamanhos?tpPapel=${papel}`, {
              signal: ctrl.signal,
            });

            const listRaw = res?.data?.data ?? res?.data ?? [];
            if (!Array.isArray(listRaw)) throw new Error("Formato inesperado");

            const sizes = listRaw.map((t: any) => ({
              id: Number(t.cdtamanho ?? t.cdTamanho ?? t.id ?? 0),
              name: String(t.dstamanho ?? t.dsTamanho ?? t.nome ?? "").trim(),
              price: Number(t.vlpreco ?? t.vlPreco ?? t.preco ?? 0),
              productId: Number(t.cdproduto ?? t.cdProduto ?? 0),
            }));

            setSizes(sizes);
          } catch (e: any) {
            const msg = (e?.message || "").toLowerCase();
            if (msg.includes("failed to fetch")) {
              setError(
                "Não foi possível conectar ao servidor (conexão recusada/indisponível). Verifique IP e porta."
              );
            } else if (msg.startsWith("http")) {
              setError(`Servidor respondeu com erro: ${e.message}.`);
            } else {
              setError("Erro ao carregar tamanhos. Tente novamente.");
            }
            console.error("Tamanhos - erro:", e);
          } finally {
            clearTimeout(to);
          }
        });

        await go(40, "Carregando complementos...", async () => {
          const ctrl = new AbortController();
          const to = setTimeout(() => ctrl.abort(), 15000);
          try {
            const papel = String(
              useUserData.getState().userData?.tpPapel ??
                localStorage.getItem("tpPapel") ??
                "8"
            );

            const res = await Api.get(`adicional/agrupado?tpPapel=${papel}`, {
              signal: ctrl.signal,
            });

            const listRaw = res?.data?.data ?? res?.data ?? [];
            if (!Array.isArray(listRaw)) throw new Error("Formato inesperado");

            const complements = listRaw.map((t: any) => ({
              id: Number(t.cdAdicional ?? t.id ?? 0),
              name: String(t.dsAdicional ?? t.nome ?? "").trim(),
              order: Number(t.nrOrdem ?? 0),
              price: Number(t.vlAdicional ?? 0),
              groupId: Number(t.cdAgrupador ?? 0),
              groupType: String(t.tpAgrupador ?? "").trim(),
            }));

            setComplements(complements);
          } catch (e: any) {
            const msg = (e?.message || "").toLowerCase();
            if (msg.includes("failed to fetch")) {
              setError(
                "Não foi possível conectar ao servidor. Verifique IP e porta."
              );
            } else if (e?.name === "AbortError") {
              setError("Tempo limite excedido. Verifique sua conexão.");
            } else {
              setError("Erro ao carregar complementos. Tente novamente.");
            }
            console.error("❌ Erro ao carregar complementos:", e);
          } finally {
            clearTimeout(to);
          }
        });

        await go(60, "Carregando produtos...", async () => {
          const ctrl = new AbortController();
          const to = setTimeout(() => ctrl.abort(), 15000);
          try {
            const papel = String(
              useUserData.getState().userData?.tpPapel ??
                localStorage.getItem("tpPapel") ??
                "8"
            );

            const res = await Api.get(`produto?tpPapel=${papel}`, {
              signal: ctrl.signal,
            });
            const listRaw = res?.data?.data ?? res?.data ?? [];
            if (!Array.isArray(listRaw)) throw new Error("Formato inesperado");

            const products = listRaw.map((p: any) => ({
              id: Number(p.cdproduto),
              name: (p.dsproduto ?? "").trim(),
              price: Number(p.vlproduto ?? 0),
              image: p.dsfotourl ?? "",
              groupId: Number(p.cdgrupo ?? 0),
            }));

            setProductArr(products);
          } catch (e: any) {
            const msg = (e?.message || "").toLowerCase();
            if (msg.includes("failed to fetch")) {
              setError(
                "Não foi possível conectar ao servidor (conexão recusada/indisponível). Verifique IP e porta."
              );
            } else if (msg.startsWith("http")) {
              setError(`Servidor respondeu com erro: ${e.message}.`);
            } else {
              setError("Erro ao carregar produtos. Tente novamente.");
            }
            console.error("Produtos - erro:", e);
          } finally {
            clearTimeout(to);
          }
        });

        await go(80, "Carregando grupos...", async () => {
          const ctrl = new AbortController();
          const to = setTimeout(() => ctrl.abort(), 15000);
          try {
            const papel = String(
              useUserData.getState().userData?.tpPapel ??
                localStorage.getItem("tpPapel") ??
                "8"
            );

            const res = await Api.get(`produto/grupo?tpPapel=${papel}`, {
              signal: ctrl.signal,
            });

            const listRaw = res?.data?.data ?? res?.data ?? [];
            if (!Array.isArray(listRaw)) throw new Error("Formato inesperado");

            const groups = listRaw.map((g: any) => ({
              id: Number(g.cdgrupo ?? g.cdGrupo ?? 0),
              name: String(g.dsgrupo ?? g.dsGrupo ?? "").trim(),
              order: Number(g.nrordem ?? g.nrOrdem ?? 999),
              subgroups: Array.isArray(g.subgrupos)
                ? g.subgrupos.map((s: any) => ({
                    id: Number(s.cdsubgrupo ?? s.cdSubgrupo ?? 0),
                    name: String(s.dssubgrupo ?? s.dsSubgrupo ?? "").trim(),
                    order: Number(s.nrordem ?? s.nrOrdem ?? 999),
                  }))
                : [],
            }));

            const sortedGroups = groups
              .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
              .map((g) => ({
                ...g,
                subgroups: [...(g.subgroups ?? [])].sort(
                  (a, b) => (a.order ?? 999) - (b.order ?? 999)
                ),
              }));

            setGroupArr(sortedGroups);
          } catch (e: any) {
            const msg = (e?.message || "").toLowerCase();
            if (msg.includes("failed to fetch")) {
              setError(
                "Não foi possível conectar ao servidor (conexão recusada/indisponível). Verifique IP e porta."
              );
            } else if (msg.startsWith("http")) {
              setError(`Servidor respondeu com erro: ${e.message}.`);
            } else {
              setError("Erro ao carregar produtos. Tente novamente.");
            }
            console.error("Produtos - erro:", e);
          } finally {
            clearTimeout(to);
          }
        });
        await go(95, "Sincronizando usuário...", async () => {
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
      <img src={logo} className="h-20 object-contain mb-4" alt="Logo" />

      {!error ? (
        <div className="flex flex-col items-center gap-4">
          <img
            src={loadingImg}
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
          <p className="text-error mb-3">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-primary px-5 py-2 rounded-md font-semibold touchable"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
}
