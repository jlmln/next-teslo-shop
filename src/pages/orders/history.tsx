import NextLink from 'next/link'
import { GetServerSideProps, NextPage } from 'next'
import { getToken } from 'next-auth/jwt'

import { DataGrid, GridColDef, GridValueOptionsParams } from '@mui/x-data-grid'

import { Chip, Grid, Link, Typography } from '@mui/material'

//Layouts
import { ShopLayout } from '@/components/layouts'

//Database
import { dbOrders } from '@/database'

//Interfaces
import { IOrder } from '@/interfaces'
interface Props{
  orders: IOrder[]
}

//Temp
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Orden pagada',
    width: 200,
    renderCell: (params: GridValueOptionsParams) => {
      return (
        params.row.paid ? 
        <Chip color='success' label='Pagada' variant='outlined' />:
        <Chip color='error' label='No pagada' variant='outlined' />
      )
    }
  },
  {
    field: 'Order',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    filterable: false,
    renderCell: (params: GridValueOptionsParams) => {
      return (
        <NextLink legacyBehavior href={`/orders/${params.row.orderId}`} passHref >
          <Link underline='always'>
            ver orden
          </Link>
        </NextLink>
      )
    }
  }
]

const HistoryPage:NextPage<Props> = ({orders}) => {

  const ordersRows = orders.map((order,i) => {
    return {
      id: i+1,
      paid: order.isPaid,
      fullname: order.shippingAddress.firstName+' '+order.shippingAddress.lastName,
      orderId: order._id
    }
  })

  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'>
      <Typography variant='h1' component='h1'>Historial de ordenes</Typography>
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%'}} >
          <DataGrid
            rows={ordersRows}
            columns={columns}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {

  const session: any = await getToken({req})

  if(!session){
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false
      }
    }
  }

  const orders = await dbOrders.getOrderByUser(session.user._id)

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage
