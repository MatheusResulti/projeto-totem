import { X } from "lucide-react";
import LoginForm from "../components/LoginForm";

export default function Login() {
  const handleClose = () => {
    if (window.electronAPI?.closeApp) window.electronAPI.closeApp();
    else window.close();
  };

  return (
    <div className="relative min-h-dvh bg-[url(./assets/capa.jpg)] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      <button
        onClick={handleClose}
        className="absolute right-3 top-3 sm:right-5 sm:top-5 z-50 no-drag grid place-items-center rounded-full border border-white/70 p-2 touchable"
      >
        <X size={28} className="text-white" />
      </button>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-7xl items-center justify-center px-3 sm:px-6">
        <div className="w-full">
          <div className="mb-6 flex justify-center">
            <img
              src="./assets/logo.png"
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
