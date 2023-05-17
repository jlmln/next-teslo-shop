import React, { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import Cookies from 'js-cookie'

//Components
import { CartList, OrderSummary } from '@/components/cart'

//Layouts
import { ShopLayout } from '@/components/layouts'

//Interfaces
import { StateCurrent } from '@/interfaces/stateCurrent'

//Utils
import { countries } from '@/utils'

//Store
import { AppDispatch } from '@/app/store'

//Actions
import { createOrder } from '@/app/Actions'
import { reset } from '@/app/Slices/cartSlice'


const SummaryPage = () => {
  const router = useRouter()

  const  dispatch = useDispatch<AppDispatch>()

  const state = useSelector((state: StateCurrent) => state.cart)

  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const {shippingAddress, itemsQuantity } = state

  useEffect(() => {
    if(!Cookies.get('firstName') ){
      router.push('/checkout/address')
    }
  },[router])

  const onCreateOrder = async () => {
    setIsPosting(true)
    const { payload: { hasError, message} } : any = await dispatch(createOrder(state))
    if(hasError){
      setIsPosting(false)
      setErrorMessage(message)
      return
    }
    dispatch(reset())
    router.replace(`/orders/${message}`)
  }
  

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1' >Resumen de la orden</Typography>
      <Grid container>
        <Grid item xs={12} sm={7} >
          <CartList editable={false} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>

            <CardContent>

              <Typography variant='h2'>Resumen ({itemsQuantity} {itemsQuantity! > 1 ? ' productos' : ' producto'}) </Typography>

              <Divider sx={{ my: 1}} />

              <Box display='flex' justifyContent='space-between' >
                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                <NextLink legacyBehavior href={'/checkout/address'} passHref >
                  <Link underline='always'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <Typography>{shippingAddress?.firstName+' '+shippingAddress?.lastName}</Typography>
              <Typography>{shippingAddress?.address}</Typography>
              {shippingAddress?.address2 ? <Typography>{shippingAddress?.address2}</Typography> : null}
              <Typography>{shippingAddress?.city+' | '+shippingAddress?.zip}</Typography>
              <Typography>{countries.find(c => c.code === shippingAddress?.country)?.name }</Typography>
              <Typography>{shippingAddress?.phone}</Typography>

              <Divider sx={{ my: 1}} />

              <Box display='flex' justifyContent='end' >
                <NextLink legacyBehavior href={'/cart'} passHref >
                  <Link underline='always'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <OrderSummary/>

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Button color='secondary' className='circular-btn' onClick={onCreateOrder} disabled={isPosting} fullWidth>
                  Confirmar orden
                </Button>

                <Chip
                  color='error'
                  label={errorMessage}
                  sx={{ display: errorMessage ? 'flex' : 'none', mt: 2}}
                />
              </Box>

            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage
