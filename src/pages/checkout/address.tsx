import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useForm } from 'react-hook-form'

//Layouts
import { ShopLayout } from "@/components/layouts"

//Utils
import { countries } from "@/utils"
import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store"
import { updateAddress } from "@/app/Slices/cartSlice"

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

const getAddressFromCookies = ():FormData => {
  return {
    firstName : Cookies.get('firstName') || '',
    lastName : Cookies.get('lastName') || '',
    address : Cookies.get('address') || '',
    address2 : Cookies.get('address2') || '',
    zip : Cookies.get('zip') || '',
    city : Cookies.get('city') || '',
    country : Cookies.get('country') || '',
    phone : Cookies.get('phone') || ''
  }
}

const AddressPage = () => {
  const router = useRouter()

  const dispatch = useDispatch<AppDispatch>()

  const { register, handleSubmit, formState: { errors }, watch  } = useForm<FormData>({
    defaultValues: getAddressFromCookies()
  });

  const [showError, setShowError] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [isRender, setIsRender] = useState(false)

  const onSubmitAddressInfo = async (data: FormData) => {
    dispatch(updateAddress(data))
    router.push('/checkout/summary')
  }

  useEffect(() => {
    setTimeout(() => {
      setIsRender(true)
    }, 1000);
  },[])

  return (
    <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino" >

      <Typography variant="h1" component='h1'>Dirección</Typography>
      {isRender && <form onSubmit={handleSubmit(onSubmitAddressInfo)} noValidate>
        <Grid container spacing={2} sx={{ mt: 2 }} >
          <Grid item xs={12} sm={6} >
            <TextField 
              label='Nombre' 
              variant="filled" 
              fullWidth 
              {...register('firstName',{
                required: 'Este campo es requerido',
                minLength: {value: 2, message: 'Mínimo 2 caracteres'}
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} >
            <TextField 
              label='Apellido' 
              variant="filled" 
              fullWidth
              {...register('lastName',{
                required: 'Este campo es requerido',
                minLength: {value: 2, message: 'Mínimo 2 caracteres'}
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}  
            />
          </Grid>

          <Grid item xs={12} sm={6} >
            <TextField 
              label='Dirección' 
              variant="filled" 
              fullWidth
              {...register('address',{
                required: 'Este campo es requerido'
              })}
              error={!!errors.address}
              helperText={errors.address?.message}   
            />
          </Grid>

          <Grid item xs={12} sm={6} >
            <TextField 
              label='Dirección 2 (opcional)' 
              variant="filled" 
              fullWidth
              {...register('address2')}
            />
          </Grid>

          <Grid item xs={12} sm={6} >
            <TextField 
              label='Código Postal' 
              variant="filled" 
              fullWidth
              {...register('zip',{
                required: 'Este campo es requerido'
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} >
            <TextField 
              label='Ciudad' 
              variant="filled" 
              fullWidth 
              {...register('city',{
                required: 'Este campo es requerido'
              })}
              error={!!errors.city}
              helperText={errors.city?.message}  
            />
          </Grid>

          <Grid item xs={12} sm={6} >
            <FormControl fullWidth>
              <InputLabel>País</InputLabel>
              <Select
                variant="filled"
                label='País'
                value={watch().country ? watch().country : 'COL' }
                {...register('country',{
                  required: 'Este campo es requerido'
                })}
                error={!!errors.country}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} >
            <TextField 
              label='Teléfono' 
              variant="filled" 
              fullWidth 
              {...register('phone',{
                required: 'Este campo es requerido'
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>
      
        <Box sx={{ mt: 5 }} display='flex' justifyContent='center' >
          <Button type="submit" color="secondary" className="circular-btn" size="large">
            Revisar pedido
          </Button>
        </Box>
      </form>}
    </ShopLayout>
  )
}

export default AddressPage
