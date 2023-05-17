import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

//Interfaces
import { AuthState } from "@/interfaces";
import { checkToken, loginAuthAction, loginUser, logoutAction, registerUser } from "../Actions/Auth";

//State
const initialState: AuthState = {
  isLoggedIn: false,
  user: undefined
}

//Async functions

//Reducer
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAuth: loginAuthAction,
    logout: logoutAction
  },
  extraReducers(builder) {
    builder.
    addCase(loginUser.pending, (state) => {
      state.isLoggedIn = false
      state.user = undefined
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      if(!action.payload){
        state.isLoggedIn = false
        state.user = undefined
      }else{
        state.isLoggedIn = true
        state.user = action.payload
      }
    })
    .addCase(loginUser.rejected, (state) => {
      state.isLoggedIn = false
      state.user = undefined
    })
    .addCase(registerUser.pending, (state) => {
      state.isLoggedIn = false
      state.user = undefined
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      if(!action.payload.hasError){
        state.isLoggedIn = true
        state.user = action.payload.user
      }
    })
    .addCase(registerUser.rejected, (state) => {
      state.isLoggedIn = false
      state.user = undefined
    })
    .addCase(checkToken.pending, (state) => {
      state.isLoggedIn = false
      state.user = undefined
    })
    .addCase(checkToken.fulfilled, (state, action) => {
      if(!action.payload){
        state.isLoggedIn = false
        state.user = undefined
      }else{
        state.isLoggedIn = true
        state.user = action.payload
      }
    })
    .addCase(checkToken.rejected, (state) => {
      state.isLoggedIn = false
      state.user = undefined
    })
  },
})

export const { loginAuth, logout } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer