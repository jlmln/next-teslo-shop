import { GetServerSideProps, NextPage } from 'next'

import { Typography } from "@mui/material";

//Components
import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
//import { initialData } from "@/database/products";

//Database
import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';

interface Props {
  products: IProduct[],
  term: string
}

const SearchPage: NextPage<Props> = ({products,term}) => {

  return (
    <ShopLayout title={'Teslo-shop - Search'} pageDescription={'descripcion search'} >
      <Typography variant="h1" component='h1'>Buscar</Typography>
      <Typography variant="h2" component='h2' sx={{ mb: 1}} textTransform='capitalize' >{products ? term : null} </Typography>

      <ProductList products={products} />
      
    </ShopLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({params}) => {

  const { query = '' } = params as { query: string}

  let products = await dbProducts.getProductByTerm(query)

  if(products.length <= 0){
    products = await dbProducts.getAllProducts()
  }

  return {
    props: {
      products,
      term: query
    }
  }
}


export default SearchPage
