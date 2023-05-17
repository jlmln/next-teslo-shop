import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
//import { initialData } from "@/database/products";
import { Typography } from "@mui/material";

export default function MenCategoryPage() {

  const { products, isLoading } = useProducts('/products?gender=men')

  return (
    <ShopLayout title={'Teslo-shop - Hombres'} pageDescription={'descripcion de categoria de hombres'} >
      <Typography variant="h1" component='h1'>Categoría de Hombres</Typography>
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
