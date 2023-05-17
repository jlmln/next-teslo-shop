import { createAsyncThunk } from "@reduxjs/toolkit"
import Cookies from "js-cookie";

import { tesloApi } from "@/api"

//Interfaces
import { Action, AuthLogin, AuthState, IUser } from "@/interfaces"
import axios from "axios";


//Sync functions
export const loginAuthAction = (state:AuthState,{payload}:Action) => {
  const payload2  = payload as IUser
  state.isLoggedIn = true
  state.user = payload2
}

export const logoutAction = (state:AuthState) => {
  state.isLoggedIn = false
  state.user = undefined
  Cookies.remove('token')
  Cookies.remove('firstName')
  Cookies.remove('lastName')
  Cookies.remove('address')
  Cookies.remove('address2')
  Cookies.remove('zip')
  Cookies.remove('city')
  Cookies.remove('country')
  Cookies.remove('phone')
  Cookies.remove('cart')
}

//Async functions
export const loginUser = createAsyncThunk('auth/loginUser',
  async ({email, password}:AuthLogin) => {
    try {
      const { data } = await tesloApi.post('/user/login',{email,password})
      const { token, user } = data
      if(token){ Cookies.set('token',token) }
      return user
    } catch (error) {
      console.log(error)
    }
  }
)

export const registerUser = createAsyncThunk('auth/registerUser',
  async ({name, email, password}:AuthLogin):Promise<{hasError:boolean,message:string,user?:IUser}> => {
    try {
      const { data } = await tesloApi.post('/user/register',{name,email,password})
      const { token, user } = data
      if(token){ Cookies.set('token',token) }
      return {
        hasError: false,
        message: 'Registrado exitosamente',
        user
      }
    } catch (error) {
      if( axios.isAxiosError(error)){
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'No se pudo crear el usuario'
      }
    }
  }
) 

export const checkToken = createAsyncThunk('auth/checkToken',
  async () => {
    if ( !Cookies.get('token')) return
    try {
      const { data } = await tesloApi.get('/user/validate-token')
      const { token, user } = data
      if(token){ Cookies.set('token',token) }
      return user
    } catch (error) {
      console.log('tokenError: ',error)
    }
  }
)