import React, { useState } from 'react'
import { getSession, signIn } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import { useForm } from 'react-hook-form'

import { AuthLayout } from '@/components/layouts/AuthLayout'

//Utils
import { validations } from '@/utils'

//Store
import { AppDispatch } from '@/app/store'

//Actions
import { registerUser } from '@/app/Actions/Auth'


type FormData = {
  email: string,
  password: string,
  name: string
};

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>()

  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const [showError, setShowError] = useState(false)
  const [messageError, setMessageError] = useState('')

  const onRegisterForm = async ({ name, email, password }: FormData) => {

    setShowError(false)

    const userRegistered = await dispatch(registerUser({name,email,password}))

    console.log(userRegistered)

    const payload = userRegistered.payload as {hasError:boolean,message:string}

    if(payload.hasError){
      setMessageError(payload.message)
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 3000);
      return
    }
    // const destination = router.query.p?.toString() || '/'
    // router.replace(destination)
    await signIn('credentials',{email,password})
  }

  return (
    <AuthLayout title='Registrar' >
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding:'10px 20px'}} >
          <Grid container spacing={ 2 } >

            <Grid item xs={12}>
              <Typography variant='h1' component='h1' >Crear cuenta</Typography>
            </Grid>
            <Chip
              label={messageError}
              color='error'
              icon={<ErrorOutline/>}
              className='fadeIn'
              sx={{ display: showError ? 'flex' : 'none' }}
            />
            <Grid item xs={12}>
              <TextField 
                label='Nombre' 
                variant='filled' 
                fullWidth
                {...register('name', {
                  required: 'Este campo es requerido',
                  minLength: {value: 2, message: 'Mínimo 2 caracteres'}
                })}
                error={ !!errors.name }
                helperText={ errors.name?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label='Correo' 
                type='email'
                variant='filled' 
                fullWidth
                {...register('email', {
                  required: 'Este campo es requerido',
                  validate: validations.isEmail
                })}
                error={ !!errors.email }
                helperText={ errors.email?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label='Contraseña' 
                type='password' 
                variant='filled' 
                fullWidth
                {...register('password',{
                  required: 'Este campo es requerido',
                  minLength: {value: 6, message: 'Mínimo 6 caracteres'},
                })}
                error={ !!errors.password }
                helperText={ errors.password?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <Button color='secondary' className='circular-btn' size='large' type='submit' fullWidth>
                Crear
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end' >
              <NextLink legacyBehavior href={router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/login'} passHref >
                <Link underline='always'>
                  ¿Ya tienes una cuenta?
                </Link>
              </NextLink>
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({req,query}) => {

  const session = await getSession({req})

  const { p = '/'} = query

  if(session){
    return{
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: {
      
    }
  }
}

export default RegisterPage