import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

//Interfaces
import { CartState, ICartProduct } from "@/interfaces";
import { addProductAction, changeQuantityAction, getSummaryOrderAction, loadCartFromCookiesAction, removeProductAction } from "../Actions";
import { createOrder, loadAddressFromCookiesAction, resetAction, updateAddressAction } from '../Actions/Cart';

//State
const initialState: CartState = {
  isLoaded: false,
  listOfCart: [],
  itemsQuantity: 0,
  total: 0,
  subTotal:0,
  tax:0,
  shippingAddress: {
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    zip: '',
    city: '',
    country: '',
    phone: '',
  }
}

//Reducer
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCartFromCookies: loadCartFromCookiesAction,
    addProduct: addProductAction,
    removeProduct: removeProductAction,
    changeQuantity: changeQuantityAction,
    getSummaryOrder: getSummaryOrderAction,
    loadAddressFromCookies: loadAddressFromCookiesAction,
    updateAddress : updateAddressAction,
    reset: resetAction
  },
  extraReducers(builder) {
    builder
    .addCase(createOrder.pending, (state) => {
      state
    })
    .addCase(createOrder.fulfilled, (state,action) => {
      state
    })
    .addCase(createOrder.rejected, (state) => {
      state
    })
  },
})

export const { 
  loadCartFromCookies, 
  addProduct, 
  removeProduct, 
  changeQuantity, 
  getSummaryOrder,
  loadAddressFromCookies,
  updateAddress,
  reset
} = cartSlice.actions

export const selectCart = (state: RootState) => state.cart

export default cartSlice.reducer