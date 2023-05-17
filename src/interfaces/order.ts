import { IUser } from "./user"
import { ShippingAddress } from './shippingAddress';
import { ISize } from "./products";

export interface IOrder{
  _id?: string,
  user?: IUser | string,
  orderItems: IOrderItem[],
  shippingAddress: ShippingAddress,
  paymentResults?: string,

  itemsQuantity: number,
  subTotal: number,
  tax: number,
  total: number,

  isPaid: boolean,
  paidAt?: string,
  
  transactionId?: string,

  createdAt?: string
}

export interface IOrderItem {
  _id: string,
  title: string,
  size: ISize,
  quantity: number,
  slug: string,
  image: string,
  price: number,
  gender: string
}