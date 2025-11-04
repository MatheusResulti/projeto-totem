/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cable, Lock, Network, User } from "lucide-react";
import InputField from "./InputField";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";
import { Api, setAuthToken } from "../api/Api";
import { useUserData } from "../utils/store";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [apiRoute, setApiRoute] = useState("");
  const [apiDoor, setApiDoor] = useState("");
  const [loading, setLoading] = useState(false);
  const setUserData = useUserData((s) => s.setUserData);

  // const setUser = async (data: any) => {
  //   localStorage.setItem("user", JSON.stringify({ ...data }));
  //   setUserData?.(data?.user ?? data);
  //   navigate("/splash");
  // };

  const handleLogin = async () => {
    if (loading) return;
    if (!apiRoute) return toast.error("O campo IP é obrigatório.");
    if (!apiDoor) return toast.error("O campo Porta é obrigatório.");
    if (!login) return toast.error("O campo Login é obrigatório.");
    if (!password) return toast.error("O campo Senha é obrigatório.");

    localStorage.setItem("route", apiRoute.trim());
    localStorage.setItem("door", apiDoor.trim());

    try {
      setLoading(true);

      const resp = await Api.post("auth", {
        cdEmpresa: 1,
        dsLogin: login.toUpperCase(),
        dsSenha: password,
      });

      const payload = resp?.data?.data ?? resp?.data ?? {};

      const fakeToken = btoa(`${payload.dsLogin}:${Date.now()}`);
      setAuthToken(fakeToken);

      localStorage.setItem("user", JSON.stringify(payload));
      setUserData?.(payload);

      toast.success("Login realizado!");
      navigate("/splash");
    } catch (e: any) {
      const msg = e?.message ?? "Verifique sua rede e tente novamente.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const route = localStorage.getItem("route");
    const door = localStorage.getItem("door");

    if (route) setApiRoute(route);
    if (door) setApiDoor(door);
    if (user && route && door) {
      navigate("/splash");
    }
  }, [navigate]);

  return (
    <div
      className="
        mx-auto w-full max-w-[520px]
        rounded-2xl bg-white/95 shadow-xl backdrop-blur
        p-4 sm:p-6 lg:p-8
      "
    >
      <div className="flex flex-col items-center text-center space-y-1 sm:space-y-1.5 mb-4 sm:mb-6">
        <img src="/assets/icon.png" className="h-14 sm:h-16 mb-2" alt="" />
        <span className="font-semibold text-base sm:text-lg lg:text-xl">
          Bem vindo!
        </span>
        <span className="font-medium text-sm sm:text-base">
          Agilize seus pedidos. Simples e rápido!
        </span>
      </div>

      <div className="space-y-3 sm:space-y-4 text-text-color font-medium">
        <InputField
          inputType="text"
          icon={<Cable size={22} />}
          value={apiRoute}
          onChange={(e) => setApiRoute(e.target.value)}
          placeholder="000.000.000.000"
          maxLength={15}
        />
        <InputField
          inputType="text"
          icon={<Network size={22} />}
          value={apiDoor}
          onChange={(e) => setApiDoor(e.target.value)}
          placeholder="0000"
          maxLength={5}
        />
        <InputField
          inputType="text"
          icon={<User size={22} />}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Digite seu login"
        />
        <PasswordInput
          icon={<Lock size={22} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
        />
      </div>

      <div className="mt-5 sm:mt-6">
        <button
          disabled={loading}
          onClick={handleLogin}
          className="w-full rounded-lg py-3 sm:py-3.5 font-semibold bg-primary text-white touchable disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}
