import { createAsyncThunk } from '@reduxjs/toolkit'
import Cookie from 'js-cookie'

//Interfaces
import { Action, ICartProduct, CartState, IOrder } from "@/interfaces"
import { ShippingAddress } from '@/interfaces/shippingAddress'

//Api
import { tesloApi } from '@/api'
import axios from 'axios'

//ENV
const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE)


//Sync functions
export const addProductAction = (state:CartState,{payload}:Action) => {
  let payload2:ICartProduct = payload as ICartProduct
  let indexFound = state.listOfCart.length > 0 ? state.listOfCart.findIndex((prod:ICartProduct) => ((prod.size == payload2.size)) && ((prod.slug == payload2.slug))) : -1
  let indexWithDiferentSize = state.listOfCart.length > 0 ? state.listOfCart.findIndex((prod:ICartProduct) => prod.slug == payload2.slug) : -1

  //En caso de no tener el producto con ninguna talla en la lista 
  if( (( indexWithDiferentSize < 0 )) ) {
    state.listOfCart.push(payload2)
    state.isLoaded = true
    Cookie.set('cart',JSON.stringify(state))
    return
  }

  //En caso de tener el producto con diferente talla
  if( 
    ((indexFound < 0)) && 
    (( indexWithDiferentSize > -1 )) && 
    ((state.listOfCart[indexWithDiferentSize].quantity+payload2.quantity <= state.listOfCart[indexWithDiferentSize].inStock)) 
  ) {
    state.listOfCart.push(payload2)
    state.isLoaded = true
    Cookie.set('cart',JSON.stringify(state))
    return
  }

  //En caso de tener el producto con la misma talla
  if( ((indexFound > -1)) && (((state.listOfCart[indexFound].quantity+payload2.quantity) <= state.listOfCart[indexFound].inStock)) ){
    state.listOfCart[indexFound].quantity = state.listOfCart[indexFound].quantity+payload2.quantity
    state.isLoaded = true
    Cookie.set('cart',JSON.stringify(state))
    return 
  }
}

export const removeProductAction = (state:CartState,{payload}:Action) => {
  state.listOfCart = state.listOfCart.filter((prod:ICartProduct) => prod._id !== payload)
  if(state.listOfCart.length == 1){
    state.isLoaded = false
    Cookie.remove('cart')
  }
  state.isLoaded = true
  Cookie.set('cart',JSON.stringify(state))
}

export const changeQuantityAction = (state:CartState,{payload}:Action) => {
  let payload2: ICartProduct = payload as ICartProduct 
  let tempState = state.listOfCart.map((prod) => {
    if(prod._id === payload2._id && prod.size === payload2.size){
      return payload2
    }
    return prod
  })

  state.listOfCart = tempState
  Cookie.set('cart',JSON.stringify(state))
}


export const loadCartFromCookiesAction = (state:CartState) => {
  let cart = Cookie.get('cart')

  if(cart){
    try {
      let cartParse = JSON.parse(cart)
      state.listOfCart = cartParse.listOfCart
      state.itemsQuantity = cartParse.itemsQuantity
      state.subTotal = cartParse.subTotal
      state.tax = cartParse.tax
      state.total = cartParse.total
      state.isLoaded = true
      getSummaryOrderAction(state)
    } catch (error) {
      return
    }    
  }
}

export const getSummaryOrderAction = (state:CartState) => {

  let totalQuantity = state.listOfCart.reduce((acum,prod) => acum+=prod.quantity,0 )

  let subtotal= state.listOfCart.reduce((acum,prod) => acum+=(prod.quantity*prod.price),0 )

  let tax = subtotal != 0 ? (subtotal*taxRate) : 0

  let fullAmount = tax != 0 ? (subtotal+tax) : 0

  state.itemsQuantity = totalQuantity
  state.subTotal = subtotal
  state.total = fullAmount
  state.tax = tax

  Cookie.set('cart',JSON.stringify(state))
}

export const loadAddressFromCookiesAction = (state:CartState) => {
  const newAddress = Cookie.get('firstName') ? {
    firstName : Cookie.get('firstName') || '',
    lastName : Cookie.get('lastName') || '',
    address : Cookie.get('address') || '',
    address2 : Cookie.get('address2') || '',
    zip : Cookie.get('zip') || '',
    city : Cookie.get('city') || '',
    country : Cookie.get('country') || '',
    phone : Cookie.get('phone') || ''
  } : undefined

  state.shippingAddress = newAddress
}

export const updateAddressAction = (state:CartState,{payload}:Action) => {
  const payload2 = payload as ShippingAddress

  Cookie.set('firstName', payload2.firstName)
  Cookie.set('lastName', payload2.lastName)
  Cookie.set('address', payload2.address )
  Cookie.set('address2', payload2.address2 || '')
  Cookie.set('zip', payload2.zip)
  Cookie.set('city', payload2.city)
  Cookie.set('country', payload2.country)
  Cookie.set('phone', payload2.phone)

  state.shippingAddress = payload2
}

export const resetAction = (state:CartState) => {
  state.isLoaded = false
  state.itemsQuantity = 0
  state.listOfCart = [] 
  state.total = 0,
  state.subTotal = 0,
  state.tax = 0,
  state.shippingAddress = {
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    zip: '',
    city: '',
    country: '',
    phone: '',
  }
  
  Cookie.remove('cart')
  Cookie.remove('firstName')
  Cookie.remove('lastName')
  Cookie.remove('address')
  Cookie.remove('address2')
  Cookie.remove('zip')
  Cookie.remove('city')
  Cookie.remove('country')
  Cookie.remove('phone')
}

//Async functions
export const createOrder = createAsyncThunk('cart/createOrder',
  async (state:any) => {

    const body: any = {
      orderItems: state.listOfCart,
      shippingAddress: state.shippingAddress,
      itemsQuantity: state.itemsQuantity,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false
    }
    try {
      const { data } = await tesloApi.post('/orders',body)
      return {
        hasError: false,
        message: data._id
      }
    } catch (error) {
      if(axios.isAxiosError(error)){
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }

      return {
        hasError: true,
        message: 'Error no controlado, hable con el administrador'
      }
    }
  }
)