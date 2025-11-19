import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useInactivityTimer } from "./utils/useInactivityTimer";

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
  useInactivityTimer(60000);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <main>
        <Outlet />
      </main>
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
