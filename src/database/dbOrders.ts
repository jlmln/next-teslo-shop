import { IOrder } from "@/interfaces";
import { isValidObjectId } from "mongoose";
import { db } from ".";
import { Order } from "@/models";

export const getOrderById = async(id:string ):Promise<IOrder | null | undefined > => {

  if( !isValidObjectId(id)){
    return null
  }

  try {

    await db.connect()
    const order = await Order.findById(id).lean()
    await db.disconnect()

    if(!order){
      return null
    }

    return JSON.parse(JSON.stringify(order))
    
  } catch (error) {
    console.log(error)
  }

}

export const getOrderByUser = async( userId: string): Promise<IOrder[] | null> => {
  if(!isValidObjectId(userId)){
    return []
  }

  try {
    
    await db.connect()
    const orders = await Order.find({user: userId}).lean()
    await db.disconnect()

    return JSON.parse(JSON.stringify(orders))
  } catch (error) {
    console.log(error)
    return null
  }
}