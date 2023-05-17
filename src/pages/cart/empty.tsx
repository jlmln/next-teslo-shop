import NextLink from "next/link";
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { RemoveShoppingCartOutlined } from "@mui/icons-material";

import { ShopLayout } from "@/components/layouts"
import { Box, Link, Typography } from '@mui/material';

//Interfaces
import { StateCurrent } from '@/interfaces/stateCurrent'

const EmptyPage = () => {

  const router = useRouter()

  const { isLoaded, listOfCart } = useSelector((state:StateCurrent) => state.cart)

  useEffect(() => {
    if(listOfCart.length > 0){
      router.replace('/cart')
    }
  },[isLoaded, listOfCart, router])

  return (
    <ShopLayout title="Carrotp vacio" pageDescription="No hay articulos en el carrito de compras">
    <Box sx={{flexDirection:{xs:'column', sm:'row'}}} display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)' >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }}/>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Typography marginLeft={2} >
            Su carrito está vació
          </Typography>
          <NextLink legacyBehavior href='/' passHref >
            <Link typography='h4' color='secondary'>
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  )
}


export default EmptyPage