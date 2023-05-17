import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

//Interfaces
import { UiState } from "@/interfaces";

//State
const initialState: UiState = {
  sidemenuOpen: false,
}

//Async functions

//Reducer
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    open: state => {
      state.sidemenuOpen = true
    },
    close: state => {
      state.sidemenuOpen = false
    }
  }
})

export const { open, close } = uiSlice.actions

export const selectUi = (state: RootState) => state.ui 

export default uiSlice.reducer