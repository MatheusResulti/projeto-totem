/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProductType {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  groupId?: number;
  type?: string;
}

export interface GroupType {
  id: number;
  name: string;
}

export type OrderType = {
  cdEmpresa: number;
  tpAtendimento: number;
  dsAtendimento: string;
  cdUsuario: number;
  dsRotulo: string;
  total: number;
  itens: any[];
};

export type ItemType = {
  dsProduto?: string;
  tamanho_id?: string;
  tamanho_nome?: string;
  price: number;
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
  observacao: string;
  tpProduto: string;
  adicionais?: {
    adicional_id: number;
    name: string;
  }[];
};
