import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function useInactivityTimer(timeout = 30000) {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const EXCLUDED_ROUTES = ["/", "/login", "/home", "/timeExceeded"];

    const isExcluded = EXCLUDED_ROUTES.some(
      (r) => location.pathname === r || location.pathname.startsWith(r + "/")
    );

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isExcluded) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (location.pathname !== "/timeExceeded") {
          const last = location.pathname + location.search + location.hash;
          sessionStorage.setItem("lastRoute", last);
          navigate("/timeExceeded", { replace: true });
        }
      }, timeout);
    };

    resetTimer();

    const events: (keyof DocumentEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
    ];
    events.forEach((evt) =>
      document.addEventListener(evt, resetTimer, { passive: true })
    );

    const onVisibility = () => {
      if (!document.hidden) resetTimer();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((evt) => document.removeEventListener(evt, resetTimer));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [navigate, location.pathname, location.search, location.hash, timeout]);
}
