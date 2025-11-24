import { X } from "lucide-react";
import LoginForm from "../../components/LoginForm/LoginForm";
import { asset } from "../../utils/asset";

export default function Login() {
  const logo = asset("/assets/logo.png");
  const capa = asset("/assets/capa.jpg");
  const handleClose = () => {
    if (window.electronAPI?.closeApp) {
      window.electronAPI.closeApp();
    } else {
      window.close();
    }
  };

  return (
    <div
      className="relative min-h-dvh bg-cover bg-center"
      style={{
        backgroundImage: `url(${capa})`,
        minHeight: "calc(100dvh - var(--kb-offset, 0px))",
      }}
    >
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      <button
        onClick={handleClose}
        className="absolute right-3 top-3 sm:right-5 sm:top-5 z-50 no-drag grid place-items-center rounded-full border border-white/70 p-2 touchable"
      >
        <X size={28} className="text-white" />
      </button>

      <div
        className="relative z-10 mx-auto flex max-w-7xl items-center justify-center px-3 sm:px-6"
        style={{ minHeight: "calc(100dvh - var(--kb-offset, 0px))" }}
      >
        <div className="w-full">
          <div className="mb-6 flex justify-center">
            <img
              src={logo}
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              alt="ControlChef"
            />
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
