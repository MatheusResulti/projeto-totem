import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Menu = lazy(() => import("./pages/Menu"));
const Cart = lazy(() => import("./pages/Cart"));
const Splash = lazy(() => import("./pages/Splash"));
const Login = lazy(() => import("./pages/Login"));
const Payment = lazy(() => import("./pages/Payment"));

function RootLayout() {
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
            <Route path="payment" element={<Payment />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
