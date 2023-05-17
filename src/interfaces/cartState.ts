import { ISize, IType, IUser } from "./";
import { ShippingAddress } from "./shippingAddress";

export interface CartState {
  isLoaded: boolean,
  listOfCart : ICartProduct[],
  itemsQuantity?:number,
  total?:number,
  subTotal?:number,
  tax?:number,

  shippingAddress?: ShippingAddress
}

export interface Action {
  type?: string,
  payload: ICartProduct | string | ShippingAddress | IUser
}

export interface ICartProduct {
  _id: string;
  image: string;
  inStock: number;
  price: number;
  size?: ISize;
  slug: string;
  title: string;
  gender: 'men'|'women'|'kid'|'unisex';
  quantity: number;
}
