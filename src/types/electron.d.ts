export {};

declare global {
  interface Window {
    electronAPI?: {
      closeApp: () => void;
      loginKiosk: () => void;
      logoutKiosk: () => void;
      onNavigate: (cb: (route: string) => void) => void;
    };
  }
}
