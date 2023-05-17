import type { NextApiRequest, NextApiResponse } from 'next'

//Database
import { db } from '@/database';
import { Order, Product, User } from '@/models';

type Data = {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number
} |{ message: string}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    await db.connect()

    const [numberOfOrders,
      paidOrders,
      notPaidOrders,
      numberOfClients,
      numberOfProducts ,
      productsWithNoInventory,
      lowInventory] = await Promise.all([
      Order.count(),
      Order.find({isPaid: true}).count(),
      Order.find({isPaid: false}).count(),
      User.find({role: 'client'}).count(),
      Product.count(),
      Product.find({inStock:0}).count(),
      Product.find({inStock: { $lte: 10  } }).count(),
    ])

    await db.disconnect()

    const dashboardResumen = {
      numberOfOrders,
      paidOrders,
      notPaidOrders,
      numberOfClients,
      numberOfProducts ,
      productsWithNoInventory,
      lowInventory
    }

    return res.status(200).json(dashboardResumen)
  } catch (error) {
    return res.status(500).json({message: 'Error en servidor'})
  }
}