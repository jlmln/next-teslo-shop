import React from 'react'

import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Chip, Grid } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useSWR from 'swr';

//Layouts
import { AdminLayout } from '@/components/layouts'

//Interfaces
import { IOrder, IUser } from '@/interfaces';


const columns: GridColDef[] = [
  {field: 'id', headerName: 'Orden ID', width: 250},
  {field: 'email', headerName: 'Correo', width: 250},
  {field: 'name', headerName: 'Nombre completo', width: 250},
  {field: 'total', headerName: 'Monto total', width: 250},
  {
    field: 'isPaid', 
    headerName: 'Pagada', 
    renderCell: ({row}: any) => {
      return row.isPaid
            ? (<Chip variant='outlined' label='Pagada' color='success' />)
            : (<Chip variant='outlined' label='Pendiente' color='error' />)
    }  
  },
  {field: 'noProducts', headerName: 'No. Productos', align: 'center'},
  {
    field: 'check', 
    headerName: 'Ver orden', 
    renderCell: ({row}: any) => {
      return (
        <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
          Ver orden
        </a>
      )
    }  
  },
  {field: 'createdAt', headerName: 'Creada en'},
]


const OrdersPage = () => {

  const { data, error } = useSWR<IOrder[]>('/api/admin/orders')

  if( !data && !error ) return (<></>)

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.itemsQuantity,
    createdAt: order.createdAt
  }))

  return (
    <AdminLayout 
      title='Ordenes' 
      subTitle='Mantenimiento de ordenes' 
      icon={<ConfirmationNumberOutlined/>}
    >
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%'}} >
          <DataGrid
            rows={rows}
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
    </AdminLayout>
  )
}

export default OrdersPage