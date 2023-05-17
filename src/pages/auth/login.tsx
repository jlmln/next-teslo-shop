import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { getSession, signIn } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import { useForm } from 'react-hook-form'

//Components
import { AuthLayout } from '@/components/layouts/AuthLayout'

//Utils
import { validations } from '@/utils'

//Store
import { AppDispatch } from '@/app/store'


type FormData = {
  email: string,
  password: string,
};

const LoginPage = () => {

  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const [showError, setShowError] = useState(false)

  const onLoginUser = async ({ email, password }: FormData) => {

    setShowError(false)
    
    // const isValidLogin = await dispatch(loginUser({email,password}))
    
    // if(!isValidLogin.payload){
    //   setShowError(true)
    //   setTimeout(() => {
    //     setShowError(false)
    //   }, 3000);
    //   return
    // }
    // const destination = router.query.p?.toString() || '/'
    // router.replace(destination)
    await signIn('credentials',{ email, password })
  }

  return (
    <AuthLayout title='Ingresar' >
      <form onSubmit={ handleSubmit(onLoginUser) } >
        <Box sx={{ width: 350, padding:'10px 20px'}} >
          <Grid container spacing={ 2 } >

            <Grid item xs={12}>
              <Typography variant='h1' component='h1' >Iniciar Sesión</Typography>
              <Chip
                label='No reconocemos ese usaurio / contraseña'
                color='error'
                icon={<ErrorOutline/>}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                type='email' 
                label='Correo' 
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
              <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end' >
              <NextLink legacyBehavior href={router.query.p ? `/auth/register?p=${ router.query.p }` : '/auth/register'} passHref >
                <Link underline='always' >
                  ¿No tienes cuenta?s
                </Link>
              </NextLink>
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

  const session = await getSession({req})

  const { p = '/'} = query

  if( session ){
    return {
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

export default LoginPage