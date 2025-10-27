export interface ProductType {
  id: number;
  name: string;
  price: number;
  image?: string;
  groupId?: number;
}

export interface GroupType {
  id: number;
  name: string;
}
