import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary' 

cloudinary.config(process.env.CLOUDINARY_URL || '')

//Database
import { db } from '@/database';
import { Product } from '@/models';

//Interfaces
import { IProduct } from '@/interfaces';


type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req,res)

    case 'POST':
      return createProducts(req,res)

    case 'PUT':
      return updateProducts(req,res)

    default:
      return res.status(200).json({ message: 'Example' })
  }
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {

    await db.connect()
    const products = await Product.find()
                    .sort({title: 'asc'})
                    .lean()
    await db.disconnect()

    if(!products) return null

    let productsF = products.map((product) => 
      {
        product.images = product.images.map( image => {
          return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
      }
    )
      

    res.status(200).json(productsF)
  } catch (error) {
    return res.status(500).json({message: 'Error en servidor'})
  }
}

const updateProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { _id = '', images = [] } = req.body as IProduct

  if (!isValidObjectId(_id)){
    return res.status(400).json({message: 'El id del producto no es válido'})
  }

  if ( images.length < 2){
    return res.status(400).json({message: 'Es necesario al menos 2 imágenes'})
  }

  try {
    await db.connect()
    const product = await Product.findById(_id)

    if( !product ){
      await db.disconnect()
      return res.status(400).json({message: 'No existe un producto con ese ID'})
    }

    product.images.forEach( async(image) => {
      if(!images.includes(image)){
        const [ fileId, extension ] = image.substring(image.lastIndexOf('/') + 1).split('.')
        await cloudinary.uploader.destroy(fileId)
      }
    })

    await product.updateOne(req.body)
    await db.disconnect()

    return res.status(201).json(product)

  } catch (error) {
    console.log(error)
    await db.disconnect()
    return res.status(500).json({message: 'Error en el servidor'})
  }
}

const createProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const { images = [] } = req.body as IProduct

  if ( images.length < 2) {
    return res.status(400).json({message: 'El producto necesita al menos 2 imágenes'})
  }

  try {

    await db.connect()
    const productInDB = await Product.findOne({slug: req.body.slug})

    if(productInDB){
      return res.status(400).json({message: 'Ya existe un producto con ese slug'})
    }

    const product = new Product(req.body)

    await product.save()
    await db.disconnect()

    res.status(201).json(product)

  } catch (error) {

    console.log(error)
    await db.disconnect()
    return res.status(500).json({message: 'Error en el servidor'})

  }

}

