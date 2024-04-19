import { createSlice } from "@reduxjs/toolkit";
import { getFunds } from "./dematActions";


const initialState = {
   loading: false,
   info: {},
   success: '',
   error: ''
}

const dematSlice = createSlice({
   name: 'dematSlice',
   initialState,
   reducers: {
      setUserData: (state, { payload }) => {
         state.info = payload
      },
      clearUserData: () => initialState
   },
   extraReducers: (builder) => {

      builder.addCase(getFunds.pending, (state) => {
         state.loading = true;
      })
      builder.addCase(getFunds.fulfilled, (state, { payload }) => {
         state.loading = false;
         // state.success = state.success
         // state.info = state.payload
         console.log(payload);
      })
      builder.addCase(getFunds.rejected, (state, { payload }) => {
         state.loading = false;
         // state.info = state.payload
         console.log(payload);
      })
   }
})

export default dematSlice.reducer

export const { setUserData, clearUserData } = dematSlice.actions