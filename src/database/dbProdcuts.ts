import { db } from '@/database';
import { Product } from '@/models';

//Interfaces
import { IProduct, ProductSlug } from '@/interfaces';
import products from '@/pages/api/admin/products';

export const getProductBySlug = async (slug: string) => {
  try {
    await db.connect()
    const product = await Product.findOne({slug}).lean()
    await db.disconnect()

    if(!product) return null

    product.images = product.images.map( image => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
    })

    return JSON.parse(JSON.stringify(product))
  } catch (error) {
    return error
  }
}

export const getAllProductsSlugs = async(): Promise<ProductSlug[]> => {
  try {
    await db.connect()
    const slugs = await Product.find().select('slug -_id').lean()
    await db.disconnect()

    return slugs
  } catch (error:any) {
    return error
  }
}

export const getProductByTerm = async (term:string): Promise<IProduct[]> => {
  term = term.toString().toLowerCase()

  // {$regex: `.*${term}*.`}
  try {
    await db.connect()
    const products = await Product.find({
      $text: { $search: term},
    }).select('title images price inStock slug -_id').lean()
    await db.disconnect()

    const updatedProducts = products.map( product => {
      product.images = product.images.map( image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
      })
      return product
    })

    return updatedProducts
  } catch (error:any) {
    return error
  }
}

export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    await db.connect()
    const products = await Product.find().lean()
    await db.disconnect()

    const updatedProducts = products.map( product => {
      product.images = product.images.map( image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
      })
      return product
    })

    return JSON.parse(JSON.stringify(updatedProducts))
  } catch (error:any) {
    return error
  }
}