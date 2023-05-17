import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './Slices/uiSlice'
import cartReducer from './Slices/cartSlice'
import authReducer from './Slices/authSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    cart: cartReducer,
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch