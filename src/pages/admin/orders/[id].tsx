import React, { useState } from 'react'
import NextLink from 'next/link'
import { GetServerSideProps, NextPage } from 'next'
import { getToken } from 'next-auth/jwt'

import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import { CreditCardOffOutlined } from '@mui/icons-material'

//Layouts
import { AdminLayout } from '@/components/layouts'

//Components
import { CartList, OrderSummary } from '@/components/cart'

//database
import { dbOrders } from '@/database'

//Interfaces
import { IOrder } from '@/interfaces'


interface Props{
  order: IOrder
}

const OrderPage: NextPage<Props> = ({order}) => {

  return (
    <AdminLayout  title='Resumen de orden' subTitle={`OrdenId: ${order._id}`}>

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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({req,query}) => {

  const { id = '' } = query

  const session:any = await getToken({req})

  if( !session ){
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
        destination: `/admin/orders`,
        permanent: false
      }
    }  
  }

  const validRoles = ['admin','super-user','SEO']

  if(!validRoles.includes(session.user.role)){
    return {
      redirect: {
        destination: `/`,
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
