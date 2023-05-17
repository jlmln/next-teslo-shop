import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
//import { initialData } from "@/database/products";
import { Typography } from "@mui/material";

export default function KidCategoryPage() {

  const { products, isLoading } = useProducts('/products?gender=kid')

  return (
    <ShopLayout title={'Teslo-shop - Niños'} pageDescription={'descripcion de categoria de niños'} >
      <Typography variant="h1" component='h1'>Categoria de Niños</Typography>
      <Typography variant="h2" component='h2' sx={{ mb: 1}} >Todos los productos</Typography>

      {isLoading  
        ?
        <FullScreenLoading/>
        :
        <ProductList products={ products} />
      }

    </ShopLayout>
  )
}
