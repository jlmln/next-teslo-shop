import React, { useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next'
import { getToken } from 'next-auth/jwt'

import { PayPalButtons } from "@paypal/react-paypal-js";
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material'
import { CreditCardOffOutlined } from '@mui/icons-material'

//Layouts
import { ShopLayout } from '@/components/layouts'

//Components
import { CartList, OrderSummary } from '@/components/cart'

//database
import { dbOrders } from '@/database'
import { tesloApi } from '@/api';

//Interfaces
import { IOrder } from '@/interfaces'


export type OrderResponseBody = {
  id: string,
  status:
  | "COMPLETED"
  | "SAVED"
  | "APPROVED"
  | "VOIDED"
  | "PAYER_ACTION_REQUIRED"
  | "CREATED"
}

interface Props{
  order: IOrder
}

const OrderPage: NextPage<Props> = ({order}) => {

  const router = useRouter()

  const [isPaying, setIsPaying] = useState(false)

  const onOrderCompleted = async ( details : OrderResponseBody ) => {
    
    if(details.status != "COMPLETED"){
      return alert('No hay pago en Paypal')
    }
    setIsPaying(true)

    try {
      const { data } = await tesloApi.post(`/orders/pay`,{
        transactionId: details.id,
        orderId: order._id
      }) 

      router.reload()
    } catch (error) {
      setIsPaying(false)
      console.log(error)
      alert('Error')
    }
  }

  return (
    <ShopLayout title='Resumen de orden 111' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1' >Orden: {order._id} </Typography>

      {order.isPaid ?
      <Chip
        sx={{ my: 2 }}
        label='Orden Pagada'
        variant='outlined'
        color='success'
        icon={<CreditCardOffOutlined/>}
      /> 
      :
      <Chip
        sx={{ my: 2 }}
        label='Pendiente de pago'
        variant='outlined'
        color='error'
        icon={<CreditCardOffOutlined/>}
      /> 
      }

      <Grid container>
        <Grid item xs={12} sm={7} >
          <CartList editable={false} products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>

            <CardContent>

              <Typography variant='h2'>Resumen ({order.itemsQuantity} {order.itemsQuantity > 1 ? 'productos' : 'producto'}) </Typography>

              <Divider sx={{ my: 1}} />

              <Box display='flex' justifyContent='space-between' >
                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                <NextLink legacyBehavior href={'/checkout/address'} passHref >
                  <Link underline='always'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <Typography>{order.shippingAddress.firstName+' '+order.shippingAddress.lastName}</Typography>
              <Typography>{order.shippingAddress.address}</Typography>
              <Typography>{order.shippingAddress.city}</Typography>
              <Typography>{order.shippingAddress.country}</Typography>
              <Typography>{order.shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1}} />

              <Box display='flex' justifyContent='end' >
                <NextLink legacyBehavior href={'/cart'} passHref >
                  <Link underline='always'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <OrderSummary order={order} />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                {
                  <Box display='flex' justifyContent='center' className='fadeIn' sx={{display: isPaying ? 'flex' : 'none'}}>
                    <CircularProgress/>
                  </Box>
                }
                <Box sx={{display: isPaying ? 'none' : 'flex', flex: 1}} flexDirection='column'>
                {order.isPaid ?
                  <Chip
                    sx={{ my: 2 }}
                    label='Orden Pagada'
                    variant='outlined'
                    color='success'
                    icon={<CreditCardOffOutlined/>}
                  />
                  :
                  (<PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                          purchase_units: [
                              {
                                  amount: {
                                      value: `${order.total}`,
                                  },
                              },
                          ],
                      });
                    }}
                    onApprove={(data, actions) => {
                        return actions!.order!.capture().then((details) => {
                          onOrderCompleted(details)
                        });
                    }}
                  />)
                }
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({req,query}) => {

  const { id = '' } = query

  const session:any = await getToken({req})

  if( !session){
    return {
      redirect: {
        destination: `/auth/login?p=${id}`,
        permanent: false
      }
    }
  }

  const order = await dbOrders.getOrderById(id.toString())

  if(!order){
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false
      }
    }  
  }

  if(order.user !== session.user._id){
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false
      }
    }  
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage
