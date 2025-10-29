import { Cable, Lock, Network, User } from "lucide-react";
import InputField from "./InputField";
import { useState } from "react";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [apiRoute, setApiRoute] = useState("");
  const [apiDoor, setApiDoor] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    if (!apiRoute)
      return toast.error("O campo IP é obrigatório."), setLoading(false);
    if (!apiDoor)
      return toast.error("O campo Porta é obrigatório."), setLoading(false);
    if (!login)
      return toast.error("O campo Login é obrigatório."), setLoading(false);
    if (!password)
      return toast.error("O campo Senha é obrigatório."), setLoading(false);

    localStorage.setItem("route", JSON.stringify(apiRoute));
    localStorage.setItem("door", JSON.stringify(apiDoor));

    try {
      const res = await Api.post(`auth`, {
        cdEmpresa: "1",
        dsLogin: login.toUpperCase(),
        dsSenha: password.toUpperCase(),
        tpPapel: 8,
      });
      if (res.error) return toast.error(res.error), setLoading(false);
      setUser({ ...res.data, configMode: isEnabled });
    } catch {
      toast.error("Verifique sua rede e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="space-y-3 sm:space-y-4">
        <InputField
          inputType="text"
          icon={<Cable size={22} />}
          value={apiRoute}
          onChange={(e) => setApiRoute(e.target.value)}
          placeholder="000.000.000.00"
          maxLength={14}
        />
        <InputField
          inputType="text"
          icon={<Network size={22} />}
          value={apiDoor}
          onChange={(e) => setApiDoor(e.target.value)}
          placeholder="0000"
          maxLength={4}
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
          className="
            w-full rounded-lg py-3 sm:py-3.5 font-semibold
            bg-primary text-white touchable"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}
