import { NextPage, GetStaticProps, GetStaticPaths } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import { useDispatch } from "react-redux"

import { Box, Button, Chip, Grid, Typography } from "@mui/material"

//Components
import { ShopLayout } from "@/components/layouts"
import { ProductSlideshow, SizeSelector } from "@/components/products"
import { ItemCounter } from "@/components/ui"

//Database
import { dbProducts } from "@/database"

//Interfaces
import { ICartProduct, IProduct, ISize, ProductSlug } from "@/interfaces"

//Store
import { AppDispatch } from "@/app/store"
import { addProduct, loadCartFromCookies } from "@/app/Slices/cartSlice"

//Actions


interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({product}) => {

  const dispatch = useDispatch<AppDispatch>()

  const { push } = useRouter()
  
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    inStock: product.inStock,
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const setSize = (e:ISize) => {
    setTempCartProduct({...tempCartProduct,size:e})
  }

  const updateQuantity = (value:number) => {
    setTempCartProduct({...tempCartProduct,quantity:value})
  }

  const addProductToCart = async () => {
    if(tempCartProduct.size){
      dispatch(addProduct(tempCartProduct))
      push('/cart')
    }
    return
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description} >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7} >
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5} >
          <Box display='flex' flexDirection='column'>
            <Typography variant="h1" component='h1'>{ product.title }</Typography>
            <Typography variant="subtitle1" component='h2' >{`$${product.price}`}</Typography>
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" > Cantidad </Typography>
            <ItemCounter current={tempCartProduct.quantity} changeQuantity={updateQuantity} max={product.inStock} />
            <SizeSelector selectedSize={ tempCartProduct.size } setSize={setSize} sizes={product.sizes} />
          </Box>
          {product.inStock > 0 ? 
            (<Button color="secondary" className="circular-btn" fullWidth onClick={addProductToCart}>
              {
                tempCartProduct.size 
                ? 'Agregar al carrito'
                : 'Seleccione una talla'
              }
            </Button>)
            : 
            (<Chip
              color='error'
              label='No hay disponibles'
              variant="outlined"
              sx={{ width: '100%' }}
            />)
          }

          <Box sx={{ mt:3 }}>
            <Typography variant="subtitle2">Description</Typography>
            <Typography variant="body2">{product.description}</Typography>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}


// export const getServerSideProps: GetServerSideProps = async ({query}) => {
//   const { slug } = query
//   const product = await dbProducts.getProductBySlug(slug?.toString()!)

//   if(!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const productsSlugs = await dbProducts.getAllProductsSlugs()

  return {
    paths: productsSlugs.map(({slug}) => (
      {params: {slug}}
    )) 
    ,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const { slug } = params as { slug: string }
  const product = await dbProducts.getProductBySlug(slug?.toString()!)

  if(!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24
  }
}

export default ProductPage
