import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'

//Interfaces
import { StateCurrent } from '@/interfaces/stateCurrent'


const CartPage = () => {
  const router = useRouter()

  const { isLoaded, listOfCart } = useSelector((state:StateCurrent) => state.cart)

  useEffect(() => {
    if(listOfCart.length < 1){
      router.replace('/cart/empty')
    }
  },[isLoaded, listOfCart, router])

  return (
    <ShopLayout title='Carrito - 3' pageDescription='Carrito de compras de la tienda'>
      {isLoaded && listOfCart.length > 0 &&
      <>
      <Typography variant='h1' component='h1' >Carrito</Typography>
        <Grid container>
          <Grid item xs={12} sm={7} >
            <CartList />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card className='summary-card'>

              <CardContent>

                <Typography variant='h2'>Orden</Typography>

                <Divider sx={{ my: 1}} />

                <OrderSummary/>

                <Box sx={{ mt: 3 }}>
                  <Button color='secondary' className='circular-btn' href='/checkout/address' fullWidth>
                    Checkout
                  </Button>
                </Box>

              </CardContent>

            </Card>
          </Grid>
        </Grid>
      </>
      }
    </ShopLayout>
  )
}

export default CartPage
