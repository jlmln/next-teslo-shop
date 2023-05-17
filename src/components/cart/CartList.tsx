import { FC } from "react"
import { useSelector } from 'react-redux';


//Interfaces
import { StateCurrent } from "@/interfaces/stateCurrent"

import { CardCartList } from "./CardCartList";
import { IOrderItem } from "@/interfaces";

interface Props {
  editable?: boolean;
  products?: IOrderItem[]
}

export const CartList: FC<Props> = ({editable = true, products}) => {

  const productsState = useSelector((state:StateCurrent) => state.cart.listOfCart)
  const productsIncart =!products ?  productsState : products

  return (
    <>
      {productsIncart.length > 0 && productsIncart.map((product) => (
        <CardCartList product={product} key={product._id+product.size} editable={editable} />
      ))}
    </>
  )
}
