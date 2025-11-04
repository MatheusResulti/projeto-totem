/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { ItemType } from "../types/types";

interface ISizes {
  sizes: [];
  setSizes: (value: any) => void;
}

export const useSizes = create<ISizes>((set) => ({
  sizes: [],
  setSizes: (value: any) => set({ sizes: value }),
}));

interface IComplements {
  complements: [];
  setComplements: (value: any) => void;
}

export const useComplements = create<IComplements>((set) => ({
  complements: [],
  setComplements: (value: any) => set({ complements: value }),
}));

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  groupId: number;
}

interface IProduct {
  productArr: Product[];
  setProductArr: (value: Product[]) => void;
}

export const useProduct = create<IProduct>((set) => ({
  productArr: [],
  setProductArr: (value) => set({ productArr: value }),
}));

interface Group {
  id: number;
  name: string;
}

interface IGroup {
  groupArr: Group[];
  setGroupArr: (value: Group[]) => void;
}

export const useGroup = create<IGroup>((set) => ({
  groupArr: [],
  setGroupArr: (value: any) => set({ groupArr: value }),
}));

interface IUserData {
  userData: {
    cdUsuario: number;
    cdOperador: number;
    dsSenha: string;
    dsLogin: string;
    nmUsuario: string;
    cdEmpmobile: number;
    tpCalculoVendaItem: number;
    prAcrescimoVenda: number;
    tpVisualizacaoMesa: string;
    cdAtendente: number;
    inBloqueado: string;
    tpPapel: number;
    modelo: string;
    FormasPgto: any;
    logo?: string;
    capa?: string;
    home?: string;
    configMode?: boolean;
    cfgTotem?: {
      corPrimaria?: string;
      corSecundaria?: string;
      cdEmpresa?: number;
      cdOperador?: number;
      cdTotem?: number;
      dsImgCapa?: string;
      dsImgInicial?: string;
      dsImgLogo?: string;
      dtManutencao?: string;
      [key: string]: any;
    };
  };
  setUserData: (value: any) => void;
}

// 1 = Administrador / 2 = Operador / 3 = Garçom / 6 = Vendedor / 7 = Caixa
export const useUserData = create<IUserData>((set) => ({
  userData: {
    cdUsuario: 0,
    cdOperador: 0,
    dsSenha: "",
    dsLogin: "",
    nmUsuario: "",
    cdEmpmobile: 0,
    tpCalculoVendaItem: 0,
    prAcrescimoVenda: 0,
    tpVisualizacaoMesa: "",
    cdAtendente: 0,
    inBloqueado: "",
    tpPapel: 0,
    modelo: "",
    FormasPgto: [],
    logo: "",
    capa: "",
    home: "",
    configMode: false,
    cfgTotem: {
      corPrimaria: "#00AEEF",
      corSecundaria: "#F5F5F5",
      cdEmpresa: 0,
      cdOperador: 0,
      cdTotem: 0,
      dsImgCapa: "",
      dsImgInicial: "",
      dsImgLogo: "",
      dtManutencao: "",
    },
  },
  setUserData: (value: any) => set({ userData: value }),
}));

interface IOrder {
  order: {
    cdEmpresa: number;
    tpAtendimento: number;
    dsAtendimento: string;
    tpLocal: number;
    cdUsuario: number;
    dsRotulo: string;
    total: number;
    itens: ItemType[];
  };
  setOrder: (value: any) => void;
}

export const useOrder = create<IOrder>((set) => ({
  order: {
    cdEmpresa: 1,
    tpAtendimento: 2,
    dsAtendimento: "TOTEM",
    tpLocal: 1,
    cdUsuario: 0,
    dsRotulo: "",
    total: 0,
    itens: [],
  },
  setOrder: (value: any) => set({ order: value }),
}));

type CountState = {
  quantity: number;
  setQuantity: (n: number) => void;
  inc: () => void;
  dec: () => void;
};

export const useCount = create<CountState>((set) => ({
  quantity: 1,
  setQuantity: (n) => set({ quantity: n }),
  inc: () => set((s) => ({ quantity: s.quantity + 1 })),
  dec: () => set((s) => ({ quantity: Math.max(s.quantity - 1, 1) })),
}));
