/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cable, Lock, Network, User } from "lucide-react";
import InputField from "../InputField/InputField";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PasswordInput from "../PasswordInput/PasswordInput";
import { Api, setAuthToken } from "../../api/Api";
import { useUserData } from "../../utils/store";
import { useNavigate } from "react-router-dom";
import { asset } from "../../utils/asset";

export default function LoginForm() {
  const navigate = useNavigate();
  const icon = asset("/assets/icon.png");

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [apiRoute, setApiRoute] = useState("");
  const [apiDoor, setApiDoor] = useState("");
  const [loading, setLoading] = useState(false);
  const setUserData = useUserData((s) => s.setUserData);

  const formatIp = (value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 12);
    const parts = [];
    for (let i = 0; i < clean.length && parts.length < 4; i += 3) {
      parts.push(clean.slice(i, i + 3));
    }
    return parts.join(".");
  };

  const handleIpChange = (value: string) => {
    setApiRoute(formatIp(value));
  };

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

      window.electronAPI?.loginKiosk?.();

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

    if (route) setApiRoute(formatIp(route));
    if (door) setApiDoor(door);
    if (user && route && door) {
      window.electronAPI?.loginKiosk?.();
      navigate("/splash");
    }
  }, [navigate]);

  return (
    <div
      className="
        mx-auto w-full max-w-[520px]
        rounded-2xl bg-background-color/95 shadow-xl backdrop-blur
        p-4 sm:p-6 lg:p-8
      "
    >
      <div className="flex flex-col items-center text-center space-y-1 sm:space-y-1.5 mb-4 sm:mb-6">
        <img src={icon} className="h-14 sm:h-16 mb-2" alt="" />
        <span className="font-semibold text-base text-primary sm:text-lg lg:text-x">
          Bem vindo!
        </span>
        <span className="font-medium text-sm sm:text-base text-text-color">
          Agilize seus pedidos. Simples e rápido!
        </span>
      </div>

      <div className="flex flex-col gap-1 text-text-color">
        <InputField
          inputType="text"
          icon={<Cable size={22} color="#0EA5E9"/>}
          value={apiRoute}
          onChange={(e) => handleIpChange(e.target.value)}
          placeholder="000.000.000.000"
          maxLength={15}
          inputProps={{ "data-enter-target": "#login-submit" }}
        />
        <InputField
          inputType="text"
          icon={<Network size={22} color="#0EA5E9" />}
          value={apiDoor}
          onChange={(e) => setApiDoor(e.target.value)}
          placeholder="0000"
          maxLength={5}
          inputProps={{
            "data-enter-target": "#login-submit",
            "data-kb-mode": "numeric",
          }}
        />
        <InputField
          inputType="text"
          icon={<User size={22} color="#0EA5E9"/>}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Digite seu login"
          inputProps={{ "data-enter-target": "#login-submit" }}
        />
        <PasswordInput
          icon={<Lock size={22} color="#0EA5E9"/>}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          inputProps={{ "data-enter-target": "#login-submit" }}
        />
      </div>

      <div className="mt-5 sm:mt-6">
        <button
          id="login-submit"
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
