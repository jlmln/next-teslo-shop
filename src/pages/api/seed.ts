import type { NextApiRequest, NextApiResponse } from "next";
import { db, seedData } from '@/database'
import { Order, Product, User } from "@/models";

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if(process.env.NODE_ENV === 'production'){
    return res.status(401).json({message: 'No tiene acceso a este servicio'})
  }

  try {
    await db.connect()

    await User.deleteMany()
    await User.insertMany(seedData.initialData.users)

    await Product.deleteMany()
    await Product.insertMany(seedData.initialData.products)

    await Order.deleteMany()
    
    await db.disconnect()

    return res.status(200).json({ message: 'Proceso realizado correctamente' })
  } catch (error:any) {
    return res.status(500).json({message: error})
  }
  
}