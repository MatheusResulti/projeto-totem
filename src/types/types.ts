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
  cdAtendente?: number;
  dsRotulo: string;
  total: number;
  vlAcrescimo?: number;
  dsHash?: string;
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

export type ResultiPayType = {
  fmp_idpk: number;
  fmp_pix_tipo: string;
  fmp_link_compartilhamento: string;
  fmp_link_qrcode: string;
  fmp_hash: string;
  fmp_descricao: string;
  fmp_chave: string;
  fmp_financeiro_conta_idpk: number;
  status: string;
};

export type ImpressaoItem = {
  text?: string;
  bold?: boolean;
  line?: boolean;
  doubleLine?: boolean;
  emptyLine?: boolean;
};
