import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function useInactivityTimer(timeout = 30000) {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (location.pathname === "/home" || location.pathname === "/timeexceeded")
      return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        navigate("/timeexceeded");
      }, timeout);
    };

    resetTimer();

    const events = ["mousemove", "mousedown", "keypress", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, location, timeout]);
}
