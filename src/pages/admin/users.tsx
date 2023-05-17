import React, { useEffect, useState } from 'react'

import { PeopleOutline } from '@mui/icons-material'
import { Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';

//Layouts
import { AdminLayout } from '@/components/layouts'

//Interfaces
import { IUser } from '@/interfaces'
import { tesloApi } from '@/api';

const UsersPage = () => {

  const { data, error } = useSWR<IUser[]>('/api/admin/users')

  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if(data) {
      setUsers(data)
    }
  },[data])

  if(!data && !error) return (<></>)

  const onRoleUpdated = async ( userId: string, newRole: string ) => {

    const previousUsers = users.map( user => ({...user}))
    const updatedUsers = users.map( user => ({
      ...user,
      role: userId === user._id ? newRole : user.role
    }))

    setUsers(updatedUsers)

    try {
      await tesloApi.put('/admin/users', { userId, role: newRole})
    } catch (error) {
      setUsers(previousUsers)
      alert('No se pudo actualizar el rol del usuario')
    }
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    { 
      field: 'role', 
      headerName: 'Rol', 
      width: 300,
      renderCell: ({row}: any) => {
        return (
          <Select
            value={ row.role }
            label='Rol'
            onChange={ ({target}) => onRoleUpdated(row.id, target.value)}
            sx={{ width: '300px'  }}
          >
            <MenuItem value='admin' > Admin </MenuItem>
            <MenuItem value='client' > Client </MenuItem>
            <MenuItem value='super-user' > Super user </MenuItem>
            <MenuItem value='SEO' > SEO </MenuItem>
          </Select>
        )
      }
    },
  ]

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }))

  return (
    <AdminLayout title='Usuarios' subTitle='Mantenimiento de usuarios' icon={<PeopleOutline/>} >
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

export default UsersPage