export {};

type ReceiptItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  observation?: string;
  additionals?: string[];
};

type ReceiptPayload = {
  company?: {
    name?: string;
    document?: string;
    address?: string;
  };
  order?: {
    total?: number;
    label?: string;
    code?: string;
    items?: ReceiptItem[];
  };
  payment?: {
    document?: string;
    type?: string;
    pix?: {
      id?: number;
      description?: string;
      key?: string;
      qrCode?: string;
    };
  };
  timestamp?: string;
  printerName?: string;
};

declare global {
  interface Window {
    electronAPI?: {
      closeApp: () => void;
      loginKiosk: () => void;
      logoutKiosk: () => void;
      onNavigate: (cb: (route: string) => void) => void;
      printReceipt: (payload: ReceiptPayload) => void;
    };
  }
}
