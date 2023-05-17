import type { NextApiRequest, NextApiResponse } from "next";
import { db} from '@/database'
import { Product } from "@/models";
import { IProduct } from "@/interfaces";

type Data = 
  | { message: string }
  | IProduct

export default function handler(req: NextApiRequest,res: NextApiResponse<Data>){

  switch (req.method) {
    case 'GET':
      return getProductBySlug(req,res)
    default:
      return res.status(400).json({
        message: 'Bad request'
      })
  }
}

const getProductBySlug = async (req: NextApiRequest,res: NextApiResponse<Data>) => {

  const { slug } = req.query

  try {
    await db.connect()
    const productFound = await Product.findOne({slug:slug}).lean()
    await db.disconnect()

    if(!productFound){
      return res.status(404).json({message:'No existe el producto'})
    }

    return res.status(200).json(productFound)
    
  } catch (error: any) {
    return res.status(500).json({message: error})
  }
  
}