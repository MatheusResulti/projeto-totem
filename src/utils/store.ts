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

interface IProduct {
  productArr: [];
  setProductArr: (value: any) => void;
}

export const useProduct = create<IProduct>((set) => ({
  productArr: [],
  setProductArr: (value: any) => set({ productArr: value }),
}));

interface IGroup {
  groupArr: [];
  setGroupArr: (value: any) => void;
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
