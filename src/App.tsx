import { lazy, Suspense } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  // NavLink,
} from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Menu = lazy(() => import("./pages/Menu"));
const Cart = lazy(() => import("./pages/Cart"));
const Splash = lazy(() => import("./pages/Splash"));

function RootLayout() {
  return (
    <div>
      {/* <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center gap-4 p-4">
          <h1 className="text-lg font-semibold">Projeto Totem</h1>
          <div className="ml-auto flex gap-3 text-sm">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "font-semibold" : "")}>Home</NavLink>
          </div>
        </nav>
      </header> */}
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
            <Route path="/" element={<Home />} />
            <Route path="/src/pages/Menu.tsx" element={<Menu />} />
            <Route path="/src/pages/Cart.tsx" element={<Cart />} />
            <Route path="/src/pages/Splash.tsx" element={<Splash />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
