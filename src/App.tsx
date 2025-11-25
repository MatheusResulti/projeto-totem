import { Toaster } from "react-hot-toast";
import { lazy, Suspense, useEffect, useState } from "react";
import { HashRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useInactivityTimer } from "./utils/useInactivityTimer";
import { VirtualKeyboard } from "./components/VirtualKeyboard/VirtualKeyboard";

const Home = lazy(() => import("./pages/Home/Home"));
const Menu = lazy(() => import("./pages/Menu/Menu"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Splash = lazy(() => import("./pages/Splash/Splash"));
const Login = lazy(() => import("./pages/Login/Login"));
const PixPayment = lazy(() => import("./pages/PixPayment/PixPayment"));
const CardPayment = lazy(() => import("./pages/CardPayment/CardPayment"));
const TimeExceeded = lazy(
  () => import("./components/TimeExceeded/TimeExceeded")
);

function RootLayout() {
  /*useInactivityTimer(60000);*/

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [activeElement, setActiveElement] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);
  const [keyboardMode, setKeyboardMode] = useState<"alpha" | "numeric">("alpha");

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        (target as any).isContentEditable
      ) {
        setActiveElement(target as HTMLInputElement | HTMLTextAreaElement);
        setKeyboardVisible(true);
        const modeAttr =
          (target as HTMLElement).getAttribute("data-kb-mode") ?? "alpha";
        setKeyboardMode(modeAttr === "numeric" ? "numeric" : "alpha");
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        (target as any).isContentEditable
      ) {
        setKeyboardVisible(false);
      }
    };

    window.addEventListener("focusin", handleFocusIn as any);
    window.addEventListener("focusout", handleFocusOut as any);

    return () => {
      window.removeEventListener("focusin", handleFocusIn as any);
      window.removeEventListener("focusout", handleFocusOut as any);
    };
  }, []);

  useEffect(() => {
    if (!keyboardVisible || !activeElement) return;
    activeElement.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [keyboardVisible, activeElement]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = keyboardVisible ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [keyboardVisible]);

  useEffect(() => {
    const offset = keyboardVisible ? keyboardHeight + 24 : 0;
    document.documentElement.style.setProperty("--kb-offset", `${offset}px`);
    return () => {
      document.documentElement.style.removeProperty("--kb-offset");
    };
  }, [keyboardVisible, keyboardHeight]);

  return (
    <div className="relative h-full w-full">
      <Toaster position="top-center" reverseOrder={false} />
      <main
        style={{
          paddingBottom: keyboardVisible ? keyboardHeight + 24 : 0,
          minHeight: "100vh",
          overflow: keyboardVisible ? "hidden" : undefined,
        }}
      >
        <Outlet />
      </main>

      <VirtualKeyboard
        visible={keyboardVisible}
        activeElement={activeElement}
        onHeightChange={(h) => setKeyboardHeight(h)}
        onClose={() => setKeyboardVisible(false)}
        mode={keyboardMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="p-6">Carregando…</div>}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Splash />} />
            <Route path="login" element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="/pagamento/pix" element={<PixPayment />} />
            <Route path="/pagamento/cartao/:tipo" element={<CardPayment />} />
            <Route path="timeExceeded" element={<TimeExceeded />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
